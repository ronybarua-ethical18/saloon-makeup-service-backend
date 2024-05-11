"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackService = void 0;
const feedback_model_1 = __importDefault(require("./feedback.model"));
const createFeedback = async (loggedUser, requestPayload) => {
    const feedback = await feedback_model_1.default.create({
        ...requestPayload,
        user: loggedUser.userId,
    });
    return feedback;
};
const getAllFeedbacks = async () => {
    const feedbacks = await feedback_model_1.default.find({}).populate('user', '-password');
    return feedbacks;
};
exports.FeedbackService = {
    createFeedback,
    getAllFeedbacks,
};
