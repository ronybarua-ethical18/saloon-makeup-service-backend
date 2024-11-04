"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaloonService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const service_interface_1 = require("./service.interface");
const service_model_1 = require("./service.model");
const user_enum_1 = require("../../shared/enums/user.enum");
const mongoose_1 = require("mongoose");
const pagination_1 = require("../../helpers/pagination");
const queryFieldsManipulation_1 = require("../../helpers/queryFieldsManipulation");
const shop_model_1 = __importDefault(require("../shop/shop.model"));
const service_utils_1 = require("./service.utils");
const createService = async (loggedUser, servicePayload) => {
    if (loggedUser.role === user_enum_1.ENUM_USER_ROLE.SELLER) {
        const standardizedServiceName = servicePayload.name.toLowerCase();
        // check if the seller has shop or not
        const shop = await shop_model_1.default.findOne({ seller: loggedUser.userId });
        console.log('shop', shop);
        console.log('logged user', loggedUser);
        // Check if a service with a case-insensitive name already exists
        const existingService = await service_model_1.ServiceModel.findOne({
            name: { $regex: new RegExp('^' + standardizedServiceName + '$', 'i') },
        });
        if (existingService) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Service already created with the name');
        }
        const createdService = await service_model_1.ServiceModel.create({
            ...servicePayload,
            shop: shop?._id,
            seller: loggedUser.userId,
        });
        return createdService;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You are not a seller');
    }
};
const getService = async (serviceId) => {
    const service = await service_model_1.ServiceModel.findById({ _id: serviceId }).populate('shop');
    if (!service) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Service not found');
    }
    return service;
};
const updateService = async (loggedUser, serviceId, updatePayload) => {
    console.log('updatePayload', updatePayload);
    const queryPayload = {
        _id: serviceId,
    };
    if (loggedUser.role === user_enum_1.ENUM_USER_ROLE.SELLER) {
        queryPayload.seller = loggedUser.userId;
    }
    const service = await service_model_1.ServiceModel.findOne(queryPayload);
    if (!service) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Service not found');
    }
    const updateService = await service_model_1.ServiceModel.findByIdAndUpdate({ _id: serviceId }, { ...updatePayload }, { new: true });
    return updateService;
};
const deleteService = async (loggedUser, serviceId) => {
    const queryPayload = {
        _id: serviceId,
    };
    if (loggedUser.role === user_enum_1.ENUM_USER_ROLE.SELLER) {
        queryPayload.seller = loggedUser.userId;
    }
    const service = await service_model_1.ServiceModel.findOneAndDelete(queryPayload);
    if (!service) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Service not found');
    }
};
const getAllServices = async (loggedUser, queryOptions, filterOptions) => {
    let queryPayload = { seller: loggedUser.userId };
    if (loggedUser.role === user_enum_1.ENUM_USER_ROLE.ADMIN ||
        loggedUser.role === user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN) {
        queryPayload = {};
    }
    const { searchTerm, ...filterableFields } = filterOptions;
    const { page, limit, skip, sortBy, sortOrder } = pagination_1.paginationHelpers.calculatePagination(queryOptions);
    const sortCondition = {};
    if (sortBy && sortOrder) {
        sortCondition[sortBy] = sortOrder;
    }
    const queriesWithFilterableFields = (0, queryFieldsManipulation_1.queryFieldsManipulation)(searchTerm, ['name', 'category', 'subCategory', 'status'], filterableFields);
    if (queriesWithFilterableFields.length > 0) {
        queryPayload.$and = queriesWithFilterableFields;
    }
    console.log('filterOptions', filterOptions);
    const services = await service_model_1.ServiceModel.find(queryPayload)
        .populate('shop', 'shopName')
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);
    const totals = await (0, service_utils_1.getTotals)(service_model_1.ServiceModel, { seller: new mongoose_1.Types.ObjectId(loggedUser.userId) }, ['APPROVED', 'PENDING', 'REJECTED']);
    return {
        meta: {
            page,
            limit,
            total: totals?.total,
            totalApproved: totals['APPROVED'],
            totalPending: totals['PENDING'],
            totalRejected: totals['REJECTED'],
        },
        data: services,
    };
};
const getTopServices = async (queryOptions) => {
    const { page, limit } = pagination_1.paginationHelpers.calculatePagination(queryOptions);
    const services = await service_model_1.ServiceModel.find({
        status: service_interface_1.ServiceStatusList.APPROVED,
    })
        .sort({ updatedAt: -1 })
        .populate('shop', 'shopName serviceTime')
        .limit(limit);
    const totals = await (0, service_utils_1.getTotals)(service_model_1.ServiceModel, {}, [
        'PENDING',
        'APPROVED',
        'REJECTED',
    ]);
    return {
        meta: {
            page,
            limit,
            total: totals?.total,
        },
        data: services,
    };
};
exports.SaloonService = {
    createService,
    getService,
    updateService,
    deleteService,
    getAllServices,
    getTopServices,
};
