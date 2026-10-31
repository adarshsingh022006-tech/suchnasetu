import crypto from 'crypto';

/**
 * Step 2: Source Collection, Validation, and Deduplication
 * Ingests raw source records, computes cryptographic signatures,
 * detects exact and near duplicate sources, and assigns canonical source IDs.
 */

export function enrichAndDeduplicateSources(rawSources = []) {
  const seenHashes = new Map();
  const seenUrls = new Map();
  const processedSources = [];
  const duplicatesFound = [];

  rawSources.forEach((src, index) => {
    const rawContent = (src.extractedContent || src.content || '').trim();
    const contentHash = src.contentHash || crypto.createHash('sha256').update(rawContent.toLowerCase()).digest('hex');
    const sourceId = src.sourceId || `src_${index + 1}_${contentHash.slice(0, 8)}`;
    const url = (src.url || '').trim();

    let isDuplicate = false;
    let duplicateReason = null;
    let originalSourceId = null;

    if (url && seenUrls.has(url)) {
      isDuplicate = true;
      duplicateReason = `Exact matching URL already registered in research session: ${url}`;
      originalSourceId = seenUrls.get(url);
    } else if (rawContent.length > 30 && seenHashes.has(contentHash)) {
      isDuplicate = true;
      duplicateReason = `Identical content body hash detected matching source: ${seenHashes.get(contentHash)}`;
      originalSourceId = seenHashes.get(contentHash);
    }

    if (isDuplicate) {
      duplicatesFound.push({
        sourceId,
        title: src.title || 'Untitled',
        url: src.url || 'Pasted / Uploaded',
        reason: duplicateReason,
        duplicateOf: originalSourceId
      });
    } else {
      if (url) seenUrls.set(url, sourceId);
      if (rawContent.length > 30) seenHashes.set(contentHash, sourceId);

      processedSources.push({
        sourceId,
        title: src.title || (url ? `Source from ${src.domain || 'web'}` : 'Direct Evidence Input'),
        url: src.url || null,
        domain: src.domain || (url ? new URL(url).hostname : 'local-input'),
        publishedDate: src.publishedDate || null,
        retrievedDate: src.retrievedDate || new Date().toISOString(),
        extractedContent: rawContent,
        contentHash,
        sourceType: src.sourceType || 'general_web',
        totalPages: src.totalPages || null,
        byteSize: src.byteSize || Buffer.byteLength(rawContent, 'utf8'),
        status: 'active'
      });
    }
  });

  return {
    validSources: processedSources,
    duplicates: duplicatesFound,
    totalIngested: rawSources.length,
    activeCount: processedSources.length
  };
}
