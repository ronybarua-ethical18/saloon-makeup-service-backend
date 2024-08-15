import Stripe from 'stripe'
import config from '../../config'
import { JwtPayload } from 'jsonwebtoken'
import { UserModel } from '../user/user.model'
import ApiError from '../../errors/ApiError'
import httpStatus from 'http-status'
import { stripe } from '../../config/stripe'
import { manipulateLineItem } from '../../utils/stripe.utils'

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
    })

    // Create an account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'http://localhost:3000/reauth', // URL to redirect if the onboarding fails
      return_url: 'http://localhost:3000/success', // URL to redirect upon successful onboarding
      type: 'account_onboarding',
    })

    // Send the URL to the frontend
    return { url: accountLink.url }
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not allowed to perform the operation',
    )
  }
}

const getStripeAccountDetails = async (accountId?: string) => {
  try {
    // Retrieve the account details
    const account = await stripe.accounts.retrieve(accountId || 'self')

    // Retrieve the account balance
    const balance = await stripe.balance.retrieve()

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

export const StripeAccountService = {
  createAndConnectStripeAccount,
  getStripeAccountDetails,
  transferAmountToConnectedStripeAccount,
  createTestChargeToStripeAccount,
  getOwnStripeAccountDetails,
  stripePaymentCheckout,
}
