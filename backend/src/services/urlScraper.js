import axios from 'axios';
import * as cheerio from 'cheerio';
import crypto from 'crypto';
import { validateUrlForSsrf } from './ssrfGuard.js';

export function computeContentHash(text) {
  return crypto.createHash('sha256').update((text || '').trim().toLowerCase()).digest('hex');
}

/**
 * Scrapes and cleans webpage text content safely.
 * @param {string} targetUrl 
 * @returns {Promise<Object>}
 */
export async function scrapeWebpage(targetUrl) {
  const ssrfCheck = await validateUrlForSsrf(targetUrl);
  if (!ssrfCheck.valid) {
    throw new Error(`SSRF Security Error: ${ssrfCheck.reason}`);
  }

  const response = await axios.get(targetUrl, {
    timeout: 12000,
    maxContentLength: 5 * 1024 * 1024, // 5MB max html
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SuchnaSetuResearchBot/1.0 (+https://suchnasetu.internal/bot)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9'
    },
    maxRedirects: 3,
    validateStatus: (status) => status >= 200 && status < 300
  });

  const html = response.data;
  const $ = cheerio.load(html);

  // Extract Metadata
  const title = $('title').text().trim() ||
                $('meta[property="og:title"]').attr('content') ||
                $('meta[name="twitter:title"]').attr('content') ||
                'Untitled Web Source';

  let publishedDate = $('meta[property="article:published_time"]').attr('content') ||
                      $('meta[name="publication_date"]').attr('content') ||
                      $('meta[name="date"]').attr('content') ||
                      $('time').attr('datetime') ||
                      $('time').text().trim() ||
                      null;

  // Clean elements that produce noise, boilerplate, or potential prompt injection
  $('script, style, noscript, svg, nav, footer, header, aside, .cookie-banner, .advertisement, .ads, .sidebar, .comments, iframe').remove();

  // Prefer main article container if available
  let mainContainer = $('main, article, #content, .content, #main, .post-content');
  let targetArea = mainContainer.length ? mainContainer : $('body');

  const paragraphs = [];
  targetArea.find('h1, h2, h3, h4, p, li, blockquote, td, th').each((_, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text.length > 20) {
      paragraphs.push(text);
    }
  });

  const extractedContent = paragraphs.join('\n\n').trim();
  if (!extractedContent || extractedContent.length < 50) {
    // Fallback to text body if structure was minimal
    const fallback = $('body').text().replace(/\s+/g, ' ').trim();
    if (fallback.length < 50) {
      throw new Error('Insufficient readable content extracted from URL.');
    }
  }

  const finalContent = extractedContent.length > 50 ? extractedContent : $('body').text().replace(/\s+/g, ' ').trim();
  const domain = ssrfCheck.parsedUrl.hostname;
  const contentHash = computeContentHash(finalContent);

  return {
    url: targetUrl,
    domain,
    title,
    publishedDate: publishedDate ? String(publishedDate).slice(0, 100) : null,
    retrievedDate: new Date().toISOString(),
    extractedContent: finalContent,
    contentHash,
    sourceType: classifyDomain(domain),
    byteSize: Buffer.byteLength(finalContent, 'utf8')
  };
}

export function classifyDomain(hostname) {
  const host = (hostname || '').toLowerCase();
  if (host.includes('.gov') || host.includes('.nic.in') || host.includes('.gov.in')) {
    return 'official_government';
  }
  if (host.includes('.edu') || host.includes('.ac.in') || host.includes('.edu.in') || host.includes('.org.in')) {
    return 'institutional_academic';
  }
  if (host.includes('news') || host.includes('times') || host.includes('tribune') || host.includes('post') || host.includes('express') || host.includes('ndtv') || host.includes('hindu')) {
    return 'news_editorial';
  }
  return 'general_web';
}
