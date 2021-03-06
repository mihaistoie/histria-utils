"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _cloneArray = (src) => {
    return src.map(item => {
        if (item) {
            if (Array.isArray(item))
                return _cloneArray(item);
            else if (typeof item === 'object')
                return _cloneObject(item);
            else
                return item;
        }
        else
            return item;
    });
};
const _cloneObject = (src) => {
    const res = {};
    Object.keys(src).forEach(propertyName => {
        const item = src[propertyName];
        if (item) {
            if (Array.isArray(item)) {
                res[propertyName] = _cloneArray(item);
            }
            else if (typeof item === 'object') {
                res[propertyName] = _cloneObject(item);
            }
            else
                res[propertyName] = item;
        }
        else
            res[propertyName] = item;
    });
    return res;
};
const _merge = (src, dst) => {
    if (!src)
        return;
    Object.keys(src).forEach(p => {
        const pv = src[p];
        let ov = dst[p];
        if (pv === null)
            return;
        if (typeof pv === 'object' && !Array.isArray(pv)) {
            ov = ov || {};
            _merge(pv, ov);
            dst[p] = ov;
        }
        else
            dst[p] = pv;
    });
};
const _destroyObjects = (obj) => {
    Object.keys(obj).forEach(pn => {
        const o = obj[pn];
        if (o && o.destroy)
            o.destroy();
        obj[pn] = null;
    });
};
const _clone = (src) => {
    if (!src)
        return src;
    const tt = typeof src;
    if (tt === 'object') {
        if (Array.isArray(src))
            return _cloneArray(src);
        else
            return _cloneObject(src);
    }
    else
        return src;
};
const _format = (...args) => {
    const s = args[0];
    return s.replace(/{(\d+)}/g, (match, num) => {
        const n = parseInt(num, 10);
        return args[n + 1];
    });
};
const _valuesByPath = (path, value, res) => {
    if (!value)
        return;
    if (!path) {
        res.push(value);
        return;
    }
    const ii = path.indexOf('.');
    if (ii >= 0) {
        value = value[path.substr(0, ii)];
        path = path.substr(ii + 1);
    }
    else {
        value = value[path];
        path = '';
    }
    if (value) {
        if (Array.isArray(value)) {
            value.forEach((item) => {
                _valuesByPath(path, item, res);
            });
        }
        else
            _valuesByPath(path, value, res);
    }
};
exports.merge = _merge;
exports.clone = _clone;
exports.destroy = _destroyObjects;
exports.format = _format;
exports.valuesByPath = _valuesByPath;

//# sourceMappingURL=helper.js.map
