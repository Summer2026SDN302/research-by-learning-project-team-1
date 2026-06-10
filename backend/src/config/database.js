const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ste_db';

mongoose.connection.on('connected', () => {
    console.log('[MongoDB] Connected successfully');
});

mongoose.connection.on('error', (err) => {
    console.error(`[MongoDB] Connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
    console.log('[MongoDB] Disconnected');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('[MongoDB] Connection closed due to application termination');
    process.exit(0);
});

const connect = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
    } catch (err) {
        console.error(`[MongoDB] Initial connection failed: ${err.message}`);
        process.exit(1);
    }
};

module.exports = { connect };
