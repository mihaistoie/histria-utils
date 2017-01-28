export interface IStore {
    findOne(entityName: string, filter: any, options: any): Promise<any>;
    find(entityName: string, filter: any, options: any): Promise<any[]>;
    initNameSpace(nameSpace: string, model: any, data: any[]): Promise<void>;
}
