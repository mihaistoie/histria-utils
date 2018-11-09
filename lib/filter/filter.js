"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function findInArray(query, array, options) {
    const validator = _parse(query);
    const findFirst = options && options.findFirst;
    const transform = options && options.transform ? options.transform : _transform;
    if (findFirst) {
        if (array) {
            for (const item of array) {
                if (_validate(validator, transform(item)))
                    return item;
            }
        }
        return null;
    }
    else {
        if (array) {
            const _filter = (item) => {
                return _validate(validator, transform(item));
            };
            return array.filter(_filter);
        }
        return [];
    }
}
exports.findInArray = findInArray;
function findInMap(query, map, options) {
    const validator = _parse(query);
    const findFirst = options && options.findFirst;
    const transform = options && options.transform ? options.transform : _transform;
    const res = [];
    if (map) {
        for (const mItem of map) {
            const item = mItem[1];
            if (_validate(validator, transform(item))) {
                if (findFirst)
                    return item;
                else
                    res.push(item);
            }
        }
    }
    return findFirst ? null : res;
}
exports.findInMap = findInMap;
function filter(query, array) {
    return findInArray(query, array);
}
exports.filter = filter;
function or(predicate) {
    return (a, b) => {
        if (!Array.isArray(b) || !b.length)
            return predicate(a, b);
        for (let i = 0, n = b.length; i < n; i++) {
            const obj = b[i];
            if (predicate(a, obj))
                return true;
        }
        return false;
    };
}
function and(predicate) {
    return (a, b) => {
        if (!Array.isArray(b) || !b.length)
            return predicate(a, b);
        for (let i = 0, n = b.length; i < n; i++) {
            const obj = b[i];
            if (!predicate(a, obj))
                return false;
        }
        return true;
    };
}
function _validate(validator, b) {
    return validator.v(validator.a, b);
}
const OPERATORS = {
    $eq: or((a, b) => a(b)),
    $ne: and((a, b) => !a(b)),
    $or(a, b) {
        return a.find((elem) => _validate(elem, b)) !== undefined;
    },
    $gt: or((a, b) => _compare(b, a) > 0),
    $gte: or((a, b) => _compare(b, a) >= 0),
    $lt: or((a, b) => _compare(b, a) < 0),
    $lte: or((a, b) => _compare(b, a) <= 0),
    $mod: or((a, b) => b % a[0] === a[1]),
    $in(a, b) {
        if (Array.isArray(b))
            return b.find(element => a.indexOf(element) >= 0) !== undefined;
        else
            return a.indexOf(b) >= 0;
    },
    $nin(a, b) {
        return !OPERATORS.$in(a, b);
    },
    $not(a, b) {
        return !_validate(a, b);
    },
    $type(a, b) {
        return b !== void (0) ? b instanceof a || b.constructor === a : false;
    },
    $all(a, b) {
        b = b || [];
        return a.every((elem) => b.indexOf(elem) > -1);
    },
    $size(a, b) {
        return b ? a === b.length : false;
    },
    $nor(a, b) {
        return b.find((elem) => !_validate(elem, b)) === undefined;
    },
    $and(a, b) {
        return a.every((elem) => _validate(elem, b));
    },
    $regex: or((a, b) => {
        return typeof b === 'string' && a.test(b);
    }),
    $where(a, b) {
        return a.call(b, b);
    },
    $elemMatch(a, b) {
        if (Array.isArray(b))
            return _search(b, a) >= 0;
        return _validate(a, b);
    },
    $exists(a, b) {
        return (b !== void 0) === a;
    }
};
const PREPARERS = {
    $eq(a) {
        if (a instanceof RegExp) {
            return (b) => {
                return typeof b === 'string' && a.test(b);
            };
        }
        else if (a instanceof Function) {
            return a;
        }
        else if (Array.isArray(a) && !a.length) {
            // Special case of a == []
            return (b) => {
                return (Array.isArray(b) && !b.length);
            };
        }
        else if (a === null) {
            return (b) => {
                // will match both null and undefined
                return b === null || b === undefined;
            };
        }
        return (b) => {
            return _compare(b, a) === 0;
        };
    },
    $ne(a) {
        return PREPARERS.$eq(a);
    },
    $and(a) {
        return a.map(_parse);
    },
    $or(a) {
        return a.map(_parse);
    },
    $nor(a) {
        return a.map(_parse);
    },
    $not(a) {
        return _parse(a);
    },
    $regex(a, query) {
        return new RegExp(a, query.$options);
    },
    $where(a) {
        return typeof a === 'string' ? new Function('obj', 'return ' + a) : a;
    },
    $elemMatch(a) {
        return _parse(a);
    },
    $exists(a) {
        return !!a;
    }
};
function _isFunction(value) {
    return typeof value === 'function';
}
function _search(arr, validator) {
    return arr.findIndex((item) => _validate(validator, item));
}
const search = (arr, validator) => {
    return arr.findIndex((item) => _validate(validator, item));
};
function _createValidator(a, validate) {
    return { a: a, v: validate };
}
function nestedValidator(a, b) {
    const values = [];
    _findValues(b, a.k, 0, values);
    if (values.length === 1)
        return _validate(a.nv, values[0]);
    return _search(values, a.nv) >= 0;
}
function _compare(a, b) {
    if (a === b)
        return 0;
    if (typeof a === typeof b) {
        if (a > b)
            return 1;
        if (a < b)
            return -1;
    }
    return;
}
function _findValues(current, path, index, values) {
    if (index === path.length || current === void 0) {
        values.push(current);
        return;
    }
    const key = path[index];
    // ensure that if current is an array, that the current key
    // is NOT an array index. This sort of thing needs to work:
    // ({'foo.0':42}, [{foo: [42]}]);
    if (Array.isArray(current) && isNaN(Number(key))) {
        current.forEach(item => {
            _findValues(item, path, index, values);
        });
    }
    else {
        _findValues(current[key], path, index + 1, values);
    }
}
function _createNestedValidator(keypath, a) {
    return { a: { k: keypath, nv: a }, v: nestedValidator };
}
/**
 * flatten the query
 */
function _parse(query) {
    if (!query || (query.constructor.toString() !== 'Object' &&
        query.constructor.toString().replace(/\n/g, '').replace(/ /g, '') !== 'functionObject(){[nativecode]}')) { // cross browser support
        query = { $eq: query };
    }
    const validators = [];
    Object.keys(query).forEach(key => {
        let a = query[key];
        if (key === '$options')
            return;
        if (OPERATORS[key]) {
            if (PREPARERS[key])
                a = PREPARERS[key](a, query);
            validators.push(_createValidator(a, OPERATORS[key]));
        }
        else {
            if (key.charCodeAt(0) === 36)
                throw new Error('Unknown operation ' + key);
            validators.push(_createNestedValidator(key.split('.'), _parse(a)));
        }
    });
    return validators.length === 1 ? validators[0] : _createValidator(validators, OPERATORS.$and);
}
function _transform(value) { return value; }

//# sourceMappingURL=filter.js.map
