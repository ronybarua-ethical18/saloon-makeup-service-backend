"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeAccountStatus = exports.AccountType = exports.UserType = void 0;
var UserType;
(function (UserType) {
    UserType["SELLER"] = "seller";
    UserType["BUYER"] = "buyer";
    // Add other user types if needed
})(UserType || (exports.UserType = UserType = {}));
var AccountType;
(function (AccountType) {
    AccountType["EXPRESS"] = "express";
    AccountType["STANDARD"] = "standard";
    AccountType["CUSTOM"] = "custom";
})(AccountType || (exports.AccountType = AccountType = {}));
var StripeAccountStatus;
(function (StripeAccountStatus) {
    StripeAccountStatus["ACTIVE"] = "active";
    StripeAccountStatus["INACTIVE"] = "inactive";
    // Add other statuses if needed
})(StripeAccountStatus || (exports.StripeAccountStatus = StripeAccountStatus = {}));
