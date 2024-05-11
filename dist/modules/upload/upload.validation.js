"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileZodSchema = void 0;
const zod_1 = require("zod");
const uploadFileSchema = zod_1.z.object({
    body: zod_1.z.object({
        img: zod_1.z.any(),
    }),
});
exports.uploadFileZodSchema = {
    uploadFileSchema,
};
