"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_enum_1 = require("../../shared/enums/user.enum");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const booking_validation_1 = require("./booking.validation");
const booking_controller_1 = require("./booking.controller");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.CUSTOMER), (0, validateRequest_1.default)(booking_validation_1.BookingValidation.createBookingZodSchema), booking_controller_1.BookingController.createBooking);
router.get('/', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.SELLER, user_enum_1.ENUM_USER_ROLE.ADMIN, user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN, user_enum_1.ENUM_USER_ROLE.CUSTOMER), booking_controller_1.BookingController.getAllBookings);
router.get('/:bookingId', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.SELLER, user_enum_1.ENUM_USER_ROLE.ADMIN, user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN, user_enum_1.ENUM_USER_ROLE.CUSTOMER), booking_controller_1.BookingController.getBooking);
router.patch('/:serviceId', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.SELLER, user_enum_1.ENUM_USER_ROLE.ADMIN, user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN, user_enum_1.ENUM_USER_ROLE.CUSTOMER), booking_controller_1.BookingController.updateBooking);
router.delete('/:serviceId', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.SELLER, user_enum_1.ENUM_USER_ROLE.ADMIN, user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN), booking_controller_1.BookingController.deleteBooking);
exports.BookingRoutes = router;
