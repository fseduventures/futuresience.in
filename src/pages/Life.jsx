import { PageHero, SectionHead, CtaBand } from '../components/Section.jsx'
import { Gallery, Celebrations } from '../components/Blocks.jsx'

// Life at futureScience: every festival album (`celebrations` in site.js, newest first) plus the
// everyday gallery. Linked from the header menu and from each page's gallery section.
export default function Life() {
  return (
    <>
      <PageHero
        eyebrow="Life at futureScience"
        title={<>Festivals, felicitations <span className="hl">and full classrooms.</span></>}
        lead="Beyond the classes and tests: the moments that make futureScience a family, from Diwali in the classroom to results day."
        image="/images/gallery/diwali-2026-group.jpg"
      />

      <section className="section">
        <div className="container">
          <SectionHead center eyebrow="Festivals" title={<>Every festival, <span className="hl-dark">celebrated together.</span></>} />
          <Celebrations />
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <SectionHead center eyebrow="Every day" title={<>Classrooms, tests <span className="hl-dark">and results days.</span></>} />
          <Gallery />
        </div>
      </section>

      <CtaBand />
    </>
  )
}
