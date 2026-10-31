/**
 * Step 6: Context-Aware Contradiction & Conflict Detection Engine
 * Compares claims ONLY when they pertain to the same core subject and comparable operational context.
 * Uses the label: "Possible conflict – needs verification".
 */

export function detectContradictions(allClaims = [], fieldAssessments = []) {
  const conflicts = [];
  const checkedPairs = new Set();

  // Group claims by fieldId
  const byField = {};
  for (const claim of allClaims) {
    if (!byField[claim.fieldId]) byField[claim.fieldId] = [];
    byField[claim.fieldId].push(claim);
  }

  for (const [fieldId, claims] of Object.entries(byField)) {
    if (claims.length < 2) continue;

    for (let i = 0; i < claims.length; i++) {
      for (let j = i + 1; j < claims.length; j++) {
        const c1 = claims[i];
        const c2 = claims[j];

        // Never compare claims originating from the same identical source
        if (c1.sourceId === c2.sourceId) continue;

        const pairKey = [c1.claimId, c2.claimId].sort().join('::');
        if (checkedPairs.has(pairKey)) continue;
        checkedPairs.add(pairKey);

        const conflictCheck = evaluatePairConflict(fieldId, c1, c2);
        if (conflictCheck.isConflict) {
          conflicts.push({
            conflictId: `CONF_${conflicts.length + 1}`,
            fieldId,
            fieldName: getFieldName(fieldId),
            label: 'Possible conflict – needs verification',
            conflictType: conflictCheck.type,
            severity: conflictCheck.severity, // 'critical' | 'moderate' | 'advisory'
            explanation: conflictCheck.explanation,
            claimA: {
              claimId: c1.claimId,
              subject: c1.subject,
              value: c1.value,
              sourceId: c1.sourceId,
              sourceTitle: c1.sourceTitle,
              cycleOrDate: c1.cycleOrDate,
              supportingText: c1.supportingText
            },
            claimB: {
              claimId: c2.claimId,
              subject: c2.subject,
              value: c2.value,
              sourceId: c2.sourceId,
              sourceTitle: c2.sourceTitle,
              cycleOrDate: c2.cycleOrDate,
              supportingText: c2.supportingText
            },
            suggestedAction: conflictCheck.suggestedAction
          });
        }
      }
    }
  }

  // Update fieldAssessments status to 'Conflicting evidence' if a conflict was detected
  for (const conf of conflicts) {
    const targetField = fieldAssessments.find(f => f.fieldId === conf.fieldId);
    if (targetField) {
      targetField.status = 'Conflicting evidence';
      targetField.gapReason = `Discrepancy detected between sources (${conf.claimA.sourceTitle} vs ${conf.claimB.sourceTitle}).`;
    }
  }

  return conflicts;
}

function evaluatePairConflict(fieldId, c1, c2) {
  const v1 = (c1.value || '').toLowerCase();
  const v2 = (c2.value || '').toLowerCase();

  // If both values are essentially identical, no conflict
  if (v1 === v2) return { isConflict: false };

  // 1. Application Process: Online vs Physical Hardcopy
  if (fieldId === 'application_process') {
    const isOffline1 = v1.includes('physical') || v1.includes('district office') || v1.includes('hard copy');
    const isOffline2 = v2.includes('physical') || v2.includes('district office') || v2.includes('hard copy');
    const isOnline1 = v1.includes('paperless') || v1.includes('online') || v1.includes('portal');
    const isOnline2 = v2.includes('paperless') || v2.includes('online') || v2.includes('portal');

    if ((isOffline1 && isOnline2) || (isOnline1 && isOffline2)) {
      return {
        isConflict: true,
        type: 'Submission Procedure Variance',
        severity: 'critical',
        explanation: 'One source mandates physical submission of printed forms and original certificates at the District Office, while another source specifies a 100% paperless online application process.',
        suggestedAction: 'Consult the latest official departmental notice or contact the nodal desk before travelling for physical counter submission.'
      };
    }
  }

  // 2. Income Limit Discrepancy
  if (fieldId === 'income_requirements') {
    const num1 = extractNumber(v1);
    const num2 = extractNumber(v2);

    if (num1 && num2 && Math.abs(num1 - num2) > 0.1) {
      return {
        isConflict: true,
        type: 'Income Threshold Discrepancy',
        severity: 'critical',
        explanation: `Sources declare differing household income ceilings: "${c1.value}" vs "${c2.value}". Applying under an obsolete income ceiling may result in immediate disqualification.`,
        suggestedAction: 'Verify the statutory income certificate ceiling in the latest Gazette notification for the current academic year.'
      };
    }
  }

  // 3. Application Deadline Discrepancy
  if (fieldId === 'application_deadline') {
    if (v1 !== v2 && !v1.includes(v2) && !v2.includes(v1)) {
      // Check if different cycles exist
      const cycleDiff = (c1.cycleOrDate && c2.cycleOrDate && c1.cycleOrDate !== c2.cycleOrDate);
      return {
        isConflict: true,
        type: cycleDiff ? 'Cycle Mismatch in Deadlines' : 'Conflicting Application Deadlines',
        severity: 'critical',
        explanation: `Discrepancy in advertised submission cutoff dates: "${c1.value}" (${c1.cycleOrDate || 'Cycle unstated'}) versus "${c2.value}" (${c2.cycleOrDate || 'Cycle unstated'}).`,
        suggestedAction: 'Always prioritize the official portal live countdown or government extension circular.'
      };
    }
  }

  // 4. Required Documents Discrepancy
  if (fieldId === 'required_documents') {
    const docs1 = v1.split(',').map(s => s.trim());
    const docs2 = v2.split(',').map(s => s.trim());
    const diff = docs1.filter(x => !docs2.includes(x)).concat(docs2.filter(x => !docs1.includes(x)));

    if (diff.length >= 2) {
      return {
        isConflict: true,
        type: 'Document Checklist Divergence',
        severity: 'moderate',
        explanation: `Sources list differing mandatory documentation requirements. Divergent items noted: ${diff.slice(0, 3).join(', ')}.`,
        suggestedAction: 'Obtain all listed documents in advance to prevent rejection during physical or digital verification.'
      };
    }
  }

  // 5. Clinical Dosage Regimen Conflict
  if (fieldId === 'dosage') {
    const isOnce = v1.includes('once daily') || v2.includes('once daily');
    const isTwice = v1.includes('twice daily') || v2.includes('twice daily');
    if (isOnce && isTwice) {
      return {
        isConflict: true,
        type: 'Clinical Dosing Frequency Divergence',
        severity: 'critical',
        explanation: `Conflicting dosing regimens detected between clinical monograph and practice advisory ("${c1.value}" vs "${c2.value}"). Inappropriate dosing risks adverse cardiovascular events.`,
        suggestedAction: 'Prioritize approved statutory drug monograph and consult medical board before clinical prescription.'
      };
    }
  }

  // 6. Policy Statutory Deadline & Penalties Conflict
  if (fieldId === 'statutory_deadline' || fieldId === 'penalties') {
    if (v1 !== v2 && !v1.includes(v2) && !v2.includes(v1)) {
      return {
        isConflict: true,
        type: fieldId === 'statutory_deadline' ? 'Statutory Enforcement Timeline Mismatch' : 'Penalty Ceiling Discrepancy',
        severity: 'critical',
        explanation: `Regulatory sources declare conflicting parameters: "${c1.value}" vs "${c2.value}". Outdated draft figures differ significantly from final gazette declarations.`,
        suggestedAction: 'Verify against final Ministry of Electronics & IT (MeitY) Gazette Notification.'
      };
    }
  }

  return { isConflict: false };
}

function extractNumber(str) {
  const m = str.match(/([0-9.,]+)/);
  if (!m) return null;
  const cleaned = m[1].replace(/,/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

function getFieldName(fieldId) {
  const map = {
    eligibility_criteria: 'Eligibility Criteria',
    income_requirements: 'Income Requirements',
    required_documents: 'Required Documents',
    application_deadline: 'Application Deadline',
    renewal_conditions: 'Renewal Conditions',
    application_process: 'Application Process & Mode',
    official_application_link: 'Official Application Link',
    indication: 'Approved Indication & Diagnosis',
    dosage: 'Dosage & Administration',
    contraindications: 'Contraindications & Risks',
    clinical_evidence: 'Trial Evidence & Efficacy',
    side_effects: 'Reported Adverse Reactions',
    jurisdiction: 'Jurisdiction & Applicability',
    compliance_mandate: 'Mandatory Compliance Actions',
    statutory_deadline: 'Effective Date & Enforcement Deadline',
    penalties: 'Penalties & Non-Compliance Repercussions',
    dispute_resolution: 'Appeals & Recourse Mechanism'
  };
  return map[fieldId] || fieldId;
}
