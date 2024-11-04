"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFixConverter = void 0;
const toFixConverter = (number = 0) => {
    return Number(number?.toFixed(2));
};
exports.toFixConverter = toFixConverter;
