"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_enum_1 = require("../../shared/enums/user.enum");
const blog_controller_1 = require("./blog.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const blog_validation_1 = require("./blog.validation");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.ADMIN, user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(blog_validation_1.BlogValidation.createBlogZodSchema), blog_controller_1.BlogController.createBlog);
router.get('/', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.ADMIN, user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN), blog_controller_1.BlogController.getAllBlogs);
exports.BlogRoutes = router;
