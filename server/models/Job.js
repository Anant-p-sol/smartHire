import mongoose from "mongoose";


const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    salary: {
      min: { type: Number },
      max: { type: Number },
    },
    skills: [String],       // Required skills list
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'internship', 'remote'],
      default: 'full-time',
    },
    experience: {
      type: String,
      enum: ['fresher', '1-3 years', '3-5 years', '5+ years'],
      default: 'fresher',
    },

    // Recruiter reference
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    deadline: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    
    matchScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


export const Job = mongoose.model('Job', jobSchema);
