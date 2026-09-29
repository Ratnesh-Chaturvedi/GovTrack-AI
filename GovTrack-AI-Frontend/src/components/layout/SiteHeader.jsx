import { useState } from 'react'
import { Icon } from '../common/Icon'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Platform', href: '#capabilities', arrow: true },
  { label: 'Analytics', href: '#coverage', arrow: true },
  { label: 'Sectors', href: '#sector-coverage-section', arrow: true },
  { label: 'Assistant', href: '/assistant' },
  { label: 'About', href: '#about' },
]

export function Logo({ government = false, href = '#home' }) {
  return (
    <a aria-label="GovTrack AI home" className={`brand${government ? ' brand-government' : ''}`} href={href}>
      {government ? <span className="brand-government-mark"><Icon name="government" size={28} /></span> : <svg aria-hidden="true" className="brand-mark" fill="none" viewBox="0 0 40 40">
        <path d="m20 2 16 9v18l-16 9L4 29V11z" fill="#2569ef" />
        <path d="m20 8 10 6-10 6-10-6zM10 20l10 6 10-6M10 26l10 6 10-6" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
      </svg>}
      <span>GovTrack <b>AI</b></span>
    </a>
  )
}

export function SiteHeader({ page = 'home' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const isAssistant = page === 'assistant'

  return (
    <header className="site-header page-container">
      <Logo href={isAssistant ? '/' : '#home'} />
      <nav aria-label="Main navigation" className={`main-nav ${menuOpen ? 'is-open' : ''}`} id="main-navigation">
        {links.map((link) => {
          const active = isAssistant ? link.label === 'Assistant' : link.label === 'Home'
          const href = isAssistant && link.href.startsWith('#') ? `/${link.href}` : link.href
          return <a aria-current={active ? 'page' : undefined} className={`nav-link ${active ? 'is-active' : ''}`} href={href} key={link.label} onClick={() => setMenuOpen(false)}>{link.label}{link.arrow && <Icon name="chevron" size={12} />}</a>
        })}
        <a className="button button-primary mobile-auth" href="/login" onClick={() => setMenuOpen(false)}>Login / Sign up <Icon name="arrowRight" size={17} /></a>
      </nav>
      <a className="button button-primary header-auth" href="/login">Login / Sign up <Icon name="arrowRight" size={17} /></a>
      <button aria-controls="main-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} type="button"><Icon name={menuOpen ? 'close' : 'menu'} size={24} /></button>
    </header>
  )
}
