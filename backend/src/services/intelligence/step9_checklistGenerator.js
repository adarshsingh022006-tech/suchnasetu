/**
 * Step 9: Actionable Verification Checklist Generator
 * Synthesizes gaps, contradictions, freshness warnings, and unconfirmed criteria
 * into a prioritized, actionable checklist of next steps for the user before applying.
 */

export function generateVerificationChecklist({
  fieldAssessments = [],
  contradictions = [],
  freshness = { warnings: [] },
  reviewedSources = []
}) {
  const items = [];
  let seq = 1;

  // 1. Conflicts are highest priority (Risk of immediate procedural failure)
  for (const conf of contradictions) {
    items.push({
      itemId: `CHK_${seq++}`,
      priority: 'CRITICAL',
      category: 'Conflict Resolution',
      task: `Resolve conflicting ${conf.fieldName.toLowerCase()}: Verify whether "${conf.claimA.value}" or "${conf.claimB.value}" applies for the current cycle.`,
      reason: conf.explanation,
      relatedField: conf.fieldId,
      relatedEvidence: [
        { claimId: conf.claimA.claimId, sourceTitle: conf.claimA.sourceTitle, value: conf.claimA.value },
        { claimId: conf.claimB.claimId, sourceTitle: conf.claimB.sourceTitle, value: conf.claimB.value }
      ],
      suggestedAuthoritativeSource: 'Official State/National Scholarship Portal or Gazette Circular',
      completed: false
    });
  }

  // 2. Critical Information Gaps (Missing criteria)
  const missingFields = fieldAssessments.filter(f => f.status === 'Not found in reviewed sources');
  for (const gap of missingFields) {
    items.push({
      itemId: `CHK_${seq++}`,
      priority: gap.critical ? 'CRITICAL' : 'HIGH',
      category: 'Information Gap Verification',
      task: `Determine official policy on: ${gap.fieldName} (Not found in reviewed sources).`,
      reason: gap.gapReason || `None of the reviewed sources contain specifications for ${gap.fieldName.toLowerCase()}.`,
      relatedField: gap.fieldId,
      relatedEvidence: [],
      suggestedAuthoritativeSource: 'Institutional Financial Aid Office / Scheme Guidelines PDF',
      completed: false
    });
  }

  // 3. Application Deadline Verification
  const deadlineField = fieldAssessments.find(f => f.fieldId === 'application_deadline');
  if (deadlineField) {
    const hasDeadlineConflict = contradictions.some(c => c.fieldId === 'application_deadline');
    if (!hasDeadlineConflict) {
      const activeClaim = deadlineField.claims[0];
      items.push({
        itemId: `CHK_${seq++}`,
        priority: 'CRITICAL',
        category: 'Deadline Confirmation',
        task: `Check live portal countdown for closing date (Reported as: ${activeClaim ? activeClaim.value : 'Uncertain'}).`,
        reason: 'Scholarship server portals often experience heavy traffic or revised dates. Submissions after cutoff are permanently rejected.',
        relatedField: 'application_deadline',
        relatedEvidence: activeClaim ? [{ claimId: activeClaim.claimId, sourceTitle: activeClaim.sourceTitle, value: activeClaim.value }] : [],
        suggestedAuthoritativeSource: 'Official Portal Homepage Live Banner / Nodal Officer Notice',
        completed: false
      });
    }
  }

  // 4. Stale or Outdated Cycle Warnings
  const cycleWarnings = freshness.warnings.filter(w => w.type.includes('Cycle') || w.type.includes('Stale'));
  for (const warn of cycleWarnings.slice(0, 2)) {
    items.push({
      itemId: `CHK_${seq++}`,
      priority: 'HIGH',
      category: 'Cycle Freshness Check',
      task: `Confirm that guidelines from source "${warn.sourceTitle}" have not changed for the current cycle.`,
      reason: warn.message,
      relatedField: 'eligibility_criteria',
      relatedEvidence: [{ sourceTitle: warn.sourceTitle }],
      suggestedAuthoritativeSource: 'State Social Welfare Department Current Year Notifications',
      completed: false
    });
  }

  // 5. Partial field items
  const partialFields = fieldAssessments.filter(f => f.status === 'Partially found');
  for (const part of partialFields) {
    items.push({
      itemId: `CHK_${seq++}`,
      priority: 'MEDIUM',
      category: 'Detail Verification',
      task: `Obtain complete operational specifications for: ${part.fieldName}.`,
      reason: part.assessmentSummary || 'Broad mention found, but operational steps or definitive parameters are incomplete.',
      relatedField: part.fieldId,
      relatedEvidence: part.claims.map(c => ({ claimId: c.claimId, sourceTitle: c.sourceTitle, value: c.value })),
      suggestedAuthoritativeSource: 'Application User Manual / FAQ Section on Official Portal',
      completed: false
    });
  }

  // Sort items by priority: CRITICAL > HIGH > MEDIUM > LOW
  const priorityOrder = { CRITICAL: 1, HIGH: 2, MEDIUM: 3, LOW: 4 };
  items.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return items;
}
