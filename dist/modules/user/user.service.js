"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../user/user.model");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const user_enum_1 = require("../../shared/enums/user.enum");
const shop_model_1 = __importDefault(require("../shop/shop.model"));
const stripe_accounts_model_1 = __importDefault(require("../stripe_accounts/stripe_accounts.model"));
const stripe_accounts_service_1 = require("../stripe_accounts/stripe_accounts.service");
const getUser = async (userId) => {
    const user = await user_model_1.UserModel.findById({ _id: userId })
        .lean()
        .select('-password');
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const responsePayload = {
        ...user,
    };
    if (user.role === user_enum_1.ENUM_USER_ROLE.SELLER) {
        const shop = await shop_model_1.default.findOne({ seller: user._id });
        const stripeAccount = await stripe_accounts_model_1.default.findOne({ user: user._id });
        if (stripeAccount) {
            const result = await stripe_accounts_service_1.StripeAccountService.getStripeAccountDetails(stripeAccount.stripeAccountId);
            const stripeAccountDetails = {
                country: result?.accountDetails?.country,
                currency: result?.accountDetails?.default_currency,
                stripeAccountId: result?.accountDetails?.id,
                bankName: result?.accountDetails?.external_accounts?.data?.[0]?.object ===
                    'bank_account'
                    ? result.accountDetails.external_accounts
                        .data[0].bank_name
                    : null,
                balance: result?.balanceDetails?.instant_available?.[0]?.amount
                    ? result.balanceDetails.instant_available[0].amount / 100
                    : result.balanceDetails.available?.[0]?.amount / 100,
            };
            responsePayload.stripeAccountDetails = stripeAccountDetails;
        }
        if (shop) {
            responsePayload.shop = shop;
        }
    }
    return responsePayload;
};
const updateUser = async (userId, updatePayload) => {
    const updatedUser = await user_model_1.UserModel.findByIdAndUpdate(userId, updatePayload, {
        new: true,
        runValidators: true,
    });
    if (!updatedUser) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    console.log('updated user', updatedUser);
    return updatedUser;
};
const deleteUser = async (userId) => {
    const user = await user_model_1.UserModel.findById({ _id: userId });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    await user_model_1.UserModel.findByIdAndDelete({ _id: user._id });
};
const getAllUsers = async (loggedUser) => {
    const admin = await user_model_1.UserModel.findOne({
        _id: loggedUser.userId,
        role: { $in: [user_enum_1.ENUM_USER_ROLE.ADMIN, user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN] },
    });
    if (admin) {
        return await user_model_1.UserModel.find({});
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You are not authorized');
    }
};
exports.UserService = {
    getUser,
    getAllUsers,
    updateUser,
    deleteUser,
};
