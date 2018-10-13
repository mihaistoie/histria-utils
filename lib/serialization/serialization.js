"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const helper = require("../utils/helper");
function check(serialization) {
    _resolveAllOf(serialization, serialization.definitions, []);
    _checkSerialization(serialization, serialization.definitions, [], true);
}
exports.check = check;
function extractDefinitionName(definition) {
    return definition.substr(_definitionLen);
}
exports.extractDefinitionName = extractDefinitionName;
const _definitionString = '#/definitions/';
const _definitionLen = '#/definitions/'.length;
function _checkKey(key) {
    let a = key.split('.');
    return a[a.length - 1];
}
function _checkSerialization(serialization, definitions, stack, root) {
    if (serialization.properties) {
        let hasId = false;
        serialization.properties.forEach((item, index) => {
            let ref = '';
            if (typeof item === 'string')
                item = { key: _checkKey(item), value: item };
            else {
                let keys = Object.keys(item);
                if (keys.length === 1) {
                    item = { key: _checkKey(keys[0]), value: item[keys[0]] };
                }
                else if (keys.length === 2) {
                    let indexKey = 0;
                    if (keys[0] === '$ref' || keys[0] === 'properties') {
                        indexKey = 1;
                    }
                    else if (keys[1] === '$ref' || keys[1] === 'properties') {
                        indexKey = 0;
                    }
                    else
                        throw util.format('Invalid serialization "%s"', JSON.stringify(item));
                    item.key = _checkKey(keys[indexKey]);
                    item.value = item[keys[indexKey]];
                    delete item[keys[indexKey]];
                    ref = item.$ref;
                    if (ref) {
                        if (definitions)
                            _expandRef(item, definitions, stack);
                    }
                }
                else
                    throw util.format('Invalid serialization  "%s"', JSON.stringify(item));
            }
            if (item.properties) {
                if (ref)
                    stack.push(ref);
                _checkSerialization(item, definitions, stack, false);
                if (ref)
                    stack.pop();
            }
            if (!hasId)
                hasId = item.key === 'id';
            serialization.properties[index] = item;
        });
        if (!hasId)
            serialization.properties.push({ key: 'id', value: 'id' });
        if (root && definitions) {
            Object.keys(definitions).forEach(definitionName => {
                let definition = definitions[definitionName];
                if (definition.properties) {
                    _checkSerialization(definition, null, [], false);
                }
            });
        }
    }
}
function _resolveAllOf(item, definitions, stack) {
    if (item.allOf) {
        let allOf = item.allOf;
        delete item.allOf;
        if (!Array.isArray(allOf))
            throw 'Invalid allOf. Not an array.';
        allOf.forEach((ii) => {
            if (ii.$ref && stack.indexOf(ii.$ref) < 0) {
                _expandRef(ii, definitions, []);
            }
            helper.merge(ii, item);
        });
    }
}
function _expandRef(item, definitions, stack) {
    if (stack.indexOf(item.$ref) >= 0)
        return;
    const def = extractDefinitionName(item.$ref);
    const definition = definitions[def];
    if (!definition)
        throw util.format('Definition not found. "%s"', item.$ref);
    const dupDef = helper.clone(definition);
    delete item.$ref;
    helper.merge(dupDef, item);
}

//# sourceMappingURL=serialization.js.map
