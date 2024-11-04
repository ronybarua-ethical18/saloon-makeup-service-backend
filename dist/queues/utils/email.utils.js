"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailDispatch = exports.emailPayloadsByUser = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const mail_trackers_model_1 = __importDefault(require("../../modules/mail-trackers/mail-trackers.model"));
const constants_1 = require("../../services/mail/constants");
const sendMail_1 = __importDefault(require("../../services/mail/sendMail"));
const mail_trackers_interface_1 = require("../../modules/mail-trackers/mail-trackers.interface");
const emailPayloadsByUser = (ownerPayload, sellerPayload, customerPayload) => {
    const mailTrackerPayload = {
        seller: sellerPayload?.sellerId,
        customer: customerPayload?.customerId,
        booking: customerPayload?.bookingId,
    };
    return [
        {
            id: 1,
            sendTo: 'owner',
            subject: 'StyleVibe - Payment disbursement ',
            targetEmail: 'ronybarua.ethical18@gmail.com',
            payload: ownerPayload,
            template: constants_1.PAYMENT_DISBURSEMENT_OWNER,
            emailType: mail_trackers_interface_1.EmailTypes.PAYMENT_DISBURSEMENT_PLATFORM,
            mailTrackerPayload,
        },
        {
            id: 2,
            sendTo: 'seller',
            subject: 'StyleVibe - Payment disbursement for a booking',
            targetEmail: sellerPayload?.sellerEmail,
            payload: sellerPayload,
            template: constants_1.PAYMENT_DISBURSEMENT_SELLER,
            emailType: mail_trackers_interface_1.EmailTypes.PAYMENT_DISBURSEMENT_SELLER,
            mailTrackerPayload,
        },
        {
            id: 3,
            sendTo: 'customer',
            subject: 'StyleVibe - Service Completion Notification',
            targetEmail: customerPayload?.customerEmail,
            payload: customerPayload,
            template: constants_1.SERVICE_COMPLETION_CUSTOMER,
            emailType: mail_trackers_interface_1.EmailTypes.SERVICE_COMPLETION_EMAIL,
            mailTrackerPayload,
        },
    ];
};
exports.emailPayloadsByUser = emailPayloadsByUser;
const emailDispatch = async (email, payload, template, subject, emailType, essentialPayload) => {
    try {
        await (0, sendMail_1.default)([email, 'ronybarua.business23@gmail.com'], {
            subject: subject,
            data: payload,
        }, template);
        await mail_trackers_model_1.default.create({
            subject: subject,
            recipient: [email],
            emailType: emailType,
            isMailSent: true,
            essentialPayload,
        });
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Something went wrong with sending mail');
    }
};
exports.emailDispatch = emailDispatch;
