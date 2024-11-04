"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionValidation = void 0;
const zod_1 = require("zod");
const transactions_interface_1 = require("./transactions.interface");
// Define the Zod schema for Transactions
const TransactionZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        customer: zod_1.z.string({ required_error: 'Customer ID is required' }), // Must be a valid ObjectId (in string format)
        seller: zod_1.z.string({ required_error: 'Seller ID is required' }), // Must be a valid ObjectId (in string format)
        service: zod_1.z.string({ required_error: 'Service ID is required' }), // Must be a valid ObjectId (in string format)
        booking: zod_1.z.string({ required_error: 'Booking ID is required' }), // Must be a valid ObjectId (in string format)
        amount: zod_1.z.number({ required_error: 'Amount is required' }).positive(),
        stripeProcessingFee: zod_1.z
            .number({ required_error: 'Stripe processing fee is required' })
            .positive(),
        status: zod_1.z.nativeEnum(transactions_interface_1.AmountStatus).default(transactions_interface_1.AmountStatus.PENDING), // Using nativeEnum for enum validation
        stripePaymentIntentId: zod_1.z.string({
            required_error: 'Stripe Payment Intent ID is required',
        }),
        transactionType: zod_1.z.nativeEnum(transactions_interface_1.TransactionType, {
            required_error: 'Transaction Type is required',
        }),
        transactionId: zod_1.z.string({ required_error: 'Transaction ID is required' }),
        paymentMethod: zod_1.z.nativeEnum(transactions_interface_1.PaymentMethod, {
            required_error: 'Payment Method is required',
        }),
        sellerAmount: zod_1.z.number().optional().default(0),
        applicationFee: zod_1.z.number().optional().default(0),
        isPaymentDisbursed: zod_1.z.boolean().optional().default(false),
    }),
});
exports.TransactionValidation = {
    TransactionZodSchema,
};
