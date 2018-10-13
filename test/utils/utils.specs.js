"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const index_1 = require("../../index");
describe('Helper', () => {
    let topic = [{
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
    let co = {
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
        let nt = index_1.helper.clone(co);
        assert.deepEqual(nt, co, 'clone (2)');
    });
    it('Clone null', () => {
        let nt = index_1.helper.clone(null);
        assert.deepEqual(nt, null, 'clone (3)');
    });
    it('Clone simple object ', () => {
        let so = { a: 5, b: [null] };
        so.c = null;
        let nt = index_1.helper.clone(so);
        assert.deepEqual(so, so, 'clone (4)');
    });
    it('Clone number', () => {
        assert.equal(index_1.helper.clone(10), 10, 'clone (5)');
    });
    it('Clone string', () => {
        assert.equal(index_1.helper.clone('My name is Mihai'), 'My name is Mihai', 'clone (6)');
    });
    it('Clone undefined', () => {
        assert.equal(index_1.helper.clone(undefined), undefined, 'clone (7)');
    });
    it('Extract values (1)', () => {
        let res = [];
        index_1.helper.valuesByPath('item', null, res);
        assert.equal(res.length, 0, 'Extract values (1)');
    });
    it('Extract values (2)', () => {
        let res = [];
        index_1.helper.valuesByPath('item', undefined, res);
        assert.equal(res.length, 0, 'Extract values (2)');
    });
    it('Extract values (3)', () => {
        let res = [];
        index_1.helper.valuesByPath('item', {}, res);
        assert.equal(res.length, 0, 'Extract values (3)');
    });
    it('Extract values (4)', () => {
        let res = [];
        index_1.helper.valuesByPath('address', topic[0], res);
        assert.equal(res.length, 1, 'Extract values (4)');
    });
    it('Extract values (5)', () => {
        let res = [];
        index_1.helper.valuesByPath('hobbies', topic[1], res);
        assert.equal(res.length, 3, 'Extract values (5)');
    });
    it('Extract values (6)', () => {
        let res = [];
        index_1.helper.valuesByPath('car.engine', co, res);
        assert.equal(res.length, 2, 'Extract values (3)');
    });
});

//# sourceMappingURL=utils.specs.js.map
