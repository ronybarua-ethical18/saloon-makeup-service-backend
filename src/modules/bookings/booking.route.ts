import express from 'express'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum'
import { SaloonServiceController } from './booking.controller'
import validateRequest from '../../middlewares/validateRequest'
import { ServiceValidation } from './booking.validation'
const router = express.Router()

router.post(
  '/',
  auth(ENUM_USER_ROLE.SELLER),
  validateRequest(ServiceValidation.ServiceZodSchema),
  SaloonServiceController.createService,
)

router.get(
  '/',
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  SaloonServiceController.getAllServices,
)

router.get(
  '/:serviceId',
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  SaloonServiceController.getService,
)

router.patch(
  '/:serviceId',
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  SaloonServiceController.updateService,
)

router.delete(
  '/:serviceId',
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  SaloonServiceController.deleteService,
)

export const SaloonServiceRoutes = router
