import { z } from 'zod'

// Define the Zod schema for Service
const createBlogZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    content: z.string({ required_error: 'Content is required' }),
    media: z.string({ required_error: 'Media is required' }).optional(),
    author: z.string({ required_error: 'Author is required' }).optional(),
    tags: z
      .array(z.string())
      .min(1, { message: 'At least one tag is required' }),
  }),
})

export const BlogValidation = {
  createBlogZodSchema,
}
