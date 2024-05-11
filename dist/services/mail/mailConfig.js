"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
const viewEngine_1 = __importDefault(require("./viewEngine"));
const config_1 = __importDefault(require("../../config"));
// mail sender
const transporterOptions = {
    host: config_1.default.smtp_host,
    port: Number(config_1.default.smtp_port),
    auth: {
        user: config_1.default.smtp_user,
        pass: config_1.default.smtp_password,
    },
    tls: {
        rejectUnauthorized: false,
    },
};
const transporter = nodemailer_1.default.createTransport(transporterOptions);
// Use compile instead of use for setting up handlebars
transporter.use('compile', (0, nodemailer_express_handlebars_1.default)(viewEngine_1.default));
exports.default = transporter;
