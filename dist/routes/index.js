"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const user_route_1 = require("../modules/user/user.route");
const service_route_1 = require("../modules/services/service.route");
const shop_route_1 = require("../modules/shop/shop.route");
const booking_route_1 = require("../modules/bookings/booking.route");
const feedback_route_1 = require("../modules/feedbacks/feedback.route");
const faq_route_1 = require("../modules/faq/faq.route");
const blog_route_1 = require("../modules/blogs/blog.route");
const upload_route_1 = require("../modules/upload/upload.route");
const stripe_accounts_route_1 = require("../modules/stripe_accounts/stripe_accounts.route");
const shop_timeslots_route_1 = require("../modules/shop_timeslots/shop_timeslots.route");
const transactions_route_1 = require("../modules/transactions/transactions.route");
const router = express_1.default.Router();
const routeList = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/users',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/services',
        route: service_route_1.SaloonServiceRoutes,
    },
    {
        path: '/shops',
        route: shop_route_1.ShopRoutes,
    },
    {
        path: '/bookings',
        route: booking_route_1.BookingRoutes,
    },
    {
        path: '/transactions',
        route: transactions_route_1.TransactionServiceRoutes,
    },
    {
        path: '/feedbacks',
        route: feedback_route_1.FeedbackRoutes,
    },
    {
        path: '/faqs',
        route: faq_route_1.FAQRoutes,
    },
    {
        path: '/blogs',
        route: blog_route_1.BlogRoutes,
    },
    {
        path: '/uploads',
        route: upload_route_1.uploadRoute,
    },
    {
        path: '/stripe',
        route: stripe_accounts_route_1.StripeAccountRoutes,
    },
    {
        path: '/shop-timeslots',
        route: shop_timeslots_route_1.ShopTimeSlotRoutes,
    },
];
routeList.forEach(route => {
    router.use(route.path, route.route);
});
exports.default = router;
