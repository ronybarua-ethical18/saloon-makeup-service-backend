import mongoose from 'mongoose'
import { z } from 'zod'

// Define the Zod schema for ShopTimeSlots with shop inside body
const createShopTimeSlotsZodSchema = z.object({
  body: z.object({
    shop: z
      .string({ required_error: 'Shop ID is required' })
      .refine(val => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid Shop ID',
      }),
    startTime: z.string({ required_error: 'Start time is required' }),
  }),
})

// Export the validation schema
export const ShopTimeSlotsValidation = {
  createShopTimeSlotsZodSchema,
}
