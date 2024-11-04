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
const stripe_accounts_interface_1 = require("./stripe_accounts.interface");
// Create the Mongoose Schema
const StripeAccountSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    userType: {
        type: String,
        enum: Object.values(stripe_accounts_interface_1.UserType),
        required: true,
    },
    stripeAccountId: {
        type: String,
        required: true,
        unique: true,
    },
    accountType: {
        type: String,
        enum: Object.values(stripe_accounts_interface_1.AccountType),
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(stripe_accounts_interface_1.StripeAccountStatus),
        default: stripe_accounts_interface_1.StripeAccountStatus.INACTIVE,
    },
    // New fields
    country: String,
    defaultCurrency: String,
    detailsSubmitted: Boolean,
    chargesEnabled: Boolean,
    payoutsEnabled: Boolean,
}, {
    timestamps: true,
});
StripeAccountSchema.index({ stripeAccountId: 1 }, { unique: true });
// Create the Mongoose Model
const StripeAccount = mongoose_1.default.model('StripeAccount', StripeAccountSchema);
exports.default = StripeAccount;
