// ─────────────────────────────────────────────────────────────
//  All site content lives here. Edit this file to update text,
//  results, batches, branches and contact details. The website,
//  SEO data (schema, sitemap, llms.txt) and the brochure all read it.
// ─────────────────────────────────────────────────────────────

export const SITE_URL = 'https://www.futurescience.in'
export const BROCHURE_URL = '/downloads/futureScience-Brochure-2027-29.pdf'
export const ACADEMIC_YEAR = '2027–29'
// Release version from package.json, injected by vite.config.js (empty when plain Node imports this file)
export const VERSION = typeof __APP_VERSION__ === 'undefined' ? '' : __APP_VERSION__

// TODO: confirm email below (it was stored in the old WordPress database).
export const contact = {
  phone: '+91 93217 84940',
  whatsapp: '919321784940', // digits only with country code; set to '' to use email for the enquiry form instead
  email: 'info@futurescience.in',
  address: 'Kandivali West & Malad West, Mumbai',
  hours: 'Mon – Sat · 8:00 AM – 8:00 PM',
  socials: {
    instagram: 'https://www.instagram.com/futurescience.in/',
    youtube: '',
    facebook: 'https://www.facebook.com/futurescience.in/',
    linkedin: 'https://in.linkedin.com/company/futurescience',
  },
}

// Tracking IDs. Empty = that tracker is not loaded at all.
// ga4: Google Analytics "Measurement ID" (G-XXXXXXXXXX); metaPixel: Meta Pixel / Dataset ID (digits only)
export const analytics = {
  ga4: 'G-6C9RV8YZ4W',
  metaPixel: '',
}

export const branches = [
  {
    id: 'kandivali-west',
    name: 'Kandivali West',
    street: 'Mahavir Nagar',
    locality: 'Kandivali West',
    city: 'Mumbai',
    region: 'Maharashtra',
    postalCode: '400067',
    mapQuery: 'futureScience Private Tutorials, Mahavir Nagar, Kandivali West, Mumbai',
    nearby: ['Kandivali', 'Borivali', 'Charkop', 'Dahanukar Wadi'],
  },
  {
    id: 'malad-west',
    name: 'Malad West',
    street: 'S.V. Road',
    locality: 'Malad West',
    city: 'Mumbai',
    region: 'Maharashtra',
    postalCode: '400064',
    mapQuery: 'futureScience Private Tutorials, S.V. Road, Malad West, Mumbai',
    nearby: ['Malad', 'Goregaon', 'Orlem', 'Marve Road'],
  },
]

export const brand = {
  name: 'futureScience',
  full: 'futureScience Private Tutorials',
  tagline: 'Science is the Future',
  parent: 'an endeavour of futureScience Eduventures LLP',
  legal: 'futureScience Eduventures LLP',
}

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/courses', label: 'Courses' },
  { to: '/results', label: 'Results' },
  { to: '/directors', label: 'Directors' },
  { to: '/contact', label: 'Contact' },
]

export const heroStats = [
  { value: 99.98, decimals: 2, suffix: '%ile', label: 'Top MHT-CET score, 2024' },
  { value: 100, suffix: '%ile', label: 'Physics & Biology, perfect scores' },
  { value: 2, prefix: '#', label: 'Rank, Mumbai University' },
  { value: 100, suffix: '%', label: 'Students qualified for professional courses' },
]

export const exams = ['JEE Main', 'JEE Advanced', 'NEET-UG', 'MHT-CET', 'CUET-UG', 'HSC Board', 'Std. XI Science', 'Std. XII Science', 'Engineering Entrance', 'Medical Entrance', 'Pharmacy Entrance', 'PCM', 'PCB']

// Coaching tracks: written for students and for search engines / AI answers alike
export const tracks = [
  { icon: 'Cog', title: 'Engineering coaching', exams: 'JEE Main · JEE Advanced · MHT-CET (PCM)', text: 'Physics, Chemistry and Mathematics for Class 11 & 12, taught to the depth JEE and MHT-CET demand.' },
  { icon: 'Stethoscope', title: 'Medical coaching', exams: 'NEET-UG · MHT-CET (PCB)', text: 'Physics, Chemistry and Biology for Class 11 & 12, with NCERT mastery and MCQ speed-building for NEET-UG.' },
  { icon: 'Pill', title: 'Pharmacy entrance coaching', exams: 'MHT-CET for B.Pharm', text: 'Admission to B.Pharm in Maharashtra is through MHT-CET; our PCB and PCM batches cover the full CET syllabus.' },
  { icon: 'BookMarked', title: 'CUET-UG coaching', exams: 'CUET-UG Science domain', text: 'Preparation for the Physics, Chemistry, Mathematics and Biology domain papers of CUET-UG.' },
  { icon: 'GraduationCap', title: 'Class 11 & 12 Science', exams: 'HSC · CBSE · ICSE / ISC', text: 'Board-exam teaching integrated with entrance preparation, so school and competitive exams move together.' },
  { icon: 'Rocket', title: 'Bridge to Std. XI', exams: 'Std. X → Std. XI', text: 'A head start for students moving into Std. XI Science, building the base that Class 11 assumes.' },
]

export const programs = [
  {
    id: 'xi-xii-integrated',
    icon: 'GraduationCap',
    title: 'Std. XI + XII Science',
    sub: 'Integrated with JEE / NEET-UG / MHT-CET / CUET',
    image: '/images/board.jpg',
    audience: 'Students entering Std. XI (SSC / ICSE / CBSE / Other)',
    duration: `2-year programme · ${ACADEMIC_YEAR}`,
    summary: 'A regular + vacation combined course that covers the Class 11 & 12 board syllabus and competitive-exam preparation side by side, with coaching, tests and mentoring under one roof.',
    points: ['Integrated & non-integrated batches', 'Board + entrance syllabus in one flow', 'Regular tests with detailed analysis', 'Personal academic mentoring'],
    tag: 'Flagship',
  },
  {
    id: 'bridge-course',
    icon: 'Rocket',
    title: 'Bridge Course',
    sub: 'Std. X → Std. XI Science',
    image: '/images/vision.png',
    audience: 'Students going to Std. XI',
    duration: 'Starts 13 April 2027',
    summary: 'A head start before Std. XI begins: the jump from Class 10 to Class 11 Science is steep, and this course builds the concepts and study habits it assumes.',
    points: ['Class 11 readiness in PCM / PCB', 'Concept gaps from Std. X closed', 'Study habits & time management', 'Smooth entry into the main batch'],
    tag: 'New',
  },
  {
    id: 'jee-cet-pcm',
    icon: 'Cog',
    title: 'JEE Main & MHT-CET (PCM)',
    sub: 'Engineering entrance coaching',
    image: '/images/ai.jpg',
    audience: 'Class 11 & 12 engineering aspirants',
    duration: 'Starts 25 May 2027',
    summary: 'Concept-first Physics, Chemistry and Mathematics that builds the problem-solving depth demanded by JEE Main, JEE Advanced and MHT-CET (PCM).',
    points: ['Deep conceptual PCM', 'Advanced problem-solving drills', 'Mock tests in real exam pattern', 'Doubt-solving any time'],
  },
  {
    id: 'neet-cet-pcb',
    icon: 'Stethoscope',
    title: 'NEET-UG & MHT-CET (PCB)',
    sub: 'Medical & pharmacy entrance coaching',
    image: '/images/medical-tech.jpg',
    audience: 'Class 11 & 12 medical and pharmacy aspirants',
    duration: 'Starts 25 May 2027',
    summary: 'Structured Physics, Chemistry and Biology with NCERT mastery and MCQ speed-building for NEET-UG, plus full MHT-CET (PCB) coverage for medical and B.Pharm admissions.',
    points: ['NCERT-anchored Biology', 'MCQ speed & accuracy training', 'Full-syllabus mock tests', 'Pharmacy (B.Pharm) CET guidance'],
  },
  {
    id: 'cuet',
    icon: 'BookMarked',
    title: 'CUET-UG (Science)',
    sub: 'Central university admissions',
    image: '/images/astronaut.jpg',
    audience: 'Class 12 science students',
    duration: 'With Std. XII',
    summary: 'Preparation for the Physics, Chemistry, Mathematics and Biology domain papers of CUET-UG, aligned with the Class 12 syllabus you are already studying.',
    points: ['Domain-subject coverage', 'NCERT-based MCQ practice', 'CUET-pattern mock tests', 'Course & university guidance'],
  },
  {
    id: 'cet-crash',
    icon: 'Zap',
    title: 'MHT-CET Crash Course',
    sub: 'PCM / PCB · after HSC',
    image: '/images/innovation-bulb.jpg',
    audience: 'Students who have appeared for HSC',
    duration: '45 days',
    summary: 'An intensive 45-day sprint with tests and precise study material for class-work and home-work, built to convert preparation into percentile.',
    points: ['45 days of focused coaching', 'Chapter-wise and full-length tests', 'Precise class-work & home-work material', 'Exam strategy sessions'],
    tag: 'High-impact',
  },
  {
    id: 'test-series',
    icon: 'ClipboardCheck',
    title: 'futureScience Test Series',
    sub: 'JEE · NEET · CET pattern',
    image: '/images/education.jpg',
    logo: '/images/test-series.png',
    audience: 'All science students',
    duration: 'Through the year',
    summary: 'Exam-pattern tests with careful analysis of strengths and weaknesses, so every attempt sharpens your strategy.',
    points: ['Real exam pattern', 'Detailed performance analysis', 'Topic-wise & full-length tests', 'Strategy feedback'],
  },
  {
    id: 'stemquest',
    icon: 'BrainCircuit',
    title: 'STEMQUEST',
    sub: 'Science beyond the syllabus',
    image: '/images/mindset.jpg',
    logo: '/images/stemquest.png',
    audience: 'Curious young minds',
    duration: 'Programme',
    summary: 'Our initiative to build a genuine scientific mindset: exploration, reasoning and innovation that goes beyond exams.',
    points: ['Scientific thinking', 'Exploration & inquiry', 'Innovation challenges', 'STEM careers awareness'],
  },
]

// Batch dates for the 2027–29 academic year
export const batches = [
  {
    course: 'Bridge Course',
    for: 'Students going to Std. XI',
    details: 'A head start in Class 11 Science before the regular batch begins.',
    start: '13 April 2027',
    startISO: '2027-04-13',
    programId: 'bridge-course',
    status: 'Admissions open',
  },
  {
    course: 'JEE Main / MHT-CET (PCM)',
    for: `Std. XI + XII Science · ${ACADEMIC_YEAR}`,
    details: 'Engineering entrance coaching integrated with the Class 11 & 12 board syllabus.',
    start: '25 May 2027',
    startISO: '2027-05-25',
    programId: 'jee-cet-pcm',
    status: 'Admissions open',
  },
  {
    course: 'NEET-UG / MHT-CET (PCB)',
    for: `Std. XI + XII Science · ${ACADEMIC_YEAR}`,
    details: 'Medical & pharmacy entrance coaching integrated with the Class 11 & 12 board syllabus.',
    start: '25 May 2027',
    startISO: '2027-05-25',
    programId: 'neet-cet-pcb',
    status: 'Admissions open',
  },
]

// Five-step methodology (from the futureScience "ladder" brochure)
export const methodology = [
  { n: '01', icon: 'Search', title: 'Explore & Learn', text: 'Our methodical approach makes the basics stronger, with no stone left unturned, which makes learning a stress-free and enjoyable process.' },
  { n: '02', icon: 'BookOpenCheck', title: 'Manage', text: 'Managing self-study is one of the most important factors that makes the difference towards the end. With our researched methodology we provide the support you need.' },
  { n: '03', icon: 'Target', title: 'Strategise', text: 'Performance in competitive exams depends on well-planned, well-executed strategy. With careful analysis of strengths and weaknesses, we guide you to the best plan to crack them.' },
  { n: '04', icon: 'TrendingUp', title: 'Grow with Confidence', text: 'With properly managed studies and a personalised strategy, we stand by you till you achieve your targets, so you always have the confidence to face academic challenges.' },
  { n: '05', icon: 'Trophy', title: 'Succeed', text: 'Success is what we work together for. Your sincere efforts and our round-the-clock support and monitoring set every student on a successful career in science & technology.' },
]

export const pillars = [
  { icon: 'MessagesSquare', title: 'No doubt left unsolved', text: 'Tutors ready to answer any query at any time: a "knowledge ATM" for every student.' },
  { icon: 'Microscope', title: 'Concepts to the core', text: 'Teaching goes deep into the why, so you can face any level of MCQ with confidence.' },
  { icon: 'ShieldCheck', title: 'Disciplined system', text: 'A structured rhythm of class-work, home-work and tests that keeps preparation on track.' },
  { icon: 'Users', title: 'Small, focused batches', text: 'Personal attention and mentoring that feels like a friendly discussion with professionals.' },
  { icon: 'LineChart', title: 'Tests with analysis', text: 'Every test is followed by analysis of strengths and weaknesses to refine strategy.' },
  { icon: 'Laptop', title: 'Online & offline', text: 'Our online classroom was the closest thing to the best offline classroom, so learning never stops.' },
]

// The two faces of futureScience. Deliberately no subject labels.
export const mentors = [
  {
    id: 'nilesh-vedant',
    name: 'Nilesh Vedant',
    role: 'Director',
    title: 'The Architect of Concepts',
    photo: '/images/mentors/nilesh-vedant.png',
    lead: 'A name generations of Mumbai science students say with gratitude. Nilesh Vedant built futureScience on one conviction: a student who truly understands will always outperform one who only memorises.',
    traits: [
      { icon: 'Microscope', label: 'Goes to the crux of every concept' },
      { icon: 'ShieldCheck', label: 'Discipline that becomes a habit for life' },
      { icon: 'Users', label: 'Stands by families from FYJC to the final exam' },
    ],
    voices: [
      { quote: 'I never thought that anybody could actually get into the crux of the topic and fit it in your head so well that you end up understanding it totally. Yes, that\'s him.', by: 'Rajal Lalit Jani', meta: 'MBBS, Government Medical College, Kolhapur' },
      { quote: 'Teachers with such a set of values, who have a strong conscience to work for the betterment and upliftment of students, are extremely rare now.', by: 'BITS Pilani alumnus', meta: 'PhD candidate, University of Minnesota' },
      { quote: 'Nilesh sir has been a strong support to Noopur throughout her entire journey, right from the start of FYJC till the end of entrance exams.', by: 'Purnima K. Mehta', meta: 'Parent' },
    ],
  },
  {
    id: 'prasanna-raut',
    name: 'Prasanna Raut',
    role: 'Director',
    title: 'The Guide Students Never Outgrow',
    photo: '/images/mentors/prasanna-raut.png',
    lead: 'Part teacher, part strategist, part friend. Prasanna Raut turns the toughest ideas into simple ones, plans each student\'s path to the exam, and is there for every doubt, at any hour.',
    traits: [
      { icon: 'Lightbulb', label: 'Makes the toughest ideas feel simple' },
      { icon: 'Target', label: 'Plans each student\'s full study schedule' },
      { icon: 'MessagesSquare', label: 'Open to every doubt, any time of day' },
    ],
    voices: [
      { quote: 'Raut sir\'s teaching made the toughest of the concepts appear simple and enjoyable to learn. He\'s been a very passionate teacher, kind at heart, ever ready to solve any doubts any time of the day.', by: 'Noopur Ketan Mehta', meta: 'B.Tech, Institute of Chemical Technology (ICT), Mumbai' },
      { quote: 'His guidance opened many of my blind spots. I sincerely thank Raut sir for introducing me to a right learning method, which I am using even during my MBBS course.', by: 'Akshay Parag Raut', meta: 'MBBS, Government Medical College, Kolhapur' },
      { quote: 'He will actually help you plan your full study schedule. And if you follow it, you will undoubtedly get the result you want to achieve.', by: 'Ruturaj Gujar', meta: 'B.E. Computer Engineering, D.J. Sanghvi CoE' },
    ],
  },
]

export const mentorsIntro = {
  eyebrow: 'The Visionaries · Directors',
  title: 'Two names behind generations of science careers.',
  lead: 'Across XI & XII Science, Nilesh Vedant and Prasanna Raut are known for more than results. They have shaped how students think, study and believe in themselves, and their students now study and work at IIT, BITS, KEM, ICT, VJTI and universities around the world.',
}

// Where futureScience alumni went next (from student testimonials)
export const alumniColleges = [
  { name: 'IIT Patna', course: 'B.Tech, Computer Science' },
  { name: 'BITS Pilani', course: 'B.E. (Hons.), now PhD, University of Minnesota' },
  { name: 'Seth G.S. Medical College & KEM Hospital', course: 'MBBS' },
  { name: 'Government Medical College, Kolhapur', course: 'MBBS' },
  { name: 'VJTI, Mumbai', course: 'B.Tech' },
  { name: 'Institute of Chemical Technology (ICT), Mumbai', course: 'B.Tech' },
  { name: 'D.J. Sanghvi College of Engineering', course: 'B.E. Computer Engineering' },
  { name: 'Dr. Bhanuben Nanavati College of Pharmacy', course: 'B.Pharm' },
  { name: 'Manipal Academy (School of Allied Health Sciences)', course: 'Bachelor of Physiotherapy' },
  { name: 'Université Pierre et Marie Curie, Paris', course: 'Research Assistant' },
]

// History + present, using only dated facts from results and student testimonials
// `exam` replaces the year label in the brochure, which shows results without passing years
export const legacy = [
  { when: 'Then', title: 'A legacy of doctors & engineers', text: 'Students from the earliest batches went on to MBBS at KEM and Government Medical College, Kolhapur, and to IIT, BITS Pilani, VJTI and ICT.' },
  { when: '2013–14', exam: 'MHT-CET', title: 'From HSC to MBBS', text: 'Akshay Parag Raut prepared for CET with futureScience and secured General-category MBBS admission at Government Medical College, Kolhapur.' },
  { when: 'NEET-UG', title: '630 / 720', text: 'Shrey Soni scored 630/720 (99.36 percentile) in NEET-UG, with 99.46 percentile in Physics.' },
  { when: '2022', exam: 'MHT-CET', title: '99.97 percentile', text: 'Tvisha Vedant: Rank 2 Mumbai University and Rank 4 Maharashtra (Female/General) in MHT-CET.' },
  { when: '2024', exam: 'MHT-CET', title: '99.98 percentile', text: 'Lyra Uchil: Rank 2 Mumbai University, with perfect 100 percentiles in Physics and Biology. 100% of students qualified for professional courses.' },
  { when: 'Now', title: `Admissions ${'2027–29'}`, text: 'Two branches in Kandivali West and Malad West, and the next generation of futureScience toppers.' },
]

export const gallery = [
  { src: '/images/gallery/batch-celebration.jpg', alt: 'A full futureScience batch celebrating together', caption: 'One batch, one family', wide: true },
  { src: '/images/gallery/felicitation.jpg', alt: 'Toppers felicitated with flowers by their mentors', caption: 'Felicitating our toppers' },
  { src: '/images/gallery/lecture.jpg', alt: 'A packed futureScience lecture', caption: 'Concept-first lectures' },
  { src: '/images/gallery/christmas.jpg', alt: 'Students celebrating Christmas in class', caption: 'Celebrations in class' },
  { src: '/images/gallery/sunday-test.jpg', alt: 'Students writing the Sunday test', caption: 'Sunday tests, every week' },
  { src: '/images/gallery/results-day.jpg', alt: 'Students and mentors together on results day', caption: 'Results day', wide: true },
]

export const toppers = [
  {
    name: 'Lyra Uchil', stream: 'PCB', score: 99.98, photo: '/images/achievers/lyra-uchil.jpg', badge: 'Rank 2 · Mumbai University',
    breakdown: [['Physics', '100'], ['Chemistry', '97.21'], ['Biology', '100']],
  },
  {
    name: 'Atharv Vedant', stream: 'PCM', score: 99.82, photo: '/images/achievers/atharv-vedant.jpg',
    breakdown: [['Physics', '99.70'], ['Chemistry', '99.94'], ['Mathematics', '99.69']],
  },
]

export const achievers = [
  { name: 'Tanisha Shah', stream: 'PCB', score: 99.01, photo: '/images/achievers/tanisha-shah.jpg' },
  { name: 'Atharv Patil', stream: 'PCM', score: 98.45, photo: '/images/achievers/atharv-patil.jpg' },
  { name: 'Dhuin Begani', stream: 'PCB', score: 98.36, photo: '/images/achievers/dhuin-begani.jpg' },
  { name: 'Jaypreet Panchal', stream: 'PCM', score: 96.02, photo: '/images/achievers/jaypreet-panchal.jpg' },
  { name: 'Vir Mehta', stream: 'PCB', score: 94.83, photo: '/images/achievers/vir-mehta.jpg' },
]

// MHT-CET 2025, highest first. Percentiles rounded to 2 decimals like the 2024 results.
// No photos yet: cards show a monogram. Add `photo: '/images/achievers/<name>.jpg'` when one arrives.
export const cet2025 = {
  exam: 'MHT-CET 2025',
  students: [
    { name: 'Aarna Diwan', stream: 'PCB', score: 99.97, breakdown: [['Physics', '99.35'], ['Chemistry', '99.93'], ['Biology', '99.99']] },
    { name: 'Aarya Mankame', stream: 'PCB', score: 99.50, breakdown: [['Physics', '97.57'], ['Chemistry', '99.45'], ['Biology', '99.68']] },
    { name: 'Manthan Dave', stream: 'PCB', score: 99.47, breakdown: [['Physics', '95.65'], ['Chemistry', '99.55'], ['Biology', '99.80']] },
    { name: 'Param Shah', stream: 'PCM', score: 99.41, breakdown: [['Physics', '99.69'], ['Chemistry', '93.56'], ['Mathematics', '99.64']] },
    { name: 'Darshit Shinde', stream: 'PCM', score: 97.81, breakdown: [['Physics', '98.77'], ['Chemistry', '99.37'], ['Mathematics', '93.47']] },
    { name: 'Bhavya Ambavat', stream: 'PCM', score: 94.63, breakdown: [['Physics', '95.86'], ['Chemistry', '90.79'], ['Mathematics', '94.26']] },
    { name: 'Aditya Jani', stream: 'PCM', score: 94.06, breakdown: [['Physics', '91.44'], ['Chemistry', '94.14'], ['Mathematics', '93.33']] },
  ],
}

export const neetTopper = {
  name: 'Shrey Soni',
  photo: '/images/achievers/shrey-soni.jpg',
  exam: 'NEET-UG',
  marks: '630',
  outOf: '720',
  percentile: '99.36',
  breakdown: [['Physics', '99.46'], ['Chemistry', '98.77'], ['Biology', '98.54']],
}

export const cet2022 = {
  name: 'Tvisha Vedant',
  photo: '/images/achievers/tvisha-vedant-hq.jpg',
  score: '99.97 percentile',
  exam: 'MHT-CET 2022',
  hsc: 'Std. XII (HSC) 2022 · 88.67% · PCM 95.33%',
  ranks: [
    ['2', 'Mumbai University', 'Female / General'],
    ['4', 'Maharashtra State', 'Female / General'],
    ['16', 'Mumbai University', 'General'],
    ['34', 'Maharashtra State', 'General'],
  ],
}

// Homepage hero carousel, in display order. Built from the records above so scores live in one place.
// `breakdown` rows draw subject bars; `facts` rows (no bar) suit ranks.
export const spotlight = [
  { ...toppers[0], exam: 'MHT-CET 2024 · PCB' },
  {
    name: cet2022.name, photo: cet2022.photo, exam: `${cet2022.exam} · PCM`, score: parseFloat(cet2022.score),
    badge: `Rank ${cet2022.ranks[0][0]} · ${cet2022.ranks[0][1]}`,
    facts: cet2022.ranks.slice(1).map(([rank, where, cat]) => [`${where} · ${cat}`, `Rank ${rank}`]),
  },
  {
    name: neetTopper.name, photo: neetTopper.photo, exam: `${neetTopper.exam} · PCB`, score: parseFloat(neetTopper.percentile),
    badge: `${neetTopper.marks} / ${neetTopper.outOf} marks`, breakdown: neetTopper.breakdown,
  },
  { ...toppers[1], exam: 'MHT-CET 2024 · PCM' },
]

// Student testimonials (from the futureScience prospectus; lightly trimmed, "…" marks a cut)
export const testimonials = [
  {
    name: 'Tvisha Vedant',
    meta: '99.97 %ile MHT-CET 2022 · B.Tech Computer Science',
    photo: '/images/achievers/tvisha-vedant-hq.jpg',
    quote: 'The online experience was closest to that of the best offline classroom. There was no doubt left unsolved and the teaching was done to the core. It was like a knowledge ATM with tutors ready to answer any query at any time. fS has given me the best possible system to work on my subjects as well as exam preparations. Selecting fS as my mentor was the best that academics could offer.',
  },
  {
    name: 'Shreyas Patil',
    meta: 'B.Tech CSE · IIT Patna',
    photo: '/images/alumni/shreyas-patil.jpg',
    quote: 'Raut sir\'s lectures were very well planned and very easy to understand. To keep the students interested he\'d explain the concept with interesting real-life applications… I still remember we had tried to observe diffraction using a laser pointer pen. As soon as Nilesh sir entered the class, there would be pin-drop silence. I was weak in Chemistry, but his homework actually worked.',
  },
  {
    name: 'BITS Pilani alumnus',
    meta: 'B.E. (Hons.) EEE, BITS Pilani · PhD candidate, University of Minnesota',
    photo: '/images/alumni/bits-alumnus.jpg',
    quote: 'He made sure that I got my fundamentals extremely clear, on which I could then build upon later. I used to disturb him with doubts at unusual hours but he never once failed to answer even a petty question, and neither did he flinch on seeing tough ones. Placing your trust in Nilesh sir and his tutorials will definitely be fruitful for a budding student to fulfil his or her dreams.',
  },
  {
    name: 'Manish Talekar',
    meta: 'MBBS · Seth G.S. Medical College & KEM Hospital',
    photo: '/images/alumni/manish-talekar.jpg',
    quote: 'For me, rather than the teaching it was more of coaching and guidance, and that is the key reason I am standing here now. It not only helped me crack the entrance exams but also built my basics strong and made me applicative rather than bookish.',
  },
  {
    name: 'Ruturaj Gujar',
    meta: 'B.E. Computer Engineering · D.J. Sanghvi CoE, Mumbai',
    quote: 'Raut sir is one of those few teachers with whom we can talk very freely and ask our doubts anytime. Nilesh sir goes to the root of every concept so that we can answer any question based on it, no matter how tricky it is. I guarantee these two teachers will leave no stone unturned to get the best out of you.',
  },
  {
    name: 'Rajal Lalit Jani',
    meta: 'MBBS · Government Medical College, Kolhapur',
    photo: '/images/alumni/rajal-jani.jpg',
    quote: 'I still remember vividly the very first class Nilesh sir took for us. I never thought that anybody could actually get into the crux of the topic and fit it in your head so well that you end up understanding it totally. I am fortunate to have studied under him.',
  },
  {
    name: 'Akshay Parag Raut',
    meta: 'MBBS · Government Medical College, Kolhapur',
    photo: '/images/alumni/akshay-raut.jpg',
    quote: 'His guidance opened many of my blind spots. He cleared many concepts and taught me quick methods of solving questions within a time limit. I did well in CET and got admission in the General category for MBBS at Government Medical College, Kolhapur.',
  },
  {
    name: 'Noopur Ketan Mehta',
    meta: 'B.Tech Food Engineering · ICT, Mumbai',
    photo: '/images/alumni/noopur-mehta.jpg',
    quote: 'Raut sir\'s teaching made the toughest of the concepts appear simple and enjoyable to learn. He\'s been a very passionate teacher, kind at heart, ever ready to solve any doubts any time of the day.',
  },
  {
    name: 'Duhita Pawar',
    meta: 'B.Pharm · Dr. Bhanuben Nanavati College of Pharmacy',
    photo: '/images/alumni/duhita-pawar.jpg',
    quote: 'Being a PCB student, physics and maths were never my forte, but Raut sir made them interesting to learn with all the experiments related to the subject. Due to the friendly teacher–student relation it was never difficult to clarify doubts.',
  },
  {
    name: 'Rashmita K. Shettigar',
    meta: 'Bachelor of Physiotherapy · Manipal',
    photo: '/images/alumni/rashmita-shettigar.jpg',
    quote: 'Junior college is the time you take up the subjects in which you want to excel, and teachers like Raut sir and Nilesh sir have helped me do just that. I\'m glad I had such well-versed teachers in my important years, who guided me, motivated me to do better and gave me the gift of knowledge.',
  },
]

export const values = [
  { icon: 'Lightbulb', title: 'Inspiring Innovation', text: 'We nurture curiosity and creative problem-solving so students think like scientists, not just exam-takers.', image: '/images/inspiring-innovation.png' },
  { icon: 'Telescope', title: 'Vision for the Future', text: 'Every lesson is aimed at a successful career in science & technology. The exam is a milestone, not the destination.', image: '/images/vision.png' },
  { icon: 'School', title: 'Transforming Education', text: 'Researched methodology, disciplined systems and genuine mentorship that make learning stress-free and enjoyable.', image: '/images/education.jpg' },
]

export const scientists = ['Newton', 'Curie', 'Maxwell', 'Franklin', 'Faraday', 'Mendel', 'Bohr', 'Tesla', 'Feynman', 'Einstein']

export const quote = {
  text: 'Keep the flame of curiosity and wonderment alive, even when studying for boring exams. That is the well from which we scientists draw our nourishment and energy.',
  by: 'Dr. Michio Kaku',
}

// Shown on the site and published as FAQPage structured data (Google + AI answer engines)
export const faqs = [
  {
    q: 'Which is the best coaching for JEE, NEET and MHT-CET in Kandivali West and Malad West?',
    a: 'futureScience Private Tutorials coaches Class 11 and 12 science students for JEE Main, JEE Advanced, NEET-UG, MHT-CET and CUET-UG at two branches: Mahavir Nagar, Kandivali West and S.V. Road, Malad West, Mumbai. In MHT-CET 2024 our students scored up to 99.98 percentile (Rank 2, Mumbai University), with perfect 100 percentiles in Physics and Biology.',
  },
  {
    q: 'Where are the futureScience branches?',
    a: 'We have two branches in Mumbai: Mahavir Nagar, Kandivali West (Mumbai 400067) and S.V. Road, Malad West (Mumbai 400064). Both are convenient for students from Kandivali, Borivali, Charkop, Malad, Goregaon and nearby areas. Call or WhatsApp +91 93217 84940.',
  },
  {
    q: 'When do the 2027–29 batches start?',
    a: 'Admissions for the 2027–29 academic year are open. The Bridge Course for students going to Std. XI starts on 13 April 2027. The JEE Main / MHT-CET (PCM) and NEET-UG / MHT-CET (PCB) batches for Std. XI + XII Science start on 25 May 2027.',
  },
  {
    q: 'Do you offer Class 11 and 12 science coaching along with JEE, NEET and CET?',
    a: 'Yes. Our flagship two-year Std. XI + XII Science programme teaches the board syllabus (HSC, CBSE, ICSE/ISC) together with JEE, NEET-UG, MHT-CET and CUET-UG preparation, in integrated and non-integrated batches.',
  },
  {
    q: 'Do you provide engineering coaching and medical coaching?',
    a: 'Yes. Engineering coaching covers JEE Main, JEE Advanced and MHT-CET (PCM) with Physics, Chemistry and Mathematics. Medical coaching covers NEET-UG and MHT-CET (PCB) with Physics, Chemistry and Biology.',
  },
  {
    q: 'Do you offer pharmacy (B.Pharm) entrance coaching?',
    a: 'Yes. Admission to B.Pharm courses in Maharashtra is through MHT-CET. Our PCB and PCM batches cover the complete MHT-CET syllabus, and we guide students aiming for pharmacy colleges.',
  },
  {
    q: 'Do you coach for CUET-UG?',
    a: 'Yes. We prepare Class 12 science students for the Physics, Chemistry, Mathematics and Biology domain papers of CUET-UG, alongside their board preparation.',
  },
  {
    q: 'What is the Bridge Course?',
    a: 'The Bridge Course is for students who have finished Std. X and are going to Std. XI Science. It closes concept gaps from Class 10 and builds the base Class 11 assumes, before the regular batch begins. The 2027 Bridge Course starts on 13 April 2027.',
  },
  {
    q: 'What results have futureScience students achieved?',
    a: 'In MHT-CET 2024, Lyra Uchil scored 99.98 percentile (Rank 2, Mumbai University; 100 percentile in Physics and Biology) and Atharv Vedant scored 99.82 percentile. Five more students scored between 94.83 and 99.01 percentile. In MHT-CET 2022, Tvisha Vedant scored 99.97 percentile (Rank 2, Mumbai University, Female/General). In NEET-UG, Shrey Soni scored 630/720 (99.36 percentile). 100% of futureScience students qualified for professional courses. Alumni have gone on to IIT Patna, BITS Pilani, Seth G.S. Medical College & KEM Hospital, Government Medical College Kolhapur, VJTI, ICT Mumbai and leading pharmacy colleges.',
  },
  {
    q: 'Who leads futureScience?',
    a: 'futureScience is led by its directors, Nilesh Vedant and Prasanna Raut, known across Mumbai for XI & XII Science teaching, student mentoring and welfare. Their students have gone on to IIT, BITS, KEM, ICT, VJTI and universities abroad.',
  },
  {
    q: 'Which boards do you teach?',
    a: 'Students from SSC (Maharashtra State Board), CBSE, ICSE/ISC and other boards join our Std. XI + XII Science programme.',
  },
  {
    q: 'How do I enrol or book a counselling session?',
    a: 'Call or WhatsApp +91 93217 84940, or send an enquiry from the Contact page. You can also download the futureScience brochure from this website.',
  },
]
