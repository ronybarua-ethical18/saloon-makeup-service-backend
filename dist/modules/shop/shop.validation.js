'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.ShopZodSchema = void 0
const zod_1 = require('zod')
const StylistSchema = zod_1.z.object({
  name: zod_1.z.string(),
  specialization: zod_1.z.string(),
  experience: zod_1.z.number(),
  contact: zod_1.z.string(),
})
const AppointmentSchema = zod_1.z.object({
  customer: zod_1.z.string(),
  serviceId: zod_1.z.string(),
  stylist: zod_1.z.string(),
  appointmentDate: zod_1.z.date(),
  appointmentTime: zod_1.z.string(),
})
const OpeningHoursSchema = zod_1.z.object({
  weekday: zod_1.z.string(),
  startTime: zod_1.z.string(),
  endTime: zod_1.z.string(),
})
const createShopZodSchema = zod_1.z.object({
  body: zod_1.z.object({
    shopName: zod_1.z.string({ required_error: 'Shop name is required' }),
    shopDescription: zod_1.z.string({
      required_error: 'Shop description is required',
    }),
    location: zod_1.z.string({ required_error: 'Location is required' }),
    stylists: zod_1.z.array(StylistSchema).optional(),
    appointments: zod_1.z.array(AppointmentSchema).optional(),
    openingHours: zod_1.z.array(OpeningHoursSchema).optional(),
    gallery: zod_1.z.array(zod_1.z.string()).optional(),
  }),
})
exports.ShopZodSchema = {
  createShopZodSchema,
}
