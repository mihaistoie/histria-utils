export declare function typeOfProperty(propSchema: {
    type?: string;
    format?: string;
    reference?: string;
}): string;
export declare function isHidden(propSchema: any): boolean;
export declare function isReadOnly(propSchema: any): boolean;
export declare function isComplex(schema: any): boolean;
export declare function expandSchema(schema: any, model: any): void;
export declare function updateRoleRefs(role: any, localModel: any, foreignModel: any, useInv: boolean): void;
export declare function roleToQueryInv(role: any, localModel: any): any;
export declare function roleToQuery(role: any, localModel: any): any;
export declare function enumCompositions(relations: any, cb: (relationName: string, relation: any) => void): void;
export declare function enumBelongsToAggregations(relations: any, cb: (relationName: string, relation: any) => void): void;
export declare function enumHasAggregations(relations: any, cb: (relationName: string, relation: any) => void): void;
export declare function enumRelations(relations: any, cb: (relationName: string, relation: any) => void): void;
export declare function parentRelation(schema: any): {
    relationName: string;
    relation: any;
};
export declare function getChildrenAndRefsOfClass(schema: any, mapper: (fullClassName: string) => any): {
    children: string[];
    refs: string[];
};
export declare function isChild(schema: any): boolean;
export declare function isTree(schema: any): boolean;
export declare function loadModel(pathToModel: string, model: any): Promise<void>;
