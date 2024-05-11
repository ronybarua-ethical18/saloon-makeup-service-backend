"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const http_status_1 = __importDefault(require("http-status"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandler_1 = __importDefault(require("./errors/globalErrorHandler"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
//parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//cookie parser
app.use((0, cookie_parser_1.default)());
// logger
app.use((0, morgan_1.default)('dev'));
// Enhancing Express.js security with Helmet middleware for essential HTTP header protection.
app.use((0, helmet_1.default)());
// sanitize request data to remove unwanted characters from req.body, req.query, req.params ($, . etc ..)
app.use((0, express_mongo_sanitize_1.default)());
// application routes
app.use('/api/v1', routes_1.default);
//Testing
app.get('/', async (req, res) => {
    res.send('Working Successfully With github actions integration server');
});
//handle not found
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: 'Not Found',
        errorMessages: [
            {
                path: req.originalUrl,
                message: 'API Not Found',
            },
        ],
    });
    next();
});
app.use(globalErrorHandler_1.default);
exports.default = app;
