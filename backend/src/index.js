import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';

import { config } from './config/index.js';
import { initDatabase } from './models/storage.js';

import healthRoutes from './routes/health.js';
import sourcesRoutes from './routes/sources.js';
import researchRoutes from './routes/research.js';
import evaluateRoutes from './routes/evaluate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Middleware: CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' }
});

app.use('/api/', apiLimiter);

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/sources', sourcesRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/evaluate', evaluateRoutes);

// Serve Frontend in production if built
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
    if (err) {
      res.status(404).json({ error: 'Endpoint not found or frontend not built yet. Access Vite dev server on port 5173.' });
    }
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('[SuchnaSetu Server Error]:', err.stack || err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    code: err.code || 'SERVER_ERROR'
  });
});

// Start Server
async function startServer() {
  await initDatabase();
  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  SUCHNASETU BACKEND RUNNING ON http://localhost:${PORT}`);
    console.log(`  Tagline: Connecting Information. Revealing What's Missing.`);
    console.log(`  Hackathon: SHINCHAN ONLINE HACKATHON 2026`);
    console.log(`=======================================================`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
