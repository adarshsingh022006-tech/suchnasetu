import express from 'express';
import { StorageRepository } from '../models/storage.js';
import { config } from '../config/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const isMongo = await StorageRepository.isConnected();
  res.json({
    status: 'healthy',
    product: 'SuchnaSetu',
    tagline: "Connecting Information. Revealing What's Missing.",
    hackathon: 'SHINCHAN ONLINE HACKATHON 2026',
    problemStatement: 'DIGITAL DARK SPOT – AI-Assisted Information Gap Detection Platform',
    timestamp: new Date().toISOString(),
    aiEngine: {
      hasGeminiApiKey: !!config.geminiApiKey,
      model: config.geminiModel,
      fallbackMode: 'Deterministic Heuristic NLP Engine active'
    },
    storage: {
      mode: isMongo ? 'MongoDB Connected' : 'In-Memory Demo Storage',
      isMongo
    }
  });
});

export default router;
