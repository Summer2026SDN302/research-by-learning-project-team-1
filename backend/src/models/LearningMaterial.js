const mongoose = require('mongoose');

const learningMaterialSchema = new mongoose.Schema(
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
            default: '',
            maxlength: 1000
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
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
        tags: {
            type: [String],
            default: []
        },
        visibility: {
            type: String,
            enum: ['course', 'public', 'private'],
            default: 'course'
        },
        downloadCount: {
            type: Number,
            min: 0,
            default: 0
        },
        verified: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

learningMaterialSchema.index({ course: 1, createdAt: -1 });
learningMaterialSchema.index({ uploadedBy: 1 });
learningMaterialSchema.index({ tags: 1 });
learningMaterialSchema.index({ title: 'text', description: 'text', tags: 'text' });

const LearningMaterial = mongoose.model('LearningMaterial', learningMaterialSchema);

module.exports = LearningMaterial;
