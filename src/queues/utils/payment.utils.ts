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
import sendEmail from '../../services/mail/sendMail'
import { PAYMENT_DISBURSEMENT_SELLER } from '../../services/mail/constants'
import mailTrackersModel from '../../modules/mail-trackers/mail-trackers.model'
import { EmailTypes } from '../../modules/mail-trackers/mail-trackers.interface'

export const paymentDisbursed = async (
  bookingDetails: IPaymentDisbursedEssentials,
): Promise<void> => {
  const {
    sellerId,
    paymentIntentId,
    bookingId,
    customerName,
    customerId,
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

    await sendEmail(
      [sellerEmail, 'ronybarua.business23@gmail.com'],
      {
        subject: 'Payment Disbursement Confirmation',
        data: {
          amount: updatedTransaction?.sellerAmount,
          sellerName,
          serviceName,
          customerName,
        },
      },
      PAYMENT_DISBURSEMENT_SELLER,
    )

    await mailTrackersModel.create({
      subject: 'Payment Disbursement Confirmation',
      recipient: [sellerEmail],
      emailType: EmailTypes.PAYMENT_DISBURSEMENT_EMAIL,
      isMailSent: true,
      essentialPayload: {
        seller: sellerId,
        customer: customerId,
        booking: bookingId,
      },
    })
  } catch (error: any) {
    SentrySetContext('Payment Disbursed Error', error)
    SentryCaptureMessage(`Payment disbursed error: ${error.message}`)
    throw error
  }
}
