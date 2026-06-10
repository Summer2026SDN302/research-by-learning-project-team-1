const mongoose = require('mongoose');

const teamTaskSchema = new mongoose.Schema(
    {
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
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
            maxlength: 2000
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        assignees: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                }
            ],
            default: []
        },
        status: {
            type: String,
            enum: ['todo', 'in_progress', 'review', 'done'],
            default: 'todo'
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium'
        },
        dueAt: {
            type: Date,
            default: null
        },
        completedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

teamTaskSchema.index({ team: 1, status: 1 });
teamTaskSchema.index({ assignees: 1, status: 1 });
teamTaskSchema.index({ dueAt: 1 });
teamTaskSchema.index({ title: 'text', description: 'text' });

const TeamTask = mongoose.model('TeamTask', teamTaskSchema);

module.exports = TeamTask;
