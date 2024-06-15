"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaloonService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const service_model_1 = require("./service.model");
const user_enum_1 = require("../../shared/enums/user.enum");
const pagination_1 = require("../../helpers/pagination");
const queryFieldsManipulation_1 = require("../../helpers/queryFieldsManipulation");
const workerHandler_1 = require("../../workers/workerHandler");
const createService = async (loggedUser, servicePayload) => {
    if (loggedUser.role === user_enum_1.ENUM_USER_ROLE.SELLER) {
        const standardizedServiceName = servicePayload.name.toLowerCase();
        // Check if a service with a case-insensitive name already exists
        const existingService = await service_model_1.ServiceModel.findOne({
            name: { $regex: new RegExp('^' + standardizedServiceName + '$', 'i') },
        });
        if (existingService) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Service already created with the name');
        }
        const createdService = await service_model_1.ServiceModel.create({
            ...servicePayload,
            seller: loggedUser.userId,
        });
        return createdService;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You are not a seller');
    }
};
const getService = async (serviceId) => {
    const service = await service_model_1.ServiceModel.findById({ _id: serviceId });
    if (!service) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Service not found');
    }
    return service;
};
const updateService = async (loggedUser, serviceId, updatePayload) => {
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
    const queriesWithFilterableFields = (0, queryFieldsManipulation_1.queryFieldsManipulation)(searchTerm, ['name', 'category', 'subCategory'], filterableFields);
    if (queriesWithFilterableFields.length) {
        queryPayload.$and = queriesWithFilterableFields;
    }
    const services = await (0, workerHandler_1.createWorker)(queryPayload, sortCondition, skip, limit);
    const total = await service_model_1.ServiceModel.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
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
};
