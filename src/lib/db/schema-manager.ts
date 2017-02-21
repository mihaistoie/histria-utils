import * as schemaUtils from '../schema/schema-utils'
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

        let ns: Map<string, any> = that._namespaces.get(nameSpace);
        if (!ns) {
            ns = new Map<string, any>();
            that._namespaces.set(nameSpace, ns)
        }
        ns.set(className, schema);
        that._classes.set(schema.name + '.' + nameSpace, schema);
    }

    public childrenAndRefsOfClass(fullClassName: string): { children: string[], refs: string[] } {
        let that = this;
        let children: string[] = [];
        let refs: string[] = [];
        let classes = [fullClassName];
        let map: any = {};
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

    public isChild(fullClassName: string): boolean {
        let that = this;
        return schemaUtils.isChild(that._classes ? that._classes.get(fullClassName) : null);
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
}


export function schemaManager(): SchemaManager {
    if (SchemaManager.singleton)
        return SchemaManager.singleton;
    return new SchemaManager();
}
