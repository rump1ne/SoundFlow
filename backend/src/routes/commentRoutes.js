const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const commentController = require('../controllers/commentController');

// Public routes
router.get('/', commentController.getComments);
router.get('/:id', commentController.getComment);
router.get('/:id/replies', commentController.getReplies);

// Protected routes
router.post('/', auth, commentController.createComment);
router.put('/:id', auth, commentController.updateComment);
router.delete('/:id', auth, commentController.deleteComment);

module.exports = router; 