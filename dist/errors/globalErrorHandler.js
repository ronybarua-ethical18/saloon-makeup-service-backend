"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const handleValidationError_1 = __importDefault(require("./handleValidationError"));
const handleZodError_1 = __importDefault(require("./handleZodError"));
const ApiError_1 = __importDefault(require("./ApiError"));
const config_1 = __importDefault(require("../config"));
// import { errorLogger } from '../shared/logger'
const globalErrorHandler = (error, _req, res, next) => {
    config_1.default.env === 'development'
        ? console.log(`🐱‍🏍 globalErrorHandler ~~`, error)
        : console.log(`🐱‍🏍 globalErrorHandler ~~`, error);
    let statusCode = 500;
    let message = 'Something went wrong!';
    let errorMessages = [];
    if (error?.name === 'ValidationError') {
        const normalizeError = (0, handleValidationError_1.default)(error);
        statusCode = normalizeError?.statusCode;
        message = normalizeError.message;
        errorMessages = normalizeError.errorMessages;
    }
    else if (error instanceof zod_1.ZodError) {
        const normalizeError = (0, handleZodError_1.default)(error);
        statusCode = normalizeError?.statusCode;
        message = normalizeError.message;
        errorMessages = normalizeError.errorMessages;
    }
    else if (error instanceof ApiError_1.default) {
        ;
        (statusCode = error?.statusCode),
            (message = error?.message),
            (errorMessages = error?.message
                ? [
                    {
                        path: '',
                        message: error?.message,
                    },
                ]
                : []);
    }
    else if (error instanceof Error) {
        message = error?.message;
        errorMessages = error?.message
            ? [
                {
                    path: '',
                    message: error?.message,
                },
            ]
            : [];
    }
    res.status(statusCode).send({
        success: false,
        message,
        errorMessages,
        stack: config_1.default.env !== 'production' ? error?.stack : undefined,
    });
    next();
};
exports.default = globalErrorHandler;
