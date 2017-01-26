import { IStorage } from '../interfaces/storage'

export class MemoryStorage implements IStorage {
    private _options: any;
    private _nameSpaces: any;
    constructor(options: any) {
        let that = this;
        that._options = options || {};
    }
    public findOne(entityName: string, filter: any, options: any): Promise<any> {
        return Promise.resolve(null);
    }
    public find(entityName: string, filter: any, options: any): Promise<any[]> {
        return Promise.resolve([]);
    }
    public initNameSpace(nameSpace: string, model: any, data: any): Promise<void> {
        let that = this;
        let ns = that._nameSpaces[nameSpace] = that._nameSpaces[nameSpace] || {};
        Object.keys(model).forEach((name) => {
            let entity = model[name];
            if (that._options.storeChildrenInParent && entity.meta.parent) {
                return;
            } else {
                ns[name] = ns[name] || { data: [] };
                ns[name].data = data;
            }
        });
        return Promise.resolve();
    }
}