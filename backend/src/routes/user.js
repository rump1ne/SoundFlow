const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  getFavorites,
  addFavorite,
  removeFavorite,
  getHistory,
  clearHistory
} = require('../controllers/userController');

// Public routes
router.get('/profile/:id', getProfile);

// Protected routes
router.use(protect);
router.put('/profile', updateProfile);
router.get('/favorites', getFavorites);
router.post('/favorites', addFavorite);
router.delete('/favorites/:favoriteType/:favoriteId', removeFavorite);
router.get('/history', getHistory);
router.delete('/history', clearHistory);

module.exports = router; 