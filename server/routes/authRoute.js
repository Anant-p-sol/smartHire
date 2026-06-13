import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import protect from '../middlewares/authmiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route 
router.get('/profile', protect, getProfile);

export default router;