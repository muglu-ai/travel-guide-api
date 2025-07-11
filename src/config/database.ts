import mongoose from 'mongoose';
import config from './env';

export const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(config.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s
            socketTimeoutMS: 45000, // Close sockets after 45s
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
};
