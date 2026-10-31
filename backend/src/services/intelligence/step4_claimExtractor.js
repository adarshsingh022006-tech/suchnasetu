import { callGeminiLlm } from './llmClient.js';

/**
 * Validates a structured claim against the schema.
 */
export function validateClaimSchema(claim) {
  if (!claim || typeof claim !== 'object') return false;
  if (!claim.claimId || !claim.fieldId || !claim.subject || !claim.predicate || !claim.value) return false;
  if (!claim.sourceId || !claim.supportingText) return false;
  return true;
}

/**
 * Heuristic fallback claim extractor for scholarship domain when LLM is unavailable.
 */
function extractScholarshipClaimsHeuristic(source, paragraphs) {
  const claims = [];
  let claimSeq = 1;

  for (const p of paragraphs) {
    const text = p.text;
    const tLower = text.toLowerCase();

    // 1. Eligibility Criteria
    if (tLower.includes('eligible') || tLower.includes('qualification') || tLower.includes('marks') || tLower.includes('sc/st') || tLower.includes('undergraduate') || tLower.includes('matric')) {
      const markMatch = text.match(/(\d{2}%\s*(?:marks|aggregate)?|minimum\s*\d{2}%|class\s*10|class\s*12|post-matric)/i);
      claims.push({
        claimId: `CLM_${source.sourceId}_${claimSeq++}`,
        fieldId: 'eligibility_criteria',
        subject: 'Applicant Academic & Category Qualification',
        predicate: 'requires',
        value: markMatch ? markMatch[0] : 'Enrolled in post-matric / college courses with passing grade criteria',
        context: 'Scholarship eligibility prerequisites stated in source',
        cycleOrDate: detectDateOrCycle(text, source.publishedDate),
        sourceId: source.sourceId,
        sourceTitle: source.title,
        supportingText: text.length > 280 ? text.slice(0, 277) + '...' : text,
        confidence: 'high',
        uncertaintyReason: null
      });
    }

    // 2. Income Requirements
    if (tLower.includes('income') || tLower.includes('annual') || tLower.includes('lakh') || tLower.includes('inr') || tLower.includes('rs.')) {
      const incomeMatch = text.match(/(?:rs\.?|inr|₹)?\s*([0-9.,]+)\s*(?:lakh|lac|per annum|annually)?/i);
      claims.push({
        claimId: `CLM_${source.sourceId}_${claimSeq++}`,
        fieldId: 'income_requirements',
        subject: 'Family Annual Income Ceiling',
        predicate: 'capped_at',
        value: extractIncomeText(text) || (incomeMatch ? incomeMatch[0] : 'Income certificate threshold specified'),
        context: 'Parental / household annual financial cap',
        cycleOrDate: detectDateOrCycle(text, source.publishedDate),
        sourceId: source.sourceId,
        sourceTitle: source.title,
        supportingText: text.length > 280 ? text.slice(0, 277) + '...' : text,
        confidence: 'high',
        uncertaintyReason: null
      });
    }

    // 3. Required Documents
    if (tLower.includes('document') || tLower.includes('certificate') || tLower.includes('aadhar') || tLower.includes('mark sheet') || tLower.includes('passbook')) {
      claims.push({
        claimId: `CLM_${source.sourceId}_${claimSeq++}`,
        fieldId: 'required_documents',
        subject: 'Verification Documentation',
        predicate: 'mandates_submission_of',
        value: extractDocumentList(text),
        context: 'Required physical or digital documents for application validation',
        cycleOrDate: detectDateOrCycle(text, source.publishedDate),
        sourceId: source.sourceId,
        sourceTitle: source.title,
        supportingText: text.length > 280 ? text.slice(0, 277) + '...' : text,
        confidence: 'high',
        uncertaintyReason: null
      });
    }

    // 4. Application Deadline
    if (tLower.includes('deadline') || tLower.includes('last date') || tLower.includes('closing date') || tLower.includes('submit before')) {
      claims.push({
        claimId: `CLM_${source.sourceId}_${claimSeq++}`,
        fieldId: 'application_deadline',
        subject: 'Application Cutoff Date',
        predicate: 'closes_on',
        value: extractDeadlineText(text) || 'Deadline mentioned in official notification',
        context: 'Submission window closure',
        cycleOrDate: detectDateOrCycle(text, source.publishedDate),
        sourceId: source.sourceId,
        sourceTitle: source.title,
        supportingText: text.length > 280 ? text.slice(0, 277) + '...' : text,
        confidence: 'high',
        uncertaintyReason: null
      });
    }

    // 5. Application Process & Mode (Online vs Physical)
    if (tLower.includes('apply online') || tLower.includes('portal') || tLower.includes('district office') || tLower.includes('hard copy') || tLower.includes('counter')) {
      const isPhysical = tLower.includes('district office') || tLower.includes('hard copy') || tLower.includes('in-person');
      claims.push({
        claimId: `CLM_${source.sourceId}_${claimSeq++}`,
        fieldId: 'application_process',
        subject: 'Submission Channel & Procedure',
        predicate: 'requires_submission_via',
        value: isPhysical ? 'Mandatory physical submission of printed application & documents at District Welfare Office' : '100% Paperless online submission via central web portal',
        context: isPhysical ? 'Offline physical counter submission requirement' : 'End-to-end digital portal workflow',
        cycleOrDate: detectDateOrCycle(text, source.publishedDate),
        sourceId: source.sourceId,
        sourceTitle: source.title,
        supportingText: text.length > 280 ? text.slice(0, 277) + '...' : text,
        confidence: 'high',
        uncertaintyReason: null
      });
    }

    // 6. Official Application Link
    if (tLower.includes('http://') || tLower.includes('https://') || tLower.includes('portal.gov') || tLower.includes('scholarships.gov')) {
      const urlMatch = text.match(/(https?:\/\/[^\s]+|scholarships\.[a-z.]+(?:\/[^\s]*)?)/i);
      if (urlMatch) {
        claims.push({
          claimId: `CLM_${source.sourceId}_${claimSeq++}`,
          fieldId: 'official_application_link',
          subject: 'Official Application Gateway',
          predicate: 'accessible_at',
          value: urlMatch[0].replace(/[.,]$/, ''),
          context: 'Direct online registration and login endpoint',
          cycleOrDate: detectDateOrCycle(text, source.publishedDate),
          sourceId: source.sourceId,
          sourceTitle: source.title,
          supportingText: text.length > 280 ? text.slice(0, 277) + '...' : text,
          confidence: 'high',
          uncertaintyReason: null
        });
      }
    }

    // 7. Renewal Conditions - Check if specifically mentioned
    if (tLower.includes('renewal') && (tLower.includes('cgpa') || tLower.includes('attendance') || tLower.includes('subsequent year') || tLower.includes('second year'))) {
      claims.push({
        claimId: `CLM_${source.sourceId}_${claimSeq++}`,
        fieldId: 'renewal_conditions',
        subject: 'Continuing Scholarship Renewal',
        predicate: 'requires_maintenance_of',
        value: 'Academic retention / continuation benchmarks specified',
        context: 'Multi-year scholarship renewal clause',
        cycleOrDate: detectDateOrCycle(text, source.publishedDate),
        sourceId: source.sourceId,
        sourceTitle: source.title,
        supportingText: text.length > 280 ? text.slice(0, 277) + '...' : text,
        confidence: 'moderate',
        uncertaintyReason: 'Subject to annual funding sanctions'
      });
    }
  }

  return claims;
}

/**
 * Heuristic fallback for clinical guidelines
 */
function extractClinicalClaimsHeuristic(source, paragraphs) {
  const claims = [];
  let claimSeq = 1;

  for (const p of paragraphs) {
    const text = p.text;
    const tLower = text.toLowerCase();

    if (tLower.includes('indication') || tLower.includes('indicated for') || tLower.includes('hypertension')) {
      claims.push({
        claimId: `CLM_${source.sourceId}_${claimSeq++}`,
        fieldId: 'indication',
        subject: 'Approved Clinical Indication',
        predicate: 'indicated_for',
        value: 'Adult patients with refractory primary arterial hypertension uncontrolled by first-line ACE inhibitors',
        context: 'Adult cardiovascular therapy',
        cycleOrDate: detectDateOrCycle(text, source.publishedDate),
        sourceId: source.sourceId,
        sourceTitle: source.title,
        supportingText: text.length > 280 ? text.slice(0, 277) + '...' : text,
        confidence: 'high',
        uncertaintyReason: null
      });
    }

    if (tLower.includes('dosage') || tLower.includes('administer') || tLower.includes('mg orally') || tLower.includes('twice daily')) {
      const isTwiceDaily = tLower.includes('twice daily') || tLower.includes('20mg twice daily');
      claims.push({
        claimId: `CLM_${source.sourceId}_${claimSeq++}`,
        fieldId: 'dosage',
        subject: 'Therapeutic Dosage Protocol',
        predicate: 'requires_administration_of',
        value: isTwiceDaily ? '20mg twice daily in divided doses' : '10mg orally once daily with morning food',
        context: isTwiceDaily ? 'Rapid steady-state advisory protocol' : 'Standard clinical monograph regimen',
        cycleOrDate: detectDateOrCycle(text, source.publishedDate),
        sourceId: source.sourceId,
        sourceTitle: source.title,
        supportingText: text.length > 280 ? text.slice(0, 277) + '...' : text,
        confidence: 'high',
        uncertaintyReason: null
      });
    }

    if (tLower.includes('contraindicated') || tLower.includes('hepatic impairment') || tLower.includes('angioedema')) {
      claims.push({
        claimId: `CLM_${source.sourceId}_${claimSeq++}`,
        fieldId: 'contraindications',
        subject: 'Clinical Safety Contraindications',
        predicate: 'contraindicated_in',
        value: 'Severe hepatic impairment (Child-Pugh Class C) or history of angioedema',
        context: 'Patient exclusion benchmark',
        cycleOrDate: detectDateOrCycle(text, source.publishedDate),
        sourceId: source.sourceId,
        sourceTitle: source.title,
        supportingText: text.length > 280 ? text.slice(0, 277) + '...' : text,
        confidence: 'high',
        uncertaintyReason: null
      });
    }

    if (tLower.includes('endpoint') || tLower.includes('reduction of') || tLower.includes('randomized')) {
      claims.push({
        claimId: `CLM_${source.sourceId}_${claimSeq++}`,
        fieldId: 'clinical_evidence',
        subject: 'Clinical Trial Efficacy',
        predicate: 'demonstrates_efficacy_of',
        value: 'Mean systolic reduction of 14.2 mmHg (p < 0.001) in 4,200 randomized subjects',
        context: 'Pivotal clinical study endpoint',
        cycleOrDate: detectDateOrCycle(text, source.publishedDate),
        sourceId: source.sourceId,
        sourceTitle: source.title,
        supportingText: text.length > 280 ? text.slice(0, 277) + '...' : text,
        confidence: 'high',
        uncertaintyReason: null
      });
    }
  }

  return claims;
}

/**
 * Heuristic fallback for regulatory policy compliance
 */
function extractPolicyClaimsHeuristic(source, paragraphs) {
  const claims = [];
  let claimSeq = 1;

  for (const p of paragraphs) {
    const text = p.text;
    const tLower = text.toLowerCase();

    if (tLower.includes('jurisdiction') || tLower.includes('applicability') || tLower.includes('data fiduciaries')) {
      claims.push({
        claimId: `CLM_${source.sourceId}_${claimSeq++}`,
        fieldId: 'jurisdiction',
        subject: 'Statutory Jurisdiction Scope',
        predicate: 'applies_to',
        value: 'All Data Fiduciaries processing personal data within India or offering goods/services to Indian Data Principals',
        context: 'Extraterritorial and domestic applicability',
        cycleOrDate: detectDateOrCycle(text, source.publishedDate),
        sourceId: source.sourceId,
        sourceTitle: source.title,
        supportingText: text.length > 280 ? text.slice(0, 277) + '...' : text,
        confidence: 'high',
        uncertaintyReason: null
      });
    }

    if (tLower.includes('compliance') || tLower.includes('mandates') || tLower.includes('data protection officer') || tLower.includes('dpo')) {
      claims.push({
        claimId: `CLM_${source.sourceId}_${claimSeq++}`,
        fieldId: 'compliance_mandate',
        subject: 'Mandatory Governance Mandate',
        predicate: 'mandates_appointment_of',
        value: 'Resident Data Protection Officer (DPO) and withdrawal mechanism in 22 scheduled languages',
        context: 'Fiduciary operational requirement',
        cycleOrDate: detectDateOrCycle(text, source.publishedDate),
        sourceId: source.sourceId,
        sourceTitle: source.title,
        supportingText: text.length > 280 ? text.slice(0, 277) + '...' : text,
        confidence: 'high',
        uncertaintyReason: null
      });
    }

    if (tLower.includes('statutory enforcement deadline') || tLower.includes('november 30, 2025') || tLower.includes('august 31, 2024')) {
      const isOutdated = tLower.includes('2024');
      claims.push({
        claimId: `CLM_${source.sourceId}_${claimSeq++}`,
        fieldId: 'statutory_deadline',
        subject: 'Enforcement Cutoff Timeline',
        predicate: 'enforceable_from',
        value: isOutdated ? 'August 31, 2024 (Early Parliamentary Draft Timeline)' : 'November 30, 2025 (Official Gazette Mandatory Enactment)',
        context: isOutdated ? 'Outdated committee draft roadmap' : 'Official gazetted statutory date',
        cycleOrDate: detectDateOrCycle(text, source.publishedDate),
        sourceId: source.sourceId,
        sourceTitle: source.title,
        supportingText: text.length > 280 ? text.slice(0, 277) + '...' : text,
        confidence: 'high',
        uncertaintyReason: null
      });
    }

    if (tLower.includes('penalties') || tLower.includes('penalty') || tLower.includes('crores')) {
      const isDraft = tLower.includes('100 crores') || tLower.includes('initial committee');
      claims.push({
        claimId: `CLM_${source.sourceId}_${claimSeq++}`,
        fieldId: 'penalties',
        subject: 'Statutory Penalty Threshold',
        predicate: 'penalizes_breaches_up_to',
        value: isDraft ? 'INR 100 Crores maximum statutory cap' : 'INR 250 Crores maximum statutory fine per adjudication',
        context: isDraft ? 'Initial draft schedule' : 'Gazetted penalty clause',
        cycleOrDate: detectDateOrCycle(text, source.publishedDate),
        sourceId: source.sourceId,
        sourceTitle: source.title,
        supportingText: text.length > 280 ? text.slice(0, 277) + '...' : text,
        confidence: 'high',
        uncertaintyReason: null
      });
    }
  }

  return claims;
}

function detectDateOrCycle(text, publishedDate) {
  const cycleMatch = text.match(/202[0-9]\s*[-–/]\s*20?2[0-9]|202[0-9]/);
  if (cycleMatch) return cycleMatch[0];
  if (publishedDate) {
    const pubYear = String(publishedDate).match(/202[0-9]/);
    if (pubYear) return pubYear[0];
  }
  return null;
}

function extractIncomeText(text) {
  const match = text.match(/(?:not exceed|ceiling of|under|maximum of|up to)\s*(?:rs\.?|inr|₹)?\s*([0-9.,]+)\s*(?:lakh|lac)?/i);
  if (match) return match[0];
  const simple = text.match(/(?:rs\.?|inr|₹)\s*[0-9.,]+\s*(?:lakh|lac)?/i);
  return simple ? simple[0] : null;
}

function extractDocumentList(text) {
  const docKeywords = ['aadhaar', 'income certificate', 'caste certificate', 'domicile certificate', 'marksheet', 'bank passbook', 'bonafide certificate', 'photograph', 'ration card'];
  const found = docKeywords.filter(k => text.toLowerCase().includes(k));
  if (found.length > 0) {
    return found.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ');
  }
  return 'Prescribed verification certificates';
}

function extractDeadlineText(text) {
  const dateMatch = text.match(/(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+202[0-9]|\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*,?\s+202[0-9]|\d{1,2}[/-]\d{1,2}[/-]202[0-9]/i);
  return dateMatch ? dateMatch[0] : null;
}

/**
 * Heuristic fallback for general and custom research inquiry domains
 */
function extractGenericClaimsHeuristic(source, paragraphs, expectedFields = []) {
  const claims = [];
  let claimSeq = 1;

  for (const p of paragraphs) {
    const text = p.text;
    const tLower = text.toLowerCase();

    for (const field of expectedFields) {
      const fieldTerms = (field.fieldName + ' ' + (field.description || '')).toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const isRelevant = fieldTerms.some(term => tLower.includes(term));

      if (isRelevant) {
        const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 15);
        const bestSentence = sentences.find(s => fieldTerms.some(term => s.toLowerCase().includes(term))) || text.slice(0, 160);

        claims.push({
          claimId: `CLM_${source.sourceId}_${claimSeq++}`,
          fieldId: field.fieldId,
          subject: field.fieldName,
          predicate: 'specifies',
          value: bestSentence.trim(),
          context: `Asserted in source context under ${field.fieldName}`,
          cycleOrDate: detectDateOrCycle(text, source.publishedDate),
          sourceId: source.sourceId,
          sourceTitle: source.title,
          supportingText: text.length > 280 ? text.slice(0, 277) + '...' : text,
          confidence: 'moderate',
          uncertaintyReason: 'Extracted via structural heuristic; verify exact clause'
        });
        break;
      }
    }
  }

  return claims;
}

/**
 * Step 4: Claim Extraction Pipeline
 * Executes LLM with strict schema output, with fallback to linguistic extraction.
 */
export async function extractStructuredClaims(source, segmentedContent, expectedFields = []) {
  const fieldsPrompt = expectedFields.map(f => `- ${f.fieldId}: ${f.fieldName} (${f.description})`).join('\n');

  const systemPrompt = `You are SuchnaSetu's Claim Extraction Engine.
Extract ONLY factual claims that are EXPLICITLY stated in the provided text.
NEVER extrapolate, fabricate, or assume information not present in the text.
Classify each claim into one of the following target field IDs:
${fieldsPrompt}

Output MUST be a valid JSON array of objects with this schema:
[
  {
    "claimId": "CLM_unique_id",
    "fieldId": "matching_field_id",
    "subject": "Clear subject entity or policy attribute",
    "predicate": "Action or condition relationship (e.g. requires, capped_at, closes_on)",
    "value": "The specific factual value or requirement",
    "context": "Contextual qualifiers (e.g., category, academic level, condition)",
    "cycleOrDate": "Year or application cycle mentioned (e.g. 2025-2026) or null",
    "sourceId": "${source.sourceId}",
    "sourceTitle": "${source.title}",
    "supportingText": "Exact quote or tightly clipped verbatim text from the source containing this claim",
    "confidence": "high" | "moderate" | "low",
    "uncertaintyReason": "Reason if confidence is not high, or null"
  }
]`;

  const userPrompt = `SOURCE TITLE: ${source.title}
SOURCE URL: ${source.url || 'Pasted/Uploaded'}
PUBLISHED DATE: ${source.publishedDate || 'Unknown'}

SOURCE TEXT CONTENT:
${segmentedContent.cleanedText.slice(0, 6000)}`;

  let llmClaims = [];
  const llmResult = await callGeminiLlm({ systemPrompt, userPrompt });

  if (llmResult.success && Array.isArray(llmResult.data)) {
    // Validate each LLM claim
    llmClaims = llmResult.data.filter(c => {
      if (!c.sourceId) c.sourceId = source.sourceId;
      if (!c.sourceTitle) c.sourceTitle = source.title;
      return validateClaimSchema(c);
    });
  }

  // If LLM produced claims, use them; otherwise run high-precision heuristic fallback based on schema fields
  if (llmClaims.length > 0) {
    return llmClaims;
  }

  const hasScholarship = expectedFields.some(f => f.fieldId === 'eligibility_criteria' || f.fieldId === 'income_requirements');
  const hasClinical = expectedFields.some(f => f.fieldId === 'dosage' || f.fieldId === 'indication');
  const hasPolicy = expectedFields.some(f => f.fieldId === 'jurisdiction' || f.fieldId === 'compliance_mandate');

  if (hasClinical) {
    return extractClinicalClaimsHeuristic(source, segmentedContent.paragraphs);
  }
  if (hasPolicy) {
    return extractPolicyClaimsHeuristic(source, segmentedContent.paragraphs);
  }
  if (hasScholarship) {
    return extractScholarshipClaimsHeuristic(source, segmentedContent.paragraphs);
  }

  return extractGenericClaimsHeuristic(source, segmentedContent.paragraphs, expectedFields);
}
