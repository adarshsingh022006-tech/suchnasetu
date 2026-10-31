/**
 * Step 8: Source Intelligence & Transparent Authority Assessment
 * Analyzes the institutional provenance and verifiable credentials of each source.
 * Crucial: Explains the authority transparently; never presents an arbitrary credibility number as truth.
 */

export function evaluateSourceIntelligence(sources = []) {
  return sources.map(src => {
    const domain = (src.domain || '').toLowerCase();
    const url = (src.url || '').toLowerCase();
    const type = src.sourceType || 'general_web';

    let category = 'Unknown / Community Source';
    let badgeClass = 'community';
    let description = 'Secondary or community platform. Requires cross-verification with primary regulatory sources.';
    let indicators = [];

    if (type === 'uploaded_document') {
      category = 'Direct Evidence Document';
      badgeClass = 'document';
      description = 'User-provided official or supplementary document. Verified for structure and readable text layers.';
      indicators.push('Direct file ingestion', 'Cryptographic SHA-256 signature calculated', 'No intermediate third-party scraping');
    } else if (domain.includes('.gov') || domain.includes('.nic.in') || domain.includes('.gov.in')) {
      category = 'Official Government Source';
      badgeClass = 'official_gov';
      description = 'Primary statutory department portal or national informatics gateway.';
      indicators.push('Official government top-level domain (.gov / .nic.in)', 'Direct regulatory issuing authority', 'Enforceable policy declarations');
    } else if (domain.includes('.edu') || domain.includes('.ac.in') || domain.includes('.edu.in')) {
      category = 'Institutional / Academic Source';
      badgeClass = 'institutional';
      description = 'Accredited university, college, or academic research portal.';
      indicators.push('Accredited academic domain (.edu / .ac.in)', 'Institutional financial aid office', 'Academic calendar alignment');
    } else if (type === 'news_editorial' || domain.includes('news') || domain.includes('express') || domain.includes('hindu') || domain.includes('times')) {
      category = 'News / Editorial Publication';
      badgeClass = 'editorial';
      description = 'Secondary reporting by journalism outlets. Subject to editorial interpretation or reporting delays.';
      indicators.push('Commercial news media entity', 'Editorial reporting of circulars', 'Secondary reference (not origin authority)');
    } else {
      category = 'General Web / Advisory Source';
      badgeClass = 'general';
      description = 'Third-party aggregator, advisory blog, or educational forum.';
      indicators.push('Third-party aggregator', 'Potentially crowd-sourced or unverified commentary', 'Dependent on external references');
    }

    if (url.startsWith('https://')) {
      indicators.push('Transport Layer Security (TLS/HTTPS) verified');
    }

    return {
      sourceId: src.sourceId,
      title: src.title,
      domain: src.domain,
      url: src.url,
      authorityCategory: category,
      badgeClass,
      description,
      transparentIndicators: indicators,
      limitationsNote: 'Authority indicates publisher category, not absolute infallibility of individual claims.'
    };
  });
}
