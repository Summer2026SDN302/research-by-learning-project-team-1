const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100,
        },
        description: {
            type: String,
            required: true,
            maxlength: 1000,
        },
        leader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        members: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
            default: [],
        },
        maxMembers: {
            type: Number,
            required: true,
            min: 2,
            max: 10,
            default: 5,
        },
        status: {
            type: String,
            enum: ['open', 'closed', 'in_progress', 'completed'],
            default: 'open',
        },
        requiredSkills: {
            type: [String],
            default: [],
        },
        tags: {
            type: [String],
            default: [],
        },
        course: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

teamSchema.index({ status: 1 });
teamSchema.index({ leader: 1 });
teamSchema.index({ tags: 1 });
teamSchema.index({ requiredSkills: 1 });

teamSchema.virtual('memberCount').get(function () {
    return this.members.length;
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
