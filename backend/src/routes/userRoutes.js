const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const userController = require('../controllers/userController');

// Current user routes
router.get('/me', auth, userController.getCurrentUser);

// Profile routes
router.get('/profile/:id', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

// Favorites routes
router.get('/favorites', auth, userController.getFavorites);
router.post('/favorites', auth, userController.addFavorite);
router.delete('/favorites/:favoriteType/:favoriteId', auth, userController.removeFavorite);

// History routes
router.get('/history', auth, userController.getHistory);
router.delete('/history', auth, userController.clearHistory);

module.exports = router; 