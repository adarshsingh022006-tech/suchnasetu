import app from '../backend/src/index.js';
import { initDatabase } from '../backend/src/models/storage.js';

let dbInitialized = false;

export default async function handler(req, res) {
  if (!dbInitialized) {
    try {
      await initDatabase();
      dbInitialized = true;
    } catch (err) {
      console.warn('Vercel DB Init Notice:', err.message);
    }
  }
  return app(req, res);
}
