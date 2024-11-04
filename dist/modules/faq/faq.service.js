"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAQService = void 0;
const faq_model_1 = __importDefault(require("./faq.model"));
const createFAQ = async (requestPayload) => {
    const faq = await faq_model_1.default.create({
        ...requestPayload,
    });
    return faq;
};
const getAllFaqs = async () => {
    const faqs = await faq_model_1.default.find({});
    return faqs;
};
exports.FAQService = {
    createFAQ,
    getAllFaqs,
};
