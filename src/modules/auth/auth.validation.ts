import { z } from 'zod'

const signUpZodSchema = z.object({
  body: z.object({
    firstName: z.string({
      required_error: 'First name is required',
    }),
    lastName: z.string({
      required_error: 'Last name is required',
    }),
    email: z.string({
      required_error: 'Email is required',
    }),
    phone: z.string({
      required_error: 'Phone is required',
    }),
    role: z.string({
      required_error: 'Role is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
})

const loginZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
})
const verifyEmailZodSchema = z.object({
  body: z.object({
    token: z.string({
      required_error: 'Token is required',
    }),
  }),
})

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
})

const changePasswordZodSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password  is required',
    }),
    newPassword: z.string({
      required_error: 'New password  is required',
    }),
  }),
})

const resetPasswordZodSchema = z.object({
  body: z.object({
    token: z.string({
      required_error: 'Token  is required',
    }),
    newPassword: z.string({
      required_error: 'New password  is required',
    }),
  }),
})

export const AuthValidation = {
  signUpZodSchema,
  loginZodSchema,
  refreshTokenZodSchema,
  changePasswordZodSchema,
  verifyEmailZodSchema,
  resetPasswordZodSchema,
}
