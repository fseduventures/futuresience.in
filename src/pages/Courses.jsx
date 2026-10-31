import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Reveal from '../components/Reveal.jsx'
import { PageHero, SectionHead, CtaBand, BrochureButton } from '../components/Section.jsx'
import { BatchTable, Faq, Tracks } from '../components/Blocks.jsx'
import { programs, faqs, ACADEMIC_YEAR } from '../data/site.js'
import { PAGE_COUNT } from '../brochure/layout.js'

export default function Courses() {
  return (
    <>
      <PageHero
        eyebrow={`Courses & Programmes · ${ACADEMIC_YEAR}`}
        title={<>JEE, NEET, CET & CUET coaching <span className="hl">for Class 11 & 12.</span></>}
        lead="Integrated Class 11 & 12 Science, a Bridge Course, engineering, medical and pharmacy entrance coaching, CUET, crash courses and test series at our Kandivali West and Malad West branches."
        image="/images/gallery/lecture.jpg"
      />

      <section className="section">
        <div className="container">
          <Reveal className="brochure-banner">
            <img src="/images/fs-mark.png" alt="futureScience logo" />
            <div>
              <b>Get every course, batch date and result in one place.</b>
              <span>The futureScience {ACADEMIC_YEAR} brochure: {PAGE_COUNT} pages, PDF.</span>
            </div>
            <BrochureButton className="btn btn-primary" />
          </Reveal>

          <div className="course-tabs">
            {programs.map((p) => (
              <a key={p.id} href={`#${p.id}`}><Icon name={p.icon} size={18} /> {p.title}</a>
            ))}
          </div>

          <div className="course-list">
            {programs.map((p, i) => (
              <Reveal as="article" id={p.id} className={`course ${i % 2 ? 'rev' : ''}`} key={p.id}>
                <div className="course-media">
                  <img src={p.image} alt={p.title} loading="lazy" />
                  {p.logo && <img className="course-logo" src={p.logo} alt={`${p.title} logo`} />}
                  {p.tag && <span className="program-tag">{p.tag}</span>}
                </div>
                <div className="course-body">
                  <span className="program-icon inline"><Icon name={p.icon} size={24} /></span>
                  <h2>{p.title}</h2>
                  <span className="program-sub">{p.sub}</span>
                  <p>{p.summary}</p>
                  <div className="course-facts">
                    <div><Icon name="Users" size={18} /><span>Who it's for</span><b>{p.audience}</b></div>
                    <div><Icon name="Clock" size={18} /><span>Duration</span><b>{p.duration}</b></div>
                  </div>
                  <ul className="check-list compact">
                    {p.points.map((pt) => <li key={pt}><Icon name="CheckCircle2" size={18} /> {pt}</li>)}
                  </ul>
                  <Link to="/contact" className="btn btn-primary">Enquire about this course <Icon name="ArrowRight" size={18} /></Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <SectionHead eyebrow={`Schedule · ${ACADEMIC_YEAR}`} title={<>Upcoming batches & <span className="hl-dark">commencement dates.</span></>} />
          <BatchTable />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead center eyebrow="Coaching tracks" title={<>Find the right track <span className="hl-dark">for your goal.</span></>} />
          <Tracks />
        </div>
      </section>

      <section className="section section-tint">
        <div className="container narrow">
          <SectionHead center eyebrow="FAQs" title={<>Course <span className="hl-dark">questions, answered.</span></>} />
          <Faq items={faqs.slice(2)} />
        </div>
      </section>

      <CtaBand />
    </>
  )
}
