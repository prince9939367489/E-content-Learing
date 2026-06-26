import { Schema, model, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  image: string;
  price: number;
  rating: number;
  studentsEnrolled: number;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    trim: true,
    minlength: [20, 'Description must be at least 20 characters long'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  instructor: {
    type: String,
    required: [true, 'Instructor name is required'],
    trim: true,
    minlength: [2, 'Instructor name must be at least 2 characters long'],
    maxlength: [50, 'Instructor name cannot exceed 50 characters']
  },
  duration: {
    type: String,
    required: [true, 'Course duration is required'],
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^(\d+(\.\d+)?\s*(hour|hours|week|weeks|month|months))$/i.test(v);
      },
      message: 'Duration must be in format: X hours/weeks/months'
    }
  },
  level: {
    type: String,
    required: [true, 'Course level is required'],
    enum: {
      values: ['Beginner', 'Intermediate', 'Advanced'],
      message: 'Level must be either Beginner, Intermediate, or Advanced'
    }
  },
  image: {
    type: String,
    required: [true, 'Course image URL is required'],
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+\..+/i.test(v);
      },
      message: 'Please provide a valid image URL'
    }
  },
  price: {
    type: Number,
    required: [true, 'Course price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(v: number) {
        return Number.isFinite(v);
      },
      message: 'Price must be a valid number'
    }
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  studentsEnrolled: {
    type: Number,
    default: 0,
    min: [0, 'Students enrolled cannot be negative']
  }
}, {
  timestamps: true
});

const Course = model<ICourse>('Course', courseSchema);
export default Course; 