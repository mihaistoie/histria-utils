import { IStore } from '../interfaces/store';
export declare type DbDriver = 'memory' | 'mongo';
export declare class DbManager {
    private _namespaces;
    static singleton: DbManager;
    constructor();
    registerNameSpace(nameSpace: string, driverName: DbDriver, options: any): void;
    store(nameSpace: string): IStore | null;
}
export declare function dbManager(): DbManager;
