import { Document, Types } from 'mongoose'

export enum UserType {
  SELLER = 'seller',
  BUYER = 'buyer',
  // Add other user types if needed
}

export enum AccountType {
  EXPRESS = 'express',
  STANDARD = 'standard',
  CUSTOM = 'custom',
}

export enum StripeAccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  // Add other statuses if needed
}

export interface IStripeAccountDetails {
  country: string
  currency: string
  stripeAccountId: string
  bankName: string
  balance: number
}

// Interface for the stripe account document
export interface IStripeAccount extends Document {
  user: Types.ObjectId
  userType: UserType
  stripeAccountId: string
  accountType: AccountType
  balance: number
  status: StripeAccountStatus
  // New fields
  country?: string
  defaultCurrency?: string
  detailsSubmitted?: boolean
  chargesEnabled?: boolean
  payoutsEnabled?: boolean
}
