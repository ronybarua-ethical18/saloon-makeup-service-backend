"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DayOfWeeks = exports.BookingStatusList = void 0;
var BookingStatusList;
(function (BookingStatusList) {
    // PENDING = 'PENDING',
    BookingStatusList["BOOKED"] = "BOOKED";
    BookingStatusList["CANCELLED"] = "CANCELLED";
    BookingStatusList["COMPLETED"] = "COMPLETED";
})(BookingStatusList || (exports.BookingStatusList = BookingStatusList = {}));
var DayOfWeeks;
(function (DayOfWeeks) {
    DayOfWeeks["FRIDAY"] = "FRIDAY";
    DayOfWeeks["SATURDAY"] = "SATURDAY";
    DayOfWeeks["SUNDAY"] = "SUNDAY";
    DayOfWeeks["MONDAY"] = "MONDAY";
    DayOfWeeks["TUESDAY"] = "TUESDAY";
    DayOfWeeks["WEDNESDAY"] = "WEDNESDAY";
    DayOfWeeks["THURSDAY"] = "THURSDAY";
})(DayOfWeeks || (exports.DayOfWeeks = DayOfWeeks = {}));
