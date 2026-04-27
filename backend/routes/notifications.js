const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getAllNotifications,
    getUnreadNotifications,
    getNotificationById,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    deleteAllNotifications,
    getUnreadCount
} = require('../controllers/notificationController');

// ==================== Notification Routes ====================

/**
 * @route GET /api/notifications
 * @desc Get all notifications for the logged-in user
 * @access Private
 */
router.get('/', protect, getAllNotifications);

/**
 * @route GET /api/notifications/unread
 * @desc Get unread notifications for the logged-in user
 * @access Private
 */
router.get('/unread', protect, getUnreadNotifications);

/**
 * @route GET /api/notifications/unread-count
 * @desc Get count of unread notifications
 * @access Private
 */
router.get('/unread-count', protect, getUnreadCount);

/**
 * @route GET /api/notifications/:id
 * @desc Get a specific notification by ID
 * @access Private
 */
router.get('/:id', protect, getNotificationById);

/**
 * @route PATCH /api/notifications/:id/read
 * @desc Mark a specific notification as read
 * @access Private
 */
router.patch('/:id/read', protect, markNotificationAsRead);

/**
 * @route PATCH /api/notifications/mark-all-read
 * @desc Mark all notifications as read for logged-in user
 * @access Private
 */
router.patch('/mark-all-read', protect, markAllNotificationsAsRead);

/**
 * @route DELETE /api/notifications/:id
 * @desc Delete a specific notification
 * @access Private
 */
router.delete('/:id', protect, deleteNotification);

/**
 * @route DELETE /api/notifications
 * @desc Delete all notifications for logged-in user
 * @access Private
 */
router.delete('/', protect, deleteAllNotifications);

module.exports = router;
