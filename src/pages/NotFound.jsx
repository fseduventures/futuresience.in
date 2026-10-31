import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'

export default function NotFound() {
  return (
    <section className="page-hero notfound" style={{ '--bg': 'url(/images/gallery/lecture.jpg)' }}>
      <div className="container">
        <span className="eyebrow light">404</span>
        <h1>This page drifted into <span className="hl">deep space.</span></h1>
        <p className="lead">The page you are looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary btn-lg">Back to Home <Icon name="ArrowRight" size={18} /></Link>
      </div>
    </section>
  )
}
