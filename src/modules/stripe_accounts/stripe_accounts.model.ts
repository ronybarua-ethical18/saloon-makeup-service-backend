import mongoose, { Schema } from 'mongoose'
import {
  IStripeAccount,
  UserType,
  AccountType,
  StripeAccountStatus,
} from './stripe_accounts.interface'

// Create the Mongoose Schema
const StripeAccountSchema = new mongoose.Schema<IStripeAccount>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    userType: {
      type: String,
      enum: Object.values(UserType),
      required: true,
    },
    stripeAccountId: {
      type: String,
      required: true,
      unique: true,
    },
    accountType: {
      type: String,
      enum: Object.values(AccountType),
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(StripeAccountStatus),
      default: StripeAccountStatus.INACTIVE,
    },
    // New fields
    country: String,
    defaultCurrency: String,
    detailsSubmitted: Boolean,
    chargesEnabled: Boolean,
    payoutsEnabled: Boolean,
  },
  {
    timestamps: true,
  },
)

StripeAccountSchema.index({ stripeAccountId: 1 }, { unique: true })

// Create the Mongoose Model
const StripeAccount = mongoose.model<IStripeAccount>(
  'StripeAccount',
  StripeAccountSchema,
)

export default StripeAccount
