export { JSONTYPES, RELATION_TYPE, AGGREGATION_KIND, JSONFORMATS, DEFAULT_PARENT_NAME } from './lib/schema/schema-consts';
export { ApplicationError } from './lib/utils/errors';
export { fs } from './lib/utils/promises';
export { messages } from './lib/locale/messages';
export { locale } from './lib/locale/locale';
export { findInArray, findInMap, filter } from './lib/filter/filter';
export { IStore } from './lib/interfaces/store';
export { schemaManager } from './lib/db/schema-manager';
export { DbDriver, dbManager, DbManager } from './lib/db/db-manager';
export declare var schemaUtils: {
    typeOfProperty: (propSchema: {
        type?: string;
        format?: string;
        reference?: string;
    }) => string;
    isHidden: (propSchema: any) => boolean;
    isReadOnly: (propSchema: any) => boolean;
    isComplex: (schema: any) => boolean;
    expandSchema: (schema: any, model: any) => void;
    enumCompositions: (relations: any, cb: (relationName: string, relation: any) => void) => void;
    updateRoleRefs: (role: any, localModel: any, foreignModel: any, useInv: boolean) => void;
    loadModel: (pathToModel: string, model: any) => Promise<void>;
};
export declare var helper: {
    merge: (src: any, dst: any) => void;
    clone: (src: any) => any;
    destroy: (obj: any) => void;
    format: (...args: any[]) => string;
};
