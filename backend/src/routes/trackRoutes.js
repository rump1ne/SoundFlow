const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const trackController = require('../controllers/trackController');

// Public routes
router.get('/', trackController.getTracks);
router.get('/search', trackController.searchTracks);
router.get('/:id', trackController.getTrack);

// Protected routes
router.post('/', auth, trackController.createTrack);
router.put('/:id', auth, trackController.updateTrack);
router.delete('/:id', auth, trackController.deleteTrack);
router.post('/upload', auth, trackController.uploadTrack);

module.exports = router; 