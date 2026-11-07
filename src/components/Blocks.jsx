import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import Reveal, { Counter } from './Reveal.jsx'
import {
  methodology, testimonials, batches, branches, contact, faqs, tracks, brand, mentors, mentorsIntro, alumniColleges, gallery, neetTopper, legacy, cet2025,
} from '../data/site.js'

const initials = (name) => name.split(/\s+/).filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join('')

export function Avatar({ t, className = '' }) {
  return t.photo
    ? <img className={className} src={t.photo} alt={t.name} loading="lazy" />
    : <span className={`avatar-initials ${className}`} aria-hidden="true">{initials(t.name)}</span>
}

export function MentorsFeature({ withVoices = false }) {
  return (
    <section className="mentors-sec">
      <div className="mentors-glow" />
      <div className="container">
        <Reveal className="section-head center light">
          <span className="eyebrow light"><Icon name="Sparkles" size={14} /> {mentorsIntro.eyebrow}</span>
          <h2 className="h2">{mentorsIntro.title.replace(/\.$/, '')}<span className="hl">.</span></h2>
          <p className="lead">{mentorsIntro.lead}</p>
        </Reveal>
        <div className="mentors">
          {mentors.map((m, i) => (
            <Reveal as="article" className={`mentor-hero ${i % 2 ? 'rev' : ''}`} id={m.id} key={m.id} delay={i * 120}>
              <div className="mentor-portrait">
                <img src={m.photo} alt={`${m.name}, ${m.role}, futureScience Private Tutorials`} loading="lazy" />
              </div>
              <div className="mentor-copy">
                <span className="mentor-title">{m.role} · {m.title}</span>
                <h3>{m.name}</h3>
                <p>{m.lead}</p>
                <ul className="mentor-traits">
                  {m.traits.map((t) => <li key={t.label}><Icon name={t.icon} size={17} /> {t.label}</li>)}
                </ul>
                {withVoices && (
                  <div className="mentor-voices">
                    {m.voices.map((v) => (
                      <blockquote key={v.by}>
                        <p>“{v.quote}”</p>
                        <cite><b>{v.by}</b> · {v.meta}</cite>
                      </blockquote>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Legacy() {
  return (
    <section className="legacy-sec">
      <div className="legacy-photo" role="img" aria-label="A full futureScience batch celebrating together" />
      <div className="container">
        <Reveal className="section-head center light">
          <span className="eyebrow light"><Icon name="Sparkles" size={14} /> Then &amp; Now</span>
          <h2 className="h2">A legacy written in <span className="hl">ranks, white coats and IIT IDs.</span></h2>
          <p className="lead">Batch after batch, futureScience students have walked into India's top medical, engineering and pharmacy colleges, and the story continues in Kandivali West and Malad West.</p>
        </Reveal>
        <ol className="timeline">
          {legacy.map((l, i) => (
            <Reveal as="li" key={l.when} delay={i * 80}>
              <span className="tl-when">{l.when}</span>
              <b>{l.title}</b>
              <p>{l.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function AlumniWall({ light = false }) {
  return (
    <div className={`alumni ${light ? 'light' : ''}`}>
      {alumniColleges.map((c, i) => (
        <Reveal className="alumnus" key={c.name} delay={(i % 5) * 60}>
          <Icon name="GraduationCap" size={20} />
          <b>{c.name}</b>
          <span>{c.course}</span>
        </Reveal>
      ))}
    </div>
  )
}

// Photos wider than 900px get a 720px "-sm" copy at build time (scripts/optimize-images.mjs), so phones
// download that instead (in dev, vite.config.js serves the original for -sm URLs).
const smallSrc = (src) => (/\.jpe?g$/i.test(src) && !SMALL_ONLY.has(src)
  ? { srcSet: `${src.replace(/(\.jpe?g)$/i, '-sm$1')} 720w, ${src} 1400w`, sizes: '(max-width: 640px) 100vw, 50vw' }
  : {})
// gallery photos already 900px wide or less, so they have no -sm copy
const SMALL_ONLY = new Set(['/images/gallery/felicitation.jpg', '/images/gallery/sunday-test.jpg'])

export function Gallery() {
  return (
    <div className="gallery">
      {gallery.map((g, i) => (
        <Reveal as="figure" className={`gal ${g.wide ? 'wide' : ''}`} key={g.src} delay={(i % 3) * 80}>
          <img src={g.src} alt={g.alt} loading="lazy" {...smallSrc(g.src)} />
          <figcaption>{g.caption}</figcaption>
        </Reveal>
      ))}
    </div>
  )
}

export function TestimonialWall({ items = testimonials }) {
  return (
    <div className="t-wall">
      {items.map((t, i) => (
        <Reveal as="figure" className="t-card" key={t.name + i} delay={(i % 3) * 80}>
          <Icon name="Quote" size={22} className="t-q" />
          <blockquote>{t.quote}</blockquote>
          <figcaption>
            <Avatar t={t} />
            <div><b>{t.name}</b><span>{t.meta}</span></div>
          </figcaption>
        </Reveal>
      ))}
    </div>
  )
}

export function NeetCard({ delay = 0 }) {
  const t = neetTopper
  return (
    <Reveal className="topper neet" delay={delay}>
      <div className="topper-photo">
        <img src={t.photo} alt={t.name} loading="lazy" />
        <span className="stream-chip">NEET-UG</span>
      </div>
      <div className="topper-body">
        <span className="badge-gold"><Icon name="Stethoscope" size={14} /> Medical entrance</span>
        <h3>{t.name}</h3>
        <div className="topper-score">{t.marks}<small>/{t.outOf}</small></div>
        <span className="muted">{t.percentile} percentile · {t.exam}</span>
        <ul className="breakdown">
          {t.breakdown.map(([s, v]) => <li key={s}><span>{s}</span><b>{v}</b></li>)}
        </ul>
      </div>
    </Reveal>
  )
}

const mapsLink = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`

export function Branches({ withMap = false }) {
  return (
    <div className="branches">
      {branches.map((b, i) => (
        <Reveal as="article" className="branch" id={b.id} key={b.id} delay={i * 100}>
          {withMap && (
            <div className="branch-map">
              <iframe
                title={`${brand.full}, ${b.name} on Google Maps`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(b.mapQuery)}&z=15&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
          <div className="branch-body">
            <span className="branch-icon"><Icon name="Building2" size={22} /></span>
            <span className="muted">futureScience branch</span>
            <h3>{b.name}</h3>
            <address>
              {b.street}, {b.locality},<br />{b.city}, {b.region} {b.postalCode}
            </address>
            <p className="branch-near">Convenient for {b.nearby.join(', ')}</p>
            <div className="branch-actions">
              <a className="btn btn-primary btn-sm" href={mapsLink(b.mapQuery)} target="_blank" rel="noreferrer"><Icon name="Navigation" size={15} /> Directions<span className="sr-only"> to {b.name}</span></a>
              <a className="btn btn-outline btn-sm" href={`tel:${contact.phone.replace(/\s/g, '')}`}><Icon name="Phone" size={15} /> {contact.phone}</a>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

export function Faq({ items = faqs }) {
  return (
    <div className="faq">
      {items.map((f, i) => (
        <details key={f.q} open={i === 0}>
          <summary>{f.q}<Icon name="ChevronDown" size={20} /></summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  )
}

export function Tracks() {
  return (
    <div className="tracks">
      {tracks.map((t, i) => (
        <Reveal as="article" className="track" key={t.title} delay={(i % 3) * 90}>
          <span className="pillar-icon"><Icon name={t.icon} size={22} /></span>
          <p className="card-title">{t.title}</p>
          <span className="track-exams">{t.exams}</span>
          <p>{t.text}</p>
        </Reveal>
      ))}
    </div>
  )
}

// Stand-in portrait for students without a photo: initials on navy, with the stream's symbol behind
function Monogram({ t }) {
  return (
    <div className="monogram" aria-hidden="true">
      <Icon name={t.stream === 'PCB' ? 'Dna' : 'Atom'} size={120} strokeWidth={1.2} />
      <span>{initials(t.name)}</span>
    </div>
  )
}

export function TopperCard({ t, exam = 'MHT-CET 2024', delay = 0 }) {
  return (
    <Reveal className="topper" delay={delay}>
      <div className={`topper-photo ${t.photo ? '' : 'is-mono'}`}>
        {t.photo ? <img src={t.photo} alt={t.name} loading="lazy" /> : <Monogram t={t} />}
        <span className="stream-chip">{t.stream}</span>
      </div>
      <div className="topper-body">
        {t.badge && <span className="badge-gold"><Icon name="Medal" size={14} /> {t.badge}</span>}
        <h3>{t.name}</h3>
        <div className="topper-score"><Counter value={t.score} decimals={2} /><small>%ile</small></div>
        <span className="muted">{exam}</span>
        <ul className="breakdown">
          {t.breakdown.map(([s, v]) => (
            <li key={s}><span>{s}</span><b className={v === '100' ? 'perfect' : ''}>{v}</b></li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}

export function AchieverCard({ a, delay = 0 }) {
  return (
    <Reveal className="achiever" delay={delay}>
      <div className="achiever-photo">{a.photo ? <img src={a.photo} alt={a.name} loading="lazy" /> : <Monogram t={a} />}</div>
      <span className="stream-chip sm">{a.stream}</span>
      <b className="achiever-score">{a.score.toFixed(2)}<small>%ile</small></b>
      <span className="achiever-name">{a.name}</span>
    </Reveal>
  )
}

// MHT-CET 2025: the best PCB and PCM scores as feature cards, everyone else in the achiever row
export function Cet2025() {
  const { exam, students } = cet2025
  const leads = ['PCB', 'PCM'].map((s) => students.find((t) => t.stream === s))
  const rest = students.filter((t) => !leads.includes(t))
  return (
    <>
      <div className="toppers">
        {leads.map((t, i) => <TopperCard t={{ ...t, badge: `${t.stream} topper` }} exam={exam} key={t.name} delay={i * 120} />)}
      </div>
      <div className="achievers">
        {rest.map((a, i) => <AchieverCard a={a} key={a.name} delay={i * 70} />)}
      </div>
    </>
  )
}

// Homepage teaser: every 2025 result in one strip, linking to the full block on /results
export function Cet2025Ribbon() {
  const { exam, students } = cet2025
  return (
    <Reveal className="new-results">
      <div className="new-results-head">
        <span className="pill">New</span>
        <p className="card-title">{exam} results</p>
        <Link to="/results#cet-2025" className="new-results-link">See all <Icon name="ArrowRight" size={16} /><span className="sr-only"> {exam} results</span></Link>
      </div>
      <ul className="new-results-list">
        {students.map((t) => (
          <li key={t.name}>
            <span className="new-results-mono"><Monogram t={t} /></span>
            <b>{t.score.toFixed(2)}<small>%ile</small></b>
            <span>{t.name}</span>
            <small className="new-results-stream">{t.stream}</small>
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

export function ProgramCard({ p, delay = 0 }) {
  return (
    <Reveal className="program" delay={delay}>
      <div className="program-media" style={{ '--img': `url(${p.image})` }}>
        {p.tag && <span className="program-tag">{p.tag}</span>}
        <span className="program-icon"><Icon name={p.icon} size={26} /></span>
      </div>
      <div className="program-body">
        <h3>{p.title}</h3>
        <span className="program-sub">{p.sub}</span>
        <p>{p.summary}</p>
        <div className="program-meta">
          <span><Icon name="Clock" size={15} /> {p.duration}</span>
        </div>
        <Link to={`/courses#${p.id}`} className="text-link">View details<span className="sr-only"> of {p.title}</span> <Icon name="ArrowRight" size={16} /></Link>
      </div>
    </Reveal>
  )
}

export function Methodology() {
  return (
    <div className="steps">
      {methodology.map((m, i) => (
        <Reveal className={`step step-${i + 1}`} key={m.n} delay={i * 90}>
          <div className="step-top">
            <span className="step-n">{m.n}</span>
            <span className="step-icon"><Icon name={m.icon} size={24} /></span>
          </div>
          <p className="card-title">{m.title}</p>
          <p>{m.text}</p>
        </Reveal>
      ))}
    </div>
  )
}

export function Testimonials() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % testimonials.length), 7000)
    return () => clearInterval(id)
  }, [])
  const t = testimonials[i]
  return (
    <div className="testimonial">
      <Icon name="Quote" size={56} className="quote-mark" />
      <blockquote key={i} className="fade-in">{t.quote}</blockquote>
      <div className="testimonial-foot">
        <Avatar t={t} />
        <div>
          <b>{t.name}</b>
          <span>{t.meta}</span>
        </div>
        <div className="stars">{[0, 1, 2, 3, 4].map((s) => <Icon key={s} name="Star" size={16} fill="currentColor" />)}</div>
      </div>
      <div className="dots">
        {testimonials.map((_, k) => (
          <button key={k} className={k === i ? 'active' : ''} onClick={() => setI(k)} aria-label={`Testimonial ${k + 1}`} />
        ))}
      </div>
    </div>
  )
}

export function BatchTable() {
  return (
    <div className="batches">
      {batches.map((b, k) => (
        <Reveal className="batch" key={b.course} delay={k * 100}>
          <div className="batch-date">
            <Icon name="CalendarDays" size={22} />
            <span>Commences</span>
            <b>{b.start}</b>
          </div>
          <div className="batch-info">
            <span className="muted">{b.for}</span>
            <h3>{b.course} batch</h3>
            <p>{b.details}</p>
          </div>
          <div className="batch-status">
            <span><span className="live-dot" /> {b.status}</span>
            <Link to="/contact" className="btn btn-primary btn-sm">Enquire</Link>
          </div>
        </Reveal>
      ))}
    </div>
  )
}
