import express from 'express'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum'
import { FeedbackController } from './feedback.controller'
const router = express.Router()

router.post(
  '/',
  auth(ENUM_USER_ROLE.CUSTOMER),
  FeedbackController.createFeedback,
)
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FeedbackController.getAllFeedbacks,
)

export const FeedbackRoutes = router
