/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import ApiError from '../../errors/ApiError'
import { JwtPayload } from 'jsonwebtoken'
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum'
import mongoose, { SortOrder } from 'mongoose'
import { paginationHelpers } from '../../helpers/pagination'
import {
  IFilterOptions,
  IGenericResponse,
  IPaginationOptions,
} from '../../shared/interfaces/common.interface'
import { queryFieldsManipulation } from '../../helpers/queryFieldsManipulation'
import { ITransactions } from './transactions.interface'
import Transaction from './transactions.model'
import { getTotals } from '../services/service.utils'

const createTransaction = async (
  payload: ITransactions,
): Promise<ITransactions> => {
  const transaction = await Transaction.create(payload)
  return transaction
}

const updateTransaction = async (
  paymentIntentId: string,
  updatePayload: object,
): Promise<ITransactions | null> => {

  console.log("update transaction payload from queue", updatePayload)
  const updateTransaction = await Transaction.findOneAndUpdate(
    { stripePaymentIntentId:paymentIntentId },
    { ...updatePayload },
    { new: true },
  )

  return updateTransaction
}

const deleteTransaction = async (
  transactionId: mongoose.Types.ObjectId,
): Promise<void> => {
  const transaction = await Transaction.findOneAndDelete(transactionId)

  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found')
  }
}

const getAllTransactions = async (
  loggedUser: JwtPayload,
  queryOptions: IPaginationOptions,
  filterOptions: IFilterOptions,
): Promise<IGenericResponse<ITransactions[]>> => {
  let queryPayload = {
    $or: [{ seller: loggedUser.userId }, { customer: loggedUser.userId }],
  } as any
  if (
    loggedUser.role === ENUM_USER_ROLE.ADMIN ||
    loggedUser.role === ENUM_USER_ROLE.SUPER_ADMIN
  ) {
    queryPayload = {}
  }
  const { searchTerm, ...filterableFields } = filterOptions
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(queryOptions)

  const sortCondition: { [key: string]: SortOrder } = {}

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder
  }

  const queriesWithFilterableFields = queryFieldsManipulation(
    searchTerm,
    [
      'paymentMethod',
      'transactionId',
      'stripePaymentIntentId',
      'status',
      'transactionType',
    ],
    filterableFields,
  )

  if (queriesWithFilterableFields.length > 0) {
    queryPayload.$and = queriesWithFilterableFields
  }

  const transactions = await Transaction.find(queryPayload)
    .populate([
      { path: 'customer', select: 'firstName lastName phone email' },
      { path: 'service', select: 'name' },
      { path: 'seller', select: 'email firstName' },
      {
        path: 'booking',
        select: 'bookingId',
      },
    ])
    .sort(sortCondition)
    .skip(skip)
    .limit(limit)

  console.log('queryPayload', queryPayload)
  const totals = await getTotals(
    Transaction as any,
    loggedUser?.role === 'seller'
      ? { seller: new mongoose.Types.ObjectId(loggedUser.userId) }
      : loggedUser?.role === 'customer'
        ? { customer: new mongoose.Types.ObjectId(loggedUser.userId) }
        : { status: { $in: ['pending', 'completed', 'refunded', 'failed'] } },
    ['pending', 'completed', 'refunded', 'failed'],
  )

  return {
    meta: {
      page,
      limit,
      total: totals?.total,
      totalPending: totals['pending'],
      totalCompleted: totals['completed'],
      totalRefunded: totals['refunded'],
      totalFailed: totals['failed'],
    },
    data: transactions,
  }
}

export const TransactionService = {
  createTransaction,
  updateTransaction,
  getAllTransactions,
  deleteTransaction,
}
