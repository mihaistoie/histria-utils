import { RELATION_TYPE } from '../schema/schema-consts'
import * as schemaUtils from '../schema/schema-utils'
import { extractDefinitionName } from '../serialization/serialization'
import * as helper from '../utils/helper';
import * as util from 'util'

export class SchemaManager {
    private _namespaces: Map<string, Map<string, any>>;
    private _classes: Map<string, Map<string, any>>;
    public static singleton: SchemaManager;
    constructor() {
        if (!SchemaManager.singleton) {
            SchemaManager.singleton = this;
        }
        return SchemaManager.singleton;
    }

    public registerSchema(schema: any): void {
        let that = this;
        let className = schema.name;
        let nameSpace = schema.nameSpace;
        that._namespaces = that._namespaces || new Map<string, any>();
        that._classes = that._classes || new Map<string, any>();

        let ns = that._namespaces.get(nameSpace);
        if (!ns) {
            ns = new Map<string, any>();
            that._namespaces.set(nameSpace, ns)
        }
        ns.set(className, schema);
        that._classes.set(nameSpace + '.' + className, schema);
    }

    public childrenAndRefsOfClass(fullClassName: string): { children: string[], refs: any } {
        let that = this;
        let refs: any = {};
        let classes = [fullClassName];
        let map: any = {};
        let i = 0;
        while (i < classes.length) {
            const cc = classes[i];
            if (!map[cc]) {
                map[cc] = true;
                let schema = that._classes.get(cc);
                if (schema) {
                    const deps = schemaUtils.getChildrenAndRefsOfClass(schema, (fullClassName: string): any => { return that._classes.get(fullClassName) });
                    deps.children.forEach(cn => {
                        if (!map[cn])
                            classes.push(cn)
                    });
                    deps.refs.forEach(refName => refs[refName] = true)
                } else
                    throw util.format('Schema not found for class "%s".', cc);
            }
            i++;
        }
        classes.shift();
        return { children: classes, refs: refs };
    }

    public isChild(fullClassName: string): boolean {
        let that = this;
        return schemaUtils.isChild(that._classes ? that._classes.get(fullClassName) : null);
    }
    public isTree(fullClassName: string): boolean {
        let that = this;
        return schemaUtils.isTree(that._classes ? that._classes.get(fullClassName) : null);
    }

    public schema(nameSpace: string, name: string): any {
        let that = this;
        if (!that._namespaces) return null;
        const ns = that._namespaces.get(nameSpace);
        if (!ns) return null;
        return ns.get(name);
    }
    public enumSchemas(nameSpace: string, cb: (schema: any) => void): void {
        let that = this;
        if (!that._namespaces) return;
        const ns = that._namespaces.get(nameSpace);
        if (!ns) return;
        for (const item of ns)
            cb(item[1])
    }
    private _path2schema(schema: any, path: string): { schema: any, isArray: boolean, isRelation: boolean } | null {
        const that = this;
        const segments = path.split('.');
        let cs = schema, cv = null, isRelation = false, isArray = false;
        for (const segment of segments) {
            if (!cs) return null;
            cv = cs.properties[segment];
            if (cv) {
                isRelation = false;
                cs = null;
            } else {
                let relation = cs.relations ? cs.relations[segment] : null;
                if (!relation) return null;
                isRelation = true;
                isArray = relation.type === RELATION_TYPE.hasMany;
                cv = that.schema(relation.nameSpace, relation.model);
                if (isArray)
                    cs = null;
                else
                    cs = cv;
            }

        }
        return { schema: cv, isRelation: isRelation, isArray: isArray };

    }
    private _serializeSchema(schema: any, root: any, rootSerialization: any, serialization: any, res: any): void {
        const that = this;
        serialization.properties && serialization.properties.forEach((item: any) => {
            let fs = that._path2schema(schema, item.value);
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
                that._serializeSchema(fs.schema, root, rootSerialization, item, cr.properties)
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
                        let defName = extractDefinitionName(cr.$ref);
                        if (!root.definitions[defName]) {
                            root.definitions[defName] = {
                                type: 'object',
                                properties: {}
                            };
                            that._serializeSchema(fs.schema, root, rootSerialization, rootSerialization.definitions[defName], root.definitions[defName].properties)
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
    public serialization2Schema(nameSpace: string, name: string, serialization: any): any {
        const res = { type: 'object', properties: {} };
        let schema = this.schema(nameSpace, name);
        if (!schema)
            throw util.format('Entity not found "%s.%s"', nameSpace, name);
        this._serializeSchema(schema, res, serialization, serialization, res.properties)
        return res;
    }
}


export function schemaManager(): SchemaManager {
    if (SchemaManager.singleton)
        return SchemaManager.singleton;
    return new SchemaManager();
}
