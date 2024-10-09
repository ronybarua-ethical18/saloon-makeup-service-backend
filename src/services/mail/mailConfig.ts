import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import handlebarOptions from './viewEngine'
import config from '../../config'

// mail sender
const transporterOptions = {
  host: config.smtp_host,
  port: Number(config.smtp_port),
  auth: {
    user: config.smtp_user,
    pass: config.smtp_password,
  },
  tls: {
    rejectUnauthorized: false,
  },
}

const transporter: nodemailer.Transporter =
  nodemailer.createTransport(transporterOptions)

// Use compile instead of use for setting up handlebars
transporter.use('compile', hbs(handlebarOptions))

export default transporter
