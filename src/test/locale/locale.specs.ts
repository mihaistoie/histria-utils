
import * as assert from 'assert';
import { locale, messages } from '../../index';

describe('Locale', () => {
    it('Locale load', () => {
        const usLocale = locale('en_US');
        assert.equal(usLocale.date.daySep, '-');
        const usMessages = messages();
        assert.notEqual(usMessages, null);
        const roMessages = messages('ro');
        assert.deepEqual(usMessages, roMessages);
    });

});