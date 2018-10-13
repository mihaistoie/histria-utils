"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const index_1 = require("../../index");
describe('Locale', () => {
    it('Locale load', function () {
        const usLocale = index_1.locale('en_US');
        assert.equal(usLocale.date.daySep, '-');
        const usMessages = index_1.messages();
        assert.notEqual(usMessages, null);
        const roMessages = index_1.messages('ro');
        assert.deepEqual(usMessages, roMessages);
    });
});

//# sourceMappingURL=locale.specs.js.map
