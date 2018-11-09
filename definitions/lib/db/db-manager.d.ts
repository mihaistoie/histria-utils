import { IStore } from '../interfaces/store';
export declare type DbDriver = 'memory' | 'mongo';
export declare class DbManager {
    static singleton: DbManager;
    private _namespaces;
    constructor();
    registerNameSpace(nameSpace: string, driverName: DbDriver, options: any): void;
    store(nameSpace: string): IStore | null;
}
export declare function dbManager(): DbManager;
//# sourceMappingURL=db-manager.d.ts.map