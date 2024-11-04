"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTimeSlots = void 0;
const moment_1 = __importDefault(require("moment"));
const generateTimeSlots = (openingHour, closingHour, maxResourcePerHour) => {
    // Define the format for the time strings
    const timeFormat = 'h:00A';
    // Parse the opening and closing hours into Moment objects
    const start = (0, moment_1.default)(openingHour, timeFormat);
    const end = (0, moment_1.default)(closingHour, timeFormat);
    // Array to hold the generated time slots
    const timeSlots = [];
    // Generate time slots from opening to closing hour
    while (start.isSameOrBefore(end)) {
        timeSlots.push({
            startTime: start.format(timeFormat),
            maxResourcePerHour,
        });
        // Move to the next hour
        start.add(1, 'hour');
    }
    return timeSlots;
};
exports.generateTimeSlots = generateTimeSlots;
