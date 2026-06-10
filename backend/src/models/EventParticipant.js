const mongoose = require('mongoose');

const eventParticipantSchema = new mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: ['registered', 'checked_in', 'cancelled', 'waitlisted'],
            default: 'registered'
        },
        registeredAt: {
            type: Date,
            default: Date.now
        },
        checkedInAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

eventParticipantSchema.index({ event: 1, user: 1 }, { unique: true });
eventParticipantSchema.index({ user: 1, registeredAt: -1 });
eventParticipantSchema.index({ event: 1, status: 1 });

const EventParticipant = mongoose.model('EventParticipant', eventParticipantSchema);

module.exports = EventParticipant;
