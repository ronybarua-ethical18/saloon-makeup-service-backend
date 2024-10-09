import { z } from 'zod'

const uploadFileSchema = z.object({
  body: z.object({
    img: z.any(),
  }),
})

export const uploadFileZodSchema = {
  uploadFileSchema,
}
