'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.BookingValidation = void 0
const zod_1 = require('zod')
// Define the Zod schema for Service
const createBookingZodSchema = zod_1.z.object({
  body: zod_1.z.object({
    seller: zod_1.z.string({ required_error: 'Seller is required' }),
    shop: zod_1.z.string({ required_error: 'Shop is required' }),
    serviceId: zod_1.z.string({ required_error: 'Service ID is required' }),
    serviceStartTime: zod_1.z.string({
      required_error: 'Service start time is required',
    }),
    serviceEndTime: zod_1.z.string({
      required_error: 'Service end time is required',
    }),
    serviceDayOfWeek: zod_1.z.string({
      required_error: 'Service day of the week is required',
    }),
    notes: zod_1.z.string({ required_error: 'Notes are required' }).optional(),
  }),
})
exports.BookingValidation = {
  createBookingZodSchema,
}
