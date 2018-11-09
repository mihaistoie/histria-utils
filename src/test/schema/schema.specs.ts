import * as assert from 'assert';
import * as path from 'path';
import { schemaUtils } from '../../index';

describe('Schema', () => {
    it('Load model', async () => {
        const model: any = {};
        await schemaUtils.loadModel(path.join(__dirname, 'compositions'), model);
    });

});