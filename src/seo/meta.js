// Page-level SEO (titles, descriptions, keywords) and schema.org structured data.
// Used by the <Seo> component in the browser and by scripts/prerender.mjs at build time.
import { SITE_URL, ACADEMIC_YEAR, brand, contact, branches, programs, batches, faqs, mentors, facts } from '../data/site.js'

const KEYWORDS = [
  'IIT-Medical Academy', 'IIT-JEE coaching', 'IIT coaching', 'medical entrance coaching', 'IIT and medical coaching Kandivali', 'IIT and medical coaching Malad',
  'science coaching for class 11 and 12', 'JEE coaching', 'NEET coaching', 'MHT-CET coaching', 'CET coaching', 'CUET coaching',
  'engineering coaching', 'medical coaching', 'pharmacy entrance coaching', 'B.Pharm CET coaching',
  'class 11 science coaching', 'class 12 science coaching', 'HSC science classes', 'PCM coaching', 'PCB coaching',
  'JEE Main coaching', 'JEE Advanced coaching', 'NEET-UG coaching', 'integrated coaching 11th 12th',
  'coaching classes in Kandivali West', 'coaching classes in Malad West', 'JEE coaching Kandivali', 'NEET coaching Kandivali',
  'JEE coaching Malad', 'NEET coaching Malad', 'CET classes Kandivali', 'CET classes Malad', 'science classes Borivali',
  'science tuition Goregaon', 'best science coaching Mumbai', 'futureScience',
]

export const pages = {
  '/': {
    // Keep under ~60 chars / ~155 chars: search results truncate longer titles and descriptions
    title: 'IIT & Medical Coaching in Kandivali & Malad | futureScience',
    description: 'IIT-JEE, Medical (NEET-UG), MHT-CET & CUET coaching for Class 11 & 12 in Kandivali West & Malad West, Mumbai. 99.98 %ile in MHT-CET 2024.',
    h1: 'IIT-JEE & Medical (NEET-UG) coaching for Class 11 & 12 Science, plus MHT-CET & CUET, in Kandivali West & Malad West, Mumbai',
  },
  '/about': {
    title: 'About futureScience IIT-Medical Academy | Kandivali & Malad',
    description: 'futureScience IIT-Medical Academy teaches Class 11 & 12 science with deep concepts, disciplined systems and personal mentoring for IIT-JEE, NEET and CET.',
    breadcrumb: 'About',
  },
  '/courses': {
    title: `Courses ${ACADEMIC_YEAR} | IIT-JEE, NEET, CET & CUET | futureScience`,
    description: 'Class 11–12 Science, Class XI Foundation, IIT-JEE, Medical (NEET-UG) & MHT-CET, CUET, crash course, test series and Discover-U in Kandivali & Malad.',
    breadcrumb: 'Courses',
  },
  '/results': {
    title: 'Results | MHT-CET, IIT-JEE & Medical Toppers | futureScience',
    description: 'MHT-CET 2025: Aarna Diwan 99.97 %ile. MHT-CET 2024: Lyra Uchil 99.98 %ile (Rank 2, Mumbai University). JEE Main 2024: 97.67 %ile. NEET-UG: 630/720.',
    breadcrumb: 'Results',
  },
  '/directors': {
    title: 'Nilesh Vedant & Prasanna Raut | Directors | futureScience',
    description: 'Meet Nilesh Vedant and Prasanna Raut, directors of futureScience IIT-Medical Academy, whose students went on to IIT, BITS, KEM, ICT and VJTI.',
    breadcrumb: 'Directors',
  },
  '/contact': {
    title: 'Contact & Branches | Kandivali & Malad | futureScience',
    description: 'Visit futureScience at Mahavir Nagar, Kandivali West or S.V. Road, Malad West, Mumbai. Call/WhatsApp +91 93217 84940 for IIT-JEE, NEET & CET admissions.',
    breadcrumb: 'Contact',
  },
  '/life': {
    title: 'Life at futureScience | Festivals, Classes & Results',
    description: 'Diwali 2026, results-day felicitations and tests in real exam conditions: life at futureScience IIT-Medical Academy, Kandivali West & Malad West.',
    breadcrumb: 'Life at futureScience',
  },
  '/privacy': {
    title: 'Privacy Policy | futureScience',
    description: 'How futureScience IIT-Medical Academy, Kandivali West & Malad West, Mumbai, handles enquiries and Google Analytics data on futurescience.in.',
    breadcrumb: 'Privacy Policy',
  },
}

export const keywords = KEYWORDS.join(', ')

// Pages are pre-rendered into folders, so their canonical URLs end with a slash
export const canonical = (path) => `${SITE_URL}${path === '/' ? '/' : `${path}/`}`

const ORG_ID = `${SITE_URL}/#organization`
const personId = (m) => `${SITE_URL}/directors/#person-${m.id}`

const postal = (b) => ({
  '@type': 'PostalAddress',
  streetAddress: b.building ? `${b.building}, ${b.street}` : b.street,
  addressLocality: `${b.locality}, ${b.city}`,
  addressRegion: b.region,
  postalCode: b.postalCode,
  addressCountry: 'IN',
})

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['EducationalOrganization', 'Organization'],
        '@id': ORG_ID,
        name: brand.full,
        alternateName: ['futureScience', brand.formerly, 'fS Private Tutorials', 'fS IIT-Medical Academy', 'futureScience Eduventures LLP'],
        legalName: brand.legal,
        ...(facts.foundedYear ? { foundingDate: facts.foundedYear } : {}),
        slogan: brand.tagline,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}${brand.logoStill}`,
        image: `${SITE_URL}/images/og-image.png`,
        telephone: contact.phone,
        email: contact.email,
        description: pages['/'].description,
        areaServed: ['Kandivali', 'Malad', 'Borivali', 'Goregaon', 'Charkop', 'Mumbai'].map((n) => ({ '@type': 'Place', name: n })),
        knowsAbout: ['JEE Main', 'JEE Advanced', 'NEET-UG', 'MHT-CET', 'CUET-UG', 'Class 11 Science', 'Class 12 Science', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Engineering entrance', 'Medical entrance', 'Pharmacy entrance'],
        sameAs: Object.values(contact.socials).filter(Boolean),
        subOrganization: branches.map((b) => ({ '@id': `${SITE_URL}/#branch-${b.id}` })),
        founder: mentors.map((m) => ({ '@id': personId(m) })),
        employee: mentors.map((m) => ({ '@id': personId(m) })),
      },
      ...mentors.map((m) => ({
        '@type': 'Person',
        '@id': personId(m),
        name: m.name,
        jobTitle: 'Director',
        image: `${SITE_URL}${m.photo}`,
        url: `${SITE_URL}/directors/#${m.id}`,
        worksFor: { '@id': ORG_ID },
        ...(m.linkedin ? { sameAs: [m.linkedin] } : {}),
      })),
      ...branches.map((b) => ({
        '@type': ['EducationalOrganization', 'LocalBusiness'],
        '@id': `${SITE_URL}/#branch-${b.id}`,
        name: `${brand.full} – ${b.name}`,
        parentOrganization: { '@id': ORG_ID },
        ...(b.shift ? { description: `${brand.full}, ${b.name} branch: ${b.shift.toLowerCase()} classes.` } : {}),
        url: `${SITE_URL}/contact/#${b.id}`,
        image: `${SITE_URL}/images/og-image.png`,
        telephone: contact.phone,
        email: contact.email,
        address: postal(b),
        hasMap: b.geo
          ? `https://www.google.com/maps/search/?api=1&query=${b.geo.lat},${b.geo.lng}`
          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.mapQuery)}`,
        ...(b.geo ? { geo: { '@type': 'GeoCoordinates', latitude: b.geo.lat, longitude: b.geo.lng } } : {}),
        areaServed: b.nearby.map((n) => ({ '@type': 'Place', name: n })),
        openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:00', closes: '20:00' }],
      })),
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: brand.full,
        publisher: { '@id': ORG_ID },
        inLanguage: 'en-IN',
      },
    ],
  }
}

// A fee as schema.org Offer: the written text always, the number only when given
const offer = (id) => {
  const f = facts.fees[id]
  return {
    '@type': 'Offer',
    category: 'Paid',
    description: f.text,
    priceCurrency: 'INR',
    ...(f.price ? { price: f.price } : {}),
    availability: 'https://schema.org/InStock',
    url: `${SITE_URL}/courses/#${id}`,
  }
}

export function coursesSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `futureScience courses ${ACADEMIC_YEAR}`,
    itemListElement: programs.map((p, i) => {
      const batch = batches.find((b) => b.programId === p.id)
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Course',
          '@id': `${SITE_URL}/courses/#${p.id}`,
          url: `${SITE_URL}/courses/#${p.id}`,
          name: p.title,
          description: `${p.sub}. ${p.summary}`,
          educationalLevel: 'Class 11 and Class 12 (Higher Secondary) Science',
          audience: { '@type': 'EducationalAudience', audienceType: p.audience },
          provider: { '@id': ORG_ID },
          ...(facts.fees[p.id] ? { offers: offer(p.id) } : {}),
          hasCourseInstance: branches.map((b) => ({
            '@type': 'CourseInstance',
            courseMode: 'Onsite',
            location: { '@type': 'Place', name: `${brand.full} – ${b.name}`, address: postal(b) },
            ...(batch ? { startDate: batch.startISO } : {}),
          })),
        },
      }
    }),
  }
}

// Each page marks up only the FAQs it shows (Google: no markup for content that isn't visible).
// Keep in step with the <Faq items=…> slices in Courses.jsx and Contact.jsx.
const FAQ_ON_PAGE = { '/': () => faqs, '/courses': () => faqs.slice(2), '/contact': () => faqs.slice(1, 6) }

export function faqSchema(items = faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
}

export function breadcrumbSchema(path) {
  const page = pages[path]
  if (!page?.breadcrumb) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: page.breadcrumb, item: canonical(path) },
    ],
  }
}

// The page itself, with the build date as dateModified: assistants prefer content they can tell is current
export function webPageSchema(path, modified) {
  const page = pages[path]
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonical(path)}#webpage`,
    url: canonical(path),
    name: page.title,
    description: page.description,
    inLanguage: 'en-IN',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': ORG_ID },
    ...(path === '/directors' ? { mainEntity: mentors.map((m) => ({ '@id': personId(m) })) } : {}),
    ...(modified ? { dateModified: modified } : {}),
  }
}

export function schemasFor(path, { modified } = {}) {
  const list = [organizationSchema(), webPageSchema(path, modified)]
  if (path === '/' || path === '/courses') list.push(coursesSchema())
  if (FAQ_ON_PAGE[path]) list.push(faqSchema(FAQ_ON_PAGE[path]()))
  const bc = breadcrumbSchema(path)
  if (bc) list.push(bc)
  return list
}
