import Icon from '../components/Icon.jsx'
import Reveal from '../components/Reveal.jsx'
import { PageHero, SectionHead, CtaBand } from '../components/Section.jsx'
import { Link } from 'react-router-dom'
import { Methodology, Legacy, MentorsFeature, Gallery } from '../components/Blocks.jsx'
import { brand, values, pillars, scientists, quote } from '../data/site.js'

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About futureScience"
        title={<>Science is the Future, <span className="hl">and so are you.</span></>}
        lead={`${brand.full} is ${brand.parent}, built to give science students the conceptual depth, discipline and mentorship that top ranks demand.`}
        image="/images/gallery/batch-celebration.jpg"
      />

      <section className="section">
        <div className="container split">
          <div>
            <SectionHead
              eyebrow="Our Story"
              title={<>A classroom where <span className="hl-dark">wonder meets rigour.</span></>}
              lead="futureScience began with a simple belief: when students truly understand science, results follow. We combine unconventional, curiosity-led teaching with a strict, disciplined system of class-work, home-work and tests."
            />
            <p className="body">
              futureScience is a mentorship-driven academy where no doubt is left unsolved, teaching goes to the core,
              and tutors are ready to answer any query at any time. That approach kept learning going through a two-year lockdown and
              produced some of Mumbai University's top MHT-CET ranks.
            </p>
            <div className="mini-stats">
              <div><b>99.98</b><span>%ile topper 2024</span></div>
              <div><b>100</b><span>%ile Physics & Biology</span></div>
              <div><b>#2</b><span>Mumbai University</span></div>
            </div>
          </div>
          <Reveal className="split-media">
            <img src="/images/gallery/lecture.jpg" alt="A packed futureScience lecture" loading="lazy" />
          </Reveal>
        </div>
      </section>

      <Legacy />

      <MentorsFeature />
      <div className="mentors-cta">
        <Link to="/directors" className="btn btn-outline">Meet the Directors <Icon name="ArrowRight" size={18} /></Link>
      </div>

      <section className="section section-tint">
        <div className="container">
          <SectionHead center eyebrow="Mission & Vision" title={<>What drives <span className="hl-dark">every lecture.</span></>} />
          <div className="values">
            {values.map((v, i) => (
              <Reveal className="value" key={v.title} delay={i * 100}>
                <div className="value-img"><img src={v.image} alt={v.title} loading="lazy" /></div>
                <span className="value-icon"><Icon name={v.icon} size={22} /></span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead center eyebrow="The fS Method" title={<>Our five-step <span className="hl-dark">success ladder.</span></>} />
          <Methodology />
        </div>
      </section>

      <section className="legends" style={{ '--bg': 'url(/images/board.jpg)' }}>
        <div className="container">
          <SectionHead center light eyebrow="Standing on the shoulders of giants" title={<>Inspired by the <span className="hl">greatest minds.</span></>} />
          <div className="legend-names">
            {scientists.map((s, i) => <Reveal as="span" key={s} delay={i * 50}>{s}</Reveal>)}
          </div>
          <p className="legend-quote">"{quote.text}" <b>— {quote.by}</b></p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead center eyebrow="Why Parents Trust Us" title={<>Built on <span className="hl-dark">six promises.</span></>} />
          <div className="pillars pillars-3">
            {pillars.map((p, i) => (
              <Reveal className="pillar card" key={p.title} delay={(i % 3) * 90}>
                <span className="pillar-icon"><Icon name={p.icon} size={22} /></span>
                <div>
                  <h4>{p.title}</h4>
                  <p>{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <SectionHead center eyebrow="Life at futureScience" title={<>Where hard work <span className="hl-dark">meets celebration.</span></>} />
          <Gallery />
        </div>
      </section>

      <CtaBand />
    </>
  )
}
