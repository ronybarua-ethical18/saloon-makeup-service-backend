"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const tryCatchAsync_1 = __importDefault(require("../../shared/tryCatchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const mongoose_1 = __importDefault(require("mongoose"));
const pick_1 = __importDefault(require("../../shared/pick"));
const pagination_1 = require("../../constants/pagination");
const booking_constants_1 = require("./booking.constants");
const booking_service_1 = require("./booking.service");
const paymentQueue_1 = require("../../queues/payment/paymentQueue");
const createBooking = (0, tryCatchAsync_1.default)(async (req, res) => {
    const loggedUser = req.user;
    const result = await booking_service_1.BookingService.createBooking(loggedUser, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'New Booking is created successfully',
        data: result,
    });
});
const getAllBookings = (0, tryCatchAsync_1.default)(async (req, res) => {
    const loggedUser = req.user;
    const filterOptions = (0, pick_1.default)(req.query, booking_constants_1.filterableFields);
    const queryOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = await booking_service_1.BookingService.getAllBookings(loggedUser, queryOptions, filterOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All bookings fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});
const getBooking = (0, tryCatchAsync_1.default)(async (req, res) => {
    if (typeof req.params.bookingId === 'string') {
        const result = await booking_service_1.BookingService.getBooking(new mongoose_1.default.Types.ObjectId(req.params['bookingId']));
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Single booking fetched successfully',
            data: result,
        });
    }
});
const updateBooking = (0, tryCatchAsync_1.default)(async (req, res) => {
    const result = await booking_service_1.BookingService.updateBooking(new mongoose_1.default.Types.ObjectId(req.params['bookingId']), req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Booking updated successfully',
        data: result,
    });
});
const updateBookings = (0, tryCatchAsync_1.default)(async (req, res) => {
    const loggedUser = req.user;
    const bookings = [
        {
            _id: '671d1aad4b8b269804161eff',
            serviceStartTime: '7:00PM',
            status: 'BOOKED',
        },
        {
            _id: '67135aca8a631d80d6b0925a',
            serviceStartTime: '11:00AM',
            status: 'BOOKED',
        }
    ];
    console.log("bookings", bookings);
    const filteredBookings = await Promise.all(bookings.map(async (booking) => {
        const processedBooking = await booking_service_1.BookingService.verifyBooking(loggedUser, new mongoose_1.default.Types.ObjectId(booking?._id));
        return processedBooking; // Return the processed booking
    })).then((results) => results.filter((booking) => booking));
    console.log('filtered bookings', filteredBookings);
    if (filteredBookings.length > 0) {
        for (const booking of filteredBookings) {
            (0, paymentQueue_1.addJobToPaymentDispatchQueue)(booking).then(() => console.log('Job added to payment dispatch queue'));
        }
        return (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Bookings are being updated, and the corresponding payment disbursement is in progress.',
        });
    }
    else {
        return (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'No valid booking records found',
        });
    }
});
const deleteBooking = (0, tryCatchAsync_1.default)(async (req, res) => {
    if (typeof req.params.bookingId === 'string') {
        await booking_service_1.BookingService.deleteBooking(new mongoose_1.default.Types.ObjectId(req.params['bookingId']));
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Booking deleted successfully',
        });
    }
});
exports.BookingController = {
    createBooking,
    getAllBookings,
    getBooking,
    updateBooking,
    deleteBooking,
    updateBookings
};
