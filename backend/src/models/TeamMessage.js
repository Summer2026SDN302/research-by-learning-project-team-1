const mongoose = require('mongoose');

const teamMessageSchema = new mongoose.Schema(
    {
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
            required: true
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 3000
        },
        attachments: {
            type: [
                {
                    name: String,
                    url: String,
                    type: String
                }
            ],
            default: []
        },
        isPinned: {
            type: Boolean,
            default: false
        },
        editedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

teamMessageSchema.index({ team: 1, createdAt: -1 });
teamMessageSchema.index({ sender: 1 });
teamMessageSchema.index({ team: 1, isPinned: 1 });

const TeamMessage = mongoose.model('TeamMessage', teamMessageSchema);

module.exports = TeamMessage;
