const { Comment, User, Track, Playlist } = require('../models');
const { Op } = require('sequelize');
const { createNotification } = require('./notificationController');

// Get a single comment by ID
exports.getComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      include: [
        { 
          model: User, 
          as: 'user', 
          attributes: ['id', 'username', 'avatar'] 
        },
        {
          model: Comment,
          as: 'replies',
          include: [
            { 
              model: User, 
              as: 'user', 
              attributes: ['id', 'username', 'avatar'] 
            }
          ],
          limit: 5,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    res.json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error('Error fetching comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comment',
      error: error.message
    });
  }
};

// Get comments for a track or playlist
exports.getComments = async (req, res) => {
  try {
    const { commentableType, commentableId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Validate commentableType
    if (!['track', 'playlist'].includes(commentableType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid commentable type'
      });
    }

    // Check if the track or playlist exists
    let commentable;
    if (commentableType === 'track') {
      commentable = await Track.findByPk(commentableId);
    } else {
      commentable = await Playlist.findByPk(commentableId);
    }

    if (!commentable) {
      return res.status(404).json({
        success: false,
        message: `${commentableType} not found`
      });
    }

    // Get top-level comments (not replies)
    const { count, rows } = await Comment.findAndCountAll({
      where: {
        commentableType,
        commentableId,
        parentId: null
      },
      include: [
        { 
          model: User, 
          as: 'user', 
          attributes: ['id', 'username', 'avatar'] 
        },
        {
          model: Comment,
          as: 'replies',
          include: [
            { 
              model: User, 
              as: 'user', 
              attributes: ['id', 'username', 'avatar'] 
            }
          ],
          limit: 5,
          order: [['createdAt', 'DESC']]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      success: true,
      data: {
        comments: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: error.message
    });
  }
};

// Get replies for a specific comment
exports.getReplies = async (req, res) => {
  try {
    const { commentId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Check if the parent comment exists
    const parentComment = await Comment.findByPk(commentId);
    if (!parentComment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const { count, rows } = await Comment.findAndCountAll({
      where: {
        parentId: commentId
      },
      include: [
        { 
          model: User, 
          as: 'user', 
          attributes: ['id', 'username', 'avatar'] 
        }
      ],
      order: [['createdAt', 'ASC']],
      limit,
      offset
    });

    res.json({
      success: true,
      data: {
        replies: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching replies:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching replies',
      error: error.message
    });
  }
};

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { content, commentableType, commentableId, parentId } = req.body;

    // Validate commentableType
    if (!['track', 'playlist'].includes(commentableType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid commentable type'
      });
    }

    // Check if the track or playlist exists
    let commentable;
    if (commentableType === 'track') {
      commentable = await Track.findByPk(commentableId);
    } else {
      commentable = await Playlist.findByPk(commentableId);
    }

    if (!commentable) {
      return res.status(404).json({
        success: false,
        message: `${commentableType} not found`
      });
    }

    // If parentId is provided, check if the parent comment exists
    if (parentId) {
      const parentComment = await Comment.findByPk(parentId);
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: 'Parent comment not found'
        });
      }
    }

    const comment = await Comment.create({
      content,
      commentableType,
      commentableId,
      parentId,
      userId: req.user.id
    });

    // Fetch the created comment with user data
    const createdComment = await Comment.findByPk(comment.id, {
      include: [
        { 
          model: User, 
          as: 'user', 
          attributes: ['id', 'username', 'avatar'] 
        }
      ]
    });

    // Create notification for the owner of the track/playlist
    if (commentable.userId !== req.user.id) {
      await createNotification(
        commentable.userId,
        'comment',
        {
          commentId: comment.id,
          commentableType,
          commentableId
        }
      );
    }

    // If this is a reply, create notification for the parent comment owner
    if (parentId) {
      const parentComment = await Comment.findByPk(parentId);
      if (parentComment && parentComment.userId !== req.user.id) {
        await createNotification(
          parentComment.userId,
          'comment',
          'New Reply',
          `${req.user.username} replied to your comment`,
          comment.id,
          'comment'
        );
      }
    }

    res.status(201).json({
      success: true,
      data: createdComment
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating comment',
      error: error.message
    });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if the user is the owner of the comment
    if (comment.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }

    await comment.update({ content });

    res.json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating comment',
      error: error.message
    });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if the user is the owner of the comment
    if (comment.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    await comment.destroy();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
      error: error.message
    });
  }
}; 