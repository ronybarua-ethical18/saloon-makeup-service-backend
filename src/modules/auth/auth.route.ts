import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AuthValidation } from './auth.validation'
import { AuthController } from './auth.controller'
const router = express.Router()

router.post(
  '/login',
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser,
)
router.post(
  '/signup',
  validateRequest(AuthValidation.signUpZodSchema),
  AuthController.signUpUser,
)
router.post('/forgot-password', AuthController.forgotPassword)

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken,
)
router.put(
  '/verify-email',
  validateRequest(AuthValidation.verifyEmailZodSchema),
  AuthController.verifyEmail,
)

router.put(
  '/reset-password',
  validateRequest(AuthValidation.resetPasswordZodSchema),
  AuthController.resetPassword,
)

// router.post(
//   '/change-password',
//   validateRequest(AuthValidation.changePasswordZodSchema),
//   auth(
//     ENUM_USER_ROLE.SUPER_ADMIN,
//     ENUM_USER_ROLE.ADMIN,
//     ENUM_USER_ROLE.FACULTY,
//     ENUM_USER_ROLE.STUDENT
//   ),
//   AuthController.changePassword
// );

export const AuthRoutes = router
