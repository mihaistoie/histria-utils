export declare class SchemaManager {
    private _namespaces;
    static singleton: SchemaManager;
    constructor();
    registerSchema(schema: any): void;
    schema(nameSpace: string, name: string): any;
}
export declare function schemaManager(): SchemaManager;
