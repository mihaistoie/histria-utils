export declare class SchemaManager {
    private _namespaces;
    static singleton: SchemaManager;
    constructor();
    registerSchema(schema: any): void;
    schema(nameSpace: string, name: string): any;
    enumSchemas(nameSpace: string, cb: (schema: any) => void): void;
}
export declare function schemaManager(): SchemaManager;
