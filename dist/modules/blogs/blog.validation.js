'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.BlogValidation = void 0
const zod_1 = require('zod')
// Define the Zod schema for Service
const createBlogZodSchema = zod_1.z.object({
  body: zod_1.z.object({
    title: zod_1.z.string({ required_error: 'Title is required' }),
    content: zod_1.z.string({ required_error: 'Content is required' }),
    media: zod_1.z.string({ required_error: 'Media is required' }).optional(),
    author: zod_1.z.string({ required_error: 'Author is required' }).optional(),
    tags: zod_1.z
      .array(zod_1.z.string())
      .min(1, { message: 'At least one tag is required' }),
  }),
})
exports.BlogValidation = {
  createBlogZodSchema,
}
