const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser
} = require('../controllers/followController');

// Protected routes
router.get('/followers', auth, getFollowers);
router.get('/following', auth, getFollowing);
router.post('/:userId', auth, followUser);
router.delete('/:userId', auth, unfollowUser);

module.exports = router; 