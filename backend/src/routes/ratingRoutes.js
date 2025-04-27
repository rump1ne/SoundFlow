const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const ratingController = require('../controllers/ratingController');

// Public routes
router.get('/:rateableType/:rateableId', ratingController.getRatings);
router.get('/user/:rateableType/:rateableId', ratingController.getUserRating);

// Protected routes
router.post('/', auth, ratingController.rateItem);
router.delete('/:rateableType/:rateableId', auth, ratingController.deleteRating);

module.exports = router; 