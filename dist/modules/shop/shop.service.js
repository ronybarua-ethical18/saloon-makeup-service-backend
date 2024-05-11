"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const shop_model_1 = __importDefault(require("./shop.model"));
const user_enum_1 = require("../../shared/enums/user.enum");
const pagination_1 = require("../../helpers/pagination");
const queryFieldsManipulation_1 = require("../../helpers/queryFieldsManipulation");
const createShop = async (loggedUser, shopPayload) => {
    if (loggedUser.role === user_enum_1.ENUM_USER_ROLE.SELLER) {
        const shop = await shop_model_1.default.findOneAndUpdate({ seller: loggedUser.userId }, { ...shopPayload }, { upsert: true, new: true, setDefaultsOnInsert: true });
        return shop;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You are not a seller');
    }
};
const getShop = async (shopId) => {
    const shop = await shop_model_1.default.findById({ _id: shopId });
    if (!shop) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Shop not found');
    }
    return shop;
};
const updateShop = async (loggedUser, shopId, updatePayload) => {
    const queryPayload = {
        _id: shopId,
    };
    if (loggedUser.role === user_enum_1.ENUM_USER_ROLE.SELLER) {
        queryPayload.seller = loggedUser.userId;
    }
    const shop = await shop_model_1.default.findOne(queryPayload);
    if (!shop) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Service not found');
    }
    const updateShop = await shop_model_1.default.findByIdAndUpdate({ _id: shopId }, { ...updatePayload }, { new: true });
    return updateShop;
};
const deleteShop = async (loggedUser, shopId) => {
    const queryPayload = {
        _id: shopId,
    };
    if (loggedUser.role === user_enum_1.ENUM_USER_ROLE.SELLER) {
        queryPayload.seller = loggedUser.userId;
    }
    const shop = await shop_model_1.default.findOneAndDelete(queryPayload);
    if (!shop) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Shop not found');
    }
};
const getAllShop = async (loggedUser, queryOptions, filterOptions) => {
    if (loggedUser.role === user_enum_1.ENUM_USER_ROLE.ADMIN ||
        loggedUser.role === user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN) {
        const queryPayload = {};
        const { searchTerm, ...filterableFields } = filterOptions;
        const { page, limit, skip, sortBy, sortOrder } = pagination_1.paginationHelpers.calculatePagination(queryOptions);
        const sortCondition = {};
        if (sortBy && sortOrder) {
            sortCondition[sortBy] = sortOrder;
        }
        const queriesWithFilterableFields = (0, queryFieldsManipulation_1.queryFieldsManipulation)(searchTerm, ['shopName', 'location'], filterableFields);
        if (queriesWithFilterableFields.length) {
            queryPayload.$and = queriesWithFilterableFields;
        }
        const shopList = await shop_model_1.default.find(queryPayload)
            .sort(sortCondition)
            .skip(skip)
            .limit(limit);
        const total = await shop_model_1.default.countDocuments();
        return {
            meta: {
                page,
                limit,
                total,
            },
            data: shopList,
        };
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You are not authorized');
    }
};
exports.ShopService = {
    createShop,
    getShop,
    getAllShop,
    updateShop,
    deleteShop,
};
