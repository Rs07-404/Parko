import mongoose from "mongoose";
import registerModels from "./registerModels";
import { MONGODB_URI } from "@root/config/constants";

if (!MONGODB_URI) {
    console.warn("MongoDB URI not found");
}

interface MongooseCache {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
}


declare global {
    interface GlobalCache {
        mongooseCache?: MongooseCache;
    }
}


const globalNode = global as unknown as GlobalCache;

globalNode.mongooseCache = globalNode.mongooseCache || { conn: null, promise: null };
const cached: MongooseCache = globalNode.mongooseCache;

export async function connectToDatabase() {
    try {
        if (cached.conn) {
            return cached.conn;
        }
    
        if (!cached.promise) {
            cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).then((m) => m.connection);
        }
        
    
        cached.conn = await cached.promise;
        registerModels(); // Ensure models are registered after connection
        globalNode.mongooseCache = cached;
        return cached.conn;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw new Error("Failed to connect to MongoDB");
    }
}
