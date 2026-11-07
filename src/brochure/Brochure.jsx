import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import Icon from '../components/Icon.jsx'
import {
  brand, contact, toppers, achievers, cet2025, cet2022, neetTopper, programs, methodology, pillars, testimonials, batches, values,
  heroStats, exams, branches, mentors, mentorsIntro, alumniColleges, gallery, legacy, ACADEMIC_YEAR, SITE_URL,
} from '../data/site.js'
import { PAGE_COUNT, imposition } from './layout.js'

const Checks = ({ items }) => (
  <ul className="b-checks">{items.map((t) => <li key={t}><Icon name="CheckCircle2" size={13} /> {t}</li>)}</ul>
)



// The brochure shows students' results without their passing years (testimonials keep theirs)
// so achievers from every batch share one grid, highest first
const brochureAchievers = [...achievers, ...cet2025.students].sort((a, b) => b.score - a.score)
const noYear = (s) => s.replace(/,?\s*\b20\d\d\b/g, '')
function useQr(text) {
  const [svg, setSvg] = useState('')
  useEffect(() => {
    if (!text) return
    QRCode.toString(text, { type: 'svg', margin: 0, color: { dark: '#0b0c2e', light: '#ffffff' } }).then(setSvg)
  }, [text])
  return svg
}

const Folio = ({ n, dark }) => (
  <div className={`folio ${dark ? 'dark' : ''}`}>
    <span>{brand.full}</span>
    <b>{String(n).padStart(2, '0')}</b>
  </div>
)

const Eyebrow = ({ children, light }) => <span className={`b-eyebrow ${light ? 'light' : ''}`}><Icon name="Sparkles" size={11} /> {children}</span>

const initials = (name) => name.split(/\s+/).filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join('')
const Avatar = ({ t }) => (t.photo ? <img src={t.photo} alt="" /> : <span className="b-initials">{initials(t.name)}</span>)

/* ── Cover ───────────────────────────────────── */
function Cover() {
  return (
    <section className="page dark cover">
      <div className="cover-bg" />
      <div className="safe">
        <div className="cover-top">
          <div className="logo-plate"><img src="/images/logo-tag.png" alt="" /></div>
          <span className="cover-year">Admissions {ACADEMIC_YEAR}</span>
        </div>
        <div className="cover-mid">
          <Eyebrow light>Class 11 &amp; 12 Science · JEE · NEET-UG · MHT-CET · CUET</Eyebrow>
          <h1>Where curious minds become <span className="hl">top rankers.</span></h1>
          <p className="cover-lead">Deep concepts, disciplined systems and mentors who are there for every doubt, from the first lecture to exam day.</p>
        </div>
        <div className="cover-stats">
          {heroStats.map((s) => (
            <div key={s.label}>
              <b>{s.prefix}{s.decimals ? s.value.toFixed(s.decimals) : s.value}<small>{s.suffix}</small></b>
              <span>{noYear(s.label)}</span>
            </div>
          ))}
        </div>
        <div className="cover-toppers">
          {toppers.map((t) => (
            <div className="cover-topper" key={t.name}>
              <img src={t.photo} alt="" />
              <div>
                <span className="chip">{t.stream} · MHT-CET</span>
                <b>{t.score}<small>%ile</small></b>
                <span className="name">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="cover-band">
        <b>{brand.tagline}</b>
        <span><Icon name="MapPin" size={13} /> {branches.map((b) => b.name).join(' · ')}</span>
        <span><Icon name="Phone" size={13} /> {contact.phone}</span>
        <span><Icon name="Globe" size={13} /> futurescience.in</span>
      </div>
    </section>
  )
}

/* ── About ───────────────────────────────────── */
function About({ n }) {
  return (
    <section className="page light">
      <div className="safe">
        <Eyebrow>About futureScience</Eyebrow>
        <h2>A launchpad for science careers, <span className="hl-dark">built for the top 1%.</span></h2>
        <p className="lead">
          {brand.full} is {brand.parent}, with branches in Kandivali West and Malad West, Mumbai. We teach science the way scientists
          think: concepts taken to the core, doubts cleared the same day, and a researched system that keeps every student moving towards a career in science and technology.
        </p>
        <div className="about-collage">
          <img className="a1" src="/images/gallery/lecture.jpg" alt="" />
          <img className="a2" src="/images/gallery/sunday-test.jpg" alt="" />
          <div className="a-badge"><Icon name="Rocket" size={18} /><div><b>Science is</b><span>the Future</span></div></div>
        </div>
        <div className="mini-stats">
          <div><b>99.98</b><span>%ile topper, MHT-CET</span></div>
          <div><b>630</b><span>/720 in NEET-UG</span></div>
          <div><b>#2</b><span>Rank, Mumbai University</span></div>
        </div>
        <div className="values-row">
          {values.map((v) => (
            <div className="b-value" key={v.title}>
              <span className="ic"><Icon name={v.icon} size={16} /></span>
              <h4>{v.title}</h4>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
        <h3 className="sub-head mt">Why parents choose futureScience</h3>
        <Checks items={[
          'Board + competitive-exam preparation in one integrated flow',
          'Tutors available for doubts, like a "knowledge ATM"',
          'Weekly tests with analysis of strengths & weaknesses',
          'Online classes as good as the best offline classroom',
        ]} />
      </div>
      <Folio n={n} />
    </section>
  )
}

/* ── Results ────────────────────────────── */
function Results({ n }) {
  return (
    <section className="page dark">
      <div className="safe">
        <Eyebrow light>Achievers · MHT-CET</Eyebrow>
        <h2>Results that speak <span className="hl">louder than claims.</span></h2>
        <div className="b-toppers">
          {toppers.map((t) => (
            <div className="b-topper" key={t.name}>
              <div className="ph"><img src={t.photo} alt="" /><span className="chip">{t.stream}</span></div>
              <div className="bd">
                {t.badge && <span className="gold"><Icon name="Medal" size={11} /> {t.badge}</span>}
                <h3>{t.name}</h3>
                <div className="score">{t.score}<small>%ile</small></div>
                <ul>
                  {t.breakdown.map(([s, v]) => <li key={s}><span>{s}</span><b className={v === '100' ? 'perfect' : ''}>{v}</b></li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="b-achievers six">
          {brochureAchievers.map((a) => (
            <div className="b-achiever" key={a.name}>
              <img src={a.photo} alt="" />
              <span className="chip sm">{a.stream}</span>
              <b>{a.score.toFixed(2)}<small>%ile</small></b>
              <span>{a.name}</span>
            </div>
          ))}
        </div>
      </div>
      <Folio n={n} dark />
    </section>
  )
}

/* ── Legacy: Then & Now ──────────────────────── */
function Legacy({ n }) {
  return (
    <section className="page dark legacy-pg">
      <div className="legacy-bg" />
      <div className="safe">
        <Eyebrow light>Then &amp; Now</Eyebrow>
        <h2>A legacy written in <span className="hl">ranks, white coats and IIT IDs.</span></h2>
        <div className="lg-cards">
          <div className="b-legacy">
            <img src={cet2022.photo} alt="" />
            <div className="lg-head">
              <span className="muted-l">{noYear(cet2022.exam)}</span>
              <h3>{cet2022.name}</h3>
              <b>{cet2022.score}</b>
            </div>
            <div className="lg-ranks">
              {cet2022.ranks.map(([r, where, cat]) => (
                <div key={where + cat}><b>#{r}</b><span>{where}</span><small>{cat}</small></div>
              ))}
            </div>
          </div>
          <div className="b-legacy neet">
            <img src={neetTopper.photo} alt="" />
            <div className="lg-head">
              <span className="muted-l">{neetTopper.exam}</span>
              <h3>{neetTopper.name}</h3>
              <b>{neetTopper.marks}/{neetTopper.outOf} · {neetTopper.percentile} %ile</b>
            </div>
            <div className="lg-ranks three">
              {neetTopper.breakdown.map(([s, v]) => <div key={s}><b>{v}</b><span>{s}</span><small>percentile</small></div>)}
            </div>
          </div>
        </div>
        <ol className="b-timeline">
          {legacy.map((l) => (
            <li key={l.when}><span>{l.exam || l.when}</span><b>{l.title}</b><p>{l.text}</p></li>
          ))}
        </ol>
      </div>
      <Folio n={n} dark />
    </section>
  )
}

/* ── The Mentors ─────────────────────────────── */
function Mentors({ n }) {
  return (
    <section className="page dark mentors-pg">
      <div className="mentors-bg" />
      <div className="safe">
        <Eyebrow light>{mentorsIntro.eyebrow}</Eyebrow>
        <h2>{mentorsIntro.title.replace(/\.$/, '')}<span className="hl">.</span></h2>
        <p className="lead light">{mentorsIntro.lead}</p>
        <div className="b-mentors">
          {mentors.map((m) => (
            <article className="b-mentor-hero" key={m.id}>
              <div className="portrait"><img src={m.photo} alt="" /></div>
              <span className="mt">{m.role} · {m.title}</span>
              <h3>{m.name}</h3>
              <p>{m.lead}</p>
              <blockquote>“{m.voices[0].quote}”<cite>{m.voices[0].by} · {m.voices[0].meta}</cite></blockquote>
            </article>
          ))}
        </div>
      </div>
      <Folio n={n} dark />
    </section>
  )
}

/* ── Programmes ──────────────────────────────── */
function ProgramRow({ p }) {
  return (
    <article className="b-program">
      <div className="pm" style={{ backgroundImage: `url(${p.image})` }}>
        {p.tag && <span className="tag">{p.tag}</span>}
        <span className="pic"><Icon name={p.icon} size={18} /></span>
      </div>
      <div className="pb">
        <h3>{p.title}</h3>
        <span className="sub">{p.sub}</span>
        <p>{p.summary}</p>
        <div className="facts">
          <span><Icon name="Users" size={11} /> {p.audience}</span>
          <span><Icon name="Clock" size={11} /> {p.duration}</span>
        </div>
        <ul>{p.points.map((pt) => <li key={pt}><Icon name="CheckCircle2" size={11} /> {pt}</li>)}</ul>
      </div>
    </article>
  )
}

function ProgrammesA({ n }) {
  return (
    <section className="page tint">
      <div className="safe">
        <Eyebrow>Programmes · {ACADEMIC_YEAR}</Eyebrow>
        <h2>Courses crafted for <span className="hl-dark">every ambition.</span></h2>
        <p className="lead sm">Class 11 &amp; 12 Science with engineering, medical and pharmacy entrance coaching. Every course combines coaching, tests and mentoring.</p>
        <div className="b-programs">{programs.slice(0, 4).map((p) => <ProgramRow p={p} key={p.id} />)}</div>
      </div>
      <Folio n={n} />
    </section>
  )
}

function ProgrammesB({ n }) {
  return (
    <section className="page tint">
      <div className="safe">
        <Eyebrow>Programmes · {ACADEMIC_YEAR}</Eyebrow>
        <h2>Specialised tracks &amp; <span className="hl-dark">beyond the syllabus.</span></h2>
        <p className="lead sm">CUET-UG, a 45-day CET sprint, exam-pattern practice, and STEM enrichment that builds a true scientific mindset.</p>
        <div className="b-programs">{programs.slice(4).map((p) => <ProgramRow p={p} key={p.id} />)}</div>
      </div>
      <Folio n={n} />
    </section>
  )
}

/* ── Method ──────────────────────────────────── */
function Method({ n }) {
  return (
    <section className="page light">
      <div className="safe">
        <Eyebrow>The fS Method</Eyebrow>
        <h2>Five steps from <span className="hl-dark">curiosity to success.</span></h2>
        <div className="ladder">
          {methodology.map((m, i) => (
            <div className={`rung r${i + 1}`} key={m.n} style={{ marginLeft: `${i * 7}mm` }}>
              <span className="n">{m.n}</span>
              <div>
                <h3><Icon name={m.icon} size={14} /> {m.title}</h3>
                <p>{m.text}</p>
              </div>
            </div>
          ))}
        </div>
        <h3 className="sub-head">The fS Advantage</h3>
        <div className="b-pillars">
          {pillars.map((p) => (
            <div className="b-pillar" key={p.title}>
              <span className="ic dark"><Icon name={p.icon} size={15} /></span>
              <div><h4>{p.title}</h4><p>{p.text}</p></div>
            </div>
          ))}
        </div>
      </div>
      <div className="exam-strip">
        <span className="lbl">We prepare you for</span>
        <div>{exams.map((e) => <span key={e}><Icon name="Atom" size={11} /> {e}</span>)}</div>
      </div>
      <Folio n={n} dark />
    </section>
  )
}

/* ── Student voices ──────────────────────────── */
function VoiceCard({ t }) {
  return (
    <figure className="b-voice">
      <Icon name="Quote" size={14} />
      <blockquote>{t.quote}</blockquote>
      <figcaption><Avatar t={t} /><div><b>{t.name}</b><span>{t.meta}</span></div></figcaption>
    </figure>
  )
}

function VoicesA({ n }) {
  return (
    <section className="page light">
      <div className="safe">
        <Eyebrow>Student Voices</Eyebrow>
        <h2>"Selecting fS as my mentor was <span className="hl-dark">the best decision."</span></h2>
        <div className="b-voices">{testimonials.slice(0, 5).map((t) => <VoiceCard t={t} key={t.name} />)}</div>
      </div>
      <Folio n={n} />
    </section>
  )
}

function VoicesB({ n }) {
  return (
    <section className="page light">
      <div className="safe">
        <Eyebrow>Student Voices</Eyebrow>
        <h2>Doctors, engineers &amp; researchers <span className="hl-dark">look back.</span></h2>
        <div className="b-voices">{testimonials.slice(5).map((t) => <VoiceCard t={t} key={t.name} />)}</div>
      </div>
      <div className="alumni-strip">
        <span className="lbl">Where our alumni went</span>
        <div>{alumniColleges.map((c) => <span key={c.name}><Icon name="GraduationCap" size={11} /> {c.name}</span>)}</div>
      </div>
      <Folio n={n} dark />
    </section>
  )
}

/* ── Life at futureScience ───────────────────── */
function Life({ n }) {
  return (
    <section className="page dark life">
      <div className="safe">
        <Eyebrow light>Life at futureScience</Eyebrow>
        <h2>Where hard work <span className="hl">meets celebration.</span></h2>
        <div className="b-gallery">
          {gallery.map((g) => (
            <figure key={g.src} className={g.wide ? 'wide' : ''}>
              <img src={g.src} alt="" />
              <figcaption>{g.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      <Folio n={n} dark />
    </section>
  )
}

/* ── Back cover ──────────────────────────────── */
function BackCover() {
  const siteQr = useQr(SITE_URL)
  const waQr = useQr(contact.whatsapp ? `https://wa.me/${contact.whatsapp}` : '')
  return (
    <section className="page dark back">
      <div className="safe">
        <Eyebrow light>Upcoming Batches · {ACADEMIC_YEAR}</Eyebrow>
        <h2>Admissions <span className="hl">now open.</span></h2>
        <div className="b-batches">
          {batches.map((b) => (
            <div className="b-batch" key={b.course}>
              <div className="dt"><Icon name="CalendarDays" size={16} /><span>Commences</span><b>{b.start}</b></div>
              <div className="inf">
                <span className="for">{b.for}</span>
                <h3>{b.course}</h3>
                <p>{b.details}</p>
                <span className="live"><i /> {b.status}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="b-cta">
          <h2>Book your free <span className="hl">counselling session.</span></h2>
          <p>Seats in every batch are limited to protect personal attention.</p>
        </div>

        <div className="b-contact">
          <ul>
            <li><Icon name="Phone" size={16} /><div><span>Call / WhatsApp</span><b>{contact.phone}</b></div></li>
            <li><Icon name="Mail" size={16} /><div><span>Email</span><b>{contact.email}</b></div></li>
            <li><Icon name="Globe" size={16} /><div><span>Website</span><b>www.futurescience.in</b></div></li>
            {branches.map((b) => (
              <li key={b.id}><Icon name="MapPin" size={16} /><div><span>Branch · {b.name}</span><b>{b.street}, {b.locality}, {b.city} {b.postalCode}</b></div></li>
            ))}
          </ul>
          <div className="qrs">
            {siteQr && <figure><div className="qr" dangerouslySetInnerHTML={{ __html: siteQr }} /><figcaption>Visit website</figcaption></figure>}
            {waQr && <figure><div className="qr" dangerouslySetInnerHTML={{ __html: waQr }} /><figcaption>WhatsApp us</figcaption></figure>}
          </div>
        </div>

        <div className="b-progs">
          <span className="lbl">Our programmes</span>
          <div>{programs.map((p) => <span key={p.id}><Icon name={p.icon} size={12} /> {p.title}</span>)}</div>
        </div>
      </div>
      <div className="back-foot">
        <div className="logo-plate"><img src="/images/logo-tag.png" alt="" /></div>
        <div>
          <b>{brand.tagline}</b>
          <span>{brand.parent}</span>
        </div>
      </div>
    </section>
  )
}

/* ── Social share card (1200×630 px, saved as public/images/og-image.png) ── */
function OgCard() {
  return (
    <div className="og">
      <div className="cover-bg" />
      <div className="og-inner">
        <div className="logo-plate"><img src="/images/logo-tag.png" alt="" /></div>
        <h1>JEE · NEET-UG · MHT-CET · CUET<br /><span className="hl">Class 11 &amp; 12 Science Coaching</span></h1>
        <p>Kandivali West &amp; Malad West, Mumbai · Admissions {ACADEMIC_YEAR}</p>
        <div className="og-stats">
          <div><b>99.98<small>%ile</small></b><span>MHT-CET 2024</span></div>
          <div><b>#2</b><span>Mumbai University</span></div>
          <div><b>630<small>/720</small></b><span>NEET-UG</span></div>
        </div>
      </div>
      <img className="og-topper" src={toppers[0].photo} alt="" />
      <div className="og-band">{contact.phone} · www.futurescience.in</div>
    </div>
  )
}

// Reading order. Spreads: 2|3, 4|5, 6|7 (programmes), 8|9, 10|11
const ORDER = [Cover, About, Results, Legacy, Mentors, ProgrammesA, ProgrammesB, Method, VoicesA, VoicesB, Life, BackCover]
if (ORDER.length !== PAGE_COUNT) console.error(`Brochure has ${ORDER.length} pages but layout.js says ${PAGE_COUNT}`)

const Page = ({ n }) => { const P = ORDER[n - 1]; return <P n={n} /> }

export default function Brochure() {
  const params = new URLSearchParams(location.search)
  if (params.get('mode') === 'og') return <OgCard />
  const mode = params.get('mode') === 'booklet' ? 'booklet' : 'reading'
  const only = Number(params.get('page')) // preview a single page: ?page=3
  const theme = params.get('theme') === 'light' ? 'theme-light' : '' // light edition: ?theme=light
  const pageCss = `@page { size: ${mode === 'booklet' ? '420mm 297mm' : '210mm 297mm'}; margin: 0; }`

  if (mode === 'booklet') {
    const side = Number(params.get('side')) // one A3 side only (for the per-side .ai export): ?mode=booklet&side=2
    return (
      <div className={`doc booklet ${side ? 'single' : ''} ${theme}`}>
        <style>{pageCss}</style>
        {imposition(PAGE_COUNT).map((pair, i) => [pair, i]).filter(([, i]) => !side || i + 1 === side).map(([[l, r], i]) => (
          <div className="sheet" key={i} data-label={`Sheet ${Math.floor(i / 2) + 1} · ${i % 2 ? 'Back' : 'Front'} · pages ${l} | ${r}`}>
            <Page n={l} /><Page n={r} />
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className={`doc reading ${only ? 'single' : ''} ${theme}`}>
      <style>{pageCss}</style>
      {ORDER.map((_, i) => i + 1).filter((n) => !only || n === only).map((n) => <Page n={n} key={n} />)}
    </div>
  )
}
