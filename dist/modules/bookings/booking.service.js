"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaloonService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const moment_1 = __importDefault(require("moment"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const booking_model_1 = __importDefault(require("./booking.model"));
const user_enum_1 = require("../../shared/enums/user.enum");
const pagination_1 = require("../../helpers/pagination");
const booking_utils_1 = require("./booking.utils");
const shop_model_1 = __importDefault(require("../shop/shop.model"));
const createBooking = async (loggedUser, bookingPayload) => {
    if (loggedUser.role === user_enum_1.ENUM_USER_ROLE.CUSTOMER) {
        const shop = (await shop_model_1.default.findOne({
            _id: bookingPayload.shop,
        }));
        if (shop?.serviceTime.offDays.includes(bookingPayload.serviceDayOfWeek)) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `The shop is closed on ${bookingPayload.serviceDayOfWeek}`);
        }
        if (!(0, booking_utils_1.areBothTimesInBetween)(bookingPayload.serviceStartTime, bookingPayload.serviceEndTime, shop?.serviceTime?.openingHour, shop?.serviceTime?.closingHour)) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'The shop does not offer any services during this time slot.');
        }
        const alreadyBookedServiceOnDay = await booking_model_1.default.find({
            serviceId: bookingPayload.serviceId,
            seller: bookingPayload.seller,
            shop: bookingPayload.shop,
            serviceDayOfWeek: bookingPayload.serviceDayOfWeek,
        });
        const existingBookingSlots = alreadyBookedServiceOnDay?.map(booking => {
            return {
                serviceStartTime: booking.serviceStartTime,
                serviceEndTime: booking.serviceEndTime,
                serviceDayOfWeek: booking.serviceDayOfWeek,
            };
        });
        for (const slot of existingBookingSlots) {
            const existingBookingSlotStartTime = (0, moment_1.default)(slot.serviceStartTime, 'HH:mm');
            const existingBookingSlotEndTime = (0, moment_1.default)(slot.serviceEndTime, 'HH:mm');
            const newBookingSlotStartTime = (0, moment_1.default)(bookingPayload.serviceStartTime, 'HH:mm');
            const newBookingSlotEndTime = (0, moment_1.default)(bookingPayload.serviceEndTime, 'HH:mm');
            if (newBookingSlotStartTime <= existingBookingSlotEndTime &&
                newBookingSlotEndTime >= existingBookingSlotStartTime) {
                throw new ApiError_1.default(http_status_1.default.CONFLICT, 'The service has already been booked for the requested time slot.');
            }
        }
        const booking = await booking_model_1.default.create({
            ...bookingPayload,
            customer: loggedUser.userId,
        });
        return booking;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You are not a customer');
    }
};
const getBooking = async (bookingId) => {
    const booking = await booking_model_1.default.findById({ _id: bookingId });
    if (!booking) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Booking not found');
    }
    return booking;
};
const updateBooking = async (loggedUser, bookingId, updatePayload) => {
    let query;
    if (loggedUser.role === 'admin' || loggedUser.role === 'super_admin') {
        query = { _id: bookingId };
    }
    else {
        query = {
            $or: [
                { _id: bookingId, customer: loggedUser.userId },
                { _id: bookingId, seller: loggedUser.userId },
            ],
        };
    }
    const booking = await booking_model_1.default.findOne(query);
    if (!booking) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Booking not found');
    }
    const updateBooking = await booking_model_1.default.findByIdAndUpdate({ _id: bookingId }, { ...updatePayload }, { new: true });
    return updateBooking;
};
const deleteBooking = async (bookingId) => {
    const booking = await booking_model_1.default.findOneAndDelete({ _id: bookingId });
    if (!booking) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Booking not found');
    }
};
const getAllBookings = async (loggedUser, queryOptions, filterOptions) => {
    let queryPayload = {
        $or: [{ seller: loggedUser.userId }, { customer: loggedUser.userId }],
    };
    if (loggedUser.role === user_enum_1.ENUM_USER_ROLE.ADMIN ||
        loggedUser.role === user_enum_1.ENUM_USER_ROLE.SUPER_ADMIN) {
        queryPayload = {};
    }
    const { searchTerm } = filterOptions;
    const { page, limit, skip, sortBy, sortOrder } = pagination_1.paginationHelpers.calculatePagination(queryOptions);
    const sortCondition = {};
    if (sortBy && sortOrder) {
        sortCondition[sortBy] = sortOrder;
    }
    let bookings;
    if (searchTerm) {
        const nameRegex = new RegExp(searchTerm, 'i');
        bookings = await booking_model_1.default.aggregate((0, booking_utils_1.bookingsAggregationPipeline)(nameRegex));
    }
    else {
        bookings = await booking_model_1.default.find(queryPayload)
            .sort(sortCondition)
            .limit(limit)
            .skip(skip)
            .populate('customer')
            .populate('seller')
            .populate('serviceId')
            .populate('shop');
    }
    const total = await booking_model_1.default.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: bookings,
    };
};
exports.SaloonService = {
    createBooking,
    getAllBookings,
    getBooking,
    updateBooking,
    deleteBooking,
};
