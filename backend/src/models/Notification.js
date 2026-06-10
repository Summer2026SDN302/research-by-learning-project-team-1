const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 180
        },
        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },
        type: {
            type: String,
            enum: ['system', 'team', 'join_request', 'course', 'post', 'quiz', 'event'],
            default: 'system'
        },
        resourceType: {
            type: String,
            default: '',
            trim: true
        },
        resourceId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        isRead: {
            type: Boolean,
            default: false
        },
        readAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
