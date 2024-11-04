"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionType = exports.PaymentMethod = exports.AmountStatus = void 0;
var AmountStatus;
(function (AmountStatus) {
    AmountStatus["PENDING"] = "pending";
    AmountStatus["COMPLETED"] = "completed";
    AmountStatus["REFUNDED"] = "refunded";
    AmountStatus["FAILED"] = "failed";
})(AmountStatus || (exports.AmountStatus = AmountStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CARD"] = "card";
    PaymentMethod["PAYPAL"] = "paypal";
    PaymentMethod["WALLET"] = "wallet";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["PAYMENT"] = "payment";
    TransactionType["REFUND"] = "refund";
    TransactionType["PAYOUT"] = "payout";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
