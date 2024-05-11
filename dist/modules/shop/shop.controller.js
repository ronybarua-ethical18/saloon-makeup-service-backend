"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopController = void 0;
const tryCatchAsync_1 = __importDefault(require("../../shared/tryCatchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const mongoose_1 = __importDefault(require("mongoose"));
const shop_service_1 = require("./shop.service");
const pick_1 = __importDefault(require("../../shared/pick"));
const shop_constants_1 = require("./shop.constants");
const pagination_1 = require("../../constants/pagination");
const createShop = (0, tryCatchAsync_1.default)(async (req, res) => {
    const loggedUser = req.user;
    const result = await shop_service_1.ShopService.createShop(loggedUser, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'New Shop is created successfully',
        data: result,
    });
});
const getAllShop = (0, tryCatchAsync_1.default)(async (req, res) => {
    const loggedUser = req.user;
    const filterOptions = (0, pick_1.default)(req.query, shop_constants_1.shopFilterableFields);
    const queryOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = await shop_service_1.ShopService.getAllShop(loggedUser, queryOptions, filterOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All shop fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});
const getShop = (0, tryCatchAsync_1.default)(async (req, res) => {
    if (typeof req.params.shopId === 'string') {
        const result = await shop_service_1.ShopService.getShop(new mongoose_1.default.Types.ObjectId(req.params['shopId']));
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Single shop fetched successfully',
            data: result,
        });
    }
});
const updateShop = (0, tryCatchAsync_1.default)(async (req, res) => {
    const loggedUser = req.user;
    if (typeof req.params.shopId === 'string') {
        const result = await shop_service_1.ShopService.updateShop(loggedUser, new mongoose_1.default.Types.ObjectId(req.params['shopId']), req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Shop updated successfully',
            data: result,
        });
    }
});
const deleteShop = (0, tryCatchAsync_1.default)(async (req, res) => {
    const loggedUser = req.user;
    if (typeof req.params.shopId === 'string') {
        await shop_service_1.ShopService.deleteShop(loggedUser, new mongoose_1.default.Types.ObjectId(req.params['shopId']));
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Shop deleted successfully',
        });
    }
});
exports.ShopController = {
    createShop,
    getShop,
    getAllShop,
    updateShop,
    deleteShop,
};
