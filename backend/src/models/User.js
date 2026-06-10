const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },
        role: {
            type: String,
            enum: ['student', 'lecturer', 'admin', 'club_leader'],
            default: 'student',
        },
        avatar: {
            type: String,
            default: '',
        },
        gpa: {
            type: Number,
            min: 0,
            max: 4,
            default: 0,
        },
        skills: {
            type: [String],
            default: [],
        },
        interests: {
            type: [String],
            default: [],
        },
        major: {
            type: String,
            default: '',
        },
        description: {
            type: String,
            maxlength: 500,
            default: '',
        },
        refreshToken: {
            type: String,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.index({ skills: 1 });
userSchema.index({ interests: 1 });
userSchema.index({ major: 1 });
userSchema.index({ role: 1 });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
