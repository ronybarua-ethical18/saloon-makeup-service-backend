"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
/* eslint-disable @typescript-eslint/no-this-alias */
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const UserSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    role: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
    },
    bio: {
        type: String,
    },
    password: {
        type: String,
        required: true,
        //   select: false
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    img: {
        type: String,
    },
}, {
    timestamps: true,
});
UserSchema.statics.isEmailTaken = async function (email) {
    return await this.findOne({ email: email });
};
UserSchema.statics.isPasswordMatched = async function (givenPassword, savedPassword) {
    return await bcrypt_1.default.compare(givenPassword, savedPassword);
};
UserSchema.pre('save', async function (next) {
    // hashing user password
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = this; // Added type assertion
    user.password = await bcrypt_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
    next();
});
exports.UserModel = (0, mongoose_1.model)('user', UserSchema);
