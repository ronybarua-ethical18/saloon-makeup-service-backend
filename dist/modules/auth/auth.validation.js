"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const signUpZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string({
            required_error: 'First name is required',
        }),
        lastName: zod_1.z.string({
            required_error: 'Last name is required',
        }),
        email: zod_1.z.string({
            required_error: 'Email is required',
        }),
        phone: zod_1.z.string({
            required_error: 'Phone is required',
        }),
        role: zod_1.z.string({
            required_error: 'Role is required',
        }),
        password: zod_1.z.string({
            required_error: 'Password is required',
        }),
    }),
});
const loginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'Email is required',
        }),
        password: zod_1.z.string({
            required_error: 'Password is required',
        }),
    }),
});
const verifyEmailZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string({
            required_error: 'Token is required',
        }),
    }),
});
const refreshTokenZodSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'Refresh Token is required',
        }),
    }),
});
const changePasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({
            required_error: 'Old password  is required',
        }),
        newPassword: zod_1.z.string({
            required_error: 'New password  is required',
        }),
    }),
});
const resetPasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string({
            required_error: 'Token  is required',
        }),
        newPassword: zod_1.z.string({
            required_error: 'New password  is required',
        }),
    }),
});
exports.AuthValidation = {
    signUpZodSchema,
    loginZodSchema,
    refreshTokenZodSchema,
    changePasswordZodSchema,
    verifyEmailZodSchema,
    resetPasswordZodSchema,
};
