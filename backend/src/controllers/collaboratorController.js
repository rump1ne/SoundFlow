const { Collaborator, User, Playlist } = require('../models');
const { createNotification } = require('./notificationController');

// Get all collaborators for a playlist
exports.getCollaborators = async (req, res) => {
  try {
    const { playlistId } = req.params;
    
    // Check if playlist exists and user has access
    const playlist = await Playlist.findByPk(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    // Check if user is the owner or a collaborator
    const isOwner = playlist.userId === req.user.id;
    const isCollaborator = await Collaborator.findOne({
      where: {
        playlistId,
        userId: req.user.id
      }
    });
    
    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Get all collaborators
    const collaborators = await Collaborator.findAll({
      where: { playlistId },
      include: [
        { 
          model: User, 
          as: 'user', 
          attributes: ['id', 'username', 'avatar', 'email'] 
        },
        {
          model: User,
          as: 'addedByUser',
          attributes: ['id', 'username']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(collaborators);
  } catch (error) {
    console.error('Error fetching collaborators:', error);
    res.status(500).json({ message: 'Error fetching collaborators' });
  }
};

// Add a collaborator to a playlist
exports.addCollaborator = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { userId, role } = req.body;
    
    // Check if playlist exists and user is the owner
    const playlist = await Playlist.findByPk(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    if (playlist.userId !== req.user.id) {
      return res.status(403).json({ message: 'Only the playlist owner can add collaborators' });
    }
    
    // Check if user to add exists
    const userToAdd = await User.findByPk(userId);
    if (!userToAdd) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is already a collaborator
    const existingCollaborator = await Collaborator.findOne({
      where: {
        playlistId,
        userId
      }
    });
    
    if (existingCollaborator) {
      return res.status(400).json({ message: 'User is already a collaborator' });
    }
    
    // Create collaborator
    const collaborator = await Collaborator.create({
      playlistId,
      userId,
      role: role || 'viewer',
      addedBy: req.user.id
    });
    
    // Create notification for the added user
    await createNotification(
      userId,
      'playlist_update',
      'Playlist Collaboration',
      `You've been added as a collaborator to the playlist "${playlist.title}"`,
      playlistId,
      'playlist'
    );
    
    res.status(201).json(collaborator);
  } catch (error) {
    console.error('Error adding collaborator:', error);
    res.status(500).json({ message: 'Error adding collaborator' });
  }
};

// Update a collaborator's role
exports.updateCollaboratorRole = async (req, res) => {
  try {
    const { playlistId, collaboratorId } = req.params;
    const { role } = req.body;
    
    // Check if playlist exists and user is the owner
    const playlist = await Playlist.findByPk(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    if (playlist.userId !== req.user.id) {
      return res.status(403).json({ message: 'Only the playlist owner can update collaborator roles' });
    }
    
    // Check if collaborator exists
    const collaborator = await Collaborator.findByPk(collaboratorId);
    if (!collaborator) {
      return res.status(404).json({ message: 'Collaborator not found' });
    }
    
    if (collaborator.playlistId !== parseInt(playlistId)) {
      return res.status(400).json({ message: 'Collaborator does not belong to this playlist' });
    }
    
    // Update collaborator role
    await collaborator.update({ role });
    
    // Create notification for the collaborator
    await createNotification(
      collaborator.userId,
      'playlist_update',
      'Role Updated',
      `Your role in the playlist "${playlist.title}" has been updated to ${role}`,
      playlistId,
      'playlist'
    );
    
    res.json(collaborator);
  } catch (error) {
    console.error('Error updating collaborator role:', error);
    res.status(500).json({ message: 'Error updating collaborator role' });
  }
};

// Remove a collaborator from a playlist
exports.removeCollaborator = async (req, res) => {
  try {
    const { playlistId, collaboratorId } = req.params;
    
    // Check if playlist exists and user is the owner
    const playlist = await Playlist.findByPk(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    if (playlist.userId !== req.user.id) {
      return res.status(403).json({ message: 'Only the playlist owner can remove collaborators' });
    }
    
    // Check if collaborator exists
    const collaborator = await Collaborator.findByPk(collaboratorId);
    if (!collaborator) {
      return res.status(404).json({ message: 'Collaborator not found' });
    }
    
    if (collaborator.playlistId !== parseInt(playlistId)) {
      return res.status(400).json({ message: 'Collaborator does not belong to this playlist' });
    }
    
    // Create notification for the removed collaborator
    await createNotification(
      collaborator.userId,
      'playlist_update',
      'Collaboration Removed',
      `You've been removed as a collaborator from the playlist "${playlist.title}"`,
      playlistId,
      'playlist'
    );
    
    // Remove collaborator
    await collaborator.destroy();
    
    res.json({ message: 'Collaborator removed successfully' });
  } catch (error) {
    console.error('Error removing collaborator:', error);
    res.status(500).json({ message: 'Error removing collaborator' });
  }
}; 