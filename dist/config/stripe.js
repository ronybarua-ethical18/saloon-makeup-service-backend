"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
const stripe_1 = __importDefault(require("stripe"));
const _1 = __importDefault(require("."));
exports.stripe = new stripe_1.default(`${_1.default.stripe.stripe_secret_key}`, {
    apiVersion: '2024-06-20',
});
