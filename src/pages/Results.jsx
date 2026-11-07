import Icon from '../components/Icon.jsx'
import Reveal from '../components/Reveal.jsx'
import { PageHero, SectionHead, CtaBand, BrochureButton, LifeLink } from '../components/Section.jsx'
import { TopperCard, AchieverCard, NeetCard, AlumniWall, TestimonialWall, Gallery, Cet2025, Celebrations } from '../components/Blocks.jsx'
import { toppers, achievers, cet2022 } from '../data/site.js'

export default function Results() {
  return (
    <>
      <PageHero
        eyebrow="Hall of Fame"
        title={<>Our achievers, <span className="hl">our pride.</span></>}
        lead="Perfect percentiles, university and state ranks, and alumni at India's best colleges, earned by students who trusted the futureScience method."
        image="/images/gallery/felicitation.jpg"
      />

      <section className="section section-dark results-sec">
        <div className="container">
          <div id="cet-2025" className="anchor">
            <SectionHead center light eyebrow="Latest · MHT-CET 2025" title={<>Fresh off the merit list: <span className="hl">99.97 %ile.</span></>} />
            <Cet2025 />
          </div>
          <div className="results-divider" />
          <SectionHead center light eyebrow="MHT-CET 2024 · NEET-UG" title={<>Toppers who <span className="hl">set the bar.</span></>} />
          <div className="toppers three">
            {toppers.map((t, i) => <TopperCard t={t} key={t.name} delay={i * 120} />)}
            <NeetCard delay={240} />
          </div>
          <div className="achievers">
            {achievers.map((a, i) => <AchieverCard a={a} key={a.name} delay={i * 70} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <Reveal className="legacy-card">
            <img src={cet2022.photo} alt={cet2022.name} />
            <div className="legacy-score">
              <b>{cet2022.score}</b>
              <span>{cet2022.exam}</span>
            </div>
          </Reveal>
          <div>
            <SectionHead
              eyebrow="PCM-CET 2022"
              title={<>{cet2022.name}: <span className="hl-dark">four ranks, one student.</span></>}
              lead={cet2022.hsc}
            />
            <div className="rank-grid">
              {cet2022.ranks.map(([r, where, cat], i) => (
                <Reveal className="rank" key={where + cat} delay={i * 80}>
                  <span className="rank-label">Rank</span>
                  <b>{r}</b>
                  <span>{where}</span>
                  <small>{cat}</small>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <SectionHead center light eyebrow="Alumni" title={<>Where futureScience students <span className="hl">are now.</span></>} />
          <AlumniWall />
        </div>
      </section>

      <section className="section section-tint" id="voices">
        <div className="container">
          <SectionHead center eyebrow="In their words" title={<>Doctors, engineers & researchers <span className="hl-dark">look back.</span></>} />
          <TestimonialWall />
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <SectionHead eyebrow="Celebrations" title={<>Every result is <span className="hl-dark">celebrated together.</span></>} lead="Results days, felicitations and festivals: the futureScience family celebrates every milestone." />
            <div className="btn-row">
              <BrochureButton className="btn btn-primary" label="Download full brochure (PDF)" />
              <LifeLink />
            </div>
          </div>
          <Reveal className="brochure">
            <img src="/images/brochure-achievers.jpg" alt="futureScience Achievers 2024 brochure" loading="lazy" />
            <span><Icon name="Award" size={16} /> Achievers 2024</span>
          </Reveal>
        </div>
        <div className="container gallery-gap">
          <Celebrations />
          <Gallery />
        </div>
      </section>

      <CtaBand />
    </>
  )
}
