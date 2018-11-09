import { typeOfProperty, isHidden, isReadOnly, isComplex, expandSchema, enumCompositions, enumRelations, enumBelongsToAggregations, enumHasAggregations, updateRoleRefs, loadModel, roleToQuery, roleToQueryInv, parentRelation } from './lib/schema/schema-utils';
import { check } from './lib/serialization/serialization';
export { JSONTYPES, RELATION_TYPE, AGGREGATION_KIND, JSONFORMATS, DEFAULT_PARENT_NAME } from './lib/schema/schema-consts';
export { ApplicationError } from './lib/utils/errors';
export { messages } from './lib/locale/messages';
export { locale } from './lib/locale/locale';
export { findInArray, findInMap, filter } from './lib/filter/filter';
export { IStore } from './lib/interfaces/store';
export { schemaManager } from './lib/db/schema-manager';
export { DbDriver, dbManager, DbManager } from './lib/db/db-manager';
export declare const schemaUtils: {
    typeOfProperty: typeof typeOfProperty;
    isHidden: typeof isHidden;
    isReadOnly: typeof isReadOnly;
    isComplex: typeof isComplex;
    expandSchema: typeof expandSchema;
    enumCompositions: typeof enumCompositions;
    enumBelongsToAggregations: typeof enumBelongsToAggregations;
    enumHasAggregations: typeof enumHasAggregations;
    enumRelations: typeof enumRelations;
    parentRelation: typeof parentRelation;
    updateRoleRefs: typeof updateRoleRefs;
    loadModel: typeof loadModel;
    roleToQuery: typeof roleToQuery;
    roleToQueryInv: typeof roleToQueryInv;
};
export declare const helper: {
    merge: (src: any, dst: any) => void;
    clone: (src: any) => any;
    destroy: (obj: any) => void;
    format: (...args: any[]) => string;
    valuesByPath: (path: string, value: any, res: any[]) => void;
};
export declare const serialization: {
    check: typeof check;
};
//# sourceMappingURL=index.d.ts.map