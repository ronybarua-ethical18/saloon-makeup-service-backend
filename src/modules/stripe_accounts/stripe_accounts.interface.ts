import mongoose, { Document } from 'mongoose'

export enum UserType {
  SELLER = 'SELLER',
  PORTAL_OWNER = 'PORTAL_OWNER',
}

export enum AccountType {
  EXPRESS = 'EXPRESS',
  STANDARD = 'STANDARD',
  CUSTOM = 'CUSTOM',
}

export enum StripeAccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// Interface for the stripe account document
export interface IStripeAccount extends Document {
  user: mongoose.Types.ObjectId
  userType: UserType
  stripeAccountId: string
  accountType: AccountType
  status: StripeAccountStatus
  balance: number
}
