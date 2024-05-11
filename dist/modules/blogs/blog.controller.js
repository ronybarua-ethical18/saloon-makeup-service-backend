"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const tryCatchAsync_1 = __importDefault(require("../../shared/tryCatchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const blog_service_1 = require("./blog.service");
const createBlog = (0, tryCatchAsync_1.default)(async (req, res) => {
    const loggedUser = req.user;
    const result = await blog_service_1.BlogService.createBlog(loggedUser, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Blog is created successfully',
        data: result,
    });
});
const getAllBlogs = (0, tryCatchAsync_1.default)(async (_req, res) => {
    const result = await blog_service_1.BlogService.getAllBlogs();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All blogs fetched successfully',
        data: result,
    });
});
exports.BlogController = {
    createBlog,
    getAllBlogs,
};
