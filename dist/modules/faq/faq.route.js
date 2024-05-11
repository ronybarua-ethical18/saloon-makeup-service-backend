'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.FAQRoutes = void 0
const express_1 = __importDefault(require('express'))
const auth_1 = __importDefault(require('../../middlewares/auth'))
const user_enum_1 = require('../../shared/enums/user.enum')
const faq_controller_1 = require('./faq.controller')
const router = express_1.default.Router()
router.post(
  '/',
  (0, auth_1.default)(
    user_enum_1.ENUM_USER_ROLE.ADMIN,
    user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN,
  ),
  faq_controller_1.FAQController.createFAQ,
)
router.get(
  '/',
  (0, auth_1.default)(
    user_enum_1.ENUM_USER_ROLE.ADMIN,
    user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN,
  ),
  faq_controller_1.FAQController.getAllFaqs,
)
exports.FAQRoutes = router
