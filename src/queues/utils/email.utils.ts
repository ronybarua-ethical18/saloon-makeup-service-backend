/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import ApiError from '../../errors/ApiError'
import mailTrackersModel from '../../modules/mail-trackers/mail-trackers.model'
import {
  PAYMENT_DISBURSEMENT_OWNER,
  PAYMENT_DISBURSEMENT_SELLER,
  SERVICE_COMPLETION_CUSTOMER,
} from '../../services/mail/constants'
import sendEmail from '../../services/mail/sendMail'
import { EmailTypes } from '../../modules/mail-trackers/mail-trackers.interface'

export const emailPayloadsByUser = (
  ownerPayload: any,
  sellerPayload: any,
  customerPayload: any,
) => {
  const mailTrackerPayload = {
    seller: sellerPayload?.sellerId,
    customer: customerPayload?.customerId,
    booking: customerPayload?.bookingId,
  }
  return [
    {
      id: 1,
      sendTo: 'owner',
      subject: 'StyleVibe - Payment disbursement ',
      targetEmail: 'ronybarua.ethical18@gmail.com',
      payload: ownerPayload,
      template: PAYMENT_DISBURSEMENT_OWNER,
      emailType: EmailTypes.PAYMENT_DISBURSEMENT_PLATFORM,
      mailTrackerPayload,
    },
    {
      id: 2,
      sendTo: 'seller',
      subject: 'StyleVibe - Payment disbursement for a booking',
      targetEmail: sellerPayload?.sellerEmail,
      payload: sellerPayload,
      template: PAYMENT_DISBURSEMENT_SELLER,
      emailType: EmailTypes.PAYMENT_DISBURSEMENT_SELLER,
      mailTrackerPayload,
    },
    {
      id: 3,
      sendTo: 'customer',
      subject: 'StyleVibe - Service Completion Notification',
      targetEmail: customerPayload?.customerEmail,
      payload: customerPayload,
      template: SERVICE_COMPLETION_CUSTOMER,
      emailType: EmailTypes.SERVICE_COMPLETION_EMAIL,
      mailTrackerPayload,
    },
  ]
}

export const emailDispatch = async (
  email: string,
  payload: any,
  template: string,
  subject: string,
  emailType: string,
  essentialPayload: any,
) => {
  try {
    await sendEmail(
      [email, 'ronybarua.business23@gmail.com'],
      {
        subject: subject,
        data: payload,
      },
      template,
    )

    await mailTrackersModel.create({
      subject: subject,
      recipient: [email],
      emailType: emailType,
      isMailSent: true,
      essentialPayload,
    })
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Something went wrong with sending mail',
    )
  }
}
