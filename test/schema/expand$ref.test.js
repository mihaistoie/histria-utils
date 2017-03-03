"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const index_1 = require("../../index");
function execTests() {
    return __awaiter(this, void 0, void 0, function* () {
        let model = {};
        let schema = {
            properties: {
                name: { $ref: '#/definitions/string' },
                address: { $ref: '#/definitions/address' }
            },
            definitions: {
                address: {
                    type: "object",
                    properties: {
                        country: { type: "string" }
                    }
                },
                string: { type: "string" }
            }
        };
        let excepted = {
            properties: {
                name: { type: "string" },
                address: {
                    type: "object",
                    properties: {
                        country: { type: "string" }
                    }
                }
            },
            definitions: {
                address: {
                    type: "object",
                    properties: {
                        country: { type: "string" }
                    }
                },
                string: { type: "string" }
            }
        };
        index_1.schemaUtils.expandSchema(schema, null);
        assert.deepEqual(schema, excepted);
    });
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
