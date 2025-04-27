const { Playlist, Track, User } = require('../models');

// Get all playlists with pagination
exports.getPlaylists = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows } = await Playlist.findAndCountAll({
      where: { isPublic: true },
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'avatar'] },
        { model: Track, as: 'tracks', attributes: ['id', 'title', 'artist', 'coverArt'] }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        playlists: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching playlists',
      error: error.message
    });
  }
};

// Get a single playlist by ID
exports.getPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'avatar'] },
        { model: Track, as: 'tracks' }
      ]
    });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found'
      });
    }

    // Check if playlist is private and user is not the owner
    if (!playlist.isPublic && (!req.user || req.user.id !== playlist.userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: playlist
    });
  } catch (error) {
    console.error('Error fetching playlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching playlist',
      error: error.message
    });
  }
};

// Create a new playlist
exports.createPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: playlist
    });
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating playlist',
      error: error.message
    });
  }
};

// Update a playlist
exports.updatePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found'
      });
    }

    // Check if user is the owner
    if (req.user.id !== playlist.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await playlist.update(req.body);

    res.json({
      success: true,
      data: playlist
    });
  } catch (error) {
    console.error('Error updating playlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating playlist',
      error: error.message
    });
  }
};

// Delete a playlist
exports.deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found'
      });
    }

    // Check if user is the owner
    if (req.user.id !== playlist.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await playlist.destroy();

    res.json({
      success: true,
      message: 'Playlist deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting playlist',
      error: error.message
    });
  }
};

// Add track to playlist
exports.addTrackToPlaylist = async (req, res) => {
  try {
    const { trackId } = req.body;
    const playlist = await Playlist.findByPk(req.params.id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found'
      });
    }

    // Check if user is the owner
    if (req.user.id !== playlist.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await playlist.addTrack(trackId);

    res.json({
      success: true,
      message: 'Track added to playlist successfully'
    });
  } catch (error) {
    console.error('Error adding track to playlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding track to playlist',
      error: error.message
    });
  }
};

// Remove track from playlist
exports.removeTrackFromPlaylist = async (req, res) => {
  try {
    const { trackId } = req.params;
    const playlist = await Playlist.findByPk(req.params.id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found'
      });
    }

    // Check if user is the owner
    if (req.user.id !== playlist.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await playlist.removeTrack(trackId);

    res.json({
      success: true,
      message: 'Track removed from playlist successfully'
    });
  } catch (error) {
    console.error('Error removing track from playlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing track from playlist',
      error: error.message
    });
  }
}; 