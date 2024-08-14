import { Request, Response } from 'express'
import tryCatchAsync from '../../shared/tryCatchAsync'
import sendResponse from '../../shared/sendResponse'
import { StripeAccountService } from './stripe_accounts.service'
import mongoose from 'mongoose'
import config from '../../config'
import { stripe } from '../../config/stripe'
import Stripe from 'stripe'

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
          payload: req.rawBody,
          secret,
        })

        try {
          event = stripe?.webhooks.constructEvent(
            req.rawBody,
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
          console.log('webhook data', data)
        }
      } else {
        return null
      }
      res.status(200).end()
    } catch (error) {
      console.log('webhook error', error)
    }
  },
)

const getStripeAccountDetails = tryCatchAsync(
  async (req: Request, res: Response) => {
    const result = await StripeAccountService.getStripeAccountDetails()

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Stripe account details is retrieved successfully',
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
        'acct_1PnjlHPXU6uylqvz',
        1000,
      )

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Amount transferred successfully',
      data: result,
    })
  },
)

export const StripeAccountController = {
  createAndConnectStripeAccount,
  stripeConnectWebhook,
  getStripeAccountDetails,
  transferAmountToConnectedStripeAccount,
  createTestChargeToStripeAccount,
  getOwnStripeAccountDetails,
}
