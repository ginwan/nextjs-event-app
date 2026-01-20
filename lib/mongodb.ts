import mongoose, { Mongoose } from 'mongoose';

// Type definition for cached connection
interface MongooseCache {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

// Declare global to avoid TypeScript errors with augmented global scope
declare global {
    var mongooseCache: MongooseCache;
}

// Initialize cache (use globalThis to persist across hot reloads in development)
const cached: MongooseCache = globalThis.mongooseCache || {
    conn: null,
    promise: null,
};

if (!globalThis.mongooseCache) {
    globalThis.mongooseCache = cached;
}

/**
 * Connect to MongoDB using Mongoose with connection caching.
 * This prevents multiple connections during development hot reloads.
 * @returns Promise<Mongoose> - The Mongoose instance
 */
async function connectMongoDB(): Promise<Mongoose> {
    // Return cached connection if available
    if (cached.conn) {
        return cached.conn;
    }

    // Return existing promise if connection is in progress
    if (cached.promise) {
        return cached.promise;
    }

    // Get MongoDB URI from environment variables
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error('MONGODB_URI environment variable is not defined');
    }

    // Create new connection promise
    cached.promise = mongoose.connect(mongoUri, {
        bufferCommands: false,
        maxPoolSize: 10,
        minPoolSize: 5,
    });

    // Resolve promise and cache connection
    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectMongoDB;
