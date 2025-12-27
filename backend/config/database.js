const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log('MongoDB Connected:', conn.connection.host);
        console.log('Database:', conn.connection.name);

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });

    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
    }
};

const closeDb = async () => {
    try {
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error on closing connection:', error.message);
    }
};

module.exports = { connectDb, closeDb };