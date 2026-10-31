import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { nav, contact, brand, ACADEMIC_YEAR } from '../data/site.js'
import Icon from './Icon.jsx'
import { BrochureButton } from './Section.jsx'
import { useTheme } from '../theme.jsx'

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const toLight = theme !== 'light'
  return (
    <button className="theme-toggle" onClick={toggle} aria-label={toLight ? 'Switch to light theme' : 'Switch to classic dark theme'} title={toLight ? 'Light theme' : 'Classic theme'}>
      <span className="tt-track"><span className="tt-thumb"><Icon name={toLight ? 'Moon' : 'Sun'} size={15} /></span></span>
    </button>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <span><span className="live-dot" /> Admissions {ACADEMIC_YEAR} open · <Icon name="MapPin" size={15} /> Kandivali West · Malad West</span>
          <span className="topbar-right">
            <a href={`tel:${contact.phone.replace(/\s/g, '')}`}><Icon name="Phone" size={14} /> {contact.phone}</a>
            <a href={`mailto:${contact.email}`}><Icon name="Mail" size={14} /> {contact.email}</a>
          </span>
        </div>
      </div>
      <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label={brand.full}>
            <img src="/images/logo-tag.png" alt={brand.full} />
          </Link>
          <nav className={`nav ${open ? 'is-open' : ''}`}>
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
                {n.label}
              </NavLink>
            ))}
            <BrochureButton className="btn btn-outline nav-brochure" label="Brochure" size={16} />
            <Link to="/contact" className="btn btn-primary nav-cta">Enrol Now <Icon name="ArrowUpRight" size={16} /></Link>
          </nav>
          <div className="header-tools">
            <ThemeToggle />
            <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
              <Icon name={open ? 'X' : 'Menu'} size={26} />
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
