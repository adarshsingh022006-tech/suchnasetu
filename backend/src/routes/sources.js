import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { StorageRepository } from '../models/storage.js';
import { scrapeWebpage, computeContentHash } from '../services/urlScraper.js';
import { extractTextFromPdf } from '../services/pdfExtractor.js';
import { DEMO_SCHOLARSHIP_DATA } from '../data/demoScholarshipSources.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// GET /api/sources/sample-pdf - Download a real sample PDF to test upload
router.get('/sample-pdf', (req, res) => {
  const filePath = path.resolve(__dirname, '../../sample-documents/Sample-Policy-Report.pdf');
  res.download(filePath, 'SuchnaSetu-Sample-Policy-Report.pdf');
});

// Memory storage for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF documents (.pdf) are permitted.'));
    }
  }
});

// POST /api/sources/url
router.post('/url', async (req, res) => {
  try {
    const { sessionId, url } = req.body;
    if (!sessionId || !url) {
      return res.status(400).json({ error: 'sessionId and url are required.' });
    }

    const session = await StorageRepository.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: `Research session '${sessionId}' not found.` });
    }

    const scraped = await scrapeWebpage(url);
    const sourceId = `src_url_${Date.now()}_${scraped.contentHash.slice(0, 6)}`;

    const saved = await StorageRepository.addSource({
      sessionId,
      sourceId,
      title: scraped.title,
      url: scraped.url,
      domain: scraped.domain,
      publishedDate: scraped.publishedDate,
      retrievedDate: scraped.retrievedDate,
      extractedContent: scraped.extractedContent,
      contentHash: scraped.contentHash,
      sourceType: scraped.sourceType,
      byteSize: scraped.byteSize
    });

    res.status(201).json({ success: true, source: saved });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/sources/text
router.post('/text', async (req, res) => {
  try {
    const { sessionId, title, text, sourceType = 'general_web' } = req.body;
    if (!sessionId || !text || text.trim().length < 20) {
      return res.status(400).json({ error: 'sessionId and substantive text (at least 20 chars) are required.' });
    }

    const session = await StorageRepository.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: `Research session '${sessionId}' not found.` });
    }

    const contentHash = computeContentHash(text);
    const sourceId = `src_txt_${Date.now()}_${contentHash.slice(0, 6)}`;

    const saved = await StorageRepository.addSource({
      sessionId,
      sourceId,
      title: (title || 'Pasted Research Evidence').trim(),
      url: null,
      domain: 'user-input',
      publishedDate: null,
      retrievedDate: new Date().toISOString(),
      extractedContent: text.trim(),
      contentHash,
      sourceType,
      byteSize: Buffer.byteLength(text, 'utf8')
    });

    res.status(201).json({ success: true, source: saved });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/sources/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file was uploaded.' });
    }

    const session = await StorageRepository.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: `Research session '${sessionId}' not found.` });
    }

    const extracted = await extractTextFromPdf(req.file.buffer, req.file.originalname);
    const sourceId = `src_pdf_${Date.now()}_${extracted.contentHash.slice(0, 6)}`;

    const saved = await StorageRepository.addSource({
      sessionId,
      sourceId,
      title: req.file.originalname,
      url: null,
      domain: 'uploaded-pdf',
      publishedDate: extracted.publishedDate,
      retrievedDate: extracted.retrievedDate,
      extractedContent: extracted.extractedContent,
      contentHash: extracted.contentHash,
      sourceType: 'uploaded_document',
      totalPages: extracted.totalPages,
      byteSize: req.file.size
    });

    res.status(201).json({ success: true, source: saved });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/sources/load-demo/:sessionId
router.post('/load-demo/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await StorageRepository.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: `Research session '${sessionId}' not found.` });
    }

    const added = [];
    for (const src of DEMO_SCHOLARSHIP_DATA.sources) {
      const saved = await StorageRepository.addSource({
        sessionId,
        ...src,
        byteSize: Buffer.byteLength(src.extractedContent, 'utf8')
      });
      added.push(saved);
    }

    res.status(201).json({
      success: true,
      message: 'Demonstration scholarship sources loaded into workspace.',
      sourcesAdded: added.length,
      sources: added
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/sources/:sessionId/:sourceId
router.delete('/:sessionId/:sourceId', async (req, res) => {
  try {
    const { sessionId, sourceId } = req.params;
    const success = await StorageRepository.removeSource(sessionId, sourceId);
    if (!success) {
      return res.status(404).json({ error: 'Source not found.' });
    }
    res.json({ success: true, message: 'Source removed from research session.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
