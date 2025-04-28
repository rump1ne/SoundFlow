const express = require('express');
const musicMetadataService = require('../services/musicMetadataService');

const router = express.Router();

// Инициализация Spotify API
musicMetadataService.initialize();

// Эндпоинт для поиска треков
router.get('/search', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }
  
  try {
    const tracks = await musicMetadataService.searchTrack(query);
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search tracks' });
  }
});

module.exports = router;
