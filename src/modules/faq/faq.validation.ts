import { z } from 'zod'

// Define the Zod schema for Service
const createFAQZodSchema = z.object({
  body: z.object({
    question: z.string({ required_error: 'Questing is required' }),
    answer: z.string({ required_error: 'Answer is required' }),
  }),
})

export const FAQValidation = {
  createFAQZodSchema,
}
