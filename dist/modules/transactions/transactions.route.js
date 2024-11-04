"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionServiceRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_enum_1 = require("../../shared/enums/user.enum");
const transactions_controller_1 = require("./transactions.controller");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.CUSTOMER, user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN), transactions_controller_1.TransactionServiceController.createTransaction);
router.get('/', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.SELLER, user_enum_1.ENUM_USER_ROLE.ADMIN, user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN, user_enum_1.ENUM_USER_ROLE.CUSTOMER), transactions_controller_1.TransactionServiceController.getAllTransactions);
router.patch('/:transactionId', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.ADMIN, user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN), transactions_controller_1.TransactionServiceController.updateTransaction);
router.delete('/:transactionId', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN), transactions_controller_1.TransactionServiceController.deleteTransaction);
exports.TransactionServiceRoutes = router;
