
import * as assert from 'assert';
import { locale, messages } from '../../index';


describe('Locale', () => {
    it('Locale load', function () {
        const usLocale = locale('en_US')
        assert.equal(usLocale.date.daySep, '-');
        const usMessages = messages();
        assert.notEqual(usMessages, null);
    });

});