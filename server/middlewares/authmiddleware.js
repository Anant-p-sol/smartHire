import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  try {
    // 1. collect the token from header 
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, unauthorized' });
    }

    // 2. Token extract 
    const token = authHeader.split(' ')[1];

    // 3. Token verify 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. send user info to the controller
    req.user = await User.findById(decoded.id).select('-password');

    next(); // further process

  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Role check middleware
export const recruiterOnly = (req, res, next) => {
  if (req.user && req.user.role === 'recruiter') {
    next();
  } else {
    res.status(403).json({ message: 'Recruiter access only' });
  }
};

export default protect;