import { useState } from 'react'
import { Icon } from '../common/Icon'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Platform', href: '#capabilities', arrow: true },
  { label: 'Analytics', href: '#coverage', arrow: true },
  { label: 'Sectors', href: '#sector-coverage-section', arrow: true },
  { label: 'Assistant', action: 'overview' },
  { label: 'About', href: '#about' },
]

function Logo() {
  return (
    <a aria-label="GovTrack AI home" className="brand" href="#home">
      <svg aria-hidden="true" className="brand-mark" fill="none" viewBox="0 0 40 40">
        <path d="m20 2 16 9v18l-16 9L4 29V11z" fill="#2569ef" />
        <path d="m20 8 10 6-10 6-10-6zM10 20l10 6 10-6M10 26l10 6 10-6" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
      </svg>
      <span>GovTrack <b>AI</b></span>
    </a>
  )
}

export function SiteHeader({ onDemo, onOverview }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNav = (action) => {
    setMenuOpen(false)
    if (action === 'overview') onOverview()
  }

  return (
    <header className="site-header page-container">
      <Logo />
      <nav aria-label="Main navigation" className={`main-nav ${menuOpen ? 'is-open' : ''}`} id="main-navigation">
        {links.map((link) => link.action ? (
          <button className="nav-link" key={link.label} onClick={() => handleNav(link.action)} type="button">{link.label}</button>
        ) : (
          <a className={`nav-link ${link.label === 'Home' ? 'is-active' : ''}`} href={link.href} key={link.label} onClick={() => setMenuOpen(false)}>{link.label}{link.arrow && <Icon name="chevron" size={12} />}</a>
        ))}
        <button className="nav-link nav-contact" onClick={() => { setMenuOpen(false); onDemo() }} type="button">Contact</button>
        <button className="button button-primary mobile-demo" onClick={() => { setMenuOpen(false); onDemo() }} type="button">Request Demo <Icon name="arrowRight" size={17} /></button>
      </nav>
      <button className="button button-primary header-demo" onClick={onDemo} type="button">Request Demo <Icon name="arrowRight" size={17} /></button>
      <button aria-controls="main-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} type="button"><Icon name={menuOpen ? 'close' : 'menu'} size={24} /></button>
    </header>
  )
}
