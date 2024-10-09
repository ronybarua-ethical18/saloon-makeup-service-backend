import mongoose, { Schema } from 'mongoose'

import {
  AmountStatus,
  ITransactions,
  PaymentMethod,
  TransactionType,
} from './transactions.interface'

// Helper function to format numbers with two decimal places
const formatNumber = (value: number): number => {
  return Math.round(value * 100) / 100
}

// Create the Mongoose Schema
const TransactionsSchema = new mongoose.Schema<ITransactions>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'service',
      required: true,
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'booking',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    stripeProcessingFee: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(AmountStatus),
      default: AmountStatus.PENDING,
    },
    stripePaymentIntentId: {
      type: String,
      required: true,
    },
    transactionType: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    sellerAmount: {
      type: Number,
      default: 0,
    },
    applicationFee: {
      type: Number,
      default: 0,
    },
    isPaymentDisbursed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Pre-save hook to format all number fields
TransactionsSchema.pre('save', function (next) {
  const transaction = this as ITransactions

  // Format the number fields with two decimal places
  transaction.amount = formatNumber(transaction.amount)
  transaction.stripeProcessingFee = formatNumber(
    transaction.stripeProcessingFee,
  )
  transaction.sellerAmount = formatNumber(transaction.sellerAmount)
  transaction.applicationFee = formatNumber(transaction.applicationFee)

  next()
})

TransactionsSchema.index({ stripePaymentIntentId: 1 }, { unique: true })

// Create the Mongoose Model
const Transaction = mongoose.model<ITransactions>(
  'transactions',
  TransactionsSchema,
)

export default Transaction
