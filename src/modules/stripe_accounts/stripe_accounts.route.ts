import express from 'express'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum'
import { StripeAccountController } from './stripe_accounts.controller'
const router = express.Router()

router.post(
  '/connect',
  auth(ENUM_USER_ROLE.SELLER),
  StripeAccountController.createAndConnectStripeAccount,
)
router.get('/account-details', StripeAccountController.getStripeAccountDetails)
router.get(
  '/owner-account-details',
  StripeAccountController.getOwnStripeAccountDetails,
)
router.post('/charge', StripeAccountController.createTestChargeToStripeAccount)
router.post(
  '/transfer-amount',
  StripeAccountController.transferAmountToConnectedStripeAccount,
)
router.post('/connect/webhook', StripeAccountController.stripeConnectWebhook)

export const StripeAccountRoutes = router
