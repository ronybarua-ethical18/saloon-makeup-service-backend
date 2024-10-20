import { Document, Schema } from 'mongoose'

export enum EmailTypes {
  VERIFICATION_EMAIL = 'VERIFICATION_EMAIL',
  PAYMENT_DISBURSEMENT_EMAIL = 'PAYMENT_DISBURSEMENT_EMAIL',
}

type IEssentialPayload = {
  user?: Schema.Types.ObjectId
  seller?: Schema.Types.ObjectId
  customer?: Schema.Types.ObjectId
  booking?: Schema.Types.ObjectId
}

interface MailAttributes {
  subject: string
  recipient: string[]
  emailType: EmailTypes
  isMailSent?: boolean
  essentialPayload: IEssentialPayload
}

export interface MailModelInterface extends MailAttributes, Document {}
