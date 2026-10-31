/**
 * Benchmark Demonstration Dataset for Hackathon 2026:
 * Follows the official problem statement "DIGITAL DARK SPOT – AI-Assisted Information Gap Detection Platform".
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
