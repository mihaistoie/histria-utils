"use strict";
const schema_utils_1 = require("./lib/schema/schema-utils");
var schema_consts_1 = require("./lib/schema/schema-consts");
exports.JSONTYPES = schema_consts_1.JSONTYPES;
exports.RELATION_TYPE = schema_consts_1.RELATION_TYPE;
exports.AGGREGATION_KIND = schema_consts_1.AGGREGATION_KIND;
exports.JSONFORMATS = schema_consts_1.JSONFORMATS;
exports.DEFAULT_PARENT_NAME = schema_consts_1.DEFAULT_PARENT_NAME;
var errors_1 = require("./lib/utils/errors");
exports.ApplicationError = errors_1.ApplicationError;
var promises_1 = require("./lib/utils/promises");
exports.fs = promises_1.fs;
var messages_1 = require("./lib/locale/messages");
exports.messages = messages_1.messages;
var filter_1 = require("./lib/filter/filter");
exports.findInArray = filter_1.findInArray;
exports.findInMap = filter_1.findInMap;
exports.filter = filter_1.filter;
exports.schemaUtils = {
    typeOfProperty: schema_utils_1.typeOfProperty,
    isHidden: schema_utils_1.isHidden,
    isReadOnly: schema_utils_1.isReadOnly,
    isComplex: schema_utils_1.isComplex,
    expandSchema: schema_utils_1.expandSchema,
    enumCompositions: schema_utils_1.enumCompositions,
    updateRoleRefs: schema_utils_1.updateRoleRefs
};
const helper_1 = require("./lib/utils/helper");
exports.utils = {
    merge: helper_1.merge,
    clone: helper_1.clone,
    destroy: helper_1.destroy,
    format: helper_1.format
};
