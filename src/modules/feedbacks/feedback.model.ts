import mongoose, { Schema } from 'mongoose'
import { IFeedback } from './feedback.interface'
const feedBackSchema = new mongoose.Schema<IFeedback>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  { timestamps: true },
)

// Create and export the mongoose model
const FeedBackModel = mongoose.model<IFeedback>('feedback', feedBackSchema)

export default FeedBackModel
