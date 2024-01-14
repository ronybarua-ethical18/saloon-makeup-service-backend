import mongoose, { Document } from 'mongoose'

export enum BookingStatusList {
  PENDING = 'PENDING',
  BOOKED = 'BOOKED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

// Interface for the booking document
export interface IBooking extends Document {
  customer: mongoose.Types.ObjectId
  seller: mongoose.Types.ObjectId
  shop: mongoose.Types.ObjectId
  serviceId: mongoose.Types.ObjectId
  serviceStartTime: string
  serviceEndTime: string
  serviceDayOfWeek: string
  status: BookingStatusList
  notes: string
}
