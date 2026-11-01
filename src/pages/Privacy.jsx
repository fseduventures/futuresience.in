import { Link } from 'react-router-dom'
import { PageHero } from '../components/Section.jsx'
import { brand, contact, analytics, SITE_URL } from '../data/site.js'

// Linked from the footer only. Describe what the site really does: keep it in step with
// src/analytics.jsx and the `analytics` IDs in site.js.
const UPDATED = '1 November 2026'

export default function Privacy() {
  const site = SITE_URL.replace('https://', '')
  return (
    <>
      <PageHero
        eyebrow={`Last updated ${UPDATED}`}
        title={<>Privacy <span className="hl">Policy.</span></>}
        lead={`How ${brand.full} handles your information when you visit ${site} or contact us.`}
      />

      <section className="section">
        <div className="container narrow legal">
          <p>
            {site} is run by {brand.legal} ("{brand.name}", "we", "us"), which runs {brand.full} in Kandivali West and
            Malad West, Mumbai. This policy explains what information the website collects, why, and the choices you have,
            in line with India's Digital Personal Data Protection Act, 2023.
          </p>

          <h2>Information you give us</h2>
          <p>
            The website has no accounts and no database. When you use the enquiry form, it writes your name, phone number,
            class, course, branch and message into a WhatsApp message or email on your own device. Nothing is sent until you
            press send there, and the website itself stores nothing. Whatever you send, or tell us when you call, visit or
            email, we use only to answer your enquiry, counsel you about admissions and stay in touch about the course you asked about.
          </p>

          <h2>Information collected automatically</h2>
          <p>
            We use <b>Google Analytics</b> to understand how the website is used, so we can improve it. It records things such as:
          </p>
          <ul>
            <li>the pages you view, how long you stay and the site or search that brought you here;</li>
            <li>your device type, browser, screen size and approximate location (city level);</li>
            <li>taps on our phone number, WhatsApp or email links, brochure downloads, and whether you use the light or dark theme.</li>
          </ul>
          <p>
            Google Analytics uses cookies and similar technology to do this. It does not give us your name, phone number or
            email address, and we never send it any of the details you type into the enquiry form.
            {analytics.metaPixel && (
              <> We also use the <b>Meta Pixel</b> (Facebook and Instagram) to measure the same visits and actions and to see how our posts and ads perform.</>
            )}
          </p>
          <p>
            The website also remembers whether you chose the light or dark theme, in your browser's local storage. That
            stays on your device and is never sent to us.
          </p>

          <h2>How long we keep it</h2>
          <p>
            Google Analytics keeps visit data for at most 14 months, after which it is deleted automatically. Enquiries you
            send us by WhatsApp or email stay with us for as long as they are needed for admissions and your time at {brand.name},
            and are then deleted.
          </p>

          <h2>Sharing</h2>
          <p>
            We do not sell or rent your information. Analytics data is processed by Google
            {analytics.metaPixel ? ' and Meta' : ''} on our behalf under their own privacy terms. We may share information
            only where the law requires it.
          </p>

          <h2>Students under 18</h2>
          <p>
            Many of our students are under 18. We ask that a parent or guardian makes, or agrees to, any enquiry or admission
            for a student under 18, and we use a student's details only for their admission and studies.
          </p>

          <h2>Your choices and rights</h2>
          <ul>
            <li>You can block or delete cookies in your browser settings, or install Google's <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer">Analytics opt-out add-on</a>. The website works the same without them.</li>
            <li>You can ask us what personal information we hold about you, ask us to correct or delete it, or withdraw your consent to being contacted, at any time.</li>
          </ul>

          <h2>Links to other sites</h2>
          <p>
            The website links to Google Maps, WhatsApp, Instagram, Facebook and LinkedIn. Those services have their own privacy policies.
          </p>

          <h2>Contact and grievances</h2>
          <p>
            For any question, request or complaint about your information, email <a href={`mailto:${contact.email}`}>{contact.email}</a> or
            call <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a> ({contact.hours}). You can also visit either
            branch; see <Link to="/contact">Contact & branches</Link>. We reply within 30 days.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            If we change how the website uses information, we will update this page and the date at the top.
          </p>
        </div>
      </section>
    </>
  )
}
