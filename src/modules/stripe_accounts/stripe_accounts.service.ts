import Stripe from 'stripe'
import config from '../../config'
import { JwtPayload } from 'jsonwebtoken'
import { UserModel } from '../user/user.model'
import ApiError from '../../errors/ApiError'
import httpStatus from 'http-status'
import { stripe } from '../../config/stripe'
import { manipulateLineItem } from '../../utils/stripe.utils'
import StripeAccountModel from './stripe_accounts.model'
import {
  UserType,
  AccountType,
  StripeAccountStatus,
} from './stripe_accounts.interface'
import mongoose from 'mongoose'

const createAndConnectStripeAccount = async (
  LoggedUser: JwtPayload,
): Promise<{ url: string }> => {
  const seller = await UserModel.findOne({
    _id: LoggedUser.userId,
    role: 'seller',
  })

  if (seller) {
    const stripe = new Stripe(`${config.stripe.stripe_secret_key}`)
    // Create a new Stripe Express account
    const account = await stripe.accounts.create({
      type: 'express',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      metadata: {
        userId: LoggedUser.userId.toString(),
        userRole: LoggedUser.role,
      },
    })

    // Create an account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'http://localhost:3000/reauth',
      return_url: `${config.client_port}/seller/settings?success=true`,
      type: 'account_onboarding',
    })

    console.log('accountLink', accountLink)
    return { url: accountLink.url }
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not allowed to perform the operation',
    )
  }
}

// Create a Payment Intent with 'manual' capture to hold funds and include application fee for platform owner
const createPaymentIntentForHold = async ({
  amount,
  currency,
  seller,
}: {
  amount: number
  currency: string
  seller: mongoose.Types.ObjectId
}) => {
  try {
    const sellerAccount = await StripeAccountModel.findOne({
      user: seller,
      userType: UserType.SELLER,
    })

    if (!sellerAccount) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'No stripe account found for the service seller',
      )
    }

    // Ensure amount and application fee are integers
    const amountInCents = Math.round(amount * 100) // Convert amount to smallest currency unit (e.g., cents)
    const applicationFeeAmount = Math.round(amountInCents * 0.1) // 10% fee for the platform owner

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents, // Amount in smallest currency unit
      currency: currency,
      capture_method: 'manual', // Hold the funds, manual capture required later
      payment_method_types: ['card'], // Specify payment method type
      description: 'Payment for service on hold',

      // Application fee for platform owner (10% of total amount)
      application_fee_amount: applicationFeeAmount, // Platform owner gets 10%

      // Transfer the remaining 90% to the seller's Stripe connected account
      transfer_data: {
        destination: sellerAccount.stripeAccountId, // Seller's connected Stripe account
      },
    })

    console.log(
      'Payment Intent Created with manual capture:',
      paymentIntent?.id,
    )
    return { client_secret: paymentIntent.client_secret, id: paymentIntent.id }
  } catch (error) {
    console.error('Failed to create Payment Intent with manual capture:', error)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Payment Intent creation failed',
    )
  }
}

const captureHeldPayment = async (paymentIntentId: string) => {
  try {
    // First, retrieve the PaymentIntent to check its status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status === 'requires_capture') {
      // If the status is 'requires_capture', we can proceed with capturing
      const capturedPaymentIntent =
        await stripe.paymentIntents.capture(paymentIntentId)
      console.log('Payment Captured:', capturedPaymentIntent)
      return capturedPaymentIntent
    } else if (paymentIntent.status === 'requires_payment_method') {
      // If the status is 'requires_payment_method', we need to inform the user
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Payment method is required. The payment has not been processed yet.',
      )
    } else {
      // For any other status, throw an error with the current status
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Cannot capture payment. Current status: ${paymentIntent.status}`,
      )
    }
  } catch (error) {
    console.error('Failed to capture the payment:', error)
    if (error instanceof ApiError) {
      throw error
    } else {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Payment capture failed',
      )
    }
  }
}

const getStripeAccountDetails = async (accountId: string) => {
  try {
    // Retrieve the account details using the provided accountId
    const account = await stripe.accounts.retrieve(accountId)

    // Retrieve the account balance
    const balance = await stripe.balance.retrieve({ stripeAccount: accountId })

    // Extract owner details based on account type
    let ownerDetails = null as unknown

    if (account.individual) {
      ownerDetails = account.individual
    } else if (account.company) {
      ownerDetails = account.company
    }

    // Combine the account, owner details, and balance
    const result = {
      accountDetails: account,
      ownerDetails,
      balanceDetails: balance,
    }

    return result
  } catch (error) {
    console.error(
      `Failed to retrieve account details and balance for ID ${accountId}:`,
      error,
    )
    throw error
  }
}

const createTestChargeToStripeAccount = async (amount: number = 5000) => {
  try {
    const charge = await stripe.charges.create({
      amount: amount, // Amount in cents (e.g., 5000 cents = $50.00)
      currency: 'eur',
      // source: 'tok_visa', // Use 'tok_visa' for a successful charge in test mode
      source: 'tok_bypassPending',
      description: 'Adding funds to available balance for testing',
    })

    console.log('Test Charge Successful:', charge)
    return charge
  } catch (error) {
    console.error('Failed to create test charge:', error)
    throw error
  }
}

const transferAmountToConnectedStripeAccount = async (
  destinationAccountId: string,
  amount: number,
) => {
  try {
    // Create a transfer to the connected account
    const transfer = await stripe.transfers.create({
      amount: amount, // amount in the smallest currency unit (e.g., cents for USD)
      currency: 'eur', // currency of the transfer
      destination: destinationAccountId, // connected account ID
      // transfer_group: 'ORDER_95', // optional transfer group for better tracking
    })

    // Retrieve the transfer details
    const retrievedTransfer = await stripe.transfers.retrieve(transfer.id)

    // Return the combined result
    return {
      transfer: retrievedTransfer,
    }
  } catch (error) {
    console.error(
      `Failed to create or retrieve transfer to account ${destinationAccountId}:`,
      error,
    )
    throw error
  }
}

const getOwnStripeAccountDetails = async () => {
  try {
    // Retrieve your own account details
    const account = (await stripe.balance.retrieve()) as object

    console.log('Own Account Details:', account)
    return account
  } catch (error) {
    console.error('Failed to retrieve own account details:', error)
    throw error
  }
}

const stripePaymentCheckout = async () => {
  const stripeFee = (45 * 2.9) / 100 + 0.3
  // const loggedUser: any = req.user

  const customer = await stripe.customers.create({
    metadata: {
      // userId: loggedUser._id.toString(),
      processing_fees: stripeFee,
      // storeId: loggedUser.storeId.toString(),
    },
  })

  console.log('stripe customer', customer)

  // Make sure manipulateLineItem() returns a non-empty array
  const lineItems = manipulateLineItem()

  if (!lineItems || lineItems?.length === 0) {
    throw new Error('Line items are required for Stripe checkout')
  }

  const stripeSessionPayload: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    payment_method_types: ['card'],

    line_items: manipulateLineItem(),
    customer: customer.id,
    phone_number_collection: {
      enabled: true,
    },
    success_url: config.stripe.stripe_payment_success_url,
    cancel_url: config.stripe.stripe_payment_failed_url,
  }

  const session = await stripe?.checkout?.sessions.create(stripeSessionPayload)

  return session.url
}

const saveOrUpdateStripeAccount = async (accountData: Stripe.Account) => {
  try {
    console.log('accountData from stripe', accountData)
    let account = await StripeAccountModel.findOne({
      stripeAccountId: accountData.id,
    })

    if (!account) {
      account = new StripeAccountModel({
        stripeAccountId: accountData.id,
        user: accountData.metadata?.userId, // Use the userId from metadata if it exists
        userType: accountData.metadata?.userRole as UserType, // Use the userRole from metadata if it exists
        accountType: accountData.type as AccountType,
        balance: 0,
        status: accountData.payouts_enabled
          ? StripeAccountStatus.ACTIVE
          : StripeAccountStatus.INACTIVE,
      })
    }

    // Update fields
    account.accountType = accountData.type as AccountType
    account.status = accountData.payouts_enabled
      ? StripeAccountStatus.ACTIVE
      : StripeAccountStatus.INACTIVE

    // Additional fields based on the webhook payload
    account.country = accountData.country
    account.defaultCurrency = accountData.default_currency
    account.detailsSubmitted = accountData.details_submitted
    account.chargesEnabled = accountData.charges_enabled
    account.payoutsEnabled = accountData.payouts_enabled

    await account.save()

    console.log('Stripe account saved/updated in database:', account)
    return account
  } catch (error) {
    console.error('Failed to save or update Stripe account:', error)
    throw error
  }
}

export const StripeAccountService = {
  createAndConnectStripeAccount,
  createPaymentIntentForHold,
  captureHeldPayment,
  getStripeAccountDetails,
  createTestChargeToStripeAccount,
  transferAmountToConnectedStripeAccount,
  getOwnStripeAccountDetails,
  stripePaymentCheckout,
  saveOrUpdateStripeAccount,
}
