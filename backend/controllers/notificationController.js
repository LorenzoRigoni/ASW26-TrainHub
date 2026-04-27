const Notification = require('../models/notification');

/**
 * Get all notifications for the logged-in user
 */
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            userId: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications',
            error: error.message
        });
    }
};

/**
 * Get unread notifications for the logged-in user
 */
exports.getUnreadNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            userId: req.user._id,
            isRead: false
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching unread notifications',
            error: error.message
        });
    }
};

/**
 * Get a specific notification by ID
 */
exports.getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        // Check if the notification belongs to the current user
        if (notification.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to access this notification'
            });
        }

        res.status(200).json({
            success: true,
            data: notification
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching notification',
            error: error.message
        });
    }
};

/**
 * Mark a specific notification as read
 */
exports.markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        // Check if the notification belongs to the current user
        if (notification.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this notification'
            });
        }

        notification.isRead = true;
        notification.updatedAt = Date.now();
        await notification.save();

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            data: notification
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error marking notification as read',
            error: error.message
        });
    }
};

/**
 * Mark all notifications as read for the logged-in user
 */
exports.markAllNotificationsAsRead = async (req, res) => {
    try {
        const result = await Notification.updateMany(
            { userId: req.user._id, isRead: false },
            { isRead: true, updatedAt: Date.now() }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read',
            count: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error marking all notifications as read',
            error: error.message
        });
    }
};

/**
 * Delete a specific notification
 */
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        // Check if the notification belongs to the current user
        if (notification.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this notification'
            });
        }

        await Notification.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting notification',
            error: error.message
        });
    }
};

/**
 * Delete all notifications for the logged-in user
 */
exports.deleteAllNotifications = async (req, res) => {
    try {
        const result = await Notification.deleteMany({
            userId: req.user._id
        });

        res.status(200).json({
            success: true,
            message: 'All notifications deleted successfully',
            count: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting all notifications',
            error: error.message
        });
    }
};

/**
 * Create a notification (internal use)
 * Called by other controllers to trigger notifications
 */
exports.createNotification = async (userId, type, title, message, relatedEntityId = null, relatedEntityType = null, expirationDays = null) => {
    try {
        const notification = new Notification({
            userId,
            type,
            title,
            message,
            relatedEntityId,
            relatedEntityType,
            expirationDays
        });

        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error.message);
        return null;
    }
};

/**
 * Get count of unread notifications for a user
 * Useful for displaying badge in UI
 */
exports.getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            userId: req.user._id,
            isRead: false
        });

        res.status(200).json({
            success: true,
            unreadCount: count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching unread count',
            error: error.message
        });
    }
};
