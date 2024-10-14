import mongoose from 'mongoose'
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

export const paymentDisbursed = async (
  bookingDetails: IPaymentDisbursedEssentials,
) => {
  try {
    const sellerStripeAccount = await StripeAccount.findOne({
      user: new mongoose.Types.ObjectId(bookingDetails.sellerId),
      status: 'active',
    })

    if (!sellerStripeAccount) {
      SentrySetContext('Seller stripe account not found', {
        message: `No corresponding stripe account found for the seller ${bookingDetails.sellerId}`,
      })
      SentryCaptureMessage(
        "Payment disbursement failed due to the seller's missing Stripe account.",
      )
    }
    const result = await StripeAccountService.captureHeldPayment(
      bookingDetails.paymentIntentId,
    )

    if (!result) {
      SentrySetContext('Something went wrong with capturing held payment', {
        message: `Capturing held payment failed for the seller ${bookingDetails.sellerId}`,
      })
      SentryCaptureMessage('Stripe held payment is failed to be captured.')
    }

    await BookingService.updateBooking(
      bookingDetails.bookingId,
      { status: BookingStatusList.COMPLETED },
    )
    await TransactionService.updateTransaction(
      bookingDetails.paymentIntentId,
      {status:AmountStatus.COMPLETED}
    )
  } catch (error: any) {
    SentrySetContext('Payment Disbursed Error', error)
    SentryCaptureMessage('Payment disbursed error')
  }
}
