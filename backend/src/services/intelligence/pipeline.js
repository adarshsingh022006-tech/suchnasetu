import { analyzeResearchObjective } from './step1_objectiveAnalyzer.js';
import { enrichAndDeduplicateSources } from './step2_sourceCollector.js';
import { cleanAndSegmentContent } from './step3_contentCleaner.js';
import { extractStructuredClaims } from './step4_claimExtractor.js';
import { detectInformationGaps } from './step5_gapDetector.js';
import { detectContradictions } from './step6_contradictionDetector.js';
import { analyzeFreshness } from './step7_freshnessAnalyzer.js';
import { evaluateSourceIntelligence } from './step8_sourceAuthority.js';
import { generateVerificationChecklist } from './step9_checklistGenerator.js';

/**
 * Full Modular 9-Step Intelligence Engine Pipeline
 * @param {Object} params
 * @param {string} params.question - The user's research query
 * @param {string} [params.domain] - Explicit domain or inferred
 * @param {Array} params.sources - Array of raw source objects
 * @returns {Promise<Object>} - Complete Research Intelligence Report
 */
export async function executeIntelligencePipeline({ question, domain = 'scholarship', sources = [] }) {
  const startTime = Date.now();

  // STEP 1: Research Objective Analysis
  const objective = analyzeResearchObjective(question, domain);

  // STEP 2: Source Collection, Validation & Deduplication
  const { validSources, duplicates, totalIngested, activeCount } = enrichAndDeduplicateSources(sources);

  if (validSources.length === 0) {
    throw new Error('No valid sources available for analysis. Please provide at least one URL, text snippet, or PDF.');
  }

  // STEP 3 & STEP 4: Segment Content & Extract Claims from each source
  const allClaims = [];
  const segmentedSources = [];

  for (const src of validSources) {
    const segmented = cleanAndSegmentContent(src.extractedContent, src.sourceId);
    segmentedSources.push({
      sourceId: src.sourceId,
      title: src.title,
      paragraphsCount: segmented.totalParagraphs,
      injectionDetected: segmented.injectionDetected
    });

    const claims = await extractStructuredClaims(src, segmented, objective.expectedFields);
    allClaims.push(...claims);
  }

  // STEP 5: Information Gap Detection
  const gapAnalysis = detectInformationGaps(objective.expectedFields, allClaims, validSources);

  // STEP 6: Contradiction & Conflict Detection
  const contradictions = detectContradictions(allClaims, gapAnalysis.fields);

  // Synchronize Completeness Map Metrics with detected conflicts
  const totalFields = gapAnalysis.fields.length;
  const supportedCount = gapAnalysis.fields.filter(f => f.status === 'Found').length;
  const partialCount = gapAnalysis.fields.filter(f => f.status === 'Partially found').length;
  const conflictCount = gapAnalysis.fields.filter(f => f.status === 'Conflicting evidence').length;
  const gapCount = gapAnalysis.fields.filter(f => f.status === 'Not found in reviewed sources').length;
  const coveragePercentage = totalFields > 0 
    ? Math.round(((supportedCount * 1.0 + partialCount * 0.5 + conflictCount * 0.4) / totalFields) * 100)
    : 0;

  gapAnalysis.metrics = {
    totalFields,
    supportedCount,
    partialCount,
    conflictCount,
    gapCount,
    coveragePercentage
  };

  // STEP 7: Freshness & Temporal Intelligence
  const freshness = analyzeFreshness(validSources, allClaims);

  // STEP 8: Source Authority Assessment
  const sourceIntelligence = evaluateSourceIntelligence(validSources);

  // STEP 9: Verification Checklist Generation
  const checklist = generateVerificationChecklist({
    fieldAssessments: gapAnalysis.fields,
    contradictions,
    freshness,
    reviewedSources: validSources
  });

  const durationMs = Date.now() - startTime;

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      durationMs,
      engineVersion: 'SuchnaSetu-v1.0-Hackathon2026',
      mode: process.env.GEMINI_API_KEY ? 'gemini_enhanced' : 'deterministic_heuristic'
    },
    objective,
    sourcesSummary: {
      totalIngested,
      activeCount,
      duplicatesCount: duplicates.length,
      duplicates,
      sourceIntelligence
    },
    completenessMap: gapAnalysis.metrics,
    completenessDisclaimer: gapAnalysis.coverageDisclaimer,
    fields: gapAnalysis.fields,
    claims: allClaims,
    contradictions,
    freshness,
    checklist,
    executiveSummary: generateExecutiveSummary({
      question,
      gapAnalysis,
      contradictions,
      freshness,
      validSources
    })
  };
}

function generateExecutiveSummary({ question, gapAnalysis, contradictions, freshness, validSources }) {
  const missingFields = gapAnalysis.fields.filter(f => f.status === 'Not found in reviewed sources');
  const conflictCount = contradictions.length;
  const staleCount = freshness.warnings.filter(w => w.type.includes('Cycle') || w.type.includes('Stale')).length;

  return {
    primaryQuestion: question,
    sourcesAnalyzed: validSources.length,
    coverageScore: gapAnalysis.metrics.coveragePercentage,
    headline: `Research completed across ${validSources.length} source(s) with ${gapAnalysis.metrics.coveragePercentage}% reviewed-source coverage.`,
    criticalFindings: [
      missingFields.length > 0 
        ? `Information Gap: ${missingFields.length} critical field(s) (${missingFields.map(m => m.fieldName).join(', ')}) were not found in reviewed sources.`
        : 'All core expected fields had some level of representation in reviewed sources.',
      conflictCount > 0 
        ? `Contradictions Detected: ${conflictCount} potential contradiction(s) identified across sources requiring direct verification.`
        : 'No direct operational contradictions detected among reviewed sources.',
      staleCount > 0 
        ? `Freshness Notice: ${staleCount} reference(s) mention older application cycles; verify active cycle guidelines.`
        : 'Sources appear consistent with current cycle timelines.'
    ],
    epistemicDisclaimer: 'Findings reflect explicitly analyzed source text only. Absence in reviewed sources does not imply absence in unreviewed regulations.'
  };
}
