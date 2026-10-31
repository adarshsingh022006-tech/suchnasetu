/**
 * Step 1: Research Objective & Domain Schema Analysis
 * Converts a freeform research question into concrete expected information fields
 * to form the basis of gap detection.
 */

export const DOMAIN_SCHEMAS = {
  scholarship: {
    domainName: 'Scholarship & Academic Grants',
    coreFields: [
      {
        fieldId: 'eligibility_criteria',
        fieldName: 'Eligibility Criteria',
        description: 'Academic marks, course qualification, community category, and residency criteria.',
        critical: true
      },
      {
        fieldId: 'income_requirements',
        fieldName: 'Income Requirements',
        description: 'Annual family income ceilings, income certificate issuers, and slab exceptions.',
        critical: true
      },
      {
        fieldId: 'required_documents',
        fieldName: 'Required Documents',
        description: 'Mandatory certificates, marksheet proofs, ID cards, bank seeding, and notarization.',
        critical: true
      },
      {
        fieldId: 'application_deadline',
        fieldName: 'Application Deadline',
        description: 'Last date to submit the application, extension notifications, and cycle dates.',
        critical: true
      },
      {
        fieldId: 'renewal_conditions',
        fieldName: 'Renewal Conditions',
        description: 'Rules for continuing the scholarship in subsequent academic years (CGPA, attendance, reapplying).',
        critical: false
      },
      {
        fieldId: 'application_process',
        fieldName: 'Application Process & Mode',
        description: 'Mode of application (online vs physical counter submission), portal steps, and verification hierarchy.',
        critical: true
      },
      {
        fieldId: 'official_application_link',
        fieldName: 'Official Application Link / Portal',
        description: 'Verified authoritative direct URL or departmental gateway to apply.',
        critical: true
      }
    ]
  },
  clinical_health: {
    domainName: 'Medical & Clinical Guidelines',
    coreFields: [
      { fieldId: 'indication', fieldName: 'Approved Indication & Diagnosis', critical: true, description: 'Medical conditions approved for treatment.' },
      { fieldId: 'dosage', fieldName: 'Dosage & Administration', critical: true, description: 'Standard dosing schedule, titrations, and routes.' },
      { fieldId: 'contraindications', fieldName: 'Contraindications & Risks', critical: true, description: 'Patient groups where the intervention is unsafe.' },
      { fieldId: 'clinical_evidence', fieldName: 'Trial Evidence & Efficacy', critical: true, description: 'Controlled study outcomes and statistical endpoints.' },
      { fieldId: 'side_effects', fieldName: 'Reported Adverse Reactions', critical: false, description: 'Known common and rare adverse events.' }
    ]
  },
  policy_legal: {
    domainName: 'Regulatory & Policy Compliance',
    coreFields: [
      { fieldId: 'jurisdiction', fieldName: 'Jurisdiction & Applicability', critical: true, description: 'Entities, thresholds, and regions covered.' },
      { fieldId: 'compliance_mandate', fieldName: 'Mandatory Compliance Actions', critical: true, description: 'What affected parties are required to perform.' },
      { fieldId: 'statutory_deadline', fieldName: 'Effective Date & Enforcement Deadline', critical: true, description: 'When compliance becomes enforceable.' },
      { fieldId: 'penalties', fieldName: 'Penalties & Non-Compliance Repercussions', critical: false, description: 'Fines, revocation, or sanctions.' },
      { fieldId: 'dispute_resolution', fieldName: 'Appeals & Recourse Mechanism', critical: false, description: 'Procedures for dispute resolution.' }
    ]
  },
  general: {
    domainName: 'General Investigation',
    coreFields: [
      { fieldId: 'primary_claim', fieldName: 'Primary Claim / Event', critical: true, description: 'Core assertion or subject being evaluated.' },
      { fieldId: 'authoritative_source', fieldName: 'Authoritative Direct Source', critical: true, description: 'Official record or primary origin document.' },
      { fieldId: 'temporal_scope', fieldName: 'Date / Effective Timeline', critical: true, description: 'Timeline when the claim applies or was enacted.' },
      { fieldId: 'conditional_caveats', fieldName: 'Exceptions & Conditional Rules', critical: false, description: 'Limitations or edge cases.' }
    ]
  }
};

/**
 * Analyzes research question and determines target domain and required fields.
 * @param {string} question 
 * @param {string} [explicitDomain]
 */
export function analyzeResearchObjective(question = '', explicitDomain = 'scholarship') {
  const qLower = question.toLowerCase();

  let selectedDomain = explicitDomain;
  if (!DOMAIN_SCHEMAS[selectedDomain]) {
    if (qLower.includes('scholarship') || qLower.includes('fellowship') || qLower.includes('stipend') || qLower.includes('grant') || qLower.includes('tuition')) {
      selectedDomain = 'scholarship';
    } else if (qLower.includes('drug') || qLower.includes('treatment') || qLower.includes('symptom') || qLower.includes('clinical') || qLower.includes('patient')) {
      selectedDomain = 'clinical_health';
    } else if (qLower.includes('act') || qLower.includes('law') || qLower.includes('regulation') || qLower.includes('gdpr') || qLower.includes('compliance')) {
      selectedDomain = 'policy_legal';
    } else {
      selectedDomain = 'general';
    }
  }

  const schema = DOMAIN_SCHEMAS[selectedDomain] || DOMAIN_SCHEMAS.scholarship;

  return {
    question: question.trim(),
    domainId: selectedDomain,
    domainName: schema.domainName,
    expectedFields: schema.coreFields.map(f => ({ ...f })),
    generatedAt: new Date().toISOString()
  };
}
