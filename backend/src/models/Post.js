const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 180
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000
        },
        type: {
            type: String,
            enum: ['announcement', 'academic_update', 'event_post', 'club_announcement'],
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            default: null
        },
        targetRoles: {
            type: [String],
            enum: ['student', 'lecturer', 'admin', 'club_leader'],
            default: ['student']
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
        status: {
            type: String,
            enum: ['draft', 'published', 'archived', 'moderated'],
            default: 'published'
        },
        publishedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

postSchema.index({ type: 1, status: 1, publishedAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ course: 1, publishedAt: -1 });
postSchema.index({ targetRoles: 1 });
postSchema.index({ title: 'text', content: 'text' });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
