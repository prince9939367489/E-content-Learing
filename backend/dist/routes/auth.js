"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../middleware/validate");
const auth_validation_1 = require("../validations/auth.validation");
const User_1 = __importDefault(require("../models/User"));
const Profile_1 = __importDefault(require("../models/Profile"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const router = express_1.default.Router();
// Signup route
router.post('/signup', (0, validate_1.validate)(auth_validation_1.registerValidation), (0, catchAsync_1.default)(async (req, res) => {
    const { name, email, password } = req.body;
    // Check if user already exists
    const existingUser = await User_1.default.findOne({ email });
    if (existingUser) {
        throw new AppError_1.default('Email already registered', 400);
    }
    // Create new user
    const user = new User_1.default({ name, email, password });
    await user.save();
    // Create user profile
    const profile = new Profile_1.default({
        user: user._id,
        avatar: `https://www.gravatar.com/avatar/${user._id}?d=mp`
    });
    await profile.save();
    // Generate token
    const token = user.generateAuthToken();
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    const profileResponse = profile.toObject();
    res.status(201).json({
        success: true,
        data: {
            user: userResponse,
            profile: profileResponse,
            token
        }
    });
}));
// Login route
router.post('/login', (0, validate_1.validate)(auth_validation_1.loginValidation), (0, catchAsync_1.default)(async (req, res) => {
    const { email, password } = req.body;
    // Find user and select password field
    const user = await User_1.default.findOne({ email }).select('+password');
    if (!user) {
        throw new AppError_1.default('Invalid credentials', 401);
    }
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new AppError_1.default('Invalid credentials', 401);
    }
    // Get or create user profile
    let profile = await Profile_1.default.findOne({ user: user._id });
    if (!profile) {
        profile = new Profile_1.default({
            user: user._id,
            avatar: `https://www.gravatar.com/avatar/${user._id}?d=mp`
        });
        await profile.save();
    }
    // Generate token
    const token = user.generateAuthToken();
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    const profileResponse = profile.toObject();
    res.json({
        success: true,
        data: {
            user: userResponse,
            profile: profileResponse,
            token
        }
    });
}));
exports.default = router;
