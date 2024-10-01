import mongoose, { Schema } from 'mongoose'

import {
  AmountStatus,
  ITransactions,
  TransactionType,
} from './transactions.interface'

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
    sellerAmount: {
      type: Number,
      required: true,
    },
    portalAmount: {
      type: Number,
      required: true,
    },
    completedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

TransactionsSchema.index({ stripeAccountId: 1 }, { unique: true })

// Create the Mongoose Model
const Transaction = mongoose.model<ITransactions>(
  'transactions',
  TransactionsSchema,
)

export default Transaction
