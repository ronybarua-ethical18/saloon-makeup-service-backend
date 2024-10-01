import { Request, Response } from 'express'
import tryCatchAsync from '../../shared/tryCatchAsync'
import sendResponse from '../../shared/sendResponse'
import { StripeAccountService } from './stripe_accounts.service'
import mongoose from 'mongoose'
import config from '../../config'
import { stripe } from '../../config/stripe'
import Stripe from 'stripe'
import ApiError from '../../errors/ApiError'
import httpStatus from 'http-status'

const createAndConnectStripeAccount = tryCatchAsync(
  async (req: Request, res: Response) => {
    const loggedUser = req.user as {
      userId: mongoose.Types.ObjectId
      role: string
    }
    const result =
      await StripeAccountService.createAndConnectStripeAccount(loggedUser)

    sendResponse<{ url: string }>(res, {
      statusCode: 200,
      success: true,
      message: 'Feedback is created successfully',
      data: result,
    })
  },
)
const createPaymentIntentForHold = tryCatchAsync(
  async (req: Request, res: Response) => {
    const result: { client_secret: string | null } =
      await StripeAccountService.createPaymentIntentForHold(req.body)

    sendResponse<unknown>(res, {
      statusCode: 200,
      success: true,
      message: 'Payment intent is created successfully',
      data: result,
    })
  },
)

const captureHeldPayment = tryCatchAsync(
  async (req: Request, res: Response) => {
    const result: Stripe.PaymentIntent =
      await StripeAccountService.captureHeldPayment(req.body?.paymentIntentId)

    sendResponse<Stripe.PaymentIntent>(res, {
      statusCode: 200,
      success: true,
      message: 'Payment captured successfully',
      data: result,
    })
  },
)

const stripeConnectWebhook = tryCatchAsync(
  async (req: Request, res: Response) => {
    try {
      // Check if webhook signing is configured.
      const webhookSecret = config.stripe.stripe_webhook_secret_key as string

      if (webhookSecret) {
        // Retrieve the event by verifying the signature using the raw body and secret.
        let event: Stripe.Event

        const secret = webhookSecret

        const header = stripe.webhooks.generateTestHeaderString({
          payload: req.rawBody as string,
          secret,
        })

        try {
          event = stripe?.webhooks.constructEvent(
            req.rawBody as string,
            header,
            webhookSecret,
          )
          console.log(`⚠️  Webhook verified`)
        } catch (err) {
          console.log(`⚠️  Webhook signature verification failed:  ${err}`)
          return res.sendStatus(400)
        }

        const data = event.data.object as Stripe.Account
        const eventType = event.type as string

        if (eventType === 'account.updated') {
          console.log('Stripe Connect account updated:', data)
          try {
            await StripeAccountService.saveOrUpdateStripeAccount(data)
          } catch (error) {
            console.error('Error saving/updating Stripe account:', error)
            // You might want to handle this error, perhaps by creating a task to reconcile this account later
          }
        }

        res.status(200).end()
      } else {
        return null
      }
    } catch (error) {
      console.log('webhook error', error)
      res.status(400).end()
    }
  },
)

const getStripeAccountDetails = tryCatchAsync(
  async (req: Request, res: Response) => {
    const { accountId } = req.params // Assuming accountId is passed as a route parameter

    if (!accountId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Account ID is required')
    }

    const result = await StripeAccountService.getStripeAccountDetails(accountId)

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Stripe account details retrieved successfully',
      data: result,
    })
  },
)

const createTestChargeToStripeAccount = tryCatchAsync(
  async (req: Request, res: Response) => {
    const result = await StripeAccountService.createTestChargeToStripeAccount()

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Amount added to your stripe account',
      data: result,
    })
  },
)
const stripePaymentCheckout = tryCatchAsync(
  async (req: Request, res: Response) => {
    const result = await StripeAccountService.stripePaymentCheckout()

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Payment checkout page is generated',
      data: result,
    })
  },
)
const getOwnStripeAccountDetails = tryCatchAsync(
  async (req: Request, res: Response) => {
    const result = await StripeAccountService.getOwnStripeAccountDetails()

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Your stripe account details is fetched successfully',
      data: result,
    })
  },
)

const transferAmountToConnectedStripeAccount = tryCatchAsync(
  async (req: Request, res: Response) => {
    const result =
      await StripeAccountService.transferAmountToConnectedStripeAccount(
        'acct_1Q3A4yBH0X57e8kd',
        575,
      )

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Amount transferred successfully',
      data: result,
    })
  },
)

const capturePayment = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.body
    const capturedPayment =
      await StripeAccountService.captureHeldPayment(paymentIntentId)
    res.status(200).json(capturedPayment)
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' })
    }
  }
}

export const StripeAccountController = {
  createAndConnectStripeAccount,
  createPaymentIntentForHold,
  captureHeldPayment,
  stripeConnectWebhook,
  getStripeAccountDetails,
  transferAmountToConnectedStripeAccount,
  createTestChargeToStripeAccount,
  getOwnStripeAccountDetails,
  stripePaymentCheckout,
  capturePayment,
}
