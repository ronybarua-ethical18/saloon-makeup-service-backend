import { Document } from 'mongoose'

// Interface for the booking document
export interface IFAQ extends Document {
  question: string
  answer: string
}
