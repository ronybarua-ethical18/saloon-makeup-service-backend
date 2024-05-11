"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const blog_model_1 = __importDefault(require("./blog.model"));
const createBlog = async (loggedUser, requestPayload) => {
    const blog = await blog_model_1.default.create({
        ...requestPayload,
        author: loggedUser.userId,
    });
    return blog;
};
const getAllBlogs = async () => {
    const blogs = await blog_model_1.default.find({});
    return blogs;
};
exports.BlogService = {
    createBlog,
    getAllBlogs,
};
