"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tryCatchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(err => {
        console.log('from global error', err);
        next(err);
    });
};
exports.default = tryCatchAsync;
