"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
// import moment from 'moment'
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const booking_interface_1 = require("./booking.interface");
const booking_model_1 = __importDefault(require("./booking.model"));
const user_enum_1 = require("../../shared/enums/user.enum");
const mongoose_1 = __importDefault(require("mongoose"));
const pagination_1 = require("../../helpers/pagination");
const booking_utils_1 = require("./booking.utils");
const shop_model_1 = __importDefault(require("../shop/shop.model"));
const shop_timeslots_service_1 = require("../shop_timeslots/shop_timeslots.service");
const moment_1 = __importDefault(require("moment"));
const transactions_model_1 = __importDefault(require("../transactions/transactions.model"));
const transactions_interface_1 = require("../transactions/transactions.interface");
const service_utils_1 = require("../services/service.utils");
const queryFieldsManipulation_1 = require("../../helpers/queryFieldsManipulation");
const sentry_1 = require("../../config/sentry");
const toFixConverter_1 = require("../../utils/toFixConverter");
const createBooking = async (loggedUser, bookingPayload) => {
    console.log('bookingPayload', bookingPayload);
    if (loggedUser.role !== user_enum_1.ENUM_USER_ROLE.CUSTOMER) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You are not a customer');
    }
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const shop = (await shop_model_1.default.findOne({
            _id: bookingPayload.shop?._id,
        }).session(session));
        if (!shop) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Shop not found');
        }
        const dayOfWeek = (0, moment_1.default)(bookingPayload.serviceDate).format('dddd');
        if (shop?.serviceTime.offDays.includes(dayOfWeek)) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `The shop is closed on ${dayOfWeek}`);
        }
        const shopTimeSlot = await shop_timeslots_service_1.ShopTimeSlotsServices.createShopTimeSlots({
            shop: bookingPayload.shop,
            seller: new mongoose_1.default.Types.ObjectId(bookingPayload.sellerId),
            serviceDate: bookingPayload.serviceDate,
            startTime: bookingPayload.serviceStartTime,
        }, session);
        const totalAmount = bookingPayload.totalAmount;
        const bookingId = (0, booking_utils_1.generateId)('SVBA', totalAmount);
        const applicationFeeAmount = (0, toFixConverter_1.toFixConverter)(totalAmount * 0.1); // 10% fee for the platform owner
        const sellerAmount = (0, toFixConverter_1.toFixConverter)(totalAmount - applicationFeeAmount);
        const booking = await booking_model_1.default.create([
            {
                bookingId,
                customer: loggedUser.userId,
                seller: new mongoose_1.default.Types.ObjectId(bookingPayload.sellerId),
                shop: bookingPayload.shop._id,
                serviceId: new mongoose_1.default.Types.ObjectId(bookingPayload.serviceId),
                serviceStartTime: bookingPayload.serviceStartTime,
                shopTimeSlot: shopTimeSlot?._id,
                totalAmount: bookingPayload.totalAmount,
                processingFees: bookingPayload.processingFees,
            },
        ], { session });
        const transactionId = (0, booking_utils_1.generateId)('SVTA', bookingPayload?.totalAmount);
        await transactions_model_1.default.create([
            {
                transactionId,
                customer: loggedUser.userId,
                seller: new mongoose_1.default.Types.ObjectId(bookingPayload.sellerId),
                service: new mongoose_1.default.Types.ObjectId(bookingPayload.serviceId),
                booking: booking[0]._id,
                amount: bookingPayload.totalAmount,
                stripeProcessingFee: bookingPayload.processingFees,
                paymentMethod: bookingPayload.paymentMethod,
                stripePaymentIntentId: bookingPayload.stripePaymentIntentId,
                transactionType: transactions_interface_1.TransactionType.PAYMENT,
                status: transactions_interface_1.AmountStatus.PENDING,
                applicationFee: applicationFeeAmount,
                sellerAmount: sellerAmount,
            },
        ], { session });
        await session.commitTransaction();
        return booking[0];
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
const getBooking = async (bookingId) => {
    const booking = await booking_model_1.default.findById({ _id: bookingId });
    if (!booking) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Booking not found');
    }
    return booking;
};
const updateBooking = async (bookingId, updatePayload) => {
    console.log('update booking payload from queue', updatePayload);
    const updateBooking = await booking_model_1.default.findByIdAndUpdate({ _id: bookingId }, { ...updatePayload }, { new: true });
    return updateBooking;
};
const verifyBooking = async (loggedUser, bookingId) => {
    // Check if the logged user is a seller
    if (loggedUser.role !== 'seller') {
        (0, sentry_1.SentrySetContext)('Forbidden', {
            issue: 'Operation not allowed - User is not a seller',
        });
        (0, sentry_1.SentryCaptureMessage)('Unauthorized booking verification attempt');
        return null;
    }
    // Find the booking with necessary relationships
    const findBooking = await booking_model_1.default.findOne({
        seller: loggedUser.userId,
        _id: bookingId,
        status: booking_interface_1.BookingStatusList.BOOKED,
    })
        .populate([
        { path: 'shopTimeSlot', select: 'slotFor' },
        { path: 'seller', select: 'firstName lastName email phone' },
        { path: 'customer', select: 'firstName lastName email phone' },
        { path: 'serviceId', select: 'name' },
        { path: 'shop', select: 'shopName' },
    ])
        .lean();
    // Return early if booking not found
    if (!findBooking) {
        (0, sentry_1.SentrySetContext)('Booking not found', {
            seller: loggedUser.userId,
            bookingId,
        });
        (0, sentry_1.SentryCaptureMessage)('Booking not found for verification');
        return null;
    }
    // Validate if the booking is eligible for update based on service time
    const { slotFor: serviceDate } = findBooking.shopTimeSlot;
    const serviceTime = findBooking.serviceStartTime;
    const isBookingEligible = (0, booking_utils_1.isServiceDateTimeAtLeastOneHourInPast)(serviceDate, serviceTime);
    if (!isBookingEligible) {
        (0, sentry_1.SentrySetContext)('Booking update not eligible for time slot', {
            seller: loggedUser.userId,
            bookingId,
        });
        (0, sentry_1.SentryCaptureMessage)('Booking is not eligible for update due to invalid service time');
        return null;
    }
    // Find the pending transaction for the booking
    const pendingTransaction = await transactions_model_1.default.findOne({
        booking: bookingId,
        status: transactions_interface_1.AmountStatus.PENDING,
    });
    // Return early if no pending transaction is found
    if (!pendingTransaction) {
        (0, sentry_1.SentrySetContext)('Transaction not found for booking', {
            seller: loggedUser.userId,
            bookingId,
        });
        (0, sentry_1.SentryCaptureMessage)('Pending transaction not found for the booking');
        return null;
    }
    const seller = findBooking?.seller || {};
    const customer = findBooking?.customer || {};
    // Return the required payment disbursement details
    return {
        bookingId,
        paymentIntentId: pendingTransaction.stripePaymentIntentId,
        customerBookingId: findBooking.bookingId,
        sellerId: seller._id,
        customerId: customer._id,
        serviceName: findBooking.serviceId.name,
        sellerName: `${seller?.firstName} ${seller.lastName}`,
        sellerEmail: seller.email,
        customerName: `${customer.firstName} ${customer.lastName}`,
        customerEmail: customer.email,
        shopName: findBooking.shop.shopName,
        totalAmount: findBooking.totalAmount,
    };
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
    const { searchTerm, ...filterableFields } = filterOptions;
    const { page, limit, skip, sortBy, sortOrder } = pagination_1.paginationHelpers.calculatePagination(queryOptions);
    const sortCondition = {};
    if (sortBy && sortOrder) {
        sortCondition[sortBy] = sortOrder;
    }
    const queriesWithFilterableFields = (0, queryFieldsManipulation_1.queryFieldsManipulation)(searchTerm, ['status'], filterableFields);
    if (queriesWithFilterableFields.length > 0) {
        queryPayload.$and = queriesWithFilterableFields;
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
            .populate([
            { path: 'customer', select: 'firstName lastName phone' },
            { path: 'seller', select: 'firstName lastName phone' },
            { path: 'serviceId', select: 'name category subCategory price' },
            {
                path: 'shop',
                select: 'shopName location maxResourcePerHour serviceTime',
            },
            { path: 'shopTimeSlot', select: 'slotFor' },
        ])
            .lean();
    }
    const totals = await (0, service_utils_1.getTotals)(booking_model_1.default, { seller: new mongoose_1.default.Types.ObjectId(loggedUser.userId) }, ['BOOKED', 'CANCELLED', 'COMPLETED']);
    console.log('totals', totals);
    return {
        meta: {
            page,
            limit,
            total: totals?.total,
            totalBooked: totals['BOOKED'],
            totalCompleted: totals['COMPLETED'],
            totalCancelled: totals['CANCELLED'],
        },
        data: bookings,
    };
};
exports.BookingService = {
    createBooking,
    getAllBookings,
    getBooking,
    updateBooking,
    deleteBooking,
    verifyBooking,
};
