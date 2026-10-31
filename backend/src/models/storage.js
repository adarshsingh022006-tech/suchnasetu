import mongoose from 'mongoose';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { config } from '../config/index.js';

// In-Memory Fallback Store
const memoryStore = {
  sessions: new Map(),
  sources: new Map(),
  reports: new Map()
};

const TMP_STORE_PATH = path.join(os.tmpdir(), 'suchnasetu_memstore.json');

function saveStoreToDisk() {
  try {
    const serialized = {
      sessions: Array.from(memoryStore.sessions.entries()),
      sources: Array.from(memoryStore.sources.entries()),
      reports: Array.from(memoryStore.reports.entries())
    };
    fs.writeFileSync(TMP_STORE_PATH, JSON.stringify(serialized), 'utf8');
  } catch (err) {
    // Silently ignore in read-only environments
  }
}

function loadStoreFromDisk() {
  try {
    if (fs.existsSync(TMP_STORE_PATH)) {
      const data = JSON.parse(fs.readFileSync(TMP_STORE_PATH, 'utf8'));
      if (data.sessions) memoryStore.sessions = new Map(data.sessions);
      if (data.sources) memoryStore.sources = new Map(data.sources);
      if (data.reports) memoryStore.reports = new Map(data.reports);
    }
  } catch (err) {
    // Ignore corrupt or unreadable cache
  }
}

let isMongoConnected = false;

// Mongoose Schema Definitions
const SourceSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  sourceId: { type: String, required: true },
  title: String,
  url: String,
  domain: String,
  publishedDate: String,
  retrievedDate: String,
  extractedContent: String,
  contentHash: String,
  sourceType: String,
  totalPages: Number,
  byteSize: Number,
  demoLabel: String,
  status: { type: String, default: 'active' }
}, { timestamps: true });

const ResearchSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  question: { type: String, required: true },
  domain: { type: String, default: 'scholarship' },
  status: { type: String, default: 'draft' }, // draft, analyzing, completed
  sourcesCount: { type: Number, default: 0 },
  lastAnalyzedAt: Date,
  report: { type: mongoose.Schema.Types.Mixed, default: null }
}, { timestamps: true });

let MongooseSource = null;
let MongooseSession = null;

export async function initDatabase() {
  loadStoreFromDisk();

  if (!config.mongodbUri) {
    console.log('[SuchnaSetu Storage] No MONGODB_URI provided. Running in Demo In-Memory Storage Mode (synced to temp cache).');
    return { mode: 'in_memory', connected: false };
  }

  try {
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 4000
    });
    isMongoConnected = true;
    MongooseSource = mongoose.model('Source', SourceSchema);
    MongooseSession = mongoose.model('ResearchSession', ResearchSessionSchema);
    console.log('[SuchnaSetu Storage] Successfully connected to MongoDB.');
    return { mode: 'mongodb', connected: true };
  } catch (err) {
    console.warn(`[SuchnaSetu Storage] MongoDB connection failed (${err.message}). Falling back to In-Memory Demo Storage.`);
    isMongoConnected = false;
    return { mode: 'in_memory_fallback', connected: false, error: err.message };
  }
}

export const StorageRepository = {
  async isConnected() {
    return isMongoConnected;
  },

  async createSession({ sessionId, question, domain = 'scholarship' }) {
    if (isMongoConnected && MongooseSession) {
      const doc = await MongooseSession.create({
        sessionId,
        question,
        domain,
        status: 'draft'
      });
      return doc.toObject();
    } else {
      const session = {
        sessionId,
        question,
        domain,
        status: 'draft',
        sourcesCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        report: null
      };
      memoryStore.sessions.set(sessionId, session);
      saveStoreToDisk();
      return session;
    }
  },

  async getSession(sessionId) {
    if (isMongoConnected && MongooseSession) {
      const doc = await MongooseSession.findOne({ sessionId }).lean();
      return doc;
    } else {
      return memoryStore.sessions.get(sessionId) || null;
    }
  },

  async getAllSessions() {
    if (isMongoConnected && MongooseSession) {
      return await MongooseSession.find().sort({ updatedAt: -1 }).limit(20).lean();
    } else {
      return Array.from(memoryStore.sessions.values()).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }
  },

  async addSource(sourceData) {
    const { sessionId } = sourceData;
    if (isMongoConnected && MongooseSource) {
      const doc = await MongooseSource.create(sourceData);
      await MongooseSession.updateOne({ sessionId }, { $inc: { sourcesCount: 1 } });
      return doc.toObject();
    } else {
      const existing = memoryStore.sources.get(sessionId) || [];
      const updated = [...existing, { ...sourceData, createdAt: new Date().toISOString() }];
      memoryStore.sources.set(sessionId, updated);

      const sess = memoryStore.sessions.get(sessionId);
      if (sess) {
        sess.sourcesCount = updated.filter(s => s.status !== 'removed').length;
        sess.updatedAt = new Date().toISOString();
      }
      saveStoreToDisk();
      return sourceData;
    }
  },

  async getSources(sessionId) {
    if (isMongoConnected && MongooseSource) {
      return await MongooseSource.find({ sessionId, status: 'active' }).lean();
    } else {
      const list = memoryStore.sources.get(sessionId) || [];
      return list.filter(s => s.status !== 'removed');
    }
  },

  async removeSource(sessionId, sourceId) {
    if (isMongoConnected && MongooseSource) {
      await MongooseSource.updateOne({ sessionId, sourceId }, { status: 'removed' });
      await MongooseSession.updateOne({ sessionId }, { $inc: { sourcesCount: -1 } });
      return true;
    } else {
      const list = memoryStore.sources.get(sessionId) || [];
      const item = list.find(s => s.sourceId === sourceId);
      if (item) {
        item.status = 'removed';
        const sess = memoryStore.sessions.get(sessionId);
        if (sess) {
          sess.sourcesCount = list.filter(s => s.status !== 'removed').length;
        }
        saveStoreToDisk();
        return true;
      }
      return false;
    }
  },

  async saveReport(sessionId, report) {
    if (isMongoConnected && MongooseSession) {
      await MongooseSession.updateOne(
        { sessionId },
        { 
          report, 
          status: 'completed', 
          lastAnalyzedAt: new Date() 
        }
      );
      return report;
    } else {
      const sess = memoryStore.sessions.get(sessionId);
      if (sess) {
        sess.report = report;
        sess.status = 'completed';
        sess.lastAnalyzedAt = new Date().toISOString();
        sess.updatedAt = new Date().toISOString();
      }
      memoryStore.reports.set(sessionId, report);
      saveStoreToDisk();
      return report;
    }
  },

  async updateChecklistItem(sessionId, itemId, completed) {
    const sess = await this.getSession(sessionId);
    if (!sess || !sess.report || !sess.report.checklist) return null;

    const item = sess.report.checklist.find(c => c.itemId === itemId);
    if (item) {
      item.completed = !!completed;
      if (isMongoConnected && MongooseSession) {
        await MongooseSession.updateOne({ sessionId }, { report: sess.report });
      } else {
        const inMem = memoryStore.sessions.get(sessionId);
        if (inMem) inMem.report = sess.report;
        saveStoreToDisk();
      }
      return item;
    }
    return null;
  }
};
