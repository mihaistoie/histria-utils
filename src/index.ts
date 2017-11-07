import {
    typeOfProperty, isHidden, isReadOnly, isComplex, expandSchema,
    enumCompositions, enumRelations, enumBelongsToAggregations,
    enumHasAggregations, updateRoleRefs, loadModel, roleToQuery,
    roleToQueryInv, parentRelation
} from './lib/schema/schema-utils';

import { check } from './lib/serialization/serialization';
export { JSONTYPES, RELATION_TYPE, AGGREGATION_KIND, JSONFORMATS, DEFAULT_PARENT_NAME } from './lib/schema/schema-consts';
export { ApplicationError } from './lib/utils/errors';
export { messages } from './lib/locale/messages';
export { locale } from './lib/locale/locale';
export { findInArray, findInMap, filter } from './lib/filter/filter';
export { IStore } from './lib/interfaces/store';
export { schemaManager } from './lib/db/schema-manager';
export { DbDriver, dbManager, DbManager } from './lib/db/db-manager';




export const schemaUtils = {
    typeOfProperty: typeOfProperty,
    isHidden: isHidden,
    isReadOnly: isReadOnly,
    isComplex: isComplex,
    expandSchema: expandSchema,
    enumCompositions: enumCompositions,
    enumBelongsToAggregations: enumBelongsToAggregations,
    enumHasAggregations: enumHasAggregations,
    enumRelations: enumRelations,
    parentRelation: parentRelation,
    updateRoleRefs: updateRoleRefs,
    loadModel: loadModel,
    roleToQuery: roleToQuery,
    roleToQueryInv: roleToQueryInv
}

import { merge, clone, destroy, format, valuesByPath } from './lib/utils/helper';

export const helper = {
    merge: merge,
    clone: clone,
    destroy: destroy,
    format: format,
    valuesByPath: valuesByPath
}

export const serialization = {
    check: check
}

