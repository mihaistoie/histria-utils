import * as schemaUtils from '../schema/schema-utils'

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

    public childrenOfClass(fullClassName: string): string[] {
        let that = this;
        let res: string[] = [];
        let classes = [fullClassName];
        let map: any = {};
        let i = 0;
        while (i < classes.length) {
            const cc = classes[i];
            if (!map[cc]) {
                map[cc] = true;
                const children = schemaUtils.getChildrenOfClass(that._classes.get(cc));
                classes = classes.concat(children);
            }
            i++;
        }
        res.shift();
        return res;
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
