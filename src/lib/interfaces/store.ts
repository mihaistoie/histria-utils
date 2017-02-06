export interface IStore {
    findOne(entityName: string, filter: any, options? : {compositions: boolean}): Promise<any>;
    find(entityName: string, filter: any, options? : {compositions: boolean}):  Promise<any[]>;
    initNameSpace(nameSpace: string, data: any[]):  Promise<void>;
}