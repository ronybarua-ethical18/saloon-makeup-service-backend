import transporter from './mailConfig'

interface IMailContext {
  subject: string
  data: unknown
}

const sendEmail = async (
  receiverEmail: Array<string>,
  context: IMailContext,
  template: string,
): Promise<void> => {
  try {
    const reports = await transporter.sendMail({
      from: '"Style Vibe Portal"',
      to: receiverEmail,
      subject: context.subject,
      template: template,
      context: context.data,
    } as object)
    console.log(reports)
  } catch (err) {
    console.log(err)
    console.log('EMAIL SEND FAILED')
  }
}

export default sendEmail
