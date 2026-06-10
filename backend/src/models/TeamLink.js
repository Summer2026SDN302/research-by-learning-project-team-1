const mongoose = require('mongoose');

const teamLinkSchema = new mongoose.Schema(
    {
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
            required: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 180
        },
        url: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default: '',
            maxlength: 1000
        },
        type: {
            type: String,
            enum: ['meeting', 'repository', 'document', 'reference', 'prototype', 'other'],
            default: 'reference'
        }
    },
    {
        timestamps: true
    }
);

teamLinkSchema.index({ team: 1, type: 1 });
teamLinkSchema.index({ createdBy: 1 });
teamLinkSchema.index({ title: 'text', description: 'text', url: 'text' });

const TeamLink = mongoose.model('TeamLink', teamLinkSchema);

module.exports = TeamLink;
