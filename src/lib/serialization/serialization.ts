import * as util from 'util';
import * as helper from '../utils/helper';


export function check(serialization: any) {
    _resolveAllOf(serialization, serialization.definitions, []);
    _checkSerialization(serialization, serialization.definitions, []);
}


const
    _definitionString = '#/definitions/';

const
    _definitionLen = '#/definitions/'.length;

function _checkKey(key: string): string {
    let a = key.split('.');
    return a[a.length - 1];
}
function _checkSerialization(serialization: any, definitions: any, stack: string[]) {
    if (serialization.properties) {
        let hasId = false;
        serialization.properties.forEach((item: any, index: number) => {
            let ref = '';
            if (typeof item === 'string')
                item = { key: _checkKey(item), value: item };
            else {
                let keys = Object.keys(item);
                if (keys.length === 1) {
                    item = { key: _checkKey(keys[0]), value: item[keys[0]] };
                } else if (keys.length === 2) {
                    let indexKey = 0;
                    if (keys[0] === '$ref' || keys[0] === 'properties') {
                        indexKey = 1;
                    } else if (keys[1] === '$ref' || keys[1] === 'properties') {
                        indexKey = 0;
                    } else
                        throw util.format('Invalid serialization  "%s"', JSON.stringify(item));
                    item.key = _checkKey(keys[indexKey]);
                    item.value = item[keys[indexKey]];
                    delete item[keys[indexKey]];
                    ref = item.$ref;
                    if (ref)
                        _expandRef(item, definitions, stack);

                } else
                    throw util.format('Invalid serialization  "%s"', JSON.stringify(item));
            }
            if (item.properties) {
                if (ref) stack.push(ref);
                _checkSerialization(item, definitions, stack);
                if (ref) stack.pop();

            }
            if (!hasId) hasId = item.key === 'id';
            serialization.properties[index] = item;
        });
        if (!hasId)
            serialization.properties.push({ key: 'id', value: 'id' })
    }
}


function _resolveAllOf(item: any, definitions: any, stack: string[]) {
    if (item.allOf) {
        let allOf = item.allOf;
        delete item.allOf;
        if (!Array.isArray(allOf))
            throw 'Invalid allOf. Not an array.'
        allOf.forEach((ii: any) => {
            if (ii.$ref && stack.indexOf(ii.$ref) < 0) {
                _expandRef(ii, definitions, [])
            }
            helper.merge(ii, item);
        });
    }

}

function _expandRef(item: any, definitions: any, stack: string[]) {
    if (stack.indexOf(item.$ref) >= 0) return;
    const def = item.$ref.substr(_definitionLen);
    const definition = definitions[def];
    if (!definition)
        throw util.format('Definition not found. "%s"', item.$ref);
    const dupDef = helper.clone(definition);
    delete item.$ref;
    helper.merge(dupDef, item);
}