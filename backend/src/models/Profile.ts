import mongoose, { Schema, model, Document, Types } from 'mongoose';

export interface IProfile extends Document {
  user: Types.ObjectId;
  avatar: string;
  phoneNumber?: string;
  address?: string;
  education?: string;
  interests?: string[];
  enrolledCourses: Types.ObjectId[];
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>({
  user: {
    type: Schema.Types.ObjectId,
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
    type: Schema.Types.ObjectId,
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

const Profile = model<IProfile>('Profile', profileSchema);

export default Profile;
