"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaloonServiceRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_enum_1 = require("../../shared/enums/user.enum");
const service_controller_1 = require("./service.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const service_validation_1 = require("./service.validation");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.SELLER), (0, validateRequest_1.default)(service_validation_1.ServiceValidation.ServiceZodSchema), service_controller_1.SaloonServiceController.createService);
router.post('/update-many', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN, user_enum_1.ENUM_USER_ROLE.ADMIN), service_controller_1.SaloonServiceController.updateManyServices);
router.get('/', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.SELLER, user_enum_1.ENUM_USER_ROLE.ADMIN, user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN), service_controller_1.SaloonServiceController.getAllServices);
router.get('/top', service_controller_1.SaloonServiceController.getTopServices);
router.get('/:serviceId', 
// auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
service_controller_1.SaloonServiceController.getService);
router.patch('/:serviceId', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.SELLER, user_enum_1.ENUM_USER_ROLE.ADMIN, user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN), service_controller_1.SaloonServiceController.updateService);
router.delete('/:serviceId', (0, auth_1.default)(user_enum_1.ENUM_USER_ROLE.SELLER, user_enum_1.ENUM_USER_ROLE.ADMIN, user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN), service_controller_1.SaloonServiceController.deleteService);
exports.SaloonServiceRoutes = router;
