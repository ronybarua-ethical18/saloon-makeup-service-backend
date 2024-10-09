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
router.post(
  '/payment-intent',
  auth(ENUM_USER_ROLE.CUSTOMER),
  StripeAccountController.createPaymentIntentForHold,
)
router.post(
  '/capture-payment',
  auth(ENUM_USER_ROLE.CUSTOMER, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN),
  StripeAccountController.captureHeldPayment,
)
router.get(
  '/account-details/:accountId',
  StripeAccountController.getStripeAccountDetails,
)
router.get(
  '/owner-account-details/:accountId',
  StripeAccountController.getOwnStripeAccountDetails,
)
router.post('/charge', StripeAccountController.createTestChargeToStripeAccount)
router.post('/payment-checkout', StripeAccountController.stripePaymentCheckout)
router.post(
  '/transfer-amount',
  StripeAccountController.transferAmountToConnectedStripeAccount,
)
router.post('/connect/webhook', StripeAccountController.stripeConnectWebhook)
router.get(
  '/details/:accountId',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  StripeAccountController.getStripeAccountDetails,
)

export const StripeAccountRoutes = router
