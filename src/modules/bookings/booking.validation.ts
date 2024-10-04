import { z } from 'zod'

// Define the Zod schema for IBookingPayload
const createBookingZodSchema = z.object({
  body: z.object({
    serviceDate: z.string({ required_error: 'Service date is required' }),
    serviceStartTime: z.string({
      required_error: 'Service start time is required',
    }),
    processingFees: z.number({
      required_error: 'Processing fees are required',
    }),
    totalAmount: z.number({ required_error: 'Total amount is required' }),
    serviceId: z.string({ required_error: 'Service ID is required' }),
    sellerId: z.string({ required_error: 'Seller ID is required' }),
    shop: z.any({ required_error: 'Shop is required' }),
    stripePaymentIntentId: z.string({
      required_error: 'Stripe Payment Intent ID is required',
    }),
    paymentMethod: z.string({ required_error: 'Payment method is required' }),
  }),
})

export const BookingValidation = {
  createBookingZodSchema,
}
