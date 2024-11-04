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
const booking_interface_1 = require("./booking.interface");
const bookingSchema = new mongoose_1.default.Schema({
    bookingId: {
        type: String,
        requried: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    customer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'user', required: true },
    seller: { type: mongoose_1.Schema.Types.ObjectId, ref: 'user', required: true },
    shop: { type: mongoose_1.Schema.Types.ObjectId, ref: 'shop', required: true },
    serviceId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'service', required: true },
    serviceStartTime: { type: String, required: true },
    shopTimeSlot: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'shopTimeSlot',
        required: true,
    },
    status: {
        type: String,
        enum: booking_interface_1.BookingStatusList,
        default: booking_interface_1.BookingStatusList.BOOKED,
    },
}, { timestamps: true });
// Pre-save hook to format all number fields
bookingSchema.pre('save', function (next) {
    const booking = this;
    // Format the number fields with two decimal places
    booking.totalAmount = Math.round(booking.totalAmount * 100) / 100;
    next();
});
// Create and export the mongoose model
const BookingModel = mongoose_1.default.model('booking', bookingSchema);
exports.default = BookingModel;
