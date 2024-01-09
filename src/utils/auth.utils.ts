/* eslint-disable @typescript-eslint/no-explicit-any */
import { Secret } from 'jsonwebtoken'
import config from '../config'
import { jwtHelpers } from '../helpers/jwtHelpers'
import sendEmail from '../services/mail/sendMail'

export const sendMailWithToken = (
  user: any,
  subject: string,
  emailType: string,
  emailTemplate: string,
) => {
  const token = jwtHelpers.createToken(
    { userId: user?._id, role: user?.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  )

  sendEmail(
    [user.email],
    {
      subject: subject,
      data: {
        name: user.firstName + ' ' + user.lastName,
        role: user.role,
        token: config.client_port + '' + `/${emailType}?token=${token}`,
      },
    },
    emailTemplate,
  )
}
