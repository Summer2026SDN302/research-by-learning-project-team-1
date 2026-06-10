const mongoose = require('mongoose');

const teamDocumentSchema = new mongoose.Schema(
    {
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
            required: true
        },
        uploadedBy: {
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
        description: {
            type: String,
            default: '',
            maxlength: 1000
        },
        fileUrl: {
            type: String,
            required: true,
            trim: true
        },
        fileName: {
            type: String,
            required: true,
            trim: true
        },
        fileType: {
            type: String,
            default: '',
            trim: true
        },
        fileSize: {
            type: Number,
            min: 0,
            default: 0
        },
        category: {
            type: String,
            enum: ['document', 'submission', 'reference', 'meeting_note', 'other'],
            default: 'document'
        }
    },
    {
        timestamps: true
    }
);

teamDocumentSchema.index({ team: 1, createdAt: -1 });
teamDocumentSchema.index({ uploadedBy: 1 });
teamDocumentSchema.index({ title: 'text', description: 'text', fileName: 'text' });

const TeamDocument = mongoose.model('TeamDocument', teamDocumentSchema);

module.exports = TeamDocument;
