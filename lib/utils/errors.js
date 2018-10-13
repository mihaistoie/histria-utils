"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HTTP_APPLICATION_ERROR = 400;
class ApplicationError extends Error {
    constructor(message, status) {
        super(message);
        this._status = status || HTTP_APPLICATION_ERROR;
    }
}
exports.ApplicationError = ApplicationError;

//# sourceMappingURL=errors.js.map
