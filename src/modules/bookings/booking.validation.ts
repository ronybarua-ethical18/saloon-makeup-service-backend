import { z } from 'zod'

// Define the Zod schema for Service
const createBookingZodSchema = z.object({
  body: z.object({
    seller: z.string({ required_error: 'Seller is required' }),
    shop: z.string({ required_error: 'Shop is required' }),
    serviceId: z.string({ required_error: 'Service ID is required' }),
    serviceStartTime: z.string({
      required_error: 'Service start time is required',
    }),
    serviceEndTime: z.string({
      required_error: 'Service end time is required',
    }),
    serviceDayOfWeek: z.string({
      required_error: 'Service day of the week is required',
    }),
    notes: z.string({ required_error: 'Notes are required' }).optional(),
  }),
})

export const BookingValidation = {
  createBookingZodSchema,
}
