export class SchemaManager {
    private _namespaces: Map<string, Map<string, any>>;
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

        let ns: Map<string, any> = that._namespaces.get(nameSpace);
        if (!ns) {
            ns = new Map<string, any>();
            that._namespaces.set(nameSpace, ns)
        }
        ns.set(className, schema);

    }
    public schema(nameSpace: string, name: string): any {
        let that = this;
        if (!that._namespaces) return null;
        const ns = that._namespaces.get(nameSpace);
        if (!ns) return null;
        return ns.get(name);
    }
}


export function schemaManager(): SchemaManager {
    if (SchemaManager.singleton)
        return SchemaManager.singleton;
    return new SchemaManager();
}
