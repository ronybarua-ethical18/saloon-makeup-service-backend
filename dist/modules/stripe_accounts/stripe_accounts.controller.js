"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeAccountController = void 0;
const tryCatchAsync_1 = __importDefault(require("../../shared/tryCatchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const stripe_accounts_service_1 = require("./stripe_accounts.service");
const config_1 = __importDefault(require("../../config"));
const stripe_1 = require("../../config/stripe");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createAndConnectStripeAccount = (0, tryCatchAsync_1.default)(async (req, res) => {
    const loggedUser = req.user;
    const result = await stripe_accounts_service_1.StripeAccountService.createAndConnectStripeAccount(loggedUser);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Feedback is created successfully',
        data: result,
    });
});
const createPaymentIntentForHold = (0, tryCatchAsync_1.default)(async (req, res) => {
    const result = await stripe_accounts_service_1.StripeAccountService.createPaymentIntentForHold(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Payment intent is created successfully',
        data: result,
    });
});
const captureHeldPayment = (0, tryCatchAsync_1.default)(async (req, res) => {
    const result = await stripe_accounts_service_1.StripeAccountService.captureHeldPayment(req.body?.paymentIntentId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Payment captured successfully',
        data: result,
    });
});
const stripeConnectWebhook = (0, tryCatchAsync_1.default)(async (req, res) => {
    try {
        // Check if webhook signing is configured.
        const webhookSecret = config_1.default.stripe.stripe_webhook_secret_key;
        if (webhookSecret) {
            // Retrieve the event by verifying the signature using the raw body and secret.
            let event;
            const secret = webhookSecret;
            const header = stripe_1.stripe.webhooks.generateTestHeaderString({
                payload: req.rawBody,
                secret,
            });
            try {
                event = stripe_1.stripe?.webhooks.constructEvent(req.rawBody, header, webhookSecret);
                console.log(`⚠️  Webhook verified`);
            }
            catch (err) {
                console.log(`⚠️  Webhook signature verification failed:  ${err}`);
                return res.sendStatus(400);
            }
            const data = event.data.object;
            const eventType = event.type;
            if (eventType === 'account.updated') {
                console.log('Stripe Connect account updated:', data);
                try {
                    await stripe_accounts_service_1.StripeAccountService.saveOrUpdateStripeAccount(data);
                }
                catch (error) {
                    console.error('Error saving/updating Stripe account:', error);
                    // You might want to handle this error, perhaps by creating a task to reconcile this account later
                }
            }
            res.status(200).end();
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.log('webhook error', error);
        res.status(400).end();
    }
});
const getStripeAccountDetails = (0, tryCatchAsync_1.default)(async (req, res) => {
    const { accountId } = req.params; // Assuming accountId is passed as a route parameter
    if (!accountId) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Account ID is required');
    }
    const result = await stripe_accounts_service_1.StripeAccountService.getStripeAccountDetails(accountId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Stripe account details retrieved successfully',
        data: result,
    });
});
const createTestChargeToStripeAccount = (0, tryCatchAsync_1.default)(async (req, res) => {
    const result = await stripe_accounts_service_1.StripeAccountService.createTestChargeToStripeAccount();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Amount added to your stripe account',
        data: result,
    });
});
const stripePaymentCheckout = (0, tryCatchAsync_1.default)(async (req, res) => {
    const result = await stripe_accounts_service_1.StripeAccountService.stripePaymentCheckout();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Payment checkout page is generated',
        data: result,
    });
});
const getOwnStripeAccountDetails = (0, tryCatchAsync_1.default)(async (req, res) => {
    const result = await stripe_accounts_service_1.StripeAccountService.getOwnStripeAccountDetails();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Your stripe account details is fetched successfully',
        data: result,
    });
});
const transferAmountToConnectedStripeAccount = (0, tryCatchAsync_1.default)(async (req, res) => {
    const result = await stripe_accounts_service_1.StripeAccountService.transferAmountToConnectedStripeAccount('acct_1Q3A4yBH0X57e8kd', 575);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Amount transferred successfully',
        data: result,
    });
});
const capturePayment = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;
        const capturedPayment = await stripe_accounts_service_1.StripeAccountService.captureHeldPayment(paymentIntentId);
        res.status(200).json(capturedPayment);
    }
    catch (error) {
        if (error instanceof ApiError_1.default) {
            res.status(error.statusCode).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};
exports.StripeAccountController = {
    createAndConnectStripeAccount,
    createPaymentIntentForHold,
    captureHeldPayment,
    stripeConnectWebhook,
    getStripeAccountDetails,
    transferAmountToConnectedStripeAccount,
    createTestChargeToStripeAccount,
    getOwnStripeAccountDetails,
    stripePaymentCheckout,
    capturePayment,
};
