import { z } from 'zod'

// Define the Zod schema for Service
const createFeedbackZodSchema = z.object({
  body: z.object({
    user: z.string({ required_error: 'User id is required' }),
    comment: z.string({ required_error: 'Comment is required' }),
    rating: z.number({ required_error: 'Rating is required' }),
  }),
})

export const FeedbackValidation = {
  createFeedbackZodSchema,
}
