"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const tryCatchAsync_1 = __importDefault(require("../../shared/tryCatchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const user_service_1 = require("./user.service");
const mongoose_1 = __importDefault(require("mongoose"));
const getAllUsers = (0, tryCatchAsync_1.default)(async (req, res) => {
    const loggedUser = req.user;
    const result = await user_service_1.UserService.getAllUsers(loggedUser);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All  users fetched successfully',
        data: result,
    });
});
const getUser = (0, tryCatchAsync_1.default)(async (req, res) => {
    if (typeof req.params.userId === 'string') {
        const result = await user_service_1.UserService.getUser(new mongoose_1.default.Types.ObjectId(req.params['userId']));
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Single user fetched successfully',
            data: result,
        });
    }
});
const updateUser = (0, tryCatchAsync_1.default)(async (req, res) => {
    if (typeof req.params.userId === 'string') {
        const result = await user_service_1.UserService.updateUser(new mongoose_1.default.Types.ObjectId(req.params['userId']), req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'User updated successfully',
            data: result,
        });
    }
});
const deleteUser = (0, tryCatchAsync_1.default)(async (req, res) => {
    const { userId } = req.params;
    await user_service_1.UserService.deleteUser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User deleted successfully',
    });
});
exports.UserController = {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
};
