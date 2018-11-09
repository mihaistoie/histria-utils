"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DbManager {
    constructor() {
        if (!DbManager.singleton) {
            DbManager.singleton = this;
        }
        return DbManager.singleton;
    }
    registerNameSpace(nameSpace, driverName, options) {
        this._namespaces = this._namespaces || new Map();
        this._namespaces.set(nameSpace, { driver: driverName, options: options });
    }
    store(nameSpace) {
        if (!this._namespaces)
            return null;
        const cfg = this._namespaces.get(nameSpace);
        if (!cfg)
            return null;
        const driver = require('histria-db-' + cfg.driver);
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

//# sourceMappingURL=db-manager.js.map
