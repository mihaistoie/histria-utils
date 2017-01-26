import { typeOfProperty, isHidden, isReadOnly, isComplex, expandSchema, enumCompositions, updateRoleRefs } from './lib/schema/schema-utils';
export { JSONTYPES, RELATION_TYPE, AGGREGATION_KIND, JSONFORMATS, DEFAULT_PARENT_NAME } from './lib/schema/schema-consts';
export { ApplicationError } from './lib/utils/errors';
export { fs } from './lib/utils/promises';
export { messages } from './lib/locale/messages';
export { findInArray, findInMap, filter } from './lib/filter/filter';


export var schemaUtils = {
    typeOfProperty: typeOfProperty,
    isHidden: isHidden,
    isReadOnly: isReadOnly,
    isComplex: isComplex,
    expandSchema: expandSchema,
    enumCompositions: enumCompositions,
    updateRoleRefs: updateRoleRefs
}

import { merge, clone, destroy, format } from './lib/utils/helper';

export var utils = {
    merge: merge,
    clone: clone,
    destroy: destroy,
    format: format
}



