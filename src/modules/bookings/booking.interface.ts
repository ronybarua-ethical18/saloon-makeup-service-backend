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

interface PopulatedSellerOrCustomer {
  _id: mongoose.Types.ObjectId
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface PopulatedShopTimeSlot {
  slotFor: Date
}

interface PopulatedService {
  name: string
}
interface PopulatedShop {
  shopName: string
}

export interface PopulatedBooking {
  seller: PopulatedSellerOrCustomer
  customer: PopulatedSellerOrCustomer
  shopTimeSlot: PopulatedShopTimeSlot
  serviceId: PopulatedService
  shop: PopulatedShop
}

export interface IPaymentDisbursedEssentials {
  paymentIntentId: string
  customerBookingId:string
  bookingId: mongoose.Types.ObjectId
  sellerId: mongoose.Types.ObjectId
  customerId: mongoose.Types.ObjectId
  serviceName:string
  totalAmount: number
  sellerName: string
  customerName: string
  sellerEmail: string
  customerEmail: string
  shopName: string
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
