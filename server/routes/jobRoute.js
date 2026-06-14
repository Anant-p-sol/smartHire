import express from 'express';
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
} from '../controllers/jobController.js';
import protect, { recruiterOnly } from '../middlewares/authmiddleware.js';

const router = express.Router();

// 🌐 Public Routes — token 
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// 🔐 Protected Routes — token 
router.post('/create', protect, recruiterOnly, createJob);
router.get('/recruiter/myjobs', protect, recruiterOnly, getMyJobs);
router.put('/:id', protect, recruiterOnly, updateJob);
router.delete('/:id', protect, recruiterOnly, deleteJob);

export default router;