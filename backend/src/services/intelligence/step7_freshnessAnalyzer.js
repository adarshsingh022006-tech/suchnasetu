/**
 * Step 7: Temporal Freshness & Cycle Intelligence Engine
 * Evaluates publication dates, temporal cycle tags (e.g., 2023-2024 vs 2025-2026),
 * and flags stale or undated claims for explicit user verification.
 * Does NOT discard older sources; contextualizes their temporal validity.
 */

export function analyzeFreshness(reviewedSources = [], allClaims = []) {
  const currentYear = new Date().getFullYear(); // e.g. 2026
  const targetCycleYears = [currentYear - 1, currentYear, currentYear + 1]; // e.g., 2025, 2026, 2027

  const warnings = [];
  const sourceFreshness = [];

  for (const src of reviewedSources) {
    let status = 'current';
    let temporalNote = '';
    const dateStr = src.publishedDate || '';

    // Check year in publication date or title
    const yearMatch = (dateStr + ' ' + src.title + ' ' + src.extractedContent.slice(0, 500)).match(/\b(201\d|202\d)\b/g);
    let detectedYears = yearMatch ? Array.from(new Set(yearMatch.map(Number))) : [];

    // Filter out historical act years like 1950, 1989
    detectedYears = detectedYears.filter(y => y >= 2018 && y <= currentYear + 2);

    const maxYear = detectedYears.length ? Math.max(...detectedYears) : null;
    const isUndated = !src.publishedDate && detectedYears.length === 0;

    if (isUndated) {
      status = 'undated';
      temporalNote = 'No explicit publication timestamp or academic cycle year found in source header.';
      warnings.push({
        warningId: `FRSH_${warnings.length + 1}`,
        sourceId: src.sourceId,
        sourceTitle: src.title,
        severity: 'advisory',
        type: 'Undated Source Notice',
        message: `Source "${src.title}" does not declare a publication or update date. Content may be from an earlier application cycle.`,
        recommendation: 'Check the official portal notices board to confirm this policy has not been superseded.'
      });
    } else if (maxYear && maxYear < Math.min(...targetCycleYears)) {
      status = 'outdated_cycle';
      temporalNote = `Refers to academic/application cycle year ${maxYear}, prior to current cycle.`;
      warnings.push({
        warningId: `FRSH_${warnings.length + 1}`,
        sourceId: src.sourceId,
        sourceTitle: src.title,
        severity: 'warning',
        type: 'Outdated Cycle Advisory',
        message: `Source "${src.title}" contains terms or dates referencing cycle ${maxYear}. Guidelines and deadlines frequently update each academic year.`,
        recommendation: `Confirm whether requirements from cycle ${maxYear} remain operative for the active application cycle.`
      });
    } else {
      status = 'recent';
      temporalNote = `Aligned with recent or active cycle (${maxYear || 'current'}).`;
    }

    sourceFreshness.push({
      sourceId: src.sourceId,
      title: src.title,
      status,
      detectedYears,
      publishedDate: src.publishedDate || 'Undated',
      retrievedDate: src.retrievedDate,
      temporalNote
    });
  }

  // Cross-check claims with cycle indicators
  const staleClaims = allClaims.filter(c => {
    if (!c.cycleOrDate) return false;
    const year = parseInt(c.cycleOrDate.match(/202\d/)?.[0] || '0', 10);
    return year > 0 && year < (currentYear - 1);
  });

  for (const c of staleClaims) {
    warnings.push({
      warningId: `FRSH_${warnings.length + 1}`,
      sourceId: c.sourceId,
      sourceTitle: c.sourceTitle,
      severity: 'warning',
      type: 'Stale Claim Cycle Reference',
      message: `Claim for "${c.subject}" explicitly references cycle "${c.cycleOrDate}", which is older than the current active window.`,
      recommendation: `Verify if "${c.value}" has been updated in the latest gazette or portal circular.`
    });
  }

  return {
    sourceFreshness,
    warnings,
    summary: {
      totalSources: reviewedSources.length,
      recentCount: sourceFreshness.filter(s => s.status === 'recent').length,
      outdatedCount: sourceFreshness.filter(s => s.status === 'outdated_cycle').length,
      undatedCount: sourceFreshness.filter(s => s.status === 'undated').length
    }
  };
}
