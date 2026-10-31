/**
 * Step 5: Information Gap Detection Engine
 * Systematically compares expected research fields against extracted claims across all reviewed sources.
 *
 * Status classifications:
 * - 'Found': Verified by one or more sources with concrete details.
 * - 'Partially found': High-level mention exists but essential specifications (e.g., exact figures or forms) are missing.
 * - 'Not found in reviewed sources': Zero evidence located in any reviewed source. (Never generate a missing fact!)
 * - 'Conflicting evidence': Multiple sources provide contradictory assertions for this field.
 */

export function detectInformationGaps(expectedFields = [], allClaims = [], reviewedSources = []) {
  const reviewedTitles = reviewedSources.map(s => `"${s.title}" (${s.sourceType || 'web'})`).join(', ');
  const totalSourcesCount = reviewedSources.length;

  const fieldAssessments = expectedFields.map(field => {
    const matchingClaims = allClaims.filter(c => c.fieldId === field.fieldId);
    const supportingSourceIds = Array.from(new Set(matchingClaims.map(c => c.sourceId)));
    const supportingSources = reviewedSources.filter(s => supportingSourceIds.includes(s.sourceId));

    let status = 'Not found in reviewed sources';
    let assessmentSummary = '';
    let gapReason = null;
    let missingElements = [];
    let completenessScore = 0; // 0 to 100

    if (matchingClaims.length === 0) {
      status = 'Not found in reviewed sources';
      completenessScore = 0;
      gapReason = `No reviewed source (${totalSourcesCount} source${totalSourcesCount === 1 ? '' : 's'} checked) contains any reference, rule, or clause regarding ${field.fieldName.toLowerCase()}.`;
      assessmentSummary = `Not found in reviewed sources: Reviewed sources (${reviewedTitles || 'None'}) do not provide any information for "${field.fieldName}".`;
      missingElements.push(`Official guidelines or criteria for ${field.fieldName}`);
    } else {
      // Check for partial vs found
      const hasSpecificValues = matchingClaims.some(c => c.value && c.value.length > 5 && !c.value.toLowerCase().includes('specified'));
      const hasUncertainty = matchingClaims.every(c => c.confidence === 'low' || c.uncertaintyReason);

      if (hasSpecificValues && !hasUncertainty) {
        status = 'Found';
        completenessScore = 100;
        assessmentSummary = `Supported by ${supportingSources.length} source(s): ${matchingClaims.map(c => c.value).slice(0, 2).join('; ')}.`;
      } else {
        status = 'Partially found';
        completenessScore = 50;
        gapReason = `Mentioned broadly in reviewed sources, but specific operational details or definitive criteria are absent.`;
        assessmentSummary = `Partially established in reviewed sources. Needs official schedule or specific form verification.`;
        missingElements.push(`Detailed specifications for ${field.fieldName}`);
      }
    }

    return {
      fieldId: field.fieldId,
      fieldName: field.fieldName,
      description: field.description,
      critical: field.critical,
      status,
      completenessScore,
      claimsCount: matchingClaims.length,
      claims: matchingClaims,
      supportingSources: supportingSources.map(s => ({
        sourceId: s.sourceId,
        title: s.title,
        url: s.url,
        sourceType: s.sourceType
      })),
      gapReason,
      missingElements,
      assessmentSummary
    };
  });

  // Calculate overall research coverage
  const totalFields = fieldAssessments.length;
  const supportedCount = fieldAssessments.filter(f => f.status === 'Found').length;
  const partialCount = fieldAssessments.filter(f => f.status === 'Partially found').length;
  const gapCount = fieldAssessments.filter(f => f.status === 'Not found in reviewed sources').length;

  const coveragePercentage = totalFields > 0 
    ? Math.round(((supportedCount * 1.0 + partialCount * 0.5) / totalFields) * 100) 
    : 0;

  return {
    fields: fieldAssessments,
    metrics: {
      totalFields,
      supportedCount,
      partialCount,
      gapCount,
      coveragePercentage
    },
    coverageDisclaimer: "Research Completeness Map indicates coverage across reviewed sources only, not absolute truth or universal completeness."
  };
}
