const express = require('express');
const router = express.Router();
const {
  getArtists,
  getArtist,
  createArtist,
  updateArtist,
  deleteArtist,
  searchArtists,
  getArtistStatistics
} = require('../controllers/artistController');
const { auth, admin } = require('../middleware/auth');

// Public routes
router.get('/', getArtists);
router.get('/search', searchArtists);
router.get('/:id', getArtist);
router.get('/:id/statistics', getArtistStatistics);

// Protected routes (admin only)
router.post('/', auth, admin, createArtist);
router.put('/:id', auth, admin, updateArtist);
router.delete('/:id', auth, admin, deleteArtist);

module.exports = router; 