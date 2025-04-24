// lib/redis.ts
import { RedisOptions } from 'ioredis';


export const BASE_URL= process.env.BASE_URL || "http://localhost:3000";

// Tokens
export const JWT_SECRET= process.env.JWT_SECRET || "";
export const AES_SECRET= process.env.AES_SECRET || "";

// Environment
export const NODE_ENV= process.env.NODE_ENV || "Development";

// Databases
export const MONGODB_URI= process.env.MONGODB_URI || "";

export const VAPID_PRIVATE_KEY= process.env.VAPID_PRIVATE_KEY || "";
export const VAPID_PUBLIC_KEY= process.env.VAPID_PUBLIC_KEY || "";
