"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const AppError_1 = __importDefault(require("../utils/AppError"));
const validate = (validations) => {
    return async (req, res, next) => {
        try {
            await Promise.all(validations.map((validation) => validation.run(req)));
            const errors = (0, express_validator_1.validationResult)(req);
            if (errors.isEmpty()) {
                return next();
            }
            const extractedErrors = [];
            errors.array().forEach((err) => {
                extractedErrors.push(err.msg);
            });
            throw new AppError_1.default(`Validation failed: ${extractedErrors.join('. ')}`, 400);
        }
        catch (error) {
            next(new AppError_1.default('Validation failed', 400));
        }
    };
};
exports.validate = validate;
