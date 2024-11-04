"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailConfig_1 = __importDefault(require("./mailConfig"));
const sendEmail = async (receiverEmail, context, template) => {
    try {
        const reports = await mailConfig_1.default.sendMail({
            from: '"Style Vibe Portal"',
            to: receiverEmail,
            subject: context.subject,
            template: template,
            context: context.data,
        });
        console.log(reports);
    }
    catch (err) {
        console.log(err);
        console.log('EMAIL SEND FAILED');
    }
};
exports.default = sendEmail;
