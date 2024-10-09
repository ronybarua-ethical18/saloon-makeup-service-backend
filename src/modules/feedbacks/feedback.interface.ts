import mongoose, { Document } from 'mongoose'

// Interface for the booking document
export interface IFeedback extends Document {
  user: mongoose.Types.ObjectId
  comment: string
  rating: number
}
