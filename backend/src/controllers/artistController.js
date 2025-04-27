const { Artist, Track, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const { createError } = require('../utils/errors');

// Get all artists
const getArtists = async (req, res) => {
  try {
    const artists = await Artist.findAll({
      order: [['monthlyListeners', 'DESC']]
    });
    res.json(artists);
  } catch (error) {
    console.error('Error getting artists:', error);
    res.status(500).json(createError('Failed to retrieve artists'));
  }
};

// Get artist by ID
const getArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findByPk(id, {
      include: [{
        model: Track,
        attributes: ['id', 'title', 'duration', 'genre', 'coverArt']
      }]
    });

    if (!artist) {
      return res.status(404).json(createError('Artist not found'));
    }

    res.json(artist);
  } catch (error) {
    console.error('Error getting artist:', error);
    res.status(500).json(createError('Failed to retrieve artist'));
  }
};

// Create artist (admin only)
const createArtist = async (req, res) => {
  try {
    const artist = await Artist.create(req.body);
    res.status(201).json(artist);
  } catch (error) {
    console.error('Error creating artist:', error);
    res.status(500).json(createError('Failed to create artist'));
  }
};

// Update artist (admin only)
const updateArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findByPk(id);

    if (!artist) {
      return res.status(404).json(createError('Artist not found'));
    }

    await artist.update(req.body);
    res.json(artist);
  } catch (error) {
    console.error('Error updating artist:', error);
    res.status(500).json(createError('Failed to update artist'));
  }
};

// Delete artist (admin only)
const deleteArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findByPk(id);

    if (!artist) {
      return res.status(404).json(createError('Artist not found'));
    }

    await artist.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting artist:', error);
    res.status(500).json(createError('Failed to delete artist'));
  }
};

// Search artists
const searchArtists = async (req, res) => {
  try {
    const { query } = req.query;
    const artists = await Artist.findAll({
      where: {
        name: {
          [Op.iLike]: `%${query}%`
        }
      },
      order: [['monthlyListeners', 'DESC']]
    });
    res.json(artists);
  } catch (error) {
    console.error('Error searching artists:', error);
    res.status(500).json(createError('Failed to search artists'));
  }
};

// Get artist statistics
const getArtistStatistics = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findByPk(id);

    if (!artist) {
      return res.status(404).json(createError('Artist not found'));
    }

    // Get total tracks
    const totalTracks = await Track.count({
      where: { artistId: id }
    });

    // Get total plays
    const totalPlays = await Track.sum('playCount', {
      where: { artistId: id }
    });

    // Get top tracks
    const topTracks = await Track.findAll({
      where: { artistId: id },
      order: [['playCount', 'DESC']],
      limit: 10
    });

    // Get genre distribution
    const genreDistribution = await Track.findAll({
      attributes: [
        'genre',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: { artistId: id },
      group: ['genre']
    });

    res.json({
      totalTracks,
      totalPlays,
      topTracks,
      genreDistribution
    });
  } catch (error) {
    console.error('Error getting artist statistics:', error);
    res.status(500).json(createError('Failed to retrieve artist statistics'));
  }
};

module.exports = {
  getArtists,
  getArtist,
  createArtist,
  updateArtist,
  deleteArtist,
  searchArtists,
  getArtistStatistics
}; 