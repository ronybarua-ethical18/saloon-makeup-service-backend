import mongoose from 'mongoose'
import { IFAQ } from './faq.interface'
const faqSchema = new mongoose.Schema<IFAQ>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { timestamps: true },
)

// Create and export the mongoose model
const FAQModel = mongoose.model<IFAQ>('faq', faqSchema)

export default FAQModel
