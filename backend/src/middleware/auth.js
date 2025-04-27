const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error.message
    });
  }
};

// Middleware to check if user is premium
const premium = async (req, res, next) => {
  try {
    if (!req.user.isPremium) {
      return res.status(403).json({
        success: false,
        message: 'Premium subscription required to access this feature'
      });
    }
    next();
  } catch (error) {
    console.error('Premium middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking premium status',
      error: error.message
    });
  }
};

module.exports = {
  auth,
  premium
}; 