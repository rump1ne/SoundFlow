const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const recommendationController = require('../controllers/recommendationController');

// Protected routes
router.get('/tracks', auth, recommendationController.getTrackRecommendations);
router.get('/playlists', auth, recommendationController.getPlaylistRecommendations);
router.get('/artists', auth, recommendationController.getArtistRecommendations);

module.exports = router; 