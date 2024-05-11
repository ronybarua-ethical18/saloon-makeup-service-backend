"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_enum_1 = require("../../shared/enums/user.enum");
const feedback_controller_1 = require("./feedback.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const feedback_validation_1 = require("./feedback.validation");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.CUSTOMER), (0, validateRequest_1.default)(feedback_validation_1.FeedbackValidation.createFeedbackZodSchema), feedback_controller_1.FeedbackController.createFeedback);
router.get('/', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.ADMIN, user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN), feedback_controller_1.FeedbackController.getAllFeedbacks);
exports.FeedbackRoutes = router;
