import { z } from 'zod'

// Define the Zod schema for Service
const ServiceZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Service name is required' }),
    category: z.string({ required_error: 'Category is required' }),
    subCategory: z.string({ required_error: 'Sub category is required' }),
    price: z.number({ required_error: 'Price is required' }).positive(),
    images: z.array(
      z.object({
        img: z.string({ required_error: 'Image link should be valid' }),
      }),
    ),
    description: z.string({ required_error: 'Description required' }),
    availability: z.boolean().optional(),
    shop: z.string({}).optional(),
    reviews: z
      .array(
        z.object({
          rating: z.number(),
          comment: z.string(),
          user: z.string({ required_error: 'User ID is required' }),
          date: z.date(),
        }),
      )
      .optional(),
  }),
})

export const ServiceValidation = {
  ServiceZodSchema,
}
