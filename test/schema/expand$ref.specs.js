"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const index_1 = require("../../index");
async function execTests() {
    let model = {};
    let schema = {
        properties: {
            name: { $ref: '#/definitions/string' },
            address: { $ref: '#/definitions/address' }
        },
        definitions: {
            address: {
                type: 'object',
                properties: {
                    country: { type: 'string' }
                }
            },
            string: { type: 'string' }
        }
    };
    let excepted = {
        properties: {
            name: { type: 'string' },
            address: {
                type: 'object',
                properties: {
                    country: { type: 'string' }
                }
            }
        },
        definitions: {
            address: {
                type: 'object',
                properties: {
                    country: { type: 'string' }
                }
            },
            string: { type: 'string' }
        }
    };
    index_1.schemaUtils.expandSchema(schema, null);
    assert.deepEqual(schema, excepted);
}
describe('Expand Schema $ref', () => {
    it('#/definitions test ', function (done) {
        execTests().then(() => {
            done();
        }).catch((ex) => {
            done(ex);
        });
    });
});

//# sourceMappingURL=expand$ref.specs.js.map
