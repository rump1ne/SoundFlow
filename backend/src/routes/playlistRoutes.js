const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const playlistController = require('../controllers/playlistController');

// Public routes
router.get('/', playlistController.getPlaylists);
router.get('/:id', playlistController.getPlaylist);

// Protected routes
router.post('/', auth, playlistController.createPlaylist);
router.put('/:id', auth, playlistController.updatePlaylist);
router.delete('/:id', auth, playlistController.deletePlaylist);
router.post('/:id/tracks', auth, playlistController.addTrackToPlaylist);
router.delete('/:id/tracks/:trackId', auth, playlistController.removeTrackFromPlaylist);

module.exports = router; 