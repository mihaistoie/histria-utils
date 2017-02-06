import { typeOfProperty, isHidden, isReadOnly, isComplex, expandSchema, enumCompositions, updateRoleRefs, loadModel } from './lib/schema/schema-utils';
export { JSONTYPES, RELATION_TYPE, AGGREGATION_KIND, JSONFORMATS, DEFAULT_PARENT_NAME } from './lib/schema/schema-consts';
export { ApplicationError } from './lib/utils/errors';
export { fs } from './lib/utils/promises';
export { messages } from './lib/locale/messages';
export { locale } from './lib/locale/locale';
export { findInArray, findInMap, filter } from './lib/filter/filter';
export { IStore } from './lib/interfaces/store';
export { schemaManager } from './lib/db/schema-manager';
export { DbDriver, dbManager, DbManager } from './lib/db/db-manager';




export var schemaUtils = {
    typeOfProperty: typeOfProperty,
    isHidden: isHidden,
    isReadOnly: isReadOnly,
    isComplex: isComplex,
    expandSchema: expandSchema,
    enumCompositions: enumCompositions,
    updateRoleRefs: updateRoleRefs,
    loadModel: loadModel
}

import { merge, clone, destroy, format } from './lib/utils/helper';

export var helper = {
    merge: merge,
    clone: clone,
    destroy: destroy,
    format: format
}



