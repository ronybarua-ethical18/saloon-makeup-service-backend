'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.uploadRoute = void 0
const express_1 = __importDefault(require('express'))
// import auth from '../../middlewares/auth'
// import { ENUM_USER_ROLE } from '../../shared/enums/user.enum'
const validateRequest_1 = __importDefault(
  require('../../middlewares/validateRequest'),
)
const upload_controller_1 = __importDefault(require('./upload.controller'))
const upload_validation_1 = require('./upload.validation')
const upload_1 = __importDefault(require('../../middlewares/upload'))
const router = express_1.default.Router()
router.post(
  '/',
  //   auth(
  //     ENUM_USER_ROLE.SELLER,
  //     ENUM_USER_ROLE.CUSTOMER,
  //     ENUM_USER_ROLE.ADMIN,
  //     ENUM_USER_ROLE.SUPER_ADMIN,
  //   ),
  (0, validateRequest_1.default)(
    upload_validation_1.uploadFileZodSchema.uploadFileSchema,
  ),
  upload_1.default.single('img'),
  upload_controller_1.default,
)
exports.uploadRoute = router
