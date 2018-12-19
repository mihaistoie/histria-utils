
import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';

import { JSONTYPES, RELATION_TYPE, AGGREGATION_KIND } from './schema-consts';
import { merge, clone } from '../utils/helper';

import { ApplicationError } from '../utils/errors';

const
    DEFINITION_STRING = '#/definitions/';
const
    DEFINITION_STRING_LEN = DEFINITION_STRING.length;

export function typeOfProperty(propSchema: { type?: string, format?: string, reference?: string }): string {
    const ps = propSchema.type || JSONTYPES.string;
    if (!JSONTYPES[ps])
        throw new ApplicationError(util.format('Unsupported schema type : "%s"', propSchema.type));
    if (propSchema.format) {
        if (ps === JSONTYPES.string) {
            if (propSchema.format === JSONTYPES.date)
                return JSONTYPES.date;
            else if (propSchema.format === JSONTYPES.datetime)
                return JSONTYPES.datetime;
            else if (propSchema.format === JSONTYPES.id)
                return JSONTYPES.id;
        } else if (ps === JSONTYPES.integer) {
            if (propSchema.format === JSONTYPES.id)
                return JSONTYPES.id;

        }
    }
    return ps;
}

export function isHidden(propSchema: any): boolean {
    return propSchema.isHidden === true;
}

export function isReadOnly(propSchema: any): boolean {
    return (propSchema.generated === true || propSchema.isReadOnly === true);
}

export function isComplex(schema: any) {
    return (schema.type === JSONTYPES.array || schema.type === JSONTYPES.object);
}

export function expandSchema(schema: any, model: any) {
    _expand$Ref(schema, [], model, schema.definitions);
}

export function updateRoleRefs(role: any, localModel: any, foreignModel: any, useInv: boolean) {
    if (!localModel) return;
    if (!role) return;
    if (useInv) {
        if (role.foreignFields && role.foreignFields.length)
            role.foreignFields.forEach((field: string, index: number) => {
                const ff = role.localFields[index];
                if (foreignModel)
                    localModel[field] = foreignModel[ff];
                else
                    delete localModel[field];
            });
    } else {
        if (role.localFields && role.localFields.length)
            role.localFields.forEach((field: string, index: number) => {
                const ff = role.foreignFields[index];
                if (foreignModel)
                    localModel[field] = foreignModel[ff];
                else
                    delete localModel[field];
            });
    }
}
export function roleToQueryInv(role: any, localModel: any): any {
    let query: any = {};
    let valueIsNull = false;
    if (!role.foreignFields) return null;
    role.foreignFields.forEach((field: string, index: number) => {
        if (valueIsNull) return;
        const ff = role.localFields[index];
        const value = localModel[ff];
        if (value === null && value === '' && value === undefined)
            valueIsNull = false;
        else
            query[field] = value;
    });
    if (valueIsNull) query = null;
    return query;
}

export function roleToQuery(role: any, localModel: any): any {
    let query: any = {};
    let valueIsNull = false;
    if (!role.localFields) return null;
    role.localFields.forEach((field: string, index: number) => {
        if (valueIsNull) return;
        const ff = role.foreignFields[index];
        const value = localModel[field];
        if (value === null && value === '' && value === undefined)
            valueIsNull = false;
        else
            query[ff] = value;
    });
    if (valueIsNull) query = null;
    return query;
}

export function enumCompositions(relations: any, cb: (relationName: string, relation: any) => void) {
    if (relations)
        Object.keys(relations).forEach(relationName => {
            const relation = relations[relationName];
            if (relation.aggregationKind === AGGREGATION_KIND.composite && (relation.type === RELATION_TYPE.hasOne || relation.type === RELATION_TYPE.hasMany)) {
                cb(relationName, relation);
            }
        });
}

export function enumBelongsToAggregations(relations: any, cb: (relationName: string, relation: any) => void) {
    if (relations)
        Object.keys(relations).forEach(relationName => {
            const relation = relations[relationName];
            if (relation.aggregationKind === AGGREGATION_KIND.shared && relation.type === RELATION_TYPE.belongsTo) {
                cb(relationName, relation);
            }
        });
}

export function enumHasAggregations(relations: any, cb: (relationName: string, relation: any) => void) {
    if (relations)
        Object.keys(relations).forEach(relationName => {
            const relation = relations[relationName];
            if (relation.aggregationKind === AGGREGATION_KIND.shared && (relation.type === RELATION_TYPE.hasMany || relation.type === RELATION_TYPE.hasOne)) {
                cb(relationName, relation);
            }
        });
}

export function enumRelations(relations: any, cb: (relationName: string, relation: any) => void) {
    if (relations)
        Object.keys(relations).forEach(relationName => {
            cb(relationName, relations[relationName]);
        });
}

export function parentRelation(schema: any): { relationName: string, relation: any } | null {
    if (schema.meta && schema.meta.parentRelation && schema.relations && schema.relations[schema.meta.parentRelation]) {
        return { relationName: schema.meta.parentRelation, relation: schema.relations[schema.meta.parentRelation] };
    }
    return null;
}

export function getChildrenAndRefsOfClass(schema: any, mapper: (fullClassName: string) => any): { children: string[], refs: string[] } {
    const deps: { children: string[], refs: string[] } = { children: [], refs: [] };
    const classes: any = {};
    const refs: any = {};
    classes[schema.nameSpace + '.' + schema.name] = true;
    const isView = schema.view;
    if (schema.relations)
        Object.keys(schema.relations).forEach(relationName => {
            const relation = schema.relations[relationName];
            const refFullName = (relation.nameSpace || schema.nameSpace) + '.' + relation.model;
            if (isView) {
                // add only compositions that are view
                if (relation.aggregationKind === AGGREGATION_KIND.composite) {
                    const refSchema = mapper(refFullName);
                    if (refSchema && refSchema.view && !classes[refFullName]) {
                        deps.children.push(refFullName);
                        classes[refFullName] = true;
                    }
                }

            } else {
                switch (relation.type) {
                    case RELATION_TYPE.hasOne:
                        if (relation.aggregationKind === AGGREGATION_KIND.composite) {
                            if (!classes[refFullName]) {
                                deps.children.push(refFullName);
                                classes[refFullName] = true;
                            }
                        } else if (relation.aggregationKind === AGGREGATION_KIND.none)
                            if (!refs[refFullName]) {
                                deps.refs.push(refFullName);
                                refs[refFullName] = true;
                            }

                        break;
                    case RELATION_TYPE.hasMany:
                        if (relation.aggregationKind === AGGREGATION_KIND.composite) {
                            if (!classes[refFullName]) {
                                deps.children.push(refFullName);
                                classes[refFullName] = true;
                            }
                        }
                        break;
                    case RELATION_TYPE.belongsTo:
                        if (relation.aggregationKind === AGGREGATION_KIND.shared) {
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

export function isChild(schema: any): boolean {
    return !!(schema && schema.meta && schema.meta.parent);
}

export function isTree(schema: any): boolean {
    return !!(schema && schema.meta && schema.meta.parent === schema.name);
}

function idDefinition(persistent: boolean): any {
    return { type: JSONTYPES.integer, generated: true, format: JSONTYPES.id, transient: !persistent };
}

function refIdDefinition(persistent: boolean): any {
    return { type: JSONTYPES.integer, isReadOnly: true, format: JSONTYPES.id, transient: !persistent };
}

// reference :
// schema_name"
// schema_name.json"
// schema.json#/definitions/definition_name"
// #/definitions/definition_name"

function _load$ref(reference: string, model: any, definitions: any): any {
    let ii = reference.indexOf(DEFINITION_STRING);
    let schemaId: string | void;
    let defName: string | void;
    if (ii >= 0) {
        schemaId = reference.substr(0, ii);
        defName = reference.substr(ii + DEFINITION_STRING_LEN);
    } else {
        schemaId = reference;
    }
    if (schemaId) {
        ii = schemaId.indexOf('.json');
        if (ii >= 0)
            schemaId = schemaId.substr(0, ii);
    }
    if (!schemaId && !defName)
        throw new ApplicationError(util.format('Unsupported schema $ref : "%s"', reference));
    let ref;
    let def = definitions;
    if (schemaId) {
        ref = model[schemaId];
        if (!ref)
            throw new ApplicationError(util.format('Schema not found "%s". ($ref : "%s")', schemaId, reference));
        if (defName)
            def = model[schemaId].definitions;
        else
            ref = clone(model[schemaId]);
    }

    if (defName && (!def || !def[defName]))
        throw new ApplicationError(util.format('Definition not found "%s". ($ref : "%s")', defName, reference));
    if (defName)
        ref = clone(def[defName]);
    return ref;
}

function _toMerge(item: any, callStack: string[], model: any, definitions: any): void {
    let toMerge = null;
    if (item.allOf) {
        toMerge = item.allOf;
        delete item.allOf;
    } else if (item.$ref) {
        if (callStack.indexOf(item.$ref) < 0) {
            toMerge = [{ $ref: item.$ref }];
            delete item.$ref;
        }
    }
    if (toMerge) {
        toMerge.forEach((ci: any) => {
            const newCallStack = callStack.slice(0);
            if (ci.$ref) {
                const ref = _load$ref(ci.$ref, model, definitions);
                newCallStack.push(ci.$ref);
                delete ci.$ref;
                merge(ref, ci);
            }
            _expand$Ref(ci, newCallStack, model, definitions);
            merge(ci, item);
        });
    }

}

function _expand$Ref(item: any, callStack: string[], model: any, definitions: any): void {
    const currentCallStack = callStack.slice(0);
    _toMerge(item, currentCallStack, model, definitions);
    let toExpand: any = null;
    if (item.properties) {
        toExpand = item;
    } else if (item.type === JSONTYPES.array && item.items) {
        toExpand = item.items;
    }
    if (toExpand && toExpand.properties) {
        Object.keys(toExpand.properties).forEach(name => {
            const prop = toExpand.properties[name];
            if (prop.allOf || prop.$ref)
                _toMerge(prop, callStack, model, definitions);
            if (prop.type === JSONTYPES.array && prop.items) {
                if (prop.items.allOf || prop.items.$ref)
                    _toMerge(prop.items, callStack, model, definitions);
            }
        });
    }
}

async function loadJsonFromFile(jsonFile: string): Promise<any> {
    const data = await util.promisify(fs.readFile)(jsonFile);
    try {
        return JSON.parse(data.toString());
    } catch (ex) {
        throw ex;
    }
}

function _checkModel(schema: any, model: any) {
    schema.properties = schema.properties || {};
    if (!schema.primaryKey || schema.view) {
        schema.properties.id = idDefinition(schema.view);
        schema.primaryKey = ['id'];
    }
    schema.meta = schema.meta || {};
    if (!schema.primaryKey)
        throw util.format('Invalid schema "%s", primarykey is missing.', schema.name);
    if (typeof schema.primaryKey === 'string') {
        const pkString: string = schema.primaryKey;
        const pk = pkString.split(',').map((key) => key.trim());
        schema.primaryKey = pk;
    }

}

function _checkHooks(schema: any, model: any) {
    const isView = schema.view;
    if (schema.hooks)
        schema.hooks.forEach((hook: any) => {
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

function _checkRelations(schema: any, model: any) {
    // schema.meta.parent = null;
    const isView = schema.view;
    if (schema.relations)
        Object.keys(schema.relations).forEach(relName => {
            const rel = schema.relations[relName];
            rel.nameSpace = rel.nameSpace || schema.nameSpace;
            if (!rel.type)
                throw util.format('Invalid relation "%s.%s", type is missing.', schema.name, relName);
            rel.title = rel.title || relName;
            if (rel.type === RELATION_TYPE.belongsTo) {
                rel.aggregationKind = rel.aggregationKind || AGGREGATION_KIND.composite;
                if (rel.aggregationKind !== AGGREGATION_KIND.shared && rel.aggregationKind !== AGGREGATION_KIND.composite) {
                    throw util.format('Invalid relation "%s.%s", aggregationKind must be composite or shared.', schema.name, relName);
                }
                if (isView && rel.aggregationKind !== AGGREGATION_KIND.composite)
                    throw util.format('Invalid relation "%s.%s": for a view aggregationKind must be composite.', schema.name, relName);

                if (rel.aggregationKind === AGGREGATION_KIND.composite) {
                    schema.meta.parent = rel.model;
                    schema.meta.parentRelation = relName;
                }
            } else {
                rel.aggregationKind = rel.aggregationKind || AGGREGATION_KIND.none;
            }
            const fullClassName = (rel.nameSpace || schema.nameSpace) + '.' + rel.model;
            if (!rel.model || !model[fullClassName])
                throw util.format('Invalid relation "%s.%s", invalid remote entity.', schema.name, relName);
            const refModel = model[fullClassName];
            if (rel.type === RELATION_TYPE.belongsTo && isView && !refModel.view)
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
                if (rel.aggregationKind === AGGREGATION_KIND.shared) {
                    throw util.format('Invalid relation "%s.%s", a view can\'t have aggregations.', schema.name, relName);
                }
                if (rel.aggregationKind === AGGREGATION_KIND.composite) {
                    if (refModel.view && !refRel)
                        throw util.format('Invalid relation "%s.%s": "%s" invRel is empty.', schema.name, relName, rel.model);
                }
                const lf = relName + 'Id';
                if (rel.type === RELATION_TYPE.hasOne) {
                    rel.localFields = [lf];
                    rel.foreignFields = ['id'];
                    schema.properties[lf] = refIdDefinition(true);
                } else if (rel.type === RELATION_TYPE.hasMany) {
                    if (refModel && refModel.view && rel.aggregationKind === AGGREGATION_KIND.composite) {
                        rel.localFields = ['id'];
                        rel.foreignFields = [rel.invRel + 'Id'];
                    } else {
                        rel.localFields = [lf];
                        rel.foreignFields = ['id'];
                        schema.properties[lf] = {
                            type: JSONTYPES.array,
                            items: refIdDefinition(true)
                        };
                    }
                } else if (rel.type === RELATION_TYPE.belongsTo) {
                    if (!rel.invRel)
                        throw util.format('Invalid relation "%s.%s", invRel is missing.', schema.name, relName);
                    if (refRel.type === RELATION_TYPE.hasMany) {
                        rel.localFields = [relName + 'Id'];
                        rel.foreignFields = ['id'];
                        schema.properties[relName + 'Id'] = refIdDefinition(true);
                    } else {
                        rel.localFields = ['id'];
                        rel.foreignFields = [rel.invRel + 'Id'];
                    }

                } else
                    throw util.format('Invalid relation "%s.%s", invalid relation type.', schema.name, relName);

                if (isView && !refModel.view && rel.aggregationKind === AGGREGATION_KIND.composite && rel.type === RELATION_TYPE.hasOne) {

                    if (rel.type === RELATION_TYPE.hasOne && !refModel.view) {
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

            } else {
                const isCompositionParent = (rel.aggregationKind === AGGREGATION_KIND.composite) && (rel.type !== RELATION_TYPE.belongsTo);
                if (!refRel && (rel.aggregationKind !== AGGREGATION_KIND.none)) {
                    if (!isCompositionParent)
                        throw util.format('Invalid relation "%s.%s", invRel for aggregations and compositions is required.', schema.name, relName);
                }
                if (refRel) {
                    if (refRel.type === RELATION_TYPE.belongsTo) {
                        refRel.aggregationKind = refRel.aggregationKind || AGGREGATION_KIND.composite;
                        if (rel.aggregationKind === AGGREGATION_KIND.none) {
                            throw util.format('Invalid relation "%s.%s", aggregationKind must be composite or shared.', schema.name, relName);
                        }
                    } else
                        refRel.aggregationKind = refRel.aggregationKind || AGGREGATION_KIND.none;

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
                rel.localFields.forEach((lf: string, index: number) => {
                    const rf = rel.foreignFields[index];
                    const crf = lf === 'id';
                    const clf = rf === 'id';
                    if (crf && !refModel.properties[rf]) {
                        refModel.properties[rf] = refIdDefinition(true);
                    } else if (clf && !schema.properties[lf]) {
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

export async function loadModel(pathToModel: string, model: any): Promise<void> {
    const files = await util.promisify(fs.readdir)(pathToModel);
    const folders = [];
    const stats: fs.Stats[] = await Promise.all(files.map((fileName: string) => {
        return util.promisify(fs.lstat)(path.join(pathToModel, fileName));
    }));
    const jsonFiles: string[] = [];
    stats.forEach((stat, index) => {
        const fn = path.join(pathToModel, files[index]);
        if (stat.isDirectory()) return;
        if (path.extname(fn) === '.json') {
            jsonFiles.push(fn);
        }
    });
    const modelByJsonFile: any = {};
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
