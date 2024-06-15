'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.sendMailWithToken = void 0
const config_1 = __importDefault(require('../config'))
const jwtHelpers_1 = require('../helpers/jwtHelpers')
const sendMail_1 = __importDefault(require('../services/mail/sendMail'))
const sendMailWithToken = (user, subject, emailType, emailTemplate) => {
  const token = jwtHelpers_1.jwtHelpers.createToken(
    { userId: user?._id, role: user?.role },
    config_1.default.jwt.secret,
    config_1.default.jwt.expires_in,
  )
  ;(0, sendMail_1.default)(
    [user.email],
    {
      subject: subject,
      data: {
        name: user.firstName + ' ' + user.lastName,
        role: user.role,
        token:
          config_1.default.client_port + '' + `/${emailType}?token=${token}`,
      },
    },
    emailTemplate,
  )
}
exports.sendMailWithToken = sendMailWithToken
