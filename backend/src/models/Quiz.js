const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true
        },
        options: {
            type: [String],
            validate: {
                validator: (options) => options.length >= 2,
                message: 'Mỗi câu hỏi phải có ít nhất hai lựa chọn'
            }
        },
        correctAnswer: {
            type: String,
            required: true,
            trim: true
        },
        explanation: {
            type: String,
            default: '',
            maxlength: 1000
        },
        points: {
            type: Number,
            min: 1,
            default: 1
        }
    },
    {
        _id: true
    }
);

const quizSchema = new mongoose.Schema(
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
            default: null
        },
        material: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LearningMaterial',
            default: null
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        source: {
            type: String,
            enum: ['manual', 'ai_generated'],
            default: 'manual'
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'medium'
        },
        questions: {
            type: [questionSchema],
            validate: {
                validator: (questions) => questions.length > 0,
                message: 'Bài quiz phải có ít nhất một câu hỏi'
            }
        },
        durationMinutes: {
            type: Number,
            min: 1,
            default: 15
        },
        isPublished: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

quizSchema.index({ course: 1, isPublished: 1 });
quizSchema.index({ material: 1 });
quizSchema.index({ createdBy: 1, createdAt: -1 });

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
