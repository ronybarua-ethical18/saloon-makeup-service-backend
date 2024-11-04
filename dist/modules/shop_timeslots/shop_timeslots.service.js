"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopTimeSlotsServices = void 0;
const user_model_1 = require("../user/user.model");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const shop_model_1 = __importDefault(require("../shop/shop.model"));
const shop_timeslots_model_1 = __importDefault(require("./shop_timeslots.model"));
const moment_1 = __importDefault(require("moment"));
const shop_timeslots_utils_1 = require("./shop_timeslots.utils");
const createShopTimeSlots = async (payload, session) => {
    const seller = await user_model_1.UserModel.findOne({
        _id: payload.seller,
        role: 'seller',
    }).session(session || null);
    const shop = await shop_model_1.default.findOne({ _id: payload?.shop }).session(session || null);
    if (seller && shop) {
        const serviceDateStart = (0, moment_1.default)(payload.serviceDate).startOf('day').toDate();
        const serviceDateEnd = (0, moment_1.default)(payload.serviceDate).endOf('day').toDate();
        // Find time slots for the shop where createdAt is within the service date
        const shopTimeSlot = await shop_timeslots_model_1.default.findOne({
            shop: shop._id,
            slotFor: {
                $gte: serviceDateStart,
                $lte: serviceDateEnd,
            },
        }).session(session || null);
        if (shopTimeSlot) {
            const updatedTimeSlots = shopTimeSlot.timeSlots.map((timeSlot) => {
                if (payload?.startTime === timeSlot.startTime &&
                    timeSlot.maxResourcePerHour > 0) {
                    return {
                        startTime: timeSlot.startTime,
                        maxResourcePerHour: timeSlot.maxResourcePerHour - 1,
                    };
                }
                return timeSlot;
            });
            const updatedShopTimeSlot = await shop_timeslots_model_1.default.findOneAndUpdate({ shop: shop._id, _id: shopTimeSlot._id }, {
                timeSlots: updatedTimeSlots,
            }, { new: true, session });
            return updatedShopTimeSlot;
        }
        else {
            const shopOpenHour = shop.serviceTime.openingHour;
            const shopClosingHour = shop.serviceTime.closingHour;
            // Generate the time slots
            let generatedTimeSlots = (0, shop_timeslots_utils_1.generateTimeSlots)(shopOpenHour, shopClosingHour, shop?.maxResourcePerHour || 5);
            // Reduce maxResourcePerHour for the specified startTime
            generatedTimeSlots = generatedTimeSlots.map(timeSlot => {
                if (timeSlot.startTime === payload.startTime &&
                    timeSlot.maxResourcePerHour > 0) {
                    return {
                        startTime: timeSlot.startTime,
                        maxResourcePerHour: timeSlot.maxResourcePerHour - 1,
                    };
                }
                return timeSlot;
            });
            const newShopTimeSlot = await shop_timeslots_model_1.default.create([
                {
                    shop: shop._id,
                    slotFor: new Date(payload.serviceDate),
                    timeSlots: generatedTimeSlots,
                },
            ], { session });
            return newShopTimeSlot[0];
        }
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You are not allowed to perform the operation');
    }
};
exports.default = createShopTimeSlots;
const getSingleShopTimeSlots = async (shopId, currentDate) => {
    const startOfDay = (0, moment_1.default)(currentDate).startOf('day').toDate();
    const endOfDay = (0, moment_1.default)(currentDate).endOf('day').toDate();
    const timeSlot = await shop_timeslots_model_1.default.findOne({
        shop: shopId,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
    return timeSlot || null;
};
exports.ShopTimeSlotsServices = {
    createShopTimeSlots,
    getSingleShopTimeSlots,
};
