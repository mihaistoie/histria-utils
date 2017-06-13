
import { IStore } from '../interfaces/store'
export type DbDriver = 'memory' | 'mongo';


export class DbManager {
    private _namespaces: Map<string, { driver: DbDriver, options: any }>
    public static singleton: DbManager;
    constructor() {
        if (!DbManager.singleton) {
            DbManager.singleton = this;
        }
        return DbManager.singleton;
    }
    public registerNameSpace(nameSpace: string, driverName: DbDriver, options: any): void {
        const that = this;
        that._namespaces = that._namespaces || new Map<string, { driver: DbDriver, options: any }>();
        that._namespaces.set(nameSpace, { driver: driverName, options: options });
    }
    public store(nameSpace: string): IStore | null {
        const that = this;
        if (!that._namespaces) return null;
        let cfg = that._namespaces.get(nameSpace);
        if (!cfg) return null;
        let driver: any = require('histria-db-' + cfg.driver);
        return <IStore>driver.store(nameSpace, cfg.options);
    }
}

export function dbManager(): DbManager {
    if (DbManager.singleton)
        return DbManager.singleton;
    return new DbManager();
}
