export { JSONTYPES, RELATION_TYPE, AGGREGATION_KIND, JSONFORMATS, DEFAULT_PARENT_NAME } from './lib/schema/schema-consts';
export { ApplicationError } from './lib/utils/errors';
export { fs } from './lib/utils/promises';
export { messages } from './lib/locale/messages';
export { locale } from './lib/locale/locale';
export { findInArray, findInMap, filter } from './lib/filter/filter';
export { IStore } from './lib/interfaces/store';
export { schemaManager } from './lib/db/schema-manager';
export { DbDriver, dbManager, DbManager } from './lib/db/db-manager';
export declare const schemaUtils: {
    typeOfProperty: (propSchema: {
        type?: string | undefined;
        format?: string | undefined;
        reference?: string | undefined;
    }) => string;
    isHidden: (propSchema: any) => boolean;
    isReadOnly: (propSchema: any) => boolean;
    isComplex: (schema: any) => boolean;
    expandSchema: (schema: any, model: any) => void;
    enumCompositions: (relations: any, cb: (relationName: string, relation: any) => void) => void;
    enumBelongsToAggregations: (relations: any, cb: (relationName: string, relation: any) => void) => void;
    enumHasAggregations: (relations: any, cb: (relationName: string, relation: any) => void) => void;
    enumRelations: (relations: any, cb: (relationName: string, relation: any) => void) => void;
    parentRelation: (schema: any) => {
        relationName: string;
        relation: any;
    } | null;
    updateRoleRefs: (role: any, localModel: any, foreignModel: any, useInv: boolean) => void;
    loadModel: (pathToModel: string, model: any) => Promise<void>;
    roleToQuery: (role: any, localModel: any) => any;
    roleToQueryInv: (role: any, localModel: any) => any;
};
export declare const helper: {
    merge: (src: any, dst: any) => void;
    clone: (src: any) => any;
    destroy: (obj: any) => void;
    format: (...args: any[]) => string;
};
export declare const serialization: {
    check: (serialization: any) => void;
};
