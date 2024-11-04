"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopTimeSlotsController = void 0;
const tryCatchAsync_1 = __importDefault(require("../../shared/tryCatchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const mongoose_1 = __importDefault(require("mongoose"));
const shop_timeslots_service_1 = require("./shop_timeslots.service");
const createShopTimeSlots = (0, tryCatchAsync_1.default)(async (req, res) => {
    await shop_timeslots_service_1.ShopTimeSlotsServices.createShopTimeSlots(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Shop time slots are created successfully',
    });
});
const getSingleShopTimeSlots = (0, tryCatchAsync_1.default)(async (req, res) => {
    const { shopId } = req.params;
    const { date } = req.query;
    const result = await shop_timeslots_service_1.ShopTimeSlotsServices.getSingleShopTimeSlots(new mongoose_1.default.Types.ObjectId(shopId), date);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Shop time slots retrieved successfully',
        data: result,
    });
});
exports.ShopTimeSlotsController = {
    createShopTimeSlots,
    getSingleShopTimeSlots,
};
