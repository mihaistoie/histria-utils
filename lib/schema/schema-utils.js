"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const fs = require("fs");
const path = require("path");
const schema_consts_1 = require("./schema-consts");
const helper_1 = require("../utils/helper");
const errors_1 = require("../utils/errors");
const DEFINITION_STRING = '#/definitions/';
const DEFINITION_STRING_LEN = DEFINITION_STRING.length;
function typeOfProperty(propSchema) {
    const ps = propSchema.type || schema_consts_1.JSONTYPES.string;
    if (!schema_consts_1.JSONTYPES[ps])
        throw new errors_1.ApplicationError(util.format('Unsupported schema type : "%s"', propSchema.type));
    if (propSchema.format) {
        if (ps === schema_consts_1.JSONTYPES.string) {
            if (propSchema.format === schema_consts_1.JSONTYPES.date)
                return schema_consts_1.JSONTYPES.date;
            else if (propSchema.format === schema_consts_1.JSONTYPES.datetime)
                return schema_consts_1.JSONTYPES.datetime;
            else if (propSchema.format === schema_consts_1.JSONTYPES.id)
                return schema_consts_1.JSONTYPES.id;
        }
        else if (ps === schema_consts_1.JSONTYPES.integer) {
            if (propSchema.format === schema_consts_1.JSONTYPES.id)
                return schema_consts_1.JSONTYPES.id;
        }
    }
    return ps;
}
exports.typeOfProperty = typeOfProperty;
function isHidden(propSchema) {
    return propSchema.isHidden === true;
}
exports.isHidden = isHidden;
function isReadOnly(propSchema) {
    return (propSchema.generated === true || propSchema.isReadOnly === true);
}
exports.isReadOnly = isReadOnly;
function isComplex(schema) {
    return (schema.type === schema_consts_1.JSONTYPES.array || schema.type === schema_consts_1.JSONTYPES.object);
}
exports.isComplex = isComplex;
function expandSchema(schema, model) {
    _expand$Ref(schema, [], model, schema.definitions);
}
exports.expandSchema = expandSchema;
function updateRoleRefs(role, localModel, foreignModel, useInv) {
    if (!localModel)
        return;
    if (!role)
        return;
    if (useInv) {
        if (role.foreignFields && role.foreignFields.length)
            role.foreignFields.forEach((field, index) => {
                const ff = role.localFields[index];
                if (foreignModel)
                    localModel[field] = foreignModel[ff];
                else
                    delete localModel[field];
            });
    }
    else {
        if (role.localFields && role.localFields.length)
            role.localFields.forEach((field, index) => {
                const ff = role.foreignFields[index];
                if (foreignModel)
                    localModel[field] = foreignModel[ff];
                else
                    delete localModel[field];
            });
    }
}
exports.updateRoleRefs = updateRoleRefs;
function roleToQueryInv(role, localModel) {
    let query = {};
    let valueIsNull = false;
    if (!role.foreignFields)
        return null;
    role.foreignFields.forEach((field, index) => {
        if (valueIsNull)
            return;
        const ff = role.localFields[index];
        const value = localModel[ff];
        if (value === null && value === '' && value === undefined)
            valueIsNull = false;
        else
            query[field] = value;
    });
    if (valueIsNull)
        query = null;
    return query;
}
exports.roleToQueryInv = roleToQueryInv;
function roleToQuery(role, localModel) {
    let query = {};
    let valueIsNull = false;
    if (!role.localFields)
        return null;
    role.localFields.forEach((field, index) => {
        if (valueIsNull)
            return;
        const ff = role.foreignFields[index];
        const value = localModel[field];
        if (value === null && value === '' && value === undefined)
            valueIsNull = false;
        else
            query[ff] = value;
    });
    if (valueIsNull)
        query = null;
    return query;
}
exports.roleToQuery = roleToQuery;
function enumCompositions(relations, cb) {
    if (relations)
        Object.keys(relations).forEach(relationName => {
            const relation = relations[relationName];
            if (relation.aggregationKind === schema_consts_1.AGGREGATION_KIND.composite && (relation.type === schema_consts_1.RELATION_TYPE.hasOne || relation.type === schema_consts_1.RELATION_TYPE.hasMany)) {
                cb(relationName, relation);
            }
        });
}
exports.enumCompositions = enumCompositions;
function enumBelongsToAggregations(relations, cb) {
    if (relations)
        Object.keys(relations).forEach(relationName => {
            const relation = relations[relationName];
            if (relation.aggregationKind === schema_consts_1.AGGREGATION_KIND.shared && relation.type === schema_consts_1.RELATION_TYPE.belongsTo) {
                cb(relationName, relation);
            }
        });
}
exports.enumBelongsToAggregations = enumBelongsToAggregations;
function enumHasAggregations(relations, cb) {
    if (relations)
        Object.keys(relations).forEach(relationName => {
            const relation = relations[relationName];
            if (relation.aggregationKind === schema_consts_1.AGGREGATION_KIND.shared && (relation.type === schema_consts_1.RELATION_TYPE.hasMany || relation.type === schema_consts_1.RELATION_TYPE.hasOne)) {
                cb(relationName, relation);
            }
        });
}
exports.enumHasAggregations = enumHasAggregations;
function enumRelations(relations, cb) {
    if (relations)
        Object.keys(relations).forEach(relationName => {
            cb(relationName, relations[relationName]);
        });
}
exports.enumRelations = enumRelations;
function parentRelation(schema) {
    if (schema.meta && schema.meta.parentRelation && schema.relations && schema.relations[schema.meta.parentRelation]) {
        return { relationName: schema.meta.parentRelation, relation: schema.relations[schema.meta.parentRelation] };
    }
    return null;
}
exports.parentRelation = parentRelation;
function getChildrenAndRefsOfClass(schema, mapper) {
    const deps = { children: [], refs: [] };
    const classes = {};
    const refs = {};
    classes[schema.nameSpace + '.' + schema.name] = true;
    const isView = schema.view;
    if (schema.relations)
        Object.keys(schema.relations).forEach(relationName => {
            const relation = schema.relations[relationName];
            const refFullName = (relation.nameSpace || schema.nameSpace) + '.' + relation.model;
            if (isView) {
                // add only compositions that are view
                if (relation.aggregationKind === schema_consts_1.AGGREGATION_KIND.composite) {
                    const refSchema = mapper(refFullName);
                    if (refSchema && refSchema.view && !classes[refFullName]) {
                        deps.children.push(refFullName);
                        classes[refFullName] = true;
                    }
                }
            }
            else {
                switch (relation.type) {
                    case schema_consts_1.RELATION_TYPE.hasOne:
                        if (relation.aggregationKind === schema_consts_1.AGGREGATION_KIND.composite) {
                            if (!classes[refFullName]) {
                                deps.children.push(refFullName);
                                classes[refFullName] = true;
                            }
                        }
                        else if (relation.aggregationKind === schema_consts_1.AGGREGATION_KIND.none)
                            if (!refs[refFullName]) {
                                deps.refs.push(refFullName);
                                refs[refFullName] = true;
                            }
                        break;
                    case schema_consts_1.RELATION_TYPE.hasMany:
                        if (relation.aggregationKind === schema_consts_1.AGGREGATION_KIND.composite) {
                            if (!classes[refFullName]) {
                                deps.children.push(refFullName);
                                classes[refFullName] = true;
                            }
                        }
                        break;
                    case schema_consts_1.RELATION_TYPE.belongsTo:
                        if (relation.aggregationKind === schema_consts_1.AGGREGATION_KIND.shared) {
                            if (!refs[refFullName]) {
                                deps.refs.push(refFullName);
                                refs[refFullName] = true;
                            }
                        }
                        break;
                }
            }
        });
    return deps;
}
exports.getChildrenAndRefsOfClass = getChildrenAndRefsOfClass;
function isChild(schema) {
    return !!(schema && schema.meta && schema.meta.parent);
}
exports.isChild = isChild;
function isTree(schema) {
    return !!(schema && schema.meta && schema.meta.parent === schema.name);
}
exports.isTree = isTree;
function idDefinition(persistent) {
    return { type: schema_consts_1.JSONTYPES.integer, generated: true, format: schema_consts_1.JSONTYPES.id, transient: !persistent };
}
function refIdDefinition(persistent) {
    return { type: schema_consts_1.JSONTYPES.integer, isReadOnly: true, format: schema_consts_1.JSONTYPES.id, transient: !persistent };
}
// reference :
// schema_name"
// schema_name.json"
// schema.json#/definitions/definition_name"
// #/definitions/definition_name"
function _load$ref(reference, model, definitions) {
    let ii = reference.indexOf(DEFINITION_STRING);
    let schemaId;
    let defName;
    if (ii >= 0) {
        schemaId = reference.substr(0, ii);
        defName = reference.substr(ii + DEFINITION_STRING_LEN);
    }
    else {
        schemaId = reference;
    }
    if (schemaId) {
        ii = schemaId.indexOf('.json');
        if (ii >= 0)
            schemaId = schemaId.substr(0, ii);
    }
    if (!schemaId && !defName)
        throw new errors_1.ApplicationError(util.format('Unsupported schema $ref : "%s"', reference));
    let ref;
    let def = definitions;
    if (schemaId) {
        ref = model[schemaId];
        if (!ref)
            throw new errors_1.ApplicationError(util.format('Schema not found "%s". ($ref : "%s")', schemaId, reference));
        if (defName)
            def = model[schemaId].definitions;
        else
            ref = helper_1.clone(model[schemaId]);
    }
    if (defName && (!def || !def[defName]))
        throw new errors_1.ApplicationError(util.format('Definition not found "%s". ($ref : "%s")', defName, reference));
    if (defName)
        ref = helper_1.clone(def[defName]);
    return ref;
}
function _toMerge(item, callStack, model, definitions) {
    let toMerge = null;
    if (item.allOf) {
        toMerge = item.allOf;
        delete item.allOf;
    }
    else if (item.$ref) {
        if (callStack.indexOf(item.$ref) < 0) {
            toMerge = [{ $ref: item.$ref }];
            delete item.$ref;
        }
    }
    if (toMerge) {
        toMerge.forEach((ci) => {
            const newCallStack = callStack.slice(0);
            if (ci.$ref) {
                const ref = _load$ref(ci.$ref, model, definitions);
                newCallStack.push(ci.$ref);
                delete ci.$ref;
                helper_1.merge(ref, ci);
            }
            _expand$Ref(ci, newCallStack, model, definitions);
            helper_1.merge(ci, item);
        });
    }
}
function _expand$Ref(item, callStack, model, definitions) {
    const currentCallStack = callStack.slice(0);
    _toMerge(item, currentCallStack, model, definitions);
    let toExpand = null;
    if (item.properties) {
        toExpand = item;
    }
    else if (item.type === schema_consts_1.JSONTYPES.array && item.items) {
        toExpand = item.items;
    }
    if (toExpand && toExpand.properties) {
        Object.keys(toExpand.properties).forEach(name => {
            const prop = toExpand.properties[name];
            if (prop.allOf || prop.$ref)
                _toMerge(prop, callStack, model, definitions);
            if (prop.type === schema_consts_1.JSONTYPES.array && prop.items) {
                if (prop.items.allOf || prop.items.$ref)
                    _toMerge(prop.items, callStack, model, definitions);
            }
        });
    }
}
async function loadJsonFromFile(jsonFile) {
    const data = await util.promisify(fs.readFile)(jsonFile);
    try {
        return JSON.parse(data.toString());
    }
    catch (ex) {
        throw ex;
    }
}
function _checkModel(schema, model) {
    schema.properties = schema.properties || {};
    if (!schema.primaryKey || schema.view) {
        schema.properties.id = idDefinition(schema.view);
        schema.primaryKey = ['id'];
    }
    schema.meta = schema.meta || {};
    if (!schema.primaryKey)
        throw util.format('Invalid schema "%s", primarykey is missing.', schema.name);
    if (typeof schema.primaryKey === 'string') {
        const pkString = schema.primaryKey;
        const pk = pkString.split(',').map((key) => key.trim());
        schema.primaryKey = pk;
    }
}
function _checkHooks(schema, model) {
    const isView = schema.view;
    if (schema.hooks)
        schema.hooks.forEach((hook) => {
            hook.type = hook.type || 'factory';
            if (hook.type === 'factory') {
                if (!hook.model)
                    throw util.format('Invalid hook definition for class "%s", model is missing.', schema.name);
                hook.nameSpace = hook.nameSpace || schema.nameSpace;
                const fullClassName = hook.nameSpace + '.' + hook.model;
                const refModel = model[fullClassName];
                if (!refModel)
                    throw util.format('Invalid hook model "%s", entity not found.', fullClassName);
                if (!hook.relation)
                    throw util.format('Invalid hook definition for class "%s", relation is missing.', schema.name);
                if (!hook.property)
                    throw util.format('Invalid hook definition for class "%s", property is missing.', schema.name);
                if (!refModel.relations || !refModel.relations[hook.relation])
                    throw util.format('Invalid hook definition for class "%s", relation "%s.%s" not found.', schema.name, fullClassName, hook.relation);
            }
        });
}
function _checkRelations(schema, model) {
    // schema.meta.parent = null;
    const isView = schema.view;
    if (schema.relations)
        Object.keys(schema.relations).forEach(relName => {
            const rel = schema.relations[relName];
            rel.nameSpace = rel.nameSpace || schema.nameSpace;
            if (!rel.type)
                throw util.format('Invalid relation "%s.%s", type is missing.', schema.name, relName);
            rel.title = rel.title || relName;
            if (rel.type === schema_consts_1.RELATION_TYPE.belongsTo) {
                rel.aggregationKind = rel.aggregationKind || schema_consts_1.AGGREGATION_KIND.composite;
                if (rel.aggregationKind !== schema_consts_1.AGGREGATION_KIND.shared && rel.aggregationKind !== schema_consts_1.AGGREGATION_KIND.composite) {
                    throw util.format('Invalid relation "%s.%s", aggregationKind must be composite or shared.', schema.name, relName);
                }
                if (isView && rel.aggregationKind !== schema_consts_1.AGGREGATION_KIND.composite)
                    throw util.format('Invalid relation "%s.%s": for a view aggregationKind must be composite.', schema.name, relName);
                if (rel.aggregationKind === schema_consts_1.AGGREGATION_KIND.composite) {
                    schema.meta.parent = rel.model;
                    schema.meta.parentRelation = relName;
                }
            }
            else {
                rel.aggregationKind = rel.aggregationKind || schema_consts_1.AGGREGATION_KIND.none;
            }
            const fullClassName = (rel.nameSpace || schema.nameSpace) + '.' + rel.model;
            if (!rel.model || !model[fullClassName])
                throw util.format('Invalid relation "%s.%s", invalid remote entity.', schema.name, relName);
            const refModel = model[fullClassName];
            if (rel.type === schema_consts_1.RELATION_TYPE.belongsTo && isView && !refModel.view)
                throw util.format('Invalid relation "%s.%s": a view can\'t belongs to an entity.', schema.name, relName);
            let refRel = null;
            if (rel.invRel) {
                if (isView) {
                    if (!refModel.view) {
                        // A view (local) can't have a reference to a persistent model (foreign)
                        throw util.format('Invalid relation "%s.%s": invRel is not allowed.', schema.name, relName);
                    }
                }
                if (!isView && refModel.view) {
                    // A persistent model (local) can't have a reference to a view (foreign)
                    throw util.format('Invalid relation "%s.%s": "%s" is a view.', schema.name, relName, rel.model);
                }
                refModel.relations = refModel.relations || {};
                refRel = refModel.relations[rel.invRel];
            }
            if (isView) {
                if (rel.aggregationKind === schema_consts_1.AGGREGATION_KIND.shared) {
                    throw util.format('Invalid relation "%s.%s", a view can\'t have aggregations.', schema.name, relName);
                }
                if (rel.aggregationKind === schema_consts_1.AGGREGATION_KIND.composite) {
                    if (refModel.view && !refRel)
                        throw util.format('Invalid relation "%s.%s": "%s" invRel is empty.', schema.name, relName, rel.model);
                }
                const lf = relName + 'Id';
                if (rel.type === schema_consts_1.RELATION_TYPE.hasOne) {
                    rel.localFields = [lf];
                    rel.foreignFields = ['id'];
                    schema.properties[lf] = refIdDefinition(true);
                }
                else if (rel.type === schema_consts_1.RELATION_TYPE.hasMany) {
                    if (refModel && refModel.view && rel.aggregationKind === schema_consts_1.AGGREGATION_KIND.composite) {
                        rel.localFields = ['id'];
                        rel.foreignFields = [rel.invRel + 'Id'];
                    }
                    else {
                        rel.localFields = [lf];
                        rel.foreignFields = ['id'];
                        schema.properties[lf] = {
                            type: schema_consts_1.JSONTYPES.array,
                            items: refIdDefinition(true)
                        };
                    }
                }
                else if (rel.type === schema_consts_1.RELATION_TYPE.belongsTo) {
                    if (!rel.invRel)
                        throw util.format('Invalid relation "%s.%s", invRel is missing.', schema.name, relName);
                    if (refRel.type === schema_consts_1.RELATION_TYPE.hasMany) {
                        rel.localFields = [relName + 'Id'];
                        rel.foreignFields = ['id'];
                        schema.properties[relName + 'Id'] = refIdDefinition(true);
                    }
                    else {
                        rel.localFields = ['id'];
                        rel.foreignFields = [rel.invRel + 'Id'];
                    }
                }
                else
                    throw util.format('Invalid relation "%s.%s", invalid relation type.', schema.name, relName);
                if (isView && !refModel.view && rel.aggregationKind === schema_consts_1.AGGREGATION_KIND.composite && rel.type === schema_consts_1.RELATION_TYPE.hasOne) {
                    if (rel.type === schema_consts_1.RELATION_TYPE.hasOne && !refModel.view) {
                        refModel.viewsOfMe = schema.viewsOfMe || {};
                        refModel.viewsOfMe[schema.nameSpace + '.' + schema.name] = {
                            nameSpace: schema.nameSpace,
                            model: schema.name,
                            relation: relName,
                            localFields: rel.localFields.slice(),
                            foreignFields: rel.foreignFields.slice()
                        };
                    }
                }
            }
            else {
                const isCompositionParent = (rel.aggregationKind === schema_consts_1.AGGREGATION_KIND.composite) && (rel.type !== schema_consts_1.RELATION_TYPE.belongsTo);
                if (!refRel && (rel.aggregationKind !== schema_consts_1.AGGREGATION_KIND.none)) {
                    if (!isCompositionParent)
                        throw util.format('Invalid relation "%s.%s", invRel for aggregations and compositions is required.', schema.name, relName);
                }
                if (refRel) {
                    if (refRel.type === schema_consts_1.RELATION_TYPE.belongsTo) {
                        refRel.aggregationKind = refRel.aggregationKind || schema_consts_1.AGGREGATION_KIND.composite;
                        if (rel.aggregationKind === schema_consts_1.AGGREGATION_KIND.none) {
                            throw util.format('Invalid relation "%s.%s", aggregationKind must be composite or shared.', schema.name, relName);
                        }
                    }
                    else
                        refRel.aggregationKind = refRel.aggregationKind || schema_consts_1.AGGREGATION_KIND.none;
                    if (refRel.aggregationKind !== rel.aggregationKind) {
                        throw util.format('Invalid type  %s.%s.aggregationKind !== %s.%s.aggregationKind.', schema.name, relName, refModel.name, rel.invRel);
                    }
                    if (refRel.type === rel.type) {
                        throw util.format('Invalid type  %s.%s.type === %s.%s.type.', schema.name, relName, refModel.name, rel.invRel);
                    }
                    rel.invType = refRel.type;
                }
                if (!rel.localFields || !rel.foreignFields) {
                    throw util.format('Invalid relation "%s.%s", localFields and foreignFields must be defined.', schema.name, relName);
                }
                if (rel.foreignFields.length !== rel.localFields.length)
                    throw util.format('Invalid relation "%s.%s", #foreignFields != #localFields.', schema.name, relName);
                // check fields
                rel.localFields.forEach((lf, index) => {
                    const rf = rel.foreignFields[index];
                    const crf = lf === 'id';
                    const clf = rf === 'id';
                    if (crf && !refModel.properties[rf]) {
                        refModel.properties[rf] = refIdDefinition(true);
                    }
                    else if (clf && !schema.properties[lf]) {
                        schema.properties[lf] = refIdDefinition(true);
                    }
                    if (!schema.properties[lf])
                        throw new Error(`Invalid relation "${schema.name}.${relName}", "${schema.name}.${lf}" - field not found.`);
                    if (!refModel.properties[rf])
                        throw new Error(`Invalid relation "${schema.name}.${relName}", "${refModel.name}.${rf}" - field not found.`);
                    if (refModel.properties[rf].type !== schema.properties[lf].type)
                        throw new Error(`Invalid relation "${schema.name}.${relName}",  typeof ${refModel.properties[rf].type} != ${typeof schema.properties[lf].type}.`);
                });
            }
        });
}
async function loadModel(pathToModel, model) {
    const files = await util.promisify(fs.readdir)(pathToModel);
    const folders = [];
    const stats = await Promise.all(files.map((fileName) => {
        return util.promisify(fs.lstat)(path.join(pathToModel, fileName));
    }));
    const jsonFiles = [];
    stats.forEach((stat, index) => {
        const fn = path.join(pathToModel, files[index]);
        if (stat.isDirectory())
            return;
        if (path.extname(fn) === '.json') {
            jsonFiles.push(fn);
        }
    });
    const modelByJsonFile = {};
    const schemas = await Promise.all(jsonFiles.map((fileName) => {
        return loadJsonFromFile(fileName);
    }));
    jsonFiles.forEach((fileName, index) => {
        const p = path.parse(fileName);
        const schema = schemas[index];
        schema.name = schema.name || p.name;
        modelByJsonFile[p.name + '.' + p.ext] = schema;
    });
    schemas.forEach((schema) => {
        _expand$Ref(schema, [], modelByJsonFile, schema.definitions);
        schema.nameSpace = schema.nameSpace || schema.name;
        model[schema.nameSpace + '.' + schema.name] = schema;
    });
    schemas.forEach(schema => {
        _checkModel(schema, model);
    });
    schemas.forEach(schema => {
        _checkRelations(schema, model);
    });
    schemas.forEach(schema => {
        _checkHooks(schema, model);
    });
}
exports.loadModel = loadModel;

//# sourceMappingURL=schema-utils.js.map
