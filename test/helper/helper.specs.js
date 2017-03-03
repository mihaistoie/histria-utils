"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const index_1 = require("../../index");
describe('Utils', () => {
    it('Merge', function () {
        let src = { type: 'object', properties: { country: { type: 'string' } } };
        let dst = { type: 'object' };
        index_1.helper.merge(src, dst);
        let excepted = { type: 'object', properties: { country: { type: 'string' } } };
        assert.deepEqual(dst, excepted);
    });
});
