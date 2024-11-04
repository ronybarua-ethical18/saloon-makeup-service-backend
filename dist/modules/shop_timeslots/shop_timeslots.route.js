"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopTimeSlotRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_enum_1 = require("../../shared/enums/user.enum");
const shop_timeslots_controller_1 = require("./shop_timeslots.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const shop_timeslots_validation_1 = require("./shop_timeslots.validation");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.SELLER), (0, validateRequest_1.default)(shop_timeslots_validation_1.ShopTimeSlotsValidation.createShopTimeSlotsZodSchema), shop_timeslots_controller_1.ShopTimeSlotsController.createShopTimeSlots);
router.get('/:shopId', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.SELLER, user_enum_1.ENUM_USER_ROLE.CUSTOMER), shop_timeslots_controller_1.ShopTimeSlotsController.getSingleShopTimeSlots);
exports.ShopTimeSlotRoutes = router;
