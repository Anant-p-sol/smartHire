import express from 'express';
import {
  applyJob,
  getMyApplications,
  getJobApplicants,
  updateStatus,
  withdrawApplication,
} from '../controllers/applicationController.js';
import protect, { recruiterOnly } from '../middlewares/authmiddleware.js';

const router = express.Router();

// 🔐 Candidate Routes
router.post('/apply/:jobId', protect, applyJob);
router.get('/my-applications', protect, getMyApplications);
router.delete('/withdraw/:applicationId', protect, withdrawApplication);

// 🔐 Recruiter Routes
router.get('/applicants/:jobId', protect, recruiterOnly, getJobApplicants);
router.put('/status/:applicationId', protect, recruiterOnly, updateStatus);

export default router;