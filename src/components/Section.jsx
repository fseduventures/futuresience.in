import { Link } from 'react-router-dom'
import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import { BROCHURE_URL, ACADEMIC_YEAR } from '../data/site.js'
import { useTheme } from '../theme.jsx'

export function SectionHead({ eyebrow, title, lead, center = false, light = false, as: H = 'h2' }) {
  return (
    <Reveal className={`section-head ${center ? 'center' : ''} ${light ? 'light' : ''}`}>
      {eyebrow && <span className="eyebrow"><Icon name="Sparkles" size={14} /> {eyebrow}</span>}
      <H className="h2">{title}</H>
      {lead && <p className="lead">{lead}</p>}
    </Reveal>
  )
}

export function PageHero({ eyebrow, title, lead, image = '/images/hero-cosmos.jpg' }) {
  return (
    <section className="page-hero" style={{ '--bg': `url(${image})` }}>
      <div className="container">
        <span className="eyebrow light"><Icon name="Sparkles" size={14} /> {eyebrow}</span>
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
    </section>
  )
}

export function BrochureButton({ className = 'btn btn-outline', label = 'Download Brochure', size = 18 }) {
  // the light theme hands out the light edition of the brochure
  const { theme } = useTheme()
  const href = theme === 'light' ? BROCHURE_URL.replace(/\.pdf$/, '-Light.pdf') : BROCHURE_URL
  return (
    <a href={href} download className={className} aria-label={`${label} (PDF)`}>
      <Icon name="FileDown" size={size} /> {label}
    </a>
  )
}

export function CtaBand() {
  return (
    <section className="cta-band">
      <div className="container cta-inner">
        <div>
          <h2>Admissions are open for {ACADEMIC_YEAR}.</h2>
          <p>Book a counselling session and find the right batch for your goals: JEE, NEET-UG, MHT-CET or CUET.</p>
        </div>
        <div className="cta-actions">
          <Link to="/contact" className="btn btn-dark">Book a Counselling Session <Icon name="ArrowRight" size={18} /></Link>
          <BrochureButton className="btn btn-outline-dark" />
        </div>
      </div>
    </section>
  )
}

// Link to the Life at futureScience page, under every gallery section
export function LifeLink({ className = 'btn btn-outline' }) {
  return <Link to="/life" className={className}>See life at futureScience <Icon name="ArrowRight" size={18} /></Link>
}
