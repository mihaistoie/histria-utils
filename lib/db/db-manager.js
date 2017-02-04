"use strict";
class DbManager {
    constructor() {
        if (!DbManager.singleton) {
            DbManager.singleton = this;
        }
        return DbManager.singleton;
    }
    registerNameSpace(nameSpace, driverName, options) {
        const that = this;
        that._namespaces = that._namespaces || new Map();
        that._namespaces.set(nameSpace, { driver: driverName, options: options });
    }
    store(nameSpace) {
        const that = this;
        if (!that._namespaces)
            return null;
        let cfg = that._namespaces.get(nameSpace);
        if (!cfg)
            return null;
        let driver = require('histria-db-' + cfg.driver);
        return driver.store(nameSpace, cfg.options);
    }
}
exports.DbManager = DbManager;
function dbManager() {
    if (DbManager.singleton)
        return DbManager.singleton;
    return new DbManager();
}
exports.dbManager = dbManager;
