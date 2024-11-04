"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mail_trackers_interface_1 = require("./mail-trackers.interface");
const mailSchema = new mongoose_1.Schema({
    subject: {
        type: String,
        required: true,
    },
    recipient: {
        type: [String],
        required: true,
    },
    emailType: {
        type: String,
        enum: mail_trackers_interface_1.EmailTypes,
        required: true,
    },
    isMailSent: {
        type: Boolean,
        default: false,
    },
    essentialPayload: {
        user: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'user',
        },
        seller: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'user',
        },
        customer: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'user',
        },
        booking: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'booking',
        },
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('mail-tracker', mailSchema);
