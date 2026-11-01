import { Link } from 'react-router-dom'
import { brand, contact, nav, programs, branches, VERSION } from '../data/site.js'
import Icon from './Icon.jsx'
import { BrochureButton } from './Section.jsx'

const socialIcons = { instagram: 'Instagram', youtube: 'Youtube', facebook: 'Facebook', linkedin: 'Linkedin' }
const socialNames = { instagram: 'Instagram', youtube: 'YouTube', facebook: 'Facebook', linkedin: 'LinkedIn' }

export default function Footer() {
  const socials = Object.entries(contact.socials).filter(([, url]) => url)
  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo"><img src="/images/logo-tag.png" alt={brand.full} /></div>
          <p>Class 11 & 12 Science coaching for JEE, NEET-UG, MHT-CET and CUET, plus engineering, medical and pharmacy entrance, in Kandivali West and Malad West, Mumbai.</p>
          <BrochureButton className="btn btn-primary btn-sm footer-brochure" label="Download Brochure (PDF)" size={16} />
          {socials.length > 0 && (
            <div className="socials">
              {socials.map(([k, url]) => (
                <a key={k} href={url} target="_blank" rel="noreferrer"><Icon name={socialIcons[k]} size={18} /><span className="sr-only">futureScience on {socialNames[k]}</span></a>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="card-title">Explore</p>
          <ul>{nav.map((n) => <li key={n.to}><Link to={n.to}>{n.label}</Link></li>)}</ul>
        </div>
        <div>
          <p className="card-title">Programmes</p>
          <ul>{programs.map((p) => <li key={p.id}><Link to={`/courses#${p.id}`}>{p.title}</Link></li>)}</ul>
        </div>
        <div>
          <p className="card-title">Get in touch</p>
          <ul className="footer-contact">
            {branches.map((b) => (
              <li key={b.id}><Icon name="MapPin" size={17} /> <Link to={`/contact#${b.id}`}>{b.street}, {b.locality}, {b.city} {b.postalCode}</Link></li>
            ))}
            <li><Icon name="Phone" size={17} /> <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a></li>
            <li><Icon name="Mail" size={17} /> <a href={`mailto:${contact.email}`}>{contact.email}</a></li>
            <li><Icon name="Clock" size={17} /> {contact.hours}</li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {brand.full} — {brand.parent}.{VERSION && <span className="site-version"> · v{VERSION}</span>}</span>
        <span className="footer-tag">{brand.tagline}</span>
      </div>
    </footer>
  )
}
