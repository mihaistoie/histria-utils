import { RELATION_TYPE } from '../schema/schema-consts';
import * as schemaUtils from '../schema/schema-utils';
import { extractDefinitionName } from '../serialization/serialization';
import * as helper from '../utils/helper';
import * as util from 'util';

export class SchemaManager {
    public static singleton: SchemaManager;
    private _namespaces: Map<string, Map<string, any>>;
    private _classes: Map<string, Map<string, any>>;
    constructor() {
        if (!SchemaManager.singleton) {
            SchemaManager.singleton = this;
        }
        return SchemaManager.singleton;
    }

    public registerSchema(schema: any): void {
        const className = schema.name;
        const nameSpace = schema.nameSpace;
        this._namespaces = this._namespaces || new Map<string, any>();
        this._classes = this._classes || new Map<string, any>();

        let ns = this._namespaces.get(nameSpace);
        if (!ns) {
            ns = new Map<string, any>();
            this._namespaces.set(nameSpace, ns);
        }
        ns.set(className, schema);
        this._classes.set(nameSpace + '.' + className, schema);
    }

    public childrenAndRefsOfClass(fullClassName: string): { children: string[], refs: any } {
        const refs: any = {};
        const classes = [fullClassName];
        const map: any = {};
        let i = 0;
        while (i < classes.length) {
            const cc = classes[i];
            if (!map[cc]) {
                map[cc] = true;
                const schema = this._classes.get(cc);
                if (schema) {
                    const deps = schemaUtils.getChildrenAndRefsOfClass(schema, (sFullClassName: string): any => this._classes.get(sFullClassName));
                    deps.children.forEach(cn => {
                        if (!map[cn])
                            classes.push(cn);
                    });
                    deps.refs.forEach(refName => refs[refName] = true);
                } else
                    throw util.format('Schema not found for class "%s".', cc);
            }
            i++;
        }
        classes.shift();
        return { children: classes, refs: refs };
    }

    public isChild(fullClassName: string): boolean {
        return schemaUtils.isChild(this._classes ? this._classes.get(fullClassName) : null);
    }
    public isTree(fullClassName: string): boolean {
        return schemaUtils.isTree(this._classes ? this._classes.get(fullClassName) : null);
    }

    public schema(nameSpace: string, name: string): any {
        if (!this._namespaces) return null;
        const ns = this._namespaces.get(nameSpace);
        if (!ns) return null;
        return ns.get(name);
    }
    public enumSchemas(nameSpace: string, cb: (schema: any) => void): void {
        if (!this._namespaces) return;
        const ns = this._namespaces.get(nameSpace);
        if (!ns) return;
        for (const item of ns)
            cb(item[1]);
    }
    public propertyInfo(propertyName: string, schema: any): { schema: any, isArray: boolean, isRelation: boolean } | null {
        let prop = schema.properties[propertyName];
        if (prop)
            return { schema: prop, isArray: false, isRelation: false };
        prop = schema.relations ? schema.relations[propertyName] : null;
        if (!prop) return null;
        return { schema: this.schema(prop.nameSpace, prop.model), isArray: prop.type === RELATION_TYPE.hasMany, isRelation: true };
    }
    public serialization2Schema(nameSpace: string, name: string, serialization: any): any {
        const res = { type: 'object', properties: {} };
        const schema = this.schema(nameSpace, name);
        if (!schema)
            throw util.format('Entity not found "%s.%s"', nameSpace, name);
        this._serializeSchema(schema, res, serialization, serialization, res.properties);
        return res;
    }

    private _path2schema(schema: any, path: string): { schema: any, isArray: boolean, isRelation: boolean } | null {
        const segments = path.split('.');
        let cs = schema;
        let cv = null;
        let isRelation = false;
        let isArray = false;
        for (const segment of segments) {
            if (!cs) return null;
            const pi = this.propertyInfo(segment, cs);
            if (!pi) return null;
            cv = pi.schema;
            if (!pi.isRelation) {
                isRelation = false;
                cs = null;
            } else {
                isRelation = true;
                isArray = pi.isArray;
                if (isArray)
                    cs = null;
                else
                    cs = cv;
            }

        }
        return { schema: cv, isRelation: isRelation, isArray: isArray };

    }
    private _serializeSchema(schema: any, root: any, rootSerialization: any, serialization: any, res: any): void {
        if (serialization.properties)
            serialization.properties.forEach((item: any) => {
                const fs = this._path2schema(schema, item.value);
                if (!fs)
                    throw util.format('Invalid path "%s.%s.%s"', schema.nameSpace, schema.name, item.value);
                if (item.properties) {
                    if (!fs.isRelation)
                        throw util.format('Invalid serialization "%s.%s.%s" is not a relation.', schema.nameSpace, schema.name, item.value);
                    let cr: any = res[item.key] = { type: 'object' };
                    if (fs.isArray) {
                        cr.type = 'array';
                        cr.items = { type: 'object' };
                        cr = cr.items;
                    }
                    cr.properties = {};
                    this._serializeSchema(fs.schema, root, rootSerialization, item, cr.properties);
                } else {
                    if (fs.isRelation) {
                        if (item.$ref) {
                            let cr: any = res[item.key] = {};
                            if (fs.isArray) {
                                cr.type = 'array';
                                cr.items = {};
                                cr = cr.items;
                            }
                            cr.$ref = item.$ref;
                            root.definitions = root.definitions || {};
                            const defName = extractDefinitionName(cr.$ref);
                            if (!root.definitions[defName]) {
                                root.definitions[defName] = {
                                    type: 'object',
                                    properties: {}
                                };
                                this._serializeSchema(fs.schema, root, rootSerialization, rootSerialization.definitions[defName], root.definitions[defName].properties);
                            }
                            return;

                        } else {
                            throw util.format('Invalid serialization for "%s.%s.%s", "properties" is missing.', schema.nameSpace, schema.name, item.value);
                        }

                    }
                    res[item.key] = helper.clone(fs.schema);
                }
            });
    }
}

export function schemaManager(): SchemaManager {
    if (SchemaManager.singleton)
        return SchemaManager.singleton;
    return new SchemaManager();
}
