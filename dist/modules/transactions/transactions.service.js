"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const user_enum_1 = require("../../shared/enums/user.enum");
const mongoose_1 = __importDefault(require("mongoose"));
const pagination_1 = require("../../helpers/pagination");
const queryFieldsManipulation_1 = require("../../helpers/queryFieldsManipulation");
const transactions_model_1 = __importDefault(require("./transactions.model"));
const service_utils_1 = require("../services/service.utils");
const createTransaction = async (payload) => {
    const transaction = await transactions_model_1.default.create(payload);
    return transaction;
};
const updateTransaction = async (paymentIntentId, updatePayload) => {
    console.log("update transaction payload from queue", updatePayload);
    const updateTransaction = await transactions_model_1.default.findOneAndUpdate({ stripePaymentIntentId: paymentIntentId }, { ...updatePayload }, { new: true });
    return updateTransaction;
};
const deleteTransaction = async (transactionId) => {
    const transaction = await transactions_model_1.default.findOneAndDelete(transactionId);
    if (!transaction) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Transaction not found');
    }
};
const getAllTransactions = async (loggedUser, queryOptions, filterOptions) => {
    let queryPayload = {
        $or: [{ seller: loggedUser.userId }, { customer: loggedUser.userId }],
    };
    if (loggedUser.role === user_enum_1.ENUM_USER_ROLE.ADMIN ||
        loggedUser.role === user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN) {
        queryPayload = {};
    }
    const { searchTerm, ...filterableFields } = filterOptions;
    const { page, limit, skip, sortBy, sortOrder } = pagination_1.paginationHelpers.calculatePagination(queryOptions);
    const sortCondition = {};
    if (sortBy && sortOrder) {
        sortCondition[sortBy] = sortOrder;
    }
    const queriesWithFilterableFields = (0, queryFieldsManipulation_1.queryFieldsManipulation)(searchTerm, [
        'paymentMethod',
        'transactionId',
        'stripePaymentIntentId',
        'status',
        'transactionType',
    ], filterableFields);
    if (queriesWithFilterableFields.length > 0) {
        queryPayload.$and = queriesWithFilterableFields;
    }
    const transactions = await transactions_model_1.default.find(queryPayload)
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
        .limit(limit);
    console.log('queryPayload', queryPayload);
    const totals = await (0, service_utils_1.getTotals)(transactions_model_1.default, loggedUser?.role === 'seller'
        ? { seller: new mongoose_1.default.Types.ObjectId(loggedUser.userId) }
        : loggedUser?.role === 'customer'
            ? { customer: new mongoose_1.default.Types.ObjectId(loggedUser.userId) }
            : { status: { $in: ['pending', 'completed', 'refunded', 'failed'] } }, ['pending', 'completed', 'refunded', 'failed']);
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
    };
};
exports.TransactionService = {
    createTransaction,
    updateTransaction,
    getAllTransactions,
    deleteTransaction,
};
