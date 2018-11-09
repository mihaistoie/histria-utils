
import * as assert from 'assert';
import { schemaUtils } from '../../index';

async function execTests() {
    const model = {};
    const schema = {
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

    const excepted = {
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
    schemaUtils.expandSchema(schema, null);
    assert.deepEqual(schema, excepted);

}

describe('Expand Schema $ref', () => {
    it('#/definitions test ', (done) => {
        execTests().then(() => {
            done();
        }).catch((ex) => {
            done(ex);
        });

    });

});
