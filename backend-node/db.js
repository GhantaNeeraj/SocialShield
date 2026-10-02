import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FALLBACK_FILE = path.join(__dirname, 'history_fallback.json');

let isMongoConnected = false;
let fallbackDatabase = [];
let connectionPromise;

// Load existing fallback DB if file exists
if (fs.existsSync(FALLBACK_FILE)) {
  try {
    const raw = fs.readFileSync(FALLBACK_FILE, 'utf-8');
    fallbackDatabase = JSON.parse(raw);
  } catch (err) {
    fallbackDatabase = [];
  }
}

export function connectDB() {
  if (isMongoConnected) return Promise.resolve(true);
  if (connectionPromise) return connectionPromise;
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialshield';
  connectionPromise = mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10
    }).then(() => {
      isMongoConnected = true;
      console.log('✅ Connected to MongoDB database!');
      return true;
    }).catch(() => {
      isMongoConnected = false;
      console.log('⚠️ Local MongoDB connection unavailable. Utilizing JSON persistence for local development.');
      return false;
    });
  return connectionPromise;
}

export function saveFallbackDB() {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(fallbackDatabase, null, 2));
  } catch (err) {
    console.error('Error saving fallback DB:', err);
  }
}

export { isMongoConnected, fallbackDatabase };
