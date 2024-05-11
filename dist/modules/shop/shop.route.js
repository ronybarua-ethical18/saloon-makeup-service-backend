"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_enum_1 = require("../../shared/enums/user.enum");
const shop_controller_1 = require("./shop.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const shop_validation_1 = require("./shop.validation");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.SELLER), (0, validateRequest_1.default)(shop_validation_1.ShopZodSchema.createShopZodSchema), shop_controller_1.ShopController.createShop);
router.get('/', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.ADMIN, user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN), shop_controller_1.ShopController.getAllShop);
router.get('/:shopId', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.ADMIN, user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN, user_enum_1.ENUM_USER_ROLE.SELLER), shop_controller_1.ShopController.getShop);
router.patch('/:shopId', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.ADMIN, user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN, user_enum_1.ENUM_USER_ROLE.SELLER), shop_controller_1.ShopController.updateShop);
router.delete('/:shopId', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.ADMIN, user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN), shop_controller_1.ShopController.deleteShop);
exports.ShopRoutes = router;
