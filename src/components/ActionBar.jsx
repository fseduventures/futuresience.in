import Icon from './Icon.jsx'
import { contact, ACADEMIC_YEAR } from '../data/site.js'

// Phones only (shown in the 640px block of styles.css): call and WhatsApp stay one tap away while
// parents scroll. Plain tel:/wa.me links, so analytics.jsx counts them as leads with no extra code.
export default function ActionBar() {
  const wa = contact.whatsapp && `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(`Hello futureScience, I'd like to know about admissions ${ACADEMIC_YEAR}.`)}`
  return (
    <div className="action-bar">
      <a className="btn btn-outline btn-sm" href={`tel:${contact.phone.replace(/\s/g, '')}`}>
        <Icon name="Phone" size={16} /> Call<span className="sr-only"> futureScience</span>
      </a>
      {wa && (
        <a className="btn btn-primary btn-sm" href={wa} target="_blank" rel="noreferrer">
          <Icon name="MessageCircle" size={16} /> WhatsApp us
        </a>
      )}
    </div>
  )
}
