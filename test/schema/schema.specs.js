"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const path = require("path");
const index_1 = require("../../index");
describe('Schema', () => {
    it('Load model', async () => {
        const model = {};
        await index_1.schemaUtils.loadModel(path.join(__dirname, 'compositions'), model);
    });
    it('Load errors', async () => {
        const model = {};
        try {
            await index_1.schemaUtils.loadModel(path.join(__dirname, 'errors01'), model);
        }
        catch (ex) {
            assert(ex);
        }
        try {
            await index_1.schemaUtils.loadModel(path.join(__dirname, 'errors02'), model);
        }
        catch (ex) {
            assert(ex);
        }
    });
});

//# sourceMappingURL=schema.specs.js.map
