"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAQValidation = void 0;
const zod_1 = require("zod");
// Define the Zod schema for Service
const createFAQZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        question: zod_1.z.string({ required_error: 'Questing is required' }),
        answer: zod_1.z.string({ required_error: 'Answer is required' }),
    }),
});
exports.FAQValidation = {
    createFAQZodSchema,
};
