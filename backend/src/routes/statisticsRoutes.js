const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const statisticsController = require('../controllers/statisticsController');

// Protected routes
router.get('/user', auth, statisticsController.getUserStatistics);
router.get('/tracks/:trackId', auth, statisticsController.getTrackStatistics);
router.get('/playlists/:playlistId', auth, statisticsController.getPlaylistStatistics);
router.get('/artists/:artistId', auth, statisticsController.getArtistStatistics);

module.exports = router; 