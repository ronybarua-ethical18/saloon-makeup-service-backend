"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentDisbursed = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const sentry_1 = require("../../config/sentry");
const stripe_accounts_model_1 = __importDefault(require("../../modules/stripe_accounts/stripe_accounts.model"));
const booking_interface_1 = require("../../modules/bookings/booking.interface");
const stripe_accounts_service_1 = require("../../modules/stripe_accounts/stripe_accounts.service");
const booking_service_1 = require("../../modules/bookings/booking.service");
const transactions_service_1 = require("../../modules/transactions/transactions.service");
const transactions_interface_1 = require("../../modules/transactions/transactions.interface");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const emailQueue_1 = require("../emails/emailQueue");
const email_utils_1 = require("./email.utils");
const paymentDisbursed = async (bookingDetails) => {
    const { sellerId, paymentIntentId, bookingId, customerBookingId, customerId, customerName, customerEmail, sellerEmail, sellerName, serviceName, } = bookingDetails;
    try {
        console.log('Booking details from payment disbursed', bookingDetails);
        const sellerStripeAccount = await stripe_accounts_model_1.default.findOne({
            user: new mongoose_1.default.Types.ObjectId(sellerId),
            status: 'active',
        });
        if (!sellerStripeAccount) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Payment disbursement failed due to the seller's missing Stripe account.");
        }
        const result = await stripe_accounts_service_1.StripeAccountService.captureHeldPayment(paymentIntentId);
        if (!result) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to capture held payment');
        }
        const [updatedBooking, updatedTransaction] = await Promise.all([
            booking_service_1.BookingService.updateBooking(bookingId, {
                status: booking_interface_1.BookingStatusList.COMPLETED,
            }),
            transactions_service_1.TransactionService.updateTransaction(paymentIntentId, {
                status: transactions_interface_1.AmountStatus.COMPLETED,
            }),
        ]);
        if (!updatedBooking || !updatedTransaction) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to update booking or transaction status');
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
        };
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
        };
        const customerPayload = {
            customerId,
            serviceName,
            customerBookingId,
            transactionId: updatedTransaction.transactionId,
            customerEmail,
            customerName,
        };
        const emailPayloads = (0, email_utils_1.emailPayloadsByUser)(ownerPayload, sellerPayload, customerPayload);
        for (const emailPayload of emailPayloads) {
            (0, emailQueue_1.addJobToEmailDispatchQueue)(emailPayload).then(() => console.log('Job added to email dispatch queue'));
        }
    }
    catch (error) {
        (0, sentry_1.SentrySetContext)('Payment Disbursed Error', error);
        (0, sentry_1.SentryCaptureMessage)(`Payment disbursed error: ${error.message}`);
        throw error;
    }
};
exports.paymentDisbursed = paymentDisbursed;
