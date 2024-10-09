import { z } from 'zod'
import {
  AmountStatus,
  PaymentMethod,
  TransactionType,
} from './transactions.interface'

// Define the Zod schema for Transactions
const TransactionZodSchema = z.object({
  body: z.object({
    customer: z.string({ required_error: 'Customer ID is required' }), // Must be a valid ObjectId (in string format)
    seller: z.string({ required_error: 'Seller ID is required' }), // Must be a valid ObjectId (in string format)
    service: z.string({ required_error: 'Service ID is required' }), // Must be a valid ObjectId (in string format)
    booking: z.string({ required_error: 'Booking ID is required' }), // Must be a valid ObjectId (in string format)
    amount: z.number({ required_error: 'Amount is required' }).positive(),
    stripeProcessingFee: z
      .number({ required_error: 'Stripe processing fee is required' })
      .positive(),
    status: z.nativeEnum(AmountStatus).default(AmountStatus.PENDING), // Using nativeEnum for enum validation
    stripePaymentIntentId: z.string({
      required_error: 'Stripe Payment Intent ID is required',
    }),
    transactionType: z.nativeEnum(TransactionType, {
      required_error: 'Transaction Type is required',
    }),
    transactionId: z.string({ required_error: 'Transaction ID is required' }),
    paymentMethod: z.nativeEnum(PaymentMethod, {
      required_error: 'Payment Method is required',
    }),
    sellerAmount: z.number().optional().default(0),
    applicationFee: z.number().optional().default(0),
    isPaymentDisbursed: z.boolean().optional().default(false),
  }),
})

export const TransactionValidation = {
  TransactionZodSchema,
}
