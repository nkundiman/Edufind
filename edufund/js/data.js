/**
 * EduFund – js/data.js
 * Central data store (replace with API calls / backend in production)
 */

// ── Sample Students ─────────────────────────────────────────────────────────
const students = [
  {
    id: 'STU-001',
    name: 'Alice Nkurunziza',
    email: 'alice@uni.rw',
    uni: 'Univ. of Rwanda',
    dept: 'Engineering',
    year: 'Year 3',
  },
  {
    id: 'STU-002',
    name: 'Bob Kamanzi',
    email: 'bob@uni.rw',
    uni: 'INES-Ruhengeri',
    dept: 'Technology',
    year: 'Year 2',
  },
  {
    id: 'STU-003',
    name: 'Clara Uwase',
    email: 'clara@kist.ac.rw',
    uni: 'KIST',
    dept: 'Science',
    year: 'Year 4',
  },
];

// ── Sample Applications ──────────────────────────────────────────────────────
// status: 'pending' | 'review' | 'approved' | 'rejected'
let applications = [
  {
    id: 'APP-001',
    studentId: 'STU-001',
    studentName: 'Alice Nkurunziza',
    uni: 'Univ. of Rwanda',
    project: 'TechSeed AI Platform',
    category: 'Technology',
    amount: 5000,
    approvedAmt: 4500,
    status: 'approved',
    date: '2026-02-10',
    desc: 'An AI-powered platform to connect startups with seed investors in East Africa.',
    team: 'Alice Nkurunziza, David Mugabo',
    outcomes: 'MVP launch, 50 beta users',
    timeline: '6 months',
    note: 'Excellent proposal. Reduced by 10% due to budget.',
  },
  {
    id: 'APP-002',
    studentId: 'STU-001',
    studentName: 'Alice Nkurunziza',
    uni: 'Univ. of Rwanda',
    project: 'AgroSmart Monitor',
    category: 'Environment',
    amount: 2500,
    approvedAmt: 0,
    status: 'pending',
    date: '2026-03-01',
    desc: 'IoT sensors for smart irrigation in smallholder farms.',
    team: 'Alice Nkurunziza',
    outcomes: '3 pilot farms equipped',
    timeline: '3 months',
    note: '',
  },
  {
    id: 'APP-003',
    studentId: 'STU-002',
    studentName: 'Bob Kamanzi',
    uni: 'INES-Ruhengeri',
    project: 'MediLink App',
    category: 'Health',
    amount: 3200,
    approvedAmt: 0,
    status: 'review',
    date: '2026-03-05',
    desc: 'Telemedicine app connecting rural patients with doctors.',
    team: 'Bob Kamanzi, Eve Kamasa',
    outcomes: '500 registered users, 3 partnered clinics',
    timeline: '12 months',
    note: '',
  },
  {
    id: 'APP-004',
    studentId: 'STU-003',
    studentName: 'Clara Uwase',
    uni: 'KIST',
    project: 'EduKids VR',
    category: 'Education',
    amount: 7000,
    approvedAmt: 0,
    status: 'rejected',
    date: '2026-01-20',
    desc: 'VR learning experiences for primary school children.',
    team: 'Clara Uwase, Frank Muneza',
    outcomes: '10 VR classrooms deployed',
    timeline: '18 months',
    note: 'Scope too large for current cycle. Resubmit with reduced scope.',
  },
  {
    id: 'APP-005',
    studentId: 'STU-002',
    studentName: 'Bob Kamanzi',
    uni: 'INES-Ruhengeri',
    project: 'CleanWater Bot',
    category: 'Environment',
    amount: 4100,
    approvedAmt: 0,
    status: 'pending',
    date: '2026-03-18',
    desc: 'Low-cost water purification robot for rural communities.',
    team: 'Bob Kamanzi',
    outcomes: '5 communities served',
    timeline: '6 months',
    note: '',
  },
];

// ── Chatbot Knowledge Base ───────────────────────────────────────────────────
// Add or edit entries to customise bot responses
const botReplies = {
  'how do i apply':
    'To apply for funding, go to the <strong>New Application</strong> tab in the sidebar. ' +
    'Fill in your project title, category, funding amount, description, team, and timeline. ' +
    'Submit when ready — our team reviews within 5–7 working days!',

  'maximum funding':
    'The maximum funding per application is <strong>$10,000</strong>. ' +
    'Most approved projects receive between $2,000–$6,000. ' +
    'Projects with strong impact statements and clear timelines are prioritised.',

  'review take':
    'The review process typically takes <strong>5–7 working days</strong> from submission. ' +
    'You\'ll receive a status update via your dashboard. ' +
    'If additional info is needed, an admin will leave a note on your application.',

  'how many pending': () =>
    `There are currently <strong>${applications.filter(a => a.status === 'pending').length} pending applications</strong> waiting for review.`,

  'total funding': () =>
    `The total funding requested across all applications is <strong>$${applications.reduce((s, a) => s + a.amount, 0).toLocaleString()}</strong>.`,

  export:
    'To export the applicant list as CSV, go to <strong>Export CSV</strong> in the admin sidebar. ' +
    'You can filter by status and date range before downloading.',

  status:
    'You can check your application status in the <strong>My Applications</strong> tab. ' +
    'Statuses: 🟡 Pending, 🔵 In Review, 🟢 Approved, 🔴 Rejected.',

  categories:
    'Available project categories are: Technology, Environment, Health, Education, Social Impact, and Arts. ' +
    'Choose the one that best fits your project.',

  team:
    'You can add team members in the "Team Members" field when submitting. ' +
    'List names separated by commas.',

  default:
    'That\'s a great question! For specific help, browse the <strong>My Applications</strong> tab ' +
    'for your status, or contact our support team at <strong>support@edufund.rw</strong>. ' +
    'I\'m here to help with any other questions! 😊',
};
