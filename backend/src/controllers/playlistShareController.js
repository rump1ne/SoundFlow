const { PlaylistShare, Playlist, User } = require('../models');
const { createNotification } = require('./notificationController');
const crypto = require('crypto');

// Generate a unique share code
const generateShareCode = () => {
  return crypto.randomBytes(6).toString('hex');
};

// Get all shares for a playlist
exports.getPlaylistShares = async (req, res) => {
  try {
    const { playlistId } = req.params;
    
    // Check if playlist exists and user is the owner
    const playlist = await Playlist.findByPk(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    if (playlist.userId !== req.user.id) {
      return res.status(403).json({ message: 'Only the playlist owner can view shares' });
    }
    
    // Get all shares
    const shares = await PlaylistShare.findAll({
      where: { playlistId },
      include: [
        {
          model: User,
          as: 'createdByUser',
          attributes: ['id', 'username']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(shares);
  } catch (error) {
    console.error('Error fetching playlist shares:', error);
    res.status(500).json({ message: 'Error fetching playlist shares' });
  }
};

// Create a new share for a playlist
exports.createPlaylistShare = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { shareType, password, expiresAt } = req.body;
    
    // Check if playlist exists and user is the owner
    const playlist = await Playlist.findByPk(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    if (playlist.userId !== req.user.id) {
      return res.status(403).json({ message: 'Only the playlist owner can create shares' });
    }
    
    // Generate unique share code
    const shareCode = generateShareCode();
    
    // Create share
    const share = await PlaylistShare.create({
      playlistId,
      shareType: shareType || 'private',
      shareCode,
      password: password || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdBy: req.user.id
    });
    
    res.status(201).json(share);
  } catch (error) {
    console.error('Error creating playlist share:', error);
    res.status(500).json({ message: 'Error creating playlist share' });
  }
};

// Get a playlist by share code
exports.getPlaylistByShareCode = async (req, res) => {
  try {
    const { shareCode } = req.params;
    const { password } = req.query;
    
    // Find share by code
    const share = await PlaylistShare.findOne({
      where: { shareCode },
      include: [
        {
          model: Playlist,
          include: [
            {
              model: User,
              attributes: ['id', 'username', 'avatar']
            }
          ]
        }
      ]
    });
    
    if (!share) {
      return res.status(404).json({ message: 'Share not found' });
    }
    
    // Check if share has expired
    if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
      return res.status(410).json({ message: 'Share has expired' });
    }
    
    // Check if share is password protected
    if (share.shareType === 'password' && !password) {
      return res.status(401).json({ message: 'Password required' });
    }
    
    // Verify password if provided
    if (share.shareType === 'password' && password !== share.password) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    
    // Create notification for the playlist owner
    await createNotification(
      share.Playlist.userId,
      'playlist_share',
      'Playlist Accessed',
      `Someone accessed your shared playlist "${share.Playlist.title}"`,
      share.playlistId,
      'playlist'
    );
    
    res.json(share.Playlist);
  } catch (error) {
    console.error('Error accessing shared playlist:', error);
    res.status(500).json({ message: 'Error accessing shared playlist' });
  }
};

// Delete a playlist share
exports.deletePlaylistShare = async (req, res) => {
  try {
    const { playlistId, shareId } = req.params;
    
    // Check if playlist exists and user is the owner
    const playlist = await Playlist.findByPk(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    if (playlist.userId !== req.user.id) {
      return res.status(403).json({ message: 'Only the playlist owner can delete shares' });
    }
    
    // Check if share exists
    const share = await PlaylistShare.findByPk(shareId);
    if (!share) {
      return res.status(404).json({ message: 'Share not found' });
    }
    
    if (share.playlistId !== parseInt(playlistId)) {
      return res.status(400).json({ message: 'Share does not belong to this playlist' });
    }
    
    // Delete share
    await share.destroy();
    
    res.json({ message: 'Share deleted successfully' });
  } catch (error) {
    console.error('Error deleting playlist share:', error);
    res.status(500).json({ message: 'Error deleting playlist share' });
  }
}; 