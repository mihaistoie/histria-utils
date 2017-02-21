"use strict";
const schemaUtils = require("../schema/schema-utils");
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
        let children = [];
        let refs = [];
        let classes = [fullClassName];
        let map = {};
        let i = 0;
        while (i < classes.length) {
            const cc = classes[i];
            if (!map[cc]) {
                map[cc] = true;
                let schema = that._classes.get(cc);
                if (!schema)
                    throw util.format('Schema not found for class "%s".', cc);
                const deps = schemaUtils.getChildrenAndRefsOfClass(schema);
                classes = classes.concat(deps.children);
                refs = refs.concat(deps.refs);
            }
            i++;
        }
        children.shift();
        return { children: children, refs: refs };
    }
    isChild(fullClassName) {
        let that = this;
        return schemaUtils.isChild(that._classes ? that._classes.get(fullClassName) : null);
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
}
exports.SchemaManager = SchemaManager;
function schemaManager() {
    if (SchemaManager.singleton)
        return SchemaManager.singleton;
    return new SchemaManager();
}
exports.schemaManager = schemaManager;
