export interface IStore {
    findOne(entityName: string, filter: any, options?: {
        compositions: boolean;
    }): Promise<any>;
    find(entityName: string, filter: any, options?: {
        compositions: boolean;
    }): Promise<any[]>;
    save(data: any): Promise<void>;
    initNameSpace(nameSpace: string, data: any): Promise<void>;
}
