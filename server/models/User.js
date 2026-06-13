import mongoose from "mongoose";



const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['candidate', 'recruiter'],
      default: 'candidate',
    },

    
    skills: [String],
    resume: {
      type: String,    
      default: '',
    },
    experience: {
      type: Number,    
      default: 0,
    },

   
    company: {
      type: String,
      default: '',
    },
    profilePic: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }  // createdAt, updatedAt auto 
);

export const User = mongoose.model('User', userSchema);