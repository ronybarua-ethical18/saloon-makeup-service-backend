"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const tryCatchAsync_1 = __importDefault(require("../../shared/tryCatchAsync"));
const config_1 = __importDefault(require("../../config"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const signUpUser = (0, tryCatchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthService.signUpUser(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Email verification link has been sent',
        data: result,
    });
});
const verifyEmail = (0, tryCatchAsync_1.default)(async (req, res) => {
    const { token } = req.body;
    await auth_service_1.AuthService.verifyEmail(token);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Email is verified successfully',
    });
});
const forgotPassword = (0, tryCatchAsync_1.default)(async (req, res) => {
    const { email } = req.body;
    await auth_service_1.AuthService.forgotPassword(email);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Verify your email to reset your password',
    });
});
const resetPassword = (0, tryCatchAsync_1.default)(async (req, res) => {
    await auth_service_1.AuthService.resetPassword(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Password is set successfully',
    });
});
const loginUser = (0, tryCatchAsync_1.default)(async (req, res) => {
    const { ...loginData } = req.body;
    const result = await auth_service_1.AuthService.loginUser(loginData);
    const { refreshToken } = result;
    // set refresh token into cookie
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    res.cookie('accessToken', result.accessToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User logged in successfully !',
        data: result,
    });
});
const refreshToken = (0, tryCatchAsync_1.default)(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await auth_service_1.AuthService.refreshToken(refreshToken);
    // set refresh token into cookie
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'New access token is generated!',
        data: result,
    });
});
exports.AuthController = {
    loginUser,
    signUpUser,
    refreshToken,
    verifyEmail,
    forgotPassword,
    resetPassword,
};
