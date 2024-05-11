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
const getUser = async (userId) => {
    const user = await user_model_1.UserModel.findById({ _id: userId });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    return user;
};
const updateUser = async (userId, updatePayload) => {
    const user = await user_model_1.UserModel.findById({ _id: userId });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const updatedUser = await user_model_1.UserModel.findByIdAndUpdate({ _id: user._id }, { ...updatePayload }, { new: true });
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
