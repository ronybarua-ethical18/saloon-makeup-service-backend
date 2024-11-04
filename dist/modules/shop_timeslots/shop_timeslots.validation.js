"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopTimeSlotsValidation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
// Define the Zod schema for ShopTimeSlots with shop inside body
const createShopTimeSlotsZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        shop: zod_1.z
            .string({ required_error: 'Shop ID is required' })
            .refine(val => mongoose_1.default.Types.ObjectId.isValid(val), {
            message: 'Invalid Shop ID',
        }),
        startTime: zod_1.z.string({ required_error: 'Start time is required' }),
    }),
});
// Export the validation schema
exports.ShopTimeSlotsValidation = {
    createShopTimeSlotsZodSchema,
};
