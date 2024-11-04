"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionServiceController = void 0;
const tryCatchAsync_1 = __importDefault(require("../../shared/tryCatchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const mongoose_1 = __importDefault(require("mongoose"));
const pick_1 = __importDefault(require("../../shared/pick"));
const pagination_1 = require("../../constants/pagination");
const transactions_service_1 = require("./transactions.service");
const transaction_constants_1 = require("./transaction.constants");
const createTransaction = (0, tryCatchAsync_1.default)(async (req, res) => {
    const result = await transactions_service_1.TransactionService.createTransaction(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'New transaction created successfully',
        data: result,
    });
});
const getAllTransactions = (0, tryCatchAsync_1.default)(async (req, res) => {
    const loggedUser = req.user;
    const filterOptions = (0, pick_1.default)(req.query, transaction_constants_1.filterableFields);
    const queryOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = await transactions_service_1.TransactionService.getAllTransactions(loggedUser, queryOptions, filterOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All transactions fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});
const updateTransaction = (0, tryCatchAsync_1.default)(async (req, res) => {
    const paymentIntentId = 'sfjkshkfsdf';
    const result = await transactions_service_1.TransactionService.updateTransaction(paymentIntentId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Transaction updated successfully',
        data: result,
    });
});
const deleteTransaction = (0, tryCatchAsync_1.default)(async (req, res) => {
    if (typeof req.params.serviceId === 'string') {
        await transactions_service_1.TransactionService.deleteTransaction(new mongoose_1.default.Types.ObjectId(req.params['serviceId']));
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Transaction deleted successfully',
        });
    }
});
exports.TransactionServiceController = {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getAllTransactions,
};
