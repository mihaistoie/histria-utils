"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_consts_1 = require("../schema/schema-consts");
const schemaUtils = require("../schema/schema-utils");
const serialization_1 = require("../serialization/serialization");
const helper = require("../utils/helper");
const util = require("util");
class SchemaManager {
    constructor() {
        if (!SchemaManager.singleton) {
            SchemaManager.singleton = this;
        }
        return SchemaManager.singleton;
    }
    registerSchema(schema) {
        let that = this;
        let className = schema.name;
        let nameSpace = schema.nameSpace;
        that._namespaces = that._namespaces || new Map();
        that._classes = that._classes || new Map();
        let ns = that._namespaces.get(nameSpace);
        if (!ns) {
            ns = new Map();
            that._namespaces.set(nameSpace, ns);
        }
        ns.set(className, schema);
        that._classes.set(nameSpace + '.' + className, schema);
    }
    childrenAndRefsOfClass(fullClassName) {
        let that = this;
        let refs = {};
        let classes = [fullClassName];
        let map = {};
        let i = 0;
        while (i < classes.length) {
            const cc = classes[i];
            if (!map[cc]) {
                map[cc] = true;
                let schema = that._classes.get(cc);
                if (schema) {
                    const deps = schemaUtils.getChildrenAndRefsOfClass(schema, (fullClassName) => { return that._classes.get(fullClassName); });
                    deps.children.forEach(cn => {
                        if (!map[cn])
                            classes.push(cn);
                    });
                    deps.refs.forEach(refName => refs[refName] = true);
                }
                else
                    throw util.format('Schema not found for class "%s".', cc);
            }
            i++;
        }
        classes.shift();
        return { children: classes, refs: refs };
    }
    isChild(fullClassName) {
        let that = this;
        return schemaUtils.isChild(that._classes ? that._classes.get(fullClassName) : null);
    }
    isTree(fullClassName) {
        let that = this;
        return schemaUtils.isTree(that._classes ? that._classes.get(fullClassName) : null);
    }
    schema(nameSpace, name) {
        let that = this;
        if (!that._namespaces)
            return null;
        const ns = that._namespaces.get(nameSpace);
        if (!ns)
            return null;
        return ns.get(name);
    }
    enumSchemas(nameSpace, cb) {
        let that = this;
        if (!that._namespaces)
            return;
        const ns = that._namespaces.get(nameSpace);
        if (!ns)
            return;
        for (const item of ns)
            cb(item[1]);
    }
    propertyInfo(propertyName, schema) {
        const that = this;
        let prop = schema.properties[propertyName];
        if (prop)
            return { schema: prop, isArray: false, isRelation: false };
        prop = schema.relations ? schema.relations[propertyName] : null;
        if (!prop)
            return null;
        return { schema: that.schema(prop.nameSpace, prop.model), isArray: prop.type === schema_consts_1.RELATION_TYPE.hasMany, isRelation: true };
    }
    _path2schema(schema, path) {
        const that = this;
        const segments = path.split('.');
        let cs = schema, cv = null, isRelation = false, isArray = false;
        for (const segment of segments) {
            if (!cs)
                return null;
            let pi = that.propertyInfo(segment, cs);
            if (!pi)
                return null;
            cv = pi.schema;
            if (!pi.isRelation) {
                isRelation = false;
                cs = null;
            }
            else {
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
    _serializeSchema(schema, root, rootSerialization, serialization, res) {
        const that = this;
        serialization.properties && serialization.properties.forEach((item) => {
            let fs = that._path2schema(schema, item.value);
            if (!fs)
                throw util.format('Invalid path "%s.%s.%s"', schema.nameSpace, schema.name, item.value);
            if (item.properties) {
                if (!fs.isRelation)
                    throw util.format('Invalid serialization "%s.%s.%s" is not a relation.', schema.nameSpace, schema.name, item.value);
                let cr = res[item.key] = { type: 'object' };
                if (fs.isArray) {
                    cr.type = 'array';
                    cr.items = { type: 'object' };
                    cr = cr.items;
                }
                cr.properties = {};
                that._serializeSchema(fs.schema, root, rootSerialization, item, cr.properties);
            }
            else {
                if (fs.isRelation) {
                    if (item.$ref) {
                        let cr = res[item.key] = {};
                        if (fs.isArray) {
                            cr.type = 'array';
                            cr.items = {};
                            cr = cr.items;
                        }
                        cr.$ref = item.$ref;
                        root.definitions = root.definitions || {};
                        let defName = serialization_1.extractDefinitionName(cr.$ref);
                        if (!root.definitions[defName]) {
                            root.definitions[defName] = {
                                type: 'object',
                                properties: {}
                            };
                            that._serializeSchema(fs.schema, root, rootSerialization, rootSerialization.definitions[defName], root.definitions[defName].properties);
                        }
                        return;
                    }
                    else {
                        throw util.format('Invalid serialization for "%s.%s.%s", "properties" is missing.', schema.nameSpace, schema.name, item.value);
                    }
                }
                res[item.key] = helper.clone(fs.schema);
            }
        });
    }
    serialization2Schema(nameSpace, name, serialization) {
        const res = { type: 'object', properties: {} };
        let schema = this.schema(nameSpace, name);
        if (!schema)
            throw util.format('Entity not found "%s.%s"', nameSpace, name);
        this._serializeSchema(schema, res, serialization, serialization, res.properties);
        return res;
    }
}
exports.SchemaManager = SchemaManager;
function schemaManager() {
    if (SchemaManager.singleton)
        return SchemaManager.singleton;
    return new SchemaManager();
}
exports.schemaManager = schemaManager;
