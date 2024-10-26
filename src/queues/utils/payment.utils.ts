/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose'
import httpStatus from 'http-status'
import { SentryCaptureMessage, SentrySetContext } from '../../config/sentry'
import StripeAccount from '../../modules/stripe_accounts/stripe_accounts.model'
import {
  BookingStatusList,
  IPaymentDisbursedEssentials,
} from '../../modules/bookings/booking.interface'
import { StripeAccountService } from '../../modules/stripe_accounts/stripe_accounts.service'
import { BookingService } from '../../modules/bookings/booking.service'
import { TransactionService } from '../../modules/transactions/transactions.service'
import { AmountStatus } from '../../modules/transactions/transactions.interface'
import ApiError from '../../errors/ApiError'
import { addJobToEmailDispatchQueue } from '../emails/emailQueue'
import { emailPayloadsByUser } from './email.utils'

export const paymentDisbursed = async (
  bookingDetails: IPaymentDisbursedEssentials,
): Promise<void> => {
  const {
    sellerId,
    paymentIntentId,
    bookingId,
    customerBookingId,
    customerId,
    customerName,
    customerEmail,
    sellerEmail,
    sellerName,
    serviceName,
  } = bookingDetails

  try {
    console.log('Booking details from payment disbursed', bookingDetails)

    const sellerStripeAccount = await StripeAccount.findOne({
      user: new mongoose.Types.ObjectId(sellerId),
      status: 'active',
    })

    if (!sellerStripeAccount) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Payment disbursement failed due to the seller's missing Stripe account.",
      )
    }

    const result =
      await StripeAccountService.captureHeldPayment(paymentIntentId)

    if (!result) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to capture held payment',
      )
    }

    const [updatedBooking, updatedTransaction] = await Promise.all([
      BookingService.updateBooking(bookingId, {
        status: BookingStatusList.COMPLETED,
      }),
      TransactionService.updateTransaction(paymentIntentId, {
        status: AmountStatus.COMPLETED,
      }),
    ])

    if (!updatedBooking || !updatedTransaction) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update booking or transaction status',
      )
    }

    const ownerPayload = {
      owner: 'Style Vibe Director',
      applicationFee: updatedTransaction.applicationFee,
      sellerAmount: updatedTransaction.sellerAmount,
      serviceName,
      bookingId,
      customerBookingId,
      sellerName,
      sellerEmail,
      stripeAccountId: sellerStripeAccount.stripeAccountId,
      customerName,
      customerEmail,
    }
    const sellerPayload = {
      amount: updatedTransaction?.sellerAmount,
      transactionId: updatedTransaction.transactionId,
      customerBookingId,
      sellerId,
      sellerEmail,
      sellerName,
      serviceName,
      customerName,
      customerEmail,
    }
    const customerPayload = {
      customerId,
      serviceName,
      customerBookingId,
      transactionId: updatedTransaction.transactionId,
      customerEmail,
      customerName,
    }

    const emailPayloads = emailPayloadsByUser(
      ownerPayload,
      sellerPayload,
      customerPayload,
    )

    for (const emailPayload of emailPayloads) {
      addJobToEmailDispatchQueue(emailPayload).then(() =>
        console.log('Job added to email dispatch queue'),
      )
    }
  } catch (error: any) {
    SentrySetContext('Payment Disbursed Error', error)
    SentryCaptureMessage(`Payment disbursed error: ${error.message}`)
    throw error
  }
}
