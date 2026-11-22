import { useState, useEffect } from 'react'
import Icon from '../components/Icon.jsx'
import Reveal from '../components/Reveal.jsx'
import { PageHero, SectionHead, BrochureButton } from '../components/Section.jsx'
import { Branches, Faq } from '../components/Blocks.jsx'
import { contact, programs, branches, faqs, ACADEMIC_YEAR } from '../data/site.js'

// Static site: no backend. The form composes a message and hands it to
// WhatsApp (if a number is configured) or the visitor's email app.
export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', grade: 'Std. X (going to XI)', course: programs[0].title, branch: branches[0].name, message: '' })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  // "Enquire about this course" links pass ?course=<id>; applied after hydration so the pre-rendered HTML stays identical
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('course')
    const p = programs.find((x) => x.id === id)
    if (p) setForm((f) => ({ ...f, course: p.title }))
  }, [])

  const submit = (e) => {
    e.preventDefault()
    const body = encodeURIComponent(
      `Hello futureScience,\n\nName: ${form.name}\nPhone: ${form.phone}\nCurrently in: ${form.grade}\nInterested in: ${form.course}\nPreferred branch: ${form.branch}\n\n${form.message}`,
    )
    const url = contact.whatsapp
      ? `https://wa.me/${contact.whatsapp}?text=${body}`
      : `mailto:${contact.email}?subject=${encodeURIComponent('Admission enquiry — ' + form.course)}&body=${body}`
    // window.open isn't a link click, so analytics.jsx can't see it: report the lead here
    window.gtag?.('event', 'generate_lead', { method: 'form' })
    window.fbq?.('track', 'Contact', { method: 'form' })
    window.open(url, '_blank')
  }

  const cards = [
    {
      icon: 'Phone', title: 'Call / WhatsApp', value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, '')}`,
      extra: contact.whatsapp && { label: 'Chat on WhatsApp', href: `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(`Hello futureScience, I'd like to know about admissions ${ACADEMIC_YEAR}.`)}` },
    },
    { icon: 'Mail', title: 'Email', value: contact.email, href: `mailto:${contact.email}` },
    { icon: 'Clock', title: 'Hours', value: contact.hours },
  ]

  return (
    <>
      <PageHero
        eyebrow={`Admissions ${ACADEMIC_YEAR}`}
        title={<>Contact us in <span className="hl">Kandivali West & Malad West.</span></>}
        lead="Talk to our counsellors about the right batch, schedule and strategy for JEE, NEET-UG, MHT-CET or CUET."
        image="/images/gallery/christmas.jpg"
      />

      <section className="section">
        <div className="container">
          <div className="contact-cards">
            {cards.map((c, i) => (
              <Reveal className="contact-card" key={c.title} delay={i * 80}>
                <span className="pillar-icon"><Icon name={c.icon} size={22} /></span>
                <span className="muted">{c.title}</span>
                {c.href ? <a href={c.href}>{c.value}</a> : <b>{c.value}</b>}
                {c.extra && <a className="text-link" href={c.extra.href} target="_blank" rel="noreferrer"><Icon name="MessageCircle" size={16} /> {c.extra.label}</a>}
              </Reveal>
            ))}
            <Reveal className="contact-card brochure-card" delay={240}>
              <span className="pillar-icon"><Icon name="FileDown" size={22} /></span>
              <span className="muted">Brochure {ACADEMIC_YEAR}</span>
              <BrochureButton className="text-link" label="Download PDF" size={16} />
            </Reveal>
          </div>

          <SectionHead eyebrow="Branches" title={<>Visit a <span className="hl-dark">futureScience branch.</span></>} />
          <Branches withMap />

          <div className="contact-grid single">
            <Reveal className="enquiry" id="enquiry">
              <SectionHead eyebrow="Enquiry" title={<>Book a free <span className="hl-dark">counselling session.</span></>} />
              <form onSubmit={submit}>
                <div className="field-row">
                  <label>Student name<input required value={form.name} onChange={set('name')} placeholder="Full name" /></label>
                  <label>Phone<input required type="tel" value={form.phone} onChange={set('phone')} placeholder="+91" /></label>
                </div>
                <div className="field-row">
                  <label>Currently in
                    <select value={form.grade} onChange={set('grade')}>
                      <option>Std. X (going to XI)</option>
                      <option>Std. XI</option>
                      <option>Std. XII</option>
                      <option>HSC appeared</option>
                    </select>
                  </label>
                  <label>Interested in
                    <select value={form.course} onChange={set('course')}>
                      {programs.map((p) => <option key={p.id}>{p.title}</option>)}
                    </select>
                  </label>
                </div>
                <label>Preferred branch
                  <select value={form.branch} onChange={set('branch')}>
                    {branches.map((b) => <option key={b.id}>{b.name}</option>)}
                  </select>
                </label>
                <label>Message<textarea rows="4" value={form.message} onChange={set('message')} placeholder="Board, target exam, preferred batch timing…" /></label>
                <button className="btn btn-primary btn-lg" type="submit">
                  <Icon name={contact.whatsapp ? 'MessageCircle' : 'Send'} size={18} />
                  {contact.whatsapp ? 'Send on WhatsApp' : 'Send by Email'}
                </button>
                <p className="form-note">The message opens in your own {contact.whatsapp ? 'WhatsApp' : 'email app'}; your details are not stored on this website. Office hours: {contact.hours}.</p>
              </form>
            </Reveal>
            <div>
              <SectionHead eyebrow="FAQs" title={<>Before you <span className="hl-dark">visit.</span></>} />
              <Faq items={faqs.slice(1, 6)} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
