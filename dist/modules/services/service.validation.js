"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceValidation = void 0;
const zod_1 = require("zod");
// Define the Zod schema for Service
const ServiceZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Service name is required' }),
        category: zod_1.z.string({ required_error: 'Category is required' }),
        subCategory: zod_1.z.string({ required_error: 'Sub category is required' }),
        price: zod_1.z.number({ required_error: 'Price is required' }).positive(),
        images: zod_1.z.array(zod_1.z.object({
            img: zod_1.z.string({ required_error: 'Image link should be valid' }),
        })),
        description: zod_1.z.string({ required_error: 'Description required' }),
        availability: zod_1.z.boolean().optional(),
        shop: zod_1.z.string({ required_error: 'Shop ID is required' }),
        reviews: zod_1.z
            .array(zod_1.z.object({
            rating: zod_1.z.number(),
            comment: zod_1.z.string(),
            user: zod_1.z.string({ required_error: 'User ID is required' }),
            date: zod_1.z.date(),
        }))
            .optional(),
    }),
});
exports.ServiceValidation = {
    ServiceZodSchema,
};
