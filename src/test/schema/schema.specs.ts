import * as assert from 'assert';
import * as path from 'path';
import { schemaUtils } from '../../index';

describe('Schema', () => {
    it('Load model', async () => {
        const model: any = {};
        await schemaUtils.loadModel(path.join(__dirname, 'compositions'), model);
    });
    it('Load errors', async () => {
        const model: any = {};
        try {
            await schemaUtils.loadModel(path.join(__dirname, 'errors01'), model);
        } catch (ex) {
            assert(ex);
        }
        try {
            await schemaUtils.loadModel(path.join(__dirname, 'errors02'), model);
        } catch (ex) {
            assert(ex);
        }

    });

});