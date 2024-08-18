import express from 'express'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum'
import { ShopTimeSlotsController } from './shop_timeslots.controller'
import validateRequest from '../../middlewares/validateRequest'
import { ShopTimeSlotsValidation } from './shop_timeslots.validation'
const router = express.Router()

router.post(
  '/',
  auth(ENUM_USER_ROLE.SELLER),
  validateRequest(ShopTimeSlotsValidation.createShopTimeSlotsZodSchema),
  ShopTimeSlotsController.createShopTimeSlots,
)
router.get(
  '/:shopId',
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.CUSTOMER),
  ShopTimeSlotsController.getSingleShopTimeSlots,
)

export const ShopTimeSlotRoutes = router
