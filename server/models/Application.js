import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'rejected', 'hired'],
      default: 'applied',
    },
    coverLetter: {
      type: String,
      default: '',
    },

    // Phase 2 — AI match score
    matchScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


applicationSchema.index(
  { job: 1, candidate: 1 },
  { unique: true }
);

const Application = mongoose.model('Application', applicationSchema);
export default Application;
