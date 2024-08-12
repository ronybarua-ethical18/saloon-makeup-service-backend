// import express from 'express'
// import auth from '../../middlewares/auth'
// import { ENUM_USER_ROLE } from '../../shared/enums/user.enum'
// import { FeedbackController } from './stripe_accounts.controller'
// import validateRequest from '../../middlewares/validateRequest'
// import { FeedbackValidation } from './stripe_accounts.validation'
// const router = express.Router()

// router.post(
//   '/',
//   auth(ENUM_USER_ROLE.CUSTOMER),
//   validateRequest(FeedbackValidation.createFeedbackZodSchema),
//   FeedbackController.createFeedback,
// )
// router.get(
//   '/',
//   auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
//   FeedbackController.getAllFeedbacks,
// )

// export const FeedbackRoutes = router
