import pdf from 'pdf-parse/lib/pdf-parse.js';
import { computeContentHash } from './urlScraper.js';

/**
 * Extracts and cleans text from an uploaded PDF file buffer.
 * @param {Buffer} dataBuffer 
 * @param {string} originalName 
 * @returns {Promise<Object>}
 */
export async function extractTextFromPdf(dataBuffer, originalName = 'uploaded-document.pdf') {
  if (!dataBuffer || dataBuffer.length === 0) {
    throw new Error('PDF file buffer is empty.');
  }

  // Validate PDF magic bytes: '%PDF-'
  const header = dataBuffer.slice(0, 5).toString('ascii');
  if (header !== '%PDF-') {
    throw new Error('Invalid file format. The uploaded file does not have a valid PDF header.');
  }

  const parsed = await pdf(dataBuffer, {
    max: 50 // Limit to first 50 pages for hackathon performance & memory safety
  });

  const rawText = parsed.text || '';
  // Clean up noisy whitespace and control characters
  const cleaned = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[^\x20-\x7E\n]/g, ' ') // Strip non-printable ASCII noise
    .replace(/ +/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();

  if (cleaned.length < 30) {
    throw new Error('Extracted PDF text is too short or appears to be a scanned image without OCR.');
  }

  return {
    title: parsed.info?.Title || originalName.replace(/\.pdf$/i, ''),
    totalPages: parsed.numpages || 1,
    extractedContent: cleaned,
    contentHash: computeContentHash(cleaned),
    publishedDate: parsed.info?.CreationDate ? String(parsed.info.CreationDate).slice(0, 50) : null,
    sourceType: 'uploaded_document',
    retrievedDate: new Date().toISOString()
  };
}
