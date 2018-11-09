"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const index_1 = require("../../index");
describe('Schema', () => {
    it('Load model', async () => {
        const model = {};
        await index_1.schemaUtils.loadModel(path.join(__dirname, 'compositions'), model);
    });
});

//# sourceMappingURL=schema.specs.js.map
