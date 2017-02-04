export interface IStore {
    findOne(entityName: string, filter: any, options: any): Promise<any>;
    find(entityName: string, filter: any, options: any):  Promise<any[]>;
    initNameSpace(nameSpace: string, data: any[]):  Promise<void>;
}