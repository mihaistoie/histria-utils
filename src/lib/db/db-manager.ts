
import { IStore } from '../interfaces/store';
export type DbDriver = 'memory' | 'mongo';

export class DbManager {
    public static singleton: DbManager;
    private _namespaces: Map<string, { driver: DbDriver, options: any }>;
    constructor() {
        if (!DbManager.singleton) {
            DbManager.singleton = this;
        }
        return DbManager.singleton;
    }
    public registerNameSpace(nameSpace: string, driverName: DbDriver, options: any): void {
        this._namespaces = this._namespaces || new Map<string, { driver: DbDriver, options: any }>();
        this._namespaces.set(nameSpace, { driver: driverName, options: options });
    }
    public store(nameSpace: string): IStore | null {
        if (!this._namespaces) return null;
        const cfg = this._namespaces.get(nameSpace);
        if (!cfg) return null;
        const driver: any = require('histria-db-' + cfg.driver);
        return driver.store(nameSpace, cfg.options) as IStore;
    }
}

export function dbManager(): DbManager {
    if (DbManager.singleton)
        return DbManager.singleton;
    return new DbManager();
}
