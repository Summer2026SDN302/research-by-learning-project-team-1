const mongoose = require('mongoose');

const postReactionSchema = new mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        type: {
            type: String,
            enum: ['like', 'love', 'useful', 'bookmark'],
            default: 'like'
        }
    },
    {
        timestamps: true
    }
);

postReactionSchema.index({ post: 1, user: 1, type: 1 }, { unique: true });
postReactionSchema.index({ user: 1, createdAt: -1 });

const PostReaction = mongoose.model('PostReaction', postReactionSchema);

module.exports = PostReaction;
