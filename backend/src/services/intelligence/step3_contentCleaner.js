/**
 * Step 3: Content Extraction & Paragraph Cleaning
 * Segments source text into identifiable, indexed contextual paragraphs
 * while neutralizing prompt injection attempts and boilerplate.
 */

// Known prompt injection patterns that malicious scraped sites might attempt
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/gi,
  /system\s*:\s*you\s+are\s+now/gi,
  /<\s*im_start\s*>/gi,
  /<\s*\|\s*im_end\s*\|>/gi,
  /\[INST\]/gi,
  /\[\/INST\]/gi,
  /assistant\s*:\s*override/gi,
  /forget\s+everything\s+you\s+learned/gi,
  /new\s+system\s+prompt\s*:/gi
];

/**
 * Sanitizes untrusted text and segments it into clean indexed paragraphs.
 * @param {string} rawText 
 * @param {string} sourceId 
 * @returns {{ cleanedText: string, paragraphs: Array<{ index: number, text: string, injectionBlocked: boolean }> }}
 */
export function cleanAndSegmentContent(rawText = '', sourceId = 'src') {
  if (!rawText) return { cleanedText: '', paragraphs: [] };

  // First pass: replace risky injection directives with safe inert tags
  let sanitized = rawText;
  let injectionDetected = false;

  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(sanitized)) {
      injectionDetected = true;
      sanitized = sanitized.replace(pattern, '[DEFUSED_UNTRUSTED_INJECTION_ATTEMPT]');
    }
  }

  // Split into paragraphs by double newlines or block breaks
  const rawParagraphs = sanitized
    .split(/\n\s*\n/)
    .map(p => p.replace(/\s+/g, ' ').trim())
    .filter(p => p.length > 20); // filter out tiny fragments / bullet dots

  const paragraphs = rawParagraphs.map((para, idx) => ({
    index: idx + 1,
    paragraphId: `${sourceId}_p${idx + 1}`,
    text: para,
    injectionBlocked: para.includes('[DEFUSED_UNTRUSTED_INJECTION_ATTEMPT]')
  }));

  const cleanedText = paragraphs.map(p => p.text).join('\n\n');

  return {
    cleanedText,
    paragraphs,
    injectionDetected,
    totalParagraphs: paragraphs.length
  };
}
