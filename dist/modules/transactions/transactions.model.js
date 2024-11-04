"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const transactions_interface_1 = require("./transactions.interface");
// Helper function to format numbers with two decimal places
const formatNumber = (value) => {
    return Math.round(value * 100) / 100;
};
// Create the Mongoose Schema
const TransactionsSchema = new mongoose_1.default.Schema({
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    seller: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    service: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'service',
        required: true,
    },
    booking: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'booking',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    stripeProcessingFee: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(transactions_interface_1.AmountStatus),
        default: transactions_interface_1.AmountStatus.PENDING,
    },
    stripePaymentIntentId: {
        type: String,
        required: true,
    },
    transactionType: {
        type: String,
        enum: Object.values(transactions_interface_1.TransactionType),
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: Object.values(transactions_interface_1.PaymentMethod),
        required: true,
    },
    sellerAmount: {
        type: Number,
        default: 0,
    },
    applicationFee: {
        type: Number,
        default: 0,
    },
    isPaymentDisbursed: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// Pre-save hook to format all number fields
TransactionsSchema.pre('save', function (next) {
    const transaction = this;
    // Format the number fields with two decimal places
    transaction.amount = formatNumber(transaction.amount);
    transaction.stripeProcessingFee = formatNumber(transaction.stripeProcessingFee);
    transaction.sellerAmount = formatNumber(transaction.sellerAmount);
    transaction.applicationFee = formatNumber(transaction.applicationFee);
    next();
});
TransactionsSchema.index({ stripePaymentIntentId: 1 }, { unique: true });
// Create the Mongoose Model
const Transaction = mongoose_1.default.model('transactions', TransactionsSchema);
exports.default = Transaction;
