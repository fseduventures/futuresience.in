import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Reveal from '../components/Reveal.jsx'
import { PageHero, SectionHead, CtaBand } from '../components/Section.jsx'
import { MentorsFeature, AlumniWall, Gallery } from '../components/Blocks.jsx'

export default function Directors() {
  return (
    <>
      <PageHero
        eyebrow="The Visionaries · Directors"
        title={<>Nilesh Vedant & Prasanna Raut: <span className="hl">the visionaries behind futureScience.</span></>}
        lead="Revered across Mumbai for XI & XII Science, for their care for students' welfare, and for the careers in science and technology that began in their classrooms."
        image="/images/gallery/results-day.jpg"
      />

      <MentorsFeature withVoices />

      <section className="section">
        <div className="container split">
          <div>
            <SectionHead
              eyebrow="Beyond the classroom"
              title={<>Student welfare, <span className="hl-dark">not just syllabus.</span></>}
              lead="Our directors stand by students and their families through the most demanding two years of school: the doubts, the pressure, the setbacks and the wins."
            />
            <ul className="check-list">
              <li><Icon name="CheckCircle2" size={20} /> Doubts answered at any hour, never brushed aside</li>
              <li><Icon name="CheckCircle2" size={20} /> A personal study plan for every student</li>
              <li><Icon name="CheckCircle2" size={20} /> Regular one-to-one conversations with parents</li>
              <li><Icon name="CheckCircle2" size={20} /> Motivation and steadiness through exam season</li>
            </ul>
            <Link to="/contact" className="btn btn-dark">Meet them at a branch <Icon name="ArrowRight" size={18} /></Link>
          </div>
          <Reveal className="split-media">
            <img src="/images/gallery/felicitation.jpg" alt="Toppers felicitated by the futureScience directors" loading="lazy" />
          </Reveal>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <SectionHead center light eyebrow="Where their students are now" title={<>From their classrooms <span className="hl">to India's best campuses.</span></>} />
          <AlumniWall />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead center eyebrow="Life at futureScience" title={<>The futureScience <span className="hl-dark">family.</span></>} />
          <Gallery />
        </div>
      </section>

      <CtaBand />
    </>
  )
}
