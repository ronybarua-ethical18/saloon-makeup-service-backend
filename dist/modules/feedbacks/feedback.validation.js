'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.FeedbackValidation = void 0
const zod_1 = require('zod')
// Define the Zod schema for Service
const createFeedbackZodSchema = zod_1.z.object({
  body: zod_1.z.object({
    user: zod_1.z.string({ required_error: 'User id is required' }),
    comment: zod_1.z.string({ required_error: 'Comment is required' }),
    rating: zod_1.z.number({ required_error: 'Rating is required' }),
  }),
})
exports.FeedbackValidation = {
  createFeedbackZodSchema,
}
