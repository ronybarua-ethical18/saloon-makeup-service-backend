import { z } from 'zod'

const StylistSchema = z.object({
  name: z.string(),
  specialization: z.string(),
  experience: z.number(),
  contact: z.string(),
})

const AppointmentSchema = z.object({
  customer: z.string(),
  serviceId: z.string(),
  stylist: z.string(),
  appointmentDate: z.date(),
  appointmentTime: z.string(),
})

const OpeningHoursSchema = z.object({
  weekday: z.string(),
  startTime: z.string(),
  endTime: z.string(),
})

const createShopZodSchema = z.object({
  body: z.object({
    shopName: z.string({ required_error: 'Shop name is required' }),
    shopDescription: z.string({
      required_error: 'Shop description is required',
    }),
    location: z.string({ required_error: 'Location is required' }),
    stylists: z.array(StylistSchema).optional(),
    appointments: z.array(AppointmentSchema).optional(),
    openingHours: z.array(OpeningHoursSchema).optional(),
    maxResourcePerHour: z.number({
      required_error: 'Max resource per hour is required',
    }),
    gallery: z
      .array(
        z.object({
          img: z.string(), // Ensures `img` is of type `string`
        }),
      )
      .optional(),
  }),
})

export const ShopZodSchema = {
  createShopZodSchema,
}
