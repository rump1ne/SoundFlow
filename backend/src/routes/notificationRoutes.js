const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} = require('../controllers/notificationController');

// Protected routes
router.get('/', auth, getNotifications);
router.get('/unread/count', auth, getUnreadCount);
router.put('/:notificationId/read', auth, markAsRead);
router.put('/read-all', auth, markAllAsRead);
router.delete('/:notificationId', auth, deleteNotification);

module.exports = router; 