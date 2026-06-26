"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const profileSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
        unique: true,
        index: true
    },
    avatar: {
        type: String,
        default: 'https://www.gravatar.com/avatar/?d=mp',
        trim: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    education: {
        type: String,
        trim: true
    },
    interests: [{
            type: String,
            trim: true
        }],
    enrolledCourses: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Course'
        }],
    bio: {
        type: String,
        trim: true,
        maxlength: [500, 'Bio cannot exceed 500 characters']
    }
}, {
    timestamps: true
});
const Profile = (0, mongoose_1.model)('Profile', profileSchema);
exports.default = Profile;
