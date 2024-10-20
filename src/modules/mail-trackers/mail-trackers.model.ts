import { Schema, model } from 'mongoose'
import { EmailTypes, MailModelInterface } from './mail-trackers.interface'

const mailSchema = new Schema<MailModelInterface>(
  {
    subject: {
      type: String,
      required: true,
    },
    recipient: {
      type: [String],
      required: true,
    },
    emailType: {
      type: String,
      enum: EmailTypes,
      required: true,
    },
    isMailSent: {
      type: Boolean,
      default: false,
    },
    essentialPayload: {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      seller: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      customer: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      booking: {
        type: Schema.Types.ObjectId,
        ref: 'booking',
      },
    },
  },
  { timestamps: true },
)

export default model<MailModelInterface>('mail-tracker', mailSchema)
