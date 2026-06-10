const mongoose = require('mongoose');

const systemActivitySchema = new mongoose.Schema(
    {
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        action: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120
        },
        resourceType: {
            type: String,
            required: true,
            trim: true,
            maxlength: 80
        },
        resourceId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        ipAddress: {
            type: String,
            default: '',
            trim: true
        },
        userAgent: {
            type: String,
            default: '',
            trim: true
        },
        severity: {
            type: String,
            enum: ['info', 'warning', 'critical'],
            default: 'info'
        }
    },
    {
        timestamps: true
    }
);

systemActivitySchema.index({ actor: 1, createdAt: -1 });
systemActivitySchema.index({ resourceType: 1, resourceId: 1 });
systemActivitySchema.index({ action: 1, createdAt: -1 });
systemActivitySchema.index({ severity: 1, createdAt: -1 });

const SystemActivity = mongoose.model('SystemActivity', systemActivitySchema);

module.exports = SystemActivity;
