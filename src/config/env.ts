import dotenv from 'dotenv';

dotenv.config();

interface Config {
    NODE_ENV: string;
    PORT: number;
    MONGODB_URI: string;
    MONGODB_NAME: string;
    JWT_SECRET: string;
    API_VERSION: string;
    CORS_ORIGIN: string;
}

const config: Config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '8000', 10),
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://muglu:h6LYayKgF5iZIXSQ@travhoo.ovi11el.mongodb.net/test?retryWrites=true&w=majority&appName=travhoo',
    MONGODB_NAME: process.env.MONGODB_NAME || 'travel_guide',
    JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
    API_VERSION: process.env.API_VERSION || 'v1',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000'
};

export default config;
