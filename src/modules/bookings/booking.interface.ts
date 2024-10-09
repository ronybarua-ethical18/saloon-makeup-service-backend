import mongoose, { Document } from 'mongoose'

export enum BookingStatusList {
  // PENDING = 'PENDING',
  BOOKED = 'BOOKED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum DayOfWeeks {
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
}

// Interface for the booking document
export interface IBooking extends Document {
  bookingId: string
  customer: mongoose.Types.ObjectId
  seller: mongoose.Types.ObjectId
  shop: mongoose.Types.ObjectId
  serviceId: mongoose.Types.ObjectId
  shopTimeSlot: mongoose.Types.ObjectId
  serviceStartTime: string
  totalAmount: number
  processingFees: number
  status: BookingStatusList
  notes: string
}
