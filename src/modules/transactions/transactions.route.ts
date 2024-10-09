import express from 'express'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum'
import { TransactionServiceController } from './transactions.controller'
const router = express.Router()

router.post(
  '/',
  auth(ENUM_USER_ROLE.CUSTOMER, ENUM_USER_ROLE.SUPER_ADMIN),
  TransactionServiceController.createTransaction,
)

router.get(
  '/',
  auth(
    ENUM_USER_ROLE.SELLER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.CUSTOMER,
  ),
  TransactionServiceController.getAllTransactions,
)

router.patch(
  '/:transactionId',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  TransactionServiceController.updateTransaction,
)

router.delete(
  '/:transactionId',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  TransactionServiceController.deleteTransaction,
)

export const TransactionServiceRoutes = router
