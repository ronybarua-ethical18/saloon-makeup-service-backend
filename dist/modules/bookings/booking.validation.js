"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingValidation = void 0;
const zod_1 = require("zod");
// Define the Zod schema for IBookingPayload
const createBookingZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        serviceDate: zod_1.z.string({ required_error: 'Service date is required' }),
        serviceStartTime: zod_1.z.string({
            required_error: 'Service start time is required',
        }),
        processingFees: zod_1.z.number({
            required_error: 'Processing fees are required',
        }),
        totalAmount: zod_1.z.number({ required_error: 'Total amount is required' }),
        serviceId: zod_1.z.string({ required_error: 'Service ID is required' }),
        sellerId: zod_1.z.string({ required_error: 'Seller ID is required' }),
        shop: zod_1.z.any({ required_error: 'Shop is required' }),
        stripePaymentIntentId: zod_1.z.string({
            required_error: 'Stripe Payment Intent ID is required',
        }),
        paymentMethod: zod_1.z.string({ required_error: 'Payment method is required' }),
    }),
});
exports.BookingValidation = {
    createBookingZodSchema,
};
