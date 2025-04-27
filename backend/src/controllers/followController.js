const { User, Follow } = require('../models');
const { createNotification } = require('./notificationController');

// Follow a user
exports.followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const userToFollow = await User.findByPk(userId);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if already following
    const existingFollow = await Follow.findOne({
      where: {
        followerId: req.user.id,
        followingId: userId
      }
    });
    
    if (existingFollow) {
      return res.status(400).json({ message: 'Already following this user' });
    }
    
    // Create follow relationship
    await Follow.create({
      followerId: req.user.id,
      followingId: userId
    });
    
    // Create notification for the followed user
    await createNotification(
      userId,
      'follow',
      'New Follower',
      `${req.user.username} started following you`,
      req.user.id,
      'user'
    );
    
    res.status(201).json({ message: 'Successfully followed user' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ message: 'Error following user' });
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if follow relationship exists
    const follow = await Follow.findOne({
      where: {
        followerId: req.user.id,
        followingId: userId
      }
    });
    
    if (!follow) {
      return res.status(404).json({ message: 'Not following this user' });
    }
    
    // Delete follow relationship
    await follow.destroy();
    
    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ message: 'Error unfollowing user' });
  }
};

// Get followers of a user
exports.getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get followers with pagination
    const { count, rows } = await Follow.findAndCountAll({
      where: { followingId: userId },
      include: [
        {
          model: User,
          as: 'follower',
          attributes: ['id', 'username', 'avatar', 'bio']
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    // Check if current user is following each follower
    const followers = await Promise.all(rows.map(async (follow) => {
      const follower = follow.follower;
      const isFollowing = await Follow.findOne({
        where: {
          followerId: req.user.id,
          followingId: follower.id
        }
      });
      
      return {
        ...follower.toJSON(),
        isFollowing: !!isFollowing
      };
    }));
    
    res.json({
      followers,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ message: 'Error fetching followers' });
  }
};

// Get users that a user is following
exports.getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get following with pagination
    const { count, rows } = await Follow.findAndCountAll({
      where: { followerId: userId },
      include: [
        {
          model: User,
          as: 'following',
          attributes: ['id', 'username', 'avatar', 'bio']
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    // Check if current user is following each user
    const following = await Promise.all(rows.map(async (follow) => {
      const followedUser = follow.following;
      const isFollowing = await Follow.findOne({
        where: {
          followerId: req.user.id,
          followingId: followedUser.id
        }
      });
      
      return {
        ...followedUser.toJSON(),
        isFollowing: !!isFollowing
      };
    }));
    
    res.json({
      following,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Error fetching following:', error);
    res.status(500).json({ message: 'Error fetching following' });
  }
};

// Check if current user is following a specific user
exports.checkFollowStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const follow = await Follow.findOne({
      where: {
        followerId: req.user.id,
        followingId: userId
      }
    });
    
    res.json({ isFollowing: !!follow });
  } catch (error) {
    console.error('Error checking follow status:', error);
    res.status(500).json({ message: 'Error checking follow status' });
  }
}; 