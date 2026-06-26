"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const User_1 = __importDefault(require("../models/User"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const router = express_1.default.Router();
// Get current user profile
router.get('/me', auth_1.auth, async (req, res, next) => {
    try {
        const authReq = req;
        const user = await User_1.default.findById(authReq.user._id).select('-password');
        if (!user) {
            throw new AppError_1.default('User not found', 404);
        }
        res.json({
            success: true,
            data: {
                user
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
