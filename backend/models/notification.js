const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },

    type: {
        type: String,
        enum: ['program_created', 'package_expiring', 'program_completed'],
        required: true
    },

    title: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    relatedEntityId: {
        type: mongoose.Types.ObjectId,
        default: null
    },

    relatedEntityType: {
        type: String,
        enum: ['TrainingProgram', 'TrainingPackage', null],
        default: null
    },

    isRead: {
        type: Boolean,
        default: false
    },

    expirationDays: {
        type: Number,
        default: null
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
