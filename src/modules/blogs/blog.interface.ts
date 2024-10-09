import mongoose, { Document } from 'mongoose'

// Interface for the booking document
export interface IBlog extends Document {
  title: string
  content: string
  media: string
  author: mongoose.Types.ObjectId
  tags: string[]
}
