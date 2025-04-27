const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  searchTracks,
  searchPlaylists,
  searchUsers,
  searchArtists,
  searchAlbums,
  searchGenres,
  search
} = require('../controllers/searchController');

// Global search (public)
router.get('/', search);

// Search tracks (public)
router.get('/tracks', searchTracks);

// Search playlists (public)
router.get('/playlists', searchPlaylists);

// Search users (public)
router.get('/users', searchUsers);

// Search artists (public)
router.get('/artists', searchArtists);

// Search albums (public)
router.get('/albums', searchAlbums);

// Search genres (public)
router.get('/genres', searchGenres);

module.exports = router; 