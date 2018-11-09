"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const index_1 = require("../../index");
describe('Helper', () => {
    const topic = [{
            name: 'craig',
            age: 90001,
            address: {
                city: 'Minneapolis',
                state: 'MN',
                phone: '9999999999'
            },
            tags: ['photos', 'cook'],
            hobbies: [
                {
                    name: 'programming',
                    description: 'some desc'
                },
                {
                    name: 'cooking'
                },
                {
                    name: 'photography',
                    places: ['haiti', 'brazil', 'costa rica']
                },
                {
                    name: 'backpacking'
                }
            ]
        },
        {
            name: 'tim',
            age: 90001,
            address: {
                city: 'St. Paul',
                state: 'MN',
                phone: '765765756765'
            },
            tags: ['dj'],
            hobbies: [
                {
                    name: 'biking',
                    description: 'some desc'
                },
                {
                    name: 'DJ'
                },
                {
                    name: 'photography',
                    places: ['costa rica']
                }
            ]
        }
    ];
    const co = {
        car: [
            {
                id: 1001,
                engineChangedHits: 0,
                engineName: 'v1',
                engine: {
                    id: 2001,
                    carId: 1001,
                    carChangedHits: 0,
                    name: 'v1'
                }
            },
            {
                id: 1002,
                engineChangedHits: 0,
                engineName: 'v2',
                engine: {
                    id: 2002,
                    carId: 1002,
                    carChangedHits: 0,
                    name: 'v2'
                }
            }
        ]
    };
    it('Clone complex array', () => {
        let nt = index_1.helper.clone(topic);
        nt = JSON.parse(JSON.stringify(topic));
        /*
        let start = new Date().getTime();
        for (var i = 0; i < 10000; i++)
            nt = JSON.parse(JSON.stringify([topic, topic, topic, topic, topic, topic, topic, topic, co, co]));
        let end = new Date().getTime();
        console.log(end - start);

        start = new Date().getTime();
        for (var i = 0; i < 10000; i++)
            nt = helper.clone([topic, topic, topic, topic, topic, topic, topic, topic, co, co]);
        end = new Date().getTime();
        console.log(end - start);

        nt = helper.clone(topic);
        */
        assert.deepEqual(nt, topic, 'clone (1)');
    });
    it('Clone complex object', () => {
        const nt = index_1.helper.clone(co);
        assert.deepEqual(nt, co, 'clone (2)');
    });
    it('Clone null', () => {
        assert.deepEqual(index_1.helper.clone(null), null, 'clone (3)');
    });
    it('Clone simple object ', () => {
        const so = { a: 5, b: [null, undefined] };
        so.c = null;
        const nt = index_1.helper.clone(so);
        assert.deepEqual(nt, so, 'clone (4)');
    });
    it('Clone number', () => {
        assert.equal(index_1.helper.clone(10), 10, 'clone (5)');
    });
    it('Clone string', () => {
        assert.equal(index_1.helper.clone('My name is Mihai'), 'My name is Mihai', 'clone (6)');
    });
    it('Clone boolean', () => {
        assert.equal(index_1.helper.clone(false), false);
    });
    it('Clone undefined', () => {
        assert.equal(index_1.helper.clone(undefined), undefined, 'clone (7)');
    });
    it('Extract values (1)', () => {
        const res = [];
        index_1.helper.valuesByPath('item', null, res);
        assert.equal(res.length, 0, 'Extract values (1)');
    });
    it('Extract values (2)', () => {
        const res = [];
        index_1.helper.valuesByPath('item', undefined, res);
        assert.equal(res.length, 0, 'Extract values (2)');
    });
    it('Extract values (3)', () => {
        const res = [];
        index_1.helper.valuesByPath('item', {}, res);
        assert.equal(res.length, 0, 'Extract values (3)');
    });
    it('Extract values (4)', () => {
        const res = [];
        index_1.helper.valuesByPath('address', topic[0], res);
        assert.equal(res.length, 1, 'Extract values (4)');
    });
    it('Extract values (5)', () => {
        const res = [];
        index_1.helper.valuesByPath('hobbies', topic[1], res);
        assert.equal(res.length, 3, 'Extract values (5)');
    });
    it('Extract values (6)', () => {
        const res = [];
        index_1.helper.valuesByPath('car.engine', co, res);
        assert.equal(res.length, 2, 'Extract values (3)');
    });
    it('Extract values (7)', () => {
        let res = [];
        const a = { b: 1 };
        index_1.helper.valuesByPath('', a, res);
        assert.deepEqual(res, [a], 'Extract values (7)');
        res = [];
        index_1.helper.valuesByPath('', null, res);
        assert.deepEqual(res, [], 'Extract values (7)');
    });
});

//# sourceMappingURL=utils.specs.js.map
