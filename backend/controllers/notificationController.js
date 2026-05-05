const Notification = require('../models/notification');
const { getIO } = require('../socket');
const { handleError, badRequest, notFound, forbidden, requiredFields, getUserResource, getUserResources } = require('./controllerHelpers');

exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await getUserResources(Notification, req.user._id, {}, { createdAt: -1 }, 'userId');

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });
    } catch (error) {
        handleError(res, error, 'Error fetching notifications');
    }
};

exports.getUnreadNotifications = async (req, res) => {
    try {
        const notifications = await getUserResources(Notification, req.user._id, { isRead: false }, { createdAt: -1 }, 'userId');

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });
    } catch (error) {
        handleError(res, error, 'Error fetching unread notifications');
    }
};

exports.getNotificationById = async (req, res) => {
    try {
        const { resource, error } = await getUserResource(Notification, req.params.id, req.user._id, 'userId');

        if (error === 'NOT_FOUND') return notFound(res, 'Notification not found');
        if (error === 'FORBIDDEN') return forbidden(res);

        res.status(200).json({ success: true, data: resource });
    } catch (error) {
        handleError(res, error, 'Error fetching notification');
    }
};

exports.markNotificationAsRead = async (req, res) => {
    try {
        const { resource, error } = await getUserResource(Notification, req.params.id, req.user._id, 'userId');

        if (error === 'NOT_FOUND') return notFound(res, 'Notification not found');
        if (error === 'FORBIDDEN') return forbidden(res);

        resource.isRead = true;
        await resource.save();

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            data: resource
        });
    } catch (error) {
        handleError(res, error, 'Error marking notification as read');
    }
};

exports.markAllNotificationsAsRead = async (req, res) => {
    try {
        const result = await Notification.updateMany(
            { userId: req.user._id, isRead: false },
            { isRead: true }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read',
            count: result.modifiedCount
        });
    } catch (error) {
        handleError(res, error, 'Error marking all notifications as read');
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const { resource, error } = await getUserResource(Notification, req.params.id, req.user._id, 'userId');

        if (error === 'NOT_FOUND') return notFound(res, 'Notification not found');
        if (error === 'FORBIDDEN') return forbidden(res);

        await resource.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        handleError(res, error, 'Error deleting notification');
    }
};

exports.deleteAllNotifications = async (req, res) => {
    try {
        const result = await Notification.deleteMany({ userId: req.user._id });

        res.status(200).json({
            success: true,
            message: 'All notifications deleted successfully',
            count: result.deletedCount
        });
    } catch (error) {
        handleError(res, error, 'Error deleting all notifications');
    }
};

// =========================
// Notification Creator
// =========================

exports.createNotification = async (
    userId,
    type,
    title,
    message,
    relatedEntityId = null,
    relatedEntityType = null,
    expirationDays = null
) => {
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

    try {
        const io = getIO();
        io.to(`user_${userId}`).emit('notification:new', notification);
    } catch (socketError) {
        console.error('Socket error:', socketError.message);
    }

    return notification;
};

exports.sendNotification = async (req, res) => {
    try {
        const { userId, type, title, message, relatedEntityId, relatedEntityType, expirationDays } = req.body;

        if (!requiredFields(req.body, ['userId', 'type', 'title', 'message'])) {
            return badRequest(res);
        }

        const notification = await exports.createNotification(
            userId,
            type,
            title,
            message,
            relatedEntityId,
            relatedEntityType,
            expirationDays
        );

        res.status(201).json({
            success: true,
            message: 'Notification sent',
            data: notification
        });
    } catch (error) {
        handleError(res, error, 'Error creating notification');
    }
};

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
        handleError(res, error, 'Error fetching unread count');
    }
};
