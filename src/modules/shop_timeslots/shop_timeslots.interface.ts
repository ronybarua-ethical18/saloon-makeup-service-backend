import mongoose, { Document } from 'mongoose'

export interface ITimeSlot {
  startTime: string
  maxResourcePerHour: number
}

// Interface for the stripe account document
export interface IShopTimeSlots extends Document {
  shop: mongoose.Types.ObjectId
  slotFor: Date
  timeSlots: ITimeSlot[]
}
