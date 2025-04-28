const { Track, Playlist, Album, Artist } = require('../models');
const { Op } = require('sequelize');

// Get all tracks with pagination
exports.getTracks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows } = await Track.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Album,
          as: 'album',
          attributes: ['id', 'title', 'imageUrl']
        },
        {
          model: Artist,
          as: 'artist',
          attributes: ['id', 'name']
        }
      ]
    });

    res.json({
      success: true,
      data: {
        tracks: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching tracks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tracks',
      error: error.message
    });
  }
};

// Get a single track by ID
exports.getTrack = async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id, {
      include: [
        {
          model: Album,
          as: 'album',
          attributes: ['id', 'title', 'imageUrl']
        },
        {
          model: Artist,
          as: 'artist',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!track) {
      return res.status(404).json({
        success: false,
        message: 'Track not found'
      });
    }

    // Increment play count
    await track.increment('plays');

    res.json({
      success: true,
      data: track
    });
  } catch (error) {
    console.error('Error fetching track:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching track',
      error: error.message
    });
  }
};

// Create a new track
exports.createTrack = async (req, res) => {
  try {
    const track = await Track.create({
      title: req.body.title,
      artistName: req.body.artistName,
      albumName: req.body.albumName,
      duration: req.body.duration,
      genre: req.body.genre,
      coverArt: req.body.coverArt,
      audioUrl: req.body.audioUrl,
      releaseDate: req.body.releaseDate,
      isPremium: req.body.isPremium
    });
    res.status(201).json(track);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a track
exports.updateTrack = async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    await track.update({
      title: req.body.title,
      artistName: req.body.artistName,
      albumName: req.body.albumName,
      duration: req.body.duration,
      genre: req.body.genre,
      coverArt: req.body.coverArt,
      audioUrl: req.body.audioUrl,
      releaseDate: req.body.releaseDate,
      isPremium: req.body.isPremium
    });
    res.json(track);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a track
exports.deleteTrack = async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    await track.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload a track
exports.uploadTrack = async (req, res) => {
  try {
    if (!req.files || !req.files.audio) {
      return res.status(400).json({
        success: false,
        message: 'No audio file uploaded'
      });
    }

    const audioFile = req.files.audio;
    const coverArtFile = req.files.coverArt;

    // TODO: Implement file upload to storage service (e.g., AWS S3)
    // For now, we'll just return a success message
    res.status(200).json({
      success: true,
      message: 'Track uploaded successfully',
      data: {
        audioFileName: audioFile.name,
        coverArtFileName: coverArtFile ? coverArtFile.name : null
      }
    });
  } catch (error) {
    console.error('Error uploading track:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading track',
      error: error.message
    });
  }
};

// Search tracks
exports.searchTracks = async (req, res) => {
  try {
    const { query } = req.query;
    const tracks = await Track.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } }
        ]
      },
      include: [
        {
          model: Album,
          as: 'album',
          attributes: ['id', 'title', 'imageUrl']
        },
        {
          model: Artist,
          as: 'artist',
          attributes: ['id', 'name'],
          where: query ? { name: { [Op.iLike]: `%${query}%` } } : undefined
        }
      ]
    });
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all tracks
exports.getAllTracks = async (req, res) => {
  try {
    const tracks = await Track.findAll({
      include: [
        {
          model: Album,
          as: 'album',
          attributes: ['id', 'title', 'imageUrl']
        },
        {
          model: Artist,
          as: 'artist',
          attributes: ['id', 'name']
        }
      ]
    });
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single track by ID
exports.getTrackById = async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id, {
      include: [{
        model: Album,
        as: 'album',
        attributes: ['id', 'title', 'coverArt']
      }]
    });
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    res.json(track);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 