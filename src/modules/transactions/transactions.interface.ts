import { Document, Schema } from 'mongoose'

export enum AmountStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

export enum PaymentMethod {
  CARD = 'card',
  PAYPAL = 'paypal',
  WALLET = 'wallet',
}

export enum TransactionType {
  PAYMENT = 'payment',
  REFUND = 'refund',
  PAYOUT = 'payout',
}

// Interface for the stripe account document
export interface ITransactions extends Document {
  customer: Schema.Types.ObjectId
  seller: Schema.Types.ObjectId
  service: Schema.Types.ObjectId
  booking: Schema.Types.ObjectId
  amount: number
  status: AmountStatus
  stripePaymentIntentId: string
  paymentMethod: PaymentMethod
  sellerAmount: number
  applicationFee: number
  stripeProcessingFee: number
  isPaymentDisbursed: boolean
  transactionId: string
  transactionType: TransactionType
}
