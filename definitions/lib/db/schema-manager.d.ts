export declare class SchemaManager {
    private _namespaces;
    private _classes;
    static singleton: SchemaManager;
    constructor();
    registerSchema(schema: any): void;
    childrenAndRefsOfClass(fullClassName: string): {
        children: string[];
        refs: any;
    };
    isChild(fullClassName: string): boolean;
    isTree(fullClassName: string): boolean;
    schema(nameSpace: string, name: string): any;
    enumSchemas(nameSpace: string, cb: (schema: any) => void): void;
    propertyInfo(propertyName: string, schema: any): {
        schema: any;
        isArray: boolean;
        isRelation: boolean;
    } | null;
    private _path2schema;
    private _serializeSchema;
    serialization2Schema(nameSpace: string, name: string, serialization: any): any;
}
export declare function schemaManager(): SchemaManager;
