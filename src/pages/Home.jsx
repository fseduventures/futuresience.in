import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Reveal, { Counter } from '../components/Reveal.jsx'
import { SectionHead, CtaBand, BrochureButton, LifeLink } from '../components/Section.jsx'
import {
  TopperCard, AchieverCard, ProgramCard, Methodology, Testimonials, BatchTable, Branches, Faq, Tracks,
  MentorsFeature, AlumniWall, Gallery, TestimonialWall, NeetCard, Legacy, Cet2025Ribbon,
} from '../components/Blocks.jsx'
import { heroStats, exams, toppers, achievers, programs, cet2022, testimonials, spotlight, ACADEMIC_YEAR } from '../data/site.js'
import { pages } from '../seo/meta.js'

// Hero carousel: a scroll-snap track, so phones can swipe natively. All slides are in the
// pre-rendered HTML; it auto-advances every 5s until the visitor hovers, focuses or touches it.
function TopperSpotlight() {
  const track = useRef(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = (i) => {
    const el = track.current
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }
  // the dots follow manual swipes as well as auto-advance
  const onScroll = () => {
    const el = track.current
    if (el) setActive(Math.round(el.scrollLeft / el.clientWidth))
  }

  useEffect(() => {
    if (paused || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => go((active + 1) % spotlight.length), 5000)
    return () => clearTimeout(t)
  }, [active, paused])

  return (
    <Reveal
      className="hero-card"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <div className="hero-card-head">
        <span className="pill">Topper Spotlight</span>
        <span className="muted-light">{spotlight[active].exam}</span>
      </div>
      <div className="spot-track" ref={track} onScroll={onScroll}>
        {spotlight.map((t, i) => (
          <div className="spot-slide" key={t.name} aria-hidden={i !== active}>
            <div className="hero-card-main">
              <img src={t.photo} alt={t.name} loading={i === 0 ? 'eager' : 'lazy'} />
              <div>
                <p className="hero-card-name">{t.name}</p>
                <div className="mega"><Counter value={t.score} decimals={2} /><small>%ile</small></div>
                {t.badge && <span className="badge-gold"><Icon name="Medal" size={14} /> {t.badge}</span>}
              </div>
            </div>
            {t.breakdown && (
              <div className="hero-card-bars">
                {t.breakdown.map(([s, v]) => (
                  <div key={s} className="bar">
                    <span>{s}</span>
                    <div className="bar-track"><div className="bar-fill" style={{ '--w': `${v}%` }} /></div>
                    <b>{v}</b>
                  </div>
                ))}
              </div>
            )}
            {t.facts && (
              <div className="spot-facts">
                {t.facts.map(([label, value]) => <p key={label} className="spot-fact"><span>{label}</span><b>{value}</b></p>)}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="spot-dots">
        {spotlight.map((t, i) => (
          <button key={t.name} type="button" onClick={() => go(i)} aria-label={`Show ${t.name}`} aria-current={i === active} />
        ))}
      </div>
    </Reveal>
  )
}

export default function Home() {
  return (
    <>
      {/* ── HERO ───────────────────────────── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow light"><Icon name="Trophy" size={14} /> Achievers 2024 · Rank 2 Mumbai University</span>
            <h1 className="hero-kicker">{pages['/'].h1}</h1>
            <p className="hero-title">
              Where curious minds become <span className="hl">top rankers.</span>
            </p>
            <p className="lead">
              futureScience Private Tutorials prepares Class 11 & 12 Science students for <b>JEE</b>, <b>NEET-UG</b>, <b>MHT-CET</b> and <b>CUET</b>,
              with deep concepts, disciplined systems and mentors who are there for every doubt.
            </p>
            <div className="hero-actions">
              <Link to="/contact" className="btn btn-primary btn-lg">Book Free Counselling <Icon name="ArrowRight" size={18} /></Link>
              <Link to="/results" className="btn btn-ghost btn-lg"><Icon name="Award" size={18} /> See Our Results</Link>
            </div>
            <div className="hero-trust">
              <Link to="/results" className="avatars" aria-label="See all our results">
                {achievers.slice(0, 4).map((a) => <img key={a.name} src={a.photo} alt={a.name} />)}
                <span><Icon name="Plus" size={18} strokeWidth={3} /></span>
              </Link>
              <p><Link to="/results"><b>100% students</b> qualified for <b>professional courses</b></Link></p>
            </div>
            <BrochureButton className="hero-brochure" label={`Download the ${ACADEMIC_YEAR} brochure (PDF)`} size={17} />
          </div>

          <TopperSpotlight />
        </div>

        <div className="container">
          <div className="stats">
            {heroStats.map((s, i) => (
              <Reveal className="stat" key={s.label} delay={i * 80}>
                <b><Counter {...s} /></b>
                <span>{s.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ───────────────────────── */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...exams, ...exams].map((e, i) => <span key={i}><Icon name="Atom" size={18} /> {e}</span>)}
        </div>
      </div>

      {/* ── RESULTS ───────────────────────── */}
      <section className="section section-dark results-sec">
        <div className="container">
          <SectionHead
            center light
            eyebrow="Hall of Fame"
            title={<>Results that speak <span className="hl">louder than claims.</span></>}
            lead="Top of the MHT-CET merit list, perfect 100 percentiles, and 630/720 in NEET-UG."
          />
          <Cet2025Ribbon />
          <div className="toppers three">
            {toppers.map((t, i) => <TopperCard t={t} key={t.name} delay={i * 120} />)}
            <NeetCard delay={240} />
          </div>
          <div className="achievers">
            {achievers.map((a, i) => <AchieverCard a={a} key={a.name} delay={i * 70} />)}
          </div>
          <Reveal className="legacy">
            <img src={cet2022.photo} alt={cet2022.name} />
            <div>
              <span className="eyebrow light">Legacy · {cet2022.exam}</span>
              <h3>{cet2022.name}: {cet2022.score}</h3>
              <p>Rank 2 Mumbai University (Female/General) · Rank 4 Maharashtra State (Female/General)</p>
            </div>
            <Link to="/results" className="btn btn-primary">All Results <Icon name="ArrowRight" size={18} /></Link>
          </Reveal>
        </div>
      </section>

      {/* ── LEGACY: THEN & NOW ────────────── */}
      <Legacy />

      {/* ── MENTORS ───────────────────────── */}
      <MentorsFeature />
      <div className="mentors-cta">
        <Link to="/directors" className="btn btn-outline">Meet the Directors <Icon name="ArrowRight" size={18} /></Link>
      </div>

      {/* ── WHY futureScience ─────────────── */}
      <section className="section">
        <div className="container split">
          <Reveal className="split-media collage">
            <img className="c1" src="/images/gallery/lecture.jpg" alt="A packed futureScience lecture" loading="lazy" />
            <img className="c2" src="/images/gallery/class-test.jpg" alt="Students writing a futureScience test in exam conditions" loading="lazy" />
            <div className="collage-badge">
              <Icon name="Rocket" size={26} />
              <div><b>Science is</b><span>the Future</span></div>
            </div>
          </Reveal>
          <div>
            <SectionHead
              eyebrow="Why futureScience"
              title={<>A launchpad for science careers, <span className="hl-dark">built for the top 1%.</span></>}
              lead="We teach science the way scientists think. Concepts are taken to the core, doubts are cleared the same day, and a researched system keeps every student moving towards a career in science and technology."
            />
            <ul className="check-list">
              <li><Icon name="CheckCircle2" size={20} /> Board + competitive-exam preparation in one integrated flow</li>
              <li><Icon name="CheckCircle2" size={20} /> Tutors available for doubts, like a "knowledge ATM"</li>
              <li><Icon name="CheckCircle2" size={20} /> Weekly tests with analysis of strengths & weaknesses</li>
              <li><Icon name="CheckCircle2" size={20} /> Online classes as good as the best offline classroom</li>
            </ul>
            <Link to="/about" className="btn btn-dark">Discover Our Story <Icon name="ArrowRight" size={18} /></Link>
          </div>
        </div>
      </section>

      {/* ── COACHING TRACKS ───────────────── */}
      <section className="section section-tint">
        <div className="container">
          <SectionHead
            center
            eyebrow="What we coach"
            title={<>Engineering, medical & pharmacy entrance, <span className="hl-dark">all under one roof.</span></>}
            lead="Science coaching for Class 11 & 12 students in Kandivali West and Malad West: board exams and every major entrance exam, taught together."
          />
          <Tracks />
        </div>
      </section>

      {/* ── PROGRAMS ──────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="head-row">
            <SectionHead
              eyebrow="Programmes"
              title={<>Courses crafted for <span className="hl-dark">every ambition.</span></>}
              lead="From the Bridge Course to the two-year integrated programme, every course combines coaching, tests and mentoring."
            />
            <Link to="/courses" className="btn btn-outline">All Courses <Icon name="ArrowRight" size={18} /></Link>
          </div>
          <div className="programs">
            {programs.map((p, i) => <ProgramCard p={p} key={p.id} delay={(i % 4) * 90} />)}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────── */}
      <section className="section section-dark testi-sec">
        <div className="container split">
          <div>
            <SectionHead
              light
              eyebrow="Student Voices"
              title={<>"Selecting fS as my mentor was the <span className="hl">best decision</span>."</>}
              lead="Doctors, engineers and researchers look back on their futureScience years."
            />
            <AlumniWall />
          </div>
          <Reveal><Testimonials /></Reveal>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <TestimonialWall items={testimonials.slice(1, 7)} />
          <div className="center-row">
            <Link to="/results#voices" className="btn btn-outline">Read all testimonials <Icon name="ArrowRight" size={18} /></Link>
          </div>
        </div>
      </section>

      {/* ── METHODOLOGY ───────────────────── */}
      <section className="section">
        <div className="container">
          <SectionHead
            center
            eyebrow="The fS Method"
            title={<>Five steps from <span className="hl-dark">curiosity to success.</span></>}
            lead="A researched methodology that takes students from strong basics to exam-day confidence."
          />
          <Methodology />
        </div>
      </section>

      {/* ── LIFE AT fS ────────────────────── */}
      <section className="section section-tint">
        <div className="container">
          <SectionHead
            center
            eyebrow="Life at futureScience"
            title={<>Where hard work <span className="hl-dark">meets celebration.</span></>}
          />
          <Gallery />
          <div className="section-cta"><LifeLink /></div>
        </div>
      </section>

      {/* ── BATCHES ───────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="head-row">
            <SectionHead
              eyebrow={`Upcoming Batches · ${ACADEMIC_YEAR}`}
              title={<>Admissions <span className="hl-dark">now open.</span></>}
              lead="Seats in each batch are limited to protect personal attention. Contact your nearest branch to reserve yours."
            />
            <BrochureButton />
          </div>
          <BatchTable />
        </div>
      </section>

      {/* ── BRANCHES ──────────────────────── */}
      <section className="section section-tint">
        <div className="container">
          <SectionHead
            center
            eyebrow="Our Branches"
            title={<>Two branches in <span className="hl-dark">Kandivali West & Malad West.</span></>}
            lead="Science coaching close to home for students from Kandivali, Borivali, Charkop, Malad, Goregaon and nearby areas."
          />
          <Branches />
        </div>
      </section>

      {/* ── FAQ ───────────────────────────── */}
      <section className="section">
        <div className="container narrow">
          <SectionHead center eyebrow="FAQs" title={<>Questions parents & students <span className="hl-dark">ask us.</span></>} />
          <Faq />
        </div>
      </section>

      <CtaBand />
    </>
  )
}
