"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = exports.resetPassword = void 0;
const http_status_1 = __importDefault(require("http-status"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../user/user.model");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../config"));
const constants_1 = require("../../services/mail/constants");
const auth_utils_1 = require("../../utils/auth.utils");
const signUpUser = async (payload) => {
    const { email } = payload;
    const user = await user_model_1.UserModel.isEmailTaken(email);
    if (user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User already exist');
    }
    const newUser = await user_model_1.UserModel.create(payload);
    (0, auth_utils_1.sendMailWithToken)(newUser, 'StyleVibe - Verify your e-mail', 'verify-email', constants_1.VERIFY_EMAIL_TEMPLATE);
    return newUser;
};
const loginUser = async (payload) => {
    const { email, password } = payload;
    const user = (await user_model_1.UserModel.findOne({ email: email })) || null;
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    if (!user.isVerified) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User is not verified yet');
    }
    const isPasswordMatched = await user_model_1.UserModel.isPasswordMatched(password, user.password);
    if (!isPasswordMatched) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect');
    }
    const tokenPayload = {
        userId: user?._id,
        role: user?.role,
        firstName: user?.firstName,
        lastName: user?.lastName,
    };
    const accessToken = jwtHelpers_1.jwtHelpers.createToken(tokenPayload, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    // create refresh token
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken(tokenPayload, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
};
const refreshToken = async (token) => {
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
        const { userId } = verifiedToken;
        const user = await user_model_1.UserModel.findById({ _id: userId });
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
        }
        const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({
            id: user._id,
            role: user.role,
        }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
        return {
            accessToken: newAccessToken,
        };
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
};
const verifyEmail = async (token) => {
    console.log('token', token);
    const { userId } = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    const user = await user_model_1.UserModel.findById({ _id: userId });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    await user_model_1.UserModel.findByIdAndUpdate(user._id, {
        isVerified: true,
    });
};
const forgotPassword = async (email) => {
    const user = await user_model_1.UserModel.findOne({ email: email });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    (0, auth_utils_1.sendMailWithToken)(user, 'StyleVibe - Password Reset', 'reset-password', constants_1.FORGOT_PASSWORD_TEMPLATE);
    return user;
};
const resetPassword = async (payload) => {
    const { userId } = await jwtHelpers_1.jwtHelpers.verifyToken(payload.token, config_1.default.jwt.secret);
    const user = await user_model_1.UserModel.findById({ _id: userId });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    const hash = await bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    await user_model_1.UserModel.findByIdAndUpdate(user._id, {
        password: hash,
    });
};
exports.resetPassword = resetPassword;
exports.AuthService = {
    loginUser,
    refreshToken,
    signUpUser,
    verifyEmail,
    forgotPassword,
    resetPassword: exports.resetPassword,
};
