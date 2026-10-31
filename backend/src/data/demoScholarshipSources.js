/**
 * Benchmark Demonstration Datasets for Hackathon 2026:
 * Primary: Official problem statement "DIGITAL DARK SPOT – AI-Assisted Information Gap Detection Platform".
 * All entries are explicitly labeled as demonstration data.
 */

export const DEMO_SCHOLARSHIP_DATA = {
  question: "What should I verify before applying for this scholarship?",
  domain: "scholarship",
  benchmarkDescription: "Official Digital Dark Spot scholarship benchmark test case containing verified gaps (renewal policy missing), procedural contradictions (online vs physical district submission), and freshness variance (2024 vs 2025-2026 cycle).",
  sources: [
    {
      sourceId: "src_demo_01_portal",
      title: "State Post-Matric Scholarship Scheme 2025-2026 Official Portal Guidelines",
      url: "https://scholarships.gov.in/schemes/post-matric-2025",
      domain: "scholarships.gov.in",
      sourceType: "official_government",
      publishedDate: "2025-07-15",
      retrievedDate: "2026-10-31T09:00:00Z",
      extractedContent: `State Post-Matric Scholarship Scheme for Higher Education (Academic Year 2025-2026).
Government Notification Ref: ED/SCHOL/2025-881.

1. Eligibility Criteria:
Candidates must have secured minimum 50% marks in the qualifying Class 10 or Class 12 board examination and be enrolled in a recognized undergraduate or diploma degree course within the state.

2. Annual Family Income Ceiling:
The total parental or household annual income from all sources must not exceed INR 2,50,000 (Two Lakh Fifty Thousand Rupees) per annum. An official income certificate issued by a competent revenue officer (Tahsildar / Sub-Divisional Magistrate) is mandatory.

3. Mandatory Verification Documents:
Applicants must upload clear scanned copies of:
(a) Aadhaar Card with biometric verification
(b) Competent Authority Income Certificate
(c) Caste Certificate (where applicable)
(d) Qualifying Exam Marksheet
(e) Active Bank Account Passbook seeded with Aadhaar.

4. Application Timeline & Deadline:
Online registrations for the 2025-2026 academic cycle commence on 1st August 2025. The final closing date for submission of online applications is October 31, 2025. Late submissions will not be entertained by the portal.

5. Application Procedure & Gateway:
The entire application process is 100% paperless and online. Candidates must register and submit their applications exclusively via the central portal at https://scholarships.gov.in. No physical documents need to be submitted at college or district administrative counters.`,
      demoLabel: "Demonstration Data - Official Portal Simulation"
    },
    {
      sourceId: "src_demo_02_advisory",
      title: "National Students Career Advisory - State Scholarship Digest 2024",
      url: "https://educationadvisory.org.in/bulletin/scholarship-guide-2024",
      domain: "educationadvisory.org.in",
      sourceType: "institutional_academic",
      publishedDate: "2024-05-10",
      retrievedDate: "2026-10-31T09:05:00Z",
      extractedContent: `Education Advisory Bulletin: Comprehensive Guide to State Post-Matric Financial Aid (Cycle 2024).

Overview & Eligibility:
The scheme supports students from economically backward households pursuing technical and non-technical higher education. Students must have passed previous qualifying examination with minimum 50% aggregate marks.

Important Deadline Notice:
For the 2024 cycle, the scholarship portal will accept forms until August 15, 2024. Students are advised to apply early to avoid server downtime.

Submission Process & Counter Verification:
After completing the initial web pre-registration, applicants are strictly required to print the generated application form and physically submit the hard copy along with attested physical document dossiers directly at the District Welfare Office counter within 7 days. Failure to complete physical counter submission invalidates the application.

Required Documentation List:
Students must assemble:
- Aadhaar Card
- Revenue Authority Income Certificate
- State Domicile Certificate
- Previous Semester Marksheet
- Notarized Affidavit on 100-rupee stamp paper declaring unemployment.`,
      demoLabel: "Demonstration Data - Outdated Academic Digest"
    },
    {
      sourceId: "src_demo_03_forum",
      title: "Higher Education Student Aid Community Forum - FAQ & Discussion",
      url: "https://studentaidforum.net/discussions/post-matric-income-limit-faq",
      domain: "studentaidforum.net",
      sourceType: "general_web",
      publishedDate: "2025-01-20",
      retrievedDate: "2026-10-31T09:10:00Z",
      extractedContent: `Student Aid Forum Discussion Thread: Clarification on Post-Matric Financial Thresholds.

User Discussion:
"Can anyone confirm the exact family income limit for the post-matric scholarship? In our district meeting last month, an official mentioned the ceiling has been kept at INR 2,00,000 per year, and anyone with higher family income will have their file rejected during verification."

Moderator Note:
Please make sure to have all your documents ready before the cutoff date. You can check application status on https://scholarships.gov.in. Be aware that renewal guidelines for the subsequent academic years are often not published until mid-year circulars are released.`,
      demoLabel: "Demonstration Data - Community Forum Thread"
    }
  ]
};

export const DEMO_CLINICAL_DATA = {
  question: "What are the approved dosage limits, contraindications, and patient exclusions for this cardiovascular protocol?",
  domain: "clinical_health",
  benchmarkDescription: "Clinical trial intelligence benchmark: flags omitted gestational and pediatric guidelines as 'Not found in reviewed sources' and detects contradictory daily dosing recommendations.",
  sources: [
    {
      sourceId: "src_clin_01_monograph",
      title: "National Health Authority - Clinical Protocol Monograph 2025",
      url: "https://clinicalguidelines.gov.in/protocols/cardio-2025",
      domain: "clinicalguidelines.gov.in",
      sourceType: "official_government",
      publishedDate: "2025-03-12",
      retrievedDate: "2026-10-31T10:00:00Z",
      extractedContent: `Clinical Monograph: Therapeutic Standards for Cardio-Metabolic Interventions (2025 Release).

1. Approved Indication:
Indicated for adult patients with refractory primary arterial hypertension uncontrolled by first-line ACE inhibitors.

2. Standard Dosage & Administration:
Administer 10mg orally once daily with morning food. Titration to maximum 20mg daily permitted after 4 weeks of continuous hemodynamic monitoring.

3. Documented Contraindications:
Strictly contraindicated in patients with severe hepatic impairment (Child-Pugh Class C) or history of angioedema.

4. Clinical Trial Endpoints:
Achieved statistically significant mean systolic reduction of 14.2 mmHg (p < 0.001) across 4,200 randomized subjects.`,
      demoLabel: "Demonstration Data - Clinical Monograph Simulation"
    },
    {
      sourceId: "src_clin_02_advisory",
      title: "Medical Practice Advisory Bulletin (2024 Edition)",
      url: "https://cardiopractice.org/bulletins/hypertension-regimen",
      domain: "cardiopractice.org",
      sourceType: "institutional_academic",
      publishedDate: "2024-04-18",
      retrievedDate: "2026-10-31T10:05:00Z",
      extractedContent: `Cardio Practice Advisory: Practical Dosing Regimens for Resistant Hypertension.

Administration Recommendation:
Physicians are advised to initiate therapy with 20mg twice daily in divided doses to achieve rapid steady-state plasma concentrations within 48 hours.

Cautionary Notes:
Ensure baseline serum creatinine and electrolyte panels are recorded prior to prescription. Pediatric dosing safety has not been evaluated.`,
      demoLabel: "Demonstration Data - Dosing Advisory Conflict"
    }
  ]
};

export const DEMO_POLICY_DATA = {
  question: "What are the mandatory statutory compliance obligations and exemptions under the Data Protection Act?",
  domain: "policy_legal",
  benchmarkDescription: "Regulatory policy benchmark: flags absent negative-list transfer exemptions and highlights conflicting penalty schedules.",
  sources: [
    {
      sourceId: "src_pol_01_gazette",
      title: "Gazette Notification: Digital Personal Data Protection Rules 2025",
      url: "https://meity.gov.in/gazette/dpdp-rules-2025",
      domain: "meity.gov.in",
      sourceType: "official_government",
      publishedDate: "2025-06-01",
      retrievedDate: "2026-10-31T10:15:00Z",
      extractedContent: `Ministry of Electronics & Information Technology Gazette Notification.

1. Jurisdiction & Applicability:
Applies to all Data Fiduciaries processing personal data within the territory of India, or outside India if offering goods or services to Data Principals in India.

2. Mandatory Compliance Mandates:
Data Fiduciaries must appoint a resident Data Protection Officer (DPO) and provide accessible mechanisms for consent withdrawal in 22 scheduled languages.

3. Statutory Enforcement Deadline:
Full statutory compliance is mandated by November 30, 2025. Non-compliance after this date is subject to direct adjudication.

4. Statutory Penalties:
Failure to observe security safeguards resulting in data breach is punishable by statutory penalties up to INR 250 Crores per adjudication.`,
      demoLabel: "Demonstration Data - Official Gazette Simulation"
    },
    {
      sourceId: "src_pol_02_digest",
      title: "Corporate Legal Advisory - Privacy Compliance Guide 2024",
      url: "https://privacylawreview.org/analysis/data-protection-compliance-2024",
      domain: "privacylawreview.org",
      sourceType: "institutional_academic",
      publishedDate: "2024-02-15",
      retrievedDate: "2026-10-31T10:20:00Z",
      extractedContent: `Corporate Legal Analysis: Preparing for Cross-Border Data Regulations (2024).

Timeline Considerations:
Organizations should target an initial readiness milestone of August 31, 2024 to align with early parliamentary committee drafts.

Penalty Calculations:
The initial committee draft proposed penalties capped at INR 100 Crores, though higher multipliers remain under active stakeholder debate. Exemption schedules for cross-border processing remain unnotified.`,
      demoLabel: "Demonstration Data - Outdated Legal Advisory"
    }
  ]
};

export const ALL_DEMO_SCENARIOS = {
  scholarship: DEMO_SCHOLARSHIP_DATA,
  clinical: DEMO_CLINICAL_DATA,
  policy: DEMO_POLICY_DATA
};
