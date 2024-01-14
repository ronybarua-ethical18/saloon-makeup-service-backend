import express from 'express'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum'
import { ShopController } from './shop.controller'
import validateRequest from '../../middlewares/validateRequest'
import { ShopZodSchema } from './shop.validation'
const router = express.Router()

router.post(
  '/',
  auth(ENUM_USER_ROLE.SELLER),
  validateRequest(ShopZodSchema.createShopZodSchema),
  ShopController.createShop,
)

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  ShopController.getAllShop,
)

router.get(
  '/:shopId',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.SELLER),
  ShopController.getShop,
)

router.patch(
  '/:shopId',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.SELLER),
  ShopController.updateShop,
)

router.delete(
  '/:shopId',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  ShopController.deleteShop,
)

export const ShopRoutes = router
