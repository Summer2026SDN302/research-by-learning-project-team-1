const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 180
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000
        },
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        location: {
            type: String,
            default: '',
            trim: true,
            maxlength: 250
        },
        onlineLink: {
            type: String,
            default: '',
            trim: true
        },
        startAt: {
            type: Date,
            required: true
        },
        endAt: {
            type: Date,
            required: true
        },
        capacity: {
            type: Number,
            min: 1,
            default: 100
        },
        tags: {
            type: [String],
            default: []
        },
        status: {
            type: String,
            enum: ['draft', 'published', 'cancelled', 'completed'],
            default: 'published'
        }
    },
    {
        timestamps: true
    }
);

eventSchema.index({ organizer: 1, startAt: -1 });
eventSchema.index({ status: 1, startAt: 1 });
eventSchema.index({ tags: 1 });
eventSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
