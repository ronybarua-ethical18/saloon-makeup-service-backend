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

export const AuthRoutes = router
