export declare class SchemaManager {
    static singleton: SchemaManager;
    private _namespaces;
    private _classes;
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
    serialization2Schema(nameSpace: string, name: string, serialization: any): any;
    private _path2schema;
    private _serializeSchema;
}
export declare function schemaManager(): SchemaManager;
//# sourceMappingURL=schema-manager.d.ts.map