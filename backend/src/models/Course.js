const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
            minlength: 2,
            maxlength: 20
        },
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 150
        },
        description: {
            type: String,
            default: '',
            maxlength: 1000
        },
        lecturer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        students: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                }
            ],
            default: []
        },
        semester: {
            type: String,
            default: '',
            trim: true
        },
        status: {
            type: String,
            enum: ['active', 'archived', 'draft'],
            default: 'active'
        }
    },
    {
        timestamps: true
    }
);

courseSchema.index({ lecturer: 1, status: 1 });
courseSchema.index({ students: 1 });
courseSchema.index({ name: 'text', code: 'text', description: 'text' });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
