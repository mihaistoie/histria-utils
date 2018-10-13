const
    _cloneArray = (src: any[]): any[] => {
        return src.map(item => {
            if (item) {
                if (Array.isArray(item))
                    return _cloneArray(item);
                else if (typeof item === 'object')
                    return _cloneObject(item);
                else
                    return item;

            } else
                return item;
        });
    },
    _cloneObject = (src: any): any => {
        const res: any = {};
        Object.keys(src).forEach(propertyName => {
            const item = src[propertyName];
            if (item) {
                if (Array.isArray(item)) {
                    res[propertyName] = _cloneArray(item);
                } else if (typeof item === 'object') {
                    res[propertyName] = _cloneObject(item);
                } else
                    res[propertyName] = item;
            }
            else res[propertyName] = item;
        });
        return res;
    },
    _merge = (src: any, dst: any): void => {
        if (!src) return;
        for (let p in src) {
            const pv = src[p];
            let ov = dst[p];
            if (pv === null) continue;
            if (typeof pv === 'object' && !Array.isArray(pv)) {
                ov = ov || {};
                _merge(pv, ov);
                dst[p] = ov;
            } else
                dst[p] = pv;
        }
    },
    _destroyObjects = (obj: any): void => {
        Object.keys(obj).forEach(pn => {
            let o = obj[pn];
            if (o && o.destroy)
                o.destroy();
            obj[pn] = null;
        });

    },
    _clone = (src: any): any => {
        if (!src) return src;
        let tt = typeof src;
        if (tt === 'object') {
            if (Array.isArray(src))
                return _cloneArray(src);
            else
                return _cloneObject(src);
        } else
            return src;
    },
    _format = (...args: any[]): string => {
        let s: string = args[0];
        return s.replace(/{(\d+)}/g, function (match: string, num: string) {
            let n = parseInt(num, 10);
            return args[n + 1];
        });
    },
    _valuesByPath = (path: string, value: any, res: any[]): void => {
        if (!value) return;
        if (!path) {
            res.push(value);
            return;
        }
        let ii = path.indexOf('.');
        if (ii >= 0) {
            value = value[path.substr(0, ii)];
            path = path.substr(ii + 1);

        } else {
            value = value[path];
            path = '';
        }
        if (value) {
            if (Array.isArray(value)) {
                value.forEach((item: any) => {
                    _valuesByPath(path, item, res);
                });
            } else _valuesByPath(path, value, res);
        }
    }


export const merge = _merge;
export const clone = _clone;
export const destroy = _destroyObjects;
export const format = _format;
export const valuesByPath = _valuesByPath;
