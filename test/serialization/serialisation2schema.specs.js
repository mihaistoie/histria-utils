"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
exports.CAR_SCHEMA = {
    type: 'object',
    name: 'car',
    nameSpace: 'compositions',
    properties: {
        name: {
            type: 'string'
        },
        id: {
            type: 'integer',
            generated: true,
            format: 'id'
        }
    },
    relations: {
        engine: {
            type: 'hasOne',
            model: 'engine',
            aggregationKind: 'composite',
            invRel: 'car',
            nameSpace: 'compositions',
            title: 'engine',
            invType: 'belongsTo',
            localFields: [
                'id'
            ],
            foreignFields: [
                'carId'
            ]
        }
    }
};
const ENGINE_SCHEMA = {
    type: 'object',
    name: 'engine',
    nameSpace: 'compositions',
    properties: {
        code: {
            type: 'string'
        },
        id: {
            type: 'integer',
            generated: true,
            format: 'id'
        },
        carId: {
            type: 'integer',
            isReadOnly: true,
            format: 'id'
        }
    },
    relations: {
        car: {
            type: 'belongsTo',
            model: 'car',
            aggregationKind: 'composite',
            invRel: 'engine',
            nameSpace: 'compositions',
            title: 'car',
            invType: 'hasOne',
            localFields: [
                'carId'
            ],
            foreignFields: [
                'id'
            ]
        }
    },
    meta: {
        parent: 'car',
        parentRelation: 'car'
    }
};
describe('Schema generation', () => {
    before(() => {
        index_1.schemaManager().registerSchema(exports.CAR_SCHEMA);
        index_1.schemaManager().registerSchema(ENGINE_SCHEMA);
    });
    it('Test 1', () => {
        let pattern = {
            properties: [
                'id',
                'name',
                { 'engineId': 'engine.id' },
                { 'engineCode': 'engine.code' }
            ]
        };
        index_1.serialization.check(pattern);
    });
});
