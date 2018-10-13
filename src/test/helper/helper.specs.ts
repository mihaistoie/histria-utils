
import * as assert from 'assert';
import { helper, ApplicationError } from '../../index';


describe('Utils', () => {
    it('Merge', () => {
        let src = { type: 'object', properties: { country: { type: 'string' } } };
        let dst = { type: 'object' };
        helper.merge(src, dst);

        let excepted = { type: 'object', properties: { country: { type: 'string' } } };
        assert.deepEqual(dst, excepted);

        dst = { type: 'object' };
        helper.merge(null, dst);
        assert.equal(Object.keys(dst).length, 1);

        dst = { type: 'object' };
        helper.merge({ a: null }, dst);
        assert.equal(Object.keys(dst).length, 1);


        let error = new ApplicationError('Test', 400);
        assert.equal(error.message, 'Test');
        error = new ApplicationError('Test');
        assert.equal(error.message, 'Test');

    });
    it('Destroy', () => {
        const toDestroy = { a: 'test', b: { c: 'x' } };
        helper.destroy(toDestroy)
        assert.deepEqual(toDestroy, { a: null, b: null });
        let c = 0;
        const toDestroyWithDestructor = {
            a: 'test',
            b: {
                c: 'test',
                destroy() {
                    c = 1;
                    this.c = 'destroyed';
                }
            }
        };
        helper.destroy(toDestroyWithDestructor);
        assert.deepEqual(toDestroyWithDestructor, { a: null, b: null });
        assert.equal(c, 1);
    });

    it('Clone', () => {
        const toClone = { a: 'test', b: { c: 'x' }, c: [{ e: 2 }, [1, 2, 3]], d: null };
        const cloned = helper.clone(toClone);
        assert.deepEqual(toClone, cloned);
    });

    it('Format', () => {
        const format = helper.format('Test {2} {1}{0}', '!', 'world', 'Hello');
        assert.equal(format, 'Test Hello world!');
    });
});