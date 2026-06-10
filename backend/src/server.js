const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { connect } = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const teamRoutes = require('./routes/teamRoutes');
const courseRoutes = require('./routes/courseRoutes');
const adminRoutes = require('./routes/adminRoutes');
const materialRoutes = require('./routes/materialRoutes');
const quizRoutes = require('./routes/quizRoutes');
const postRoutes = require('./routes/postRoutes');
const eventRoutes = require('./routes/eventRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const workspaceRoutes = require('./routes/workspaceRoutes');
const activityRoutes = require('./routes/activityRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const parseOrigins = (value) => {
    if (!value) {
        return [];
    }

    return value
        .replace(/^\[/, '')
        .replace(/\]$/, '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
};
const allowedOrigins = parseOrigins(
    process.env.CLIENT_URLS ||
    process.env.CLIENT_URL ||
    'http://localhost:5173,http://127.0.0.1:5173'
);
const corsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Nguồn truy cập không được CORS cho phép'));
    },
    credentials: true
};

app.use(helmet());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: {
        success: false,
        message: 'Bạn thao tác quá nhanh, vui lòng thử lại sau.'
    }
});
app.use('/api', limiter);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/teams', teamRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/materials', materialRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/workspace', workspaceRoutes);
app.use('/api/v1/activities', activityRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'STE API đang hoạt động',
        timestamp: new Date().toISOString()
    });
});

app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Không tìm thấy đường dẫn ${req.originalUrl}`
    });
});

app.use(errorHandler);

const startServer = async () => {
    try {
        await connect();
        app.listen(PORT, () => {
            console.log(`[Server] STE API running on port ${PORT}`);
            console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (err) {
        console.error(`[Server] Failed to start: ${err.message}`);
        process.exit(1);
    }
};

startServer();
