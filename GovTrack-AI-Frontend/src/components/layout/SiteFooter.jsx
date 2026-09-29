import { useState } from 'react'
import { assistantBackground, footerSkyline } from '../../assets'
import { Icon } from '../common/Icon'
import { Logo } from './SiteHeader'
import './SiteFooter.css'

const platformLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Projects', href: '#coverage' },
  { label: 'Sectors', href: '#sector-coverage-section' },
  { label: 'States', href: '#coverage' },
  { label: 'AI Assistant', href: '/assistant' },
]

const socialChannels = [
  { label: 'X', mark: '𝕏' },
  { label: 'LinkedIn', mark: 'in' },
  { label: 'GitHub', icon: 'github' },
  { label: 'YouTube', icon: 'youtube' },
  { label: 'Email', icon: 'mail' },
]

function FooterCallout() {
  return (
    <section aria-labelledby="footer-callout-title" className="footer-callout">
      <div className="footer-callout-copy">
        <span className="footer-kicker">Build a more transparent India</span>
        <h2 id="footer-callout-title">Be Part of <span>the Change</span></h2>
        <p>Explore infrastructure data, track progress, and contribute to a more transparent and accountable India.</p>
      </div>
      <div className="footer-callout-actions">
        <a className="button button-primary" href="#coverage">Explore Projects <Icon name="arrowRight" size={17} /></a>
        <a className="button button-secondary" href="#capabilities">Learn More</a>
      </div>
    </section>
  )
}

function FooterUpdates() {
  const [message, setMessage] = useState('')

  const handleSubscribe = (event) => {
    event.preventDefault()
    event.currentTarget.reset()
    setMessage('Email updates are not connected yet. No address was saved.')
  }

  return (
    <section aria-labelledby="footer-updates-title" className="footer-updates">
      <h3 id="footer-updates-title">Stay Updated</h3>
      <p>Get the latest updates on government projects, new features and insights.</p>
      <form onSubmit={handleSubscribe}>
        <label className="footer-email-field">
          <Icon name="mail" size={17} />
          <span className="sr-only">Your email address</span>
          <input autoComplete="email" name="email" placeholder="Enter your email" required type="email" />
        </label>
        <button className="footer-subscribe" type="submit">Subscribe</button>
      </form>
      {message && <p className="footer-feedback" role="status">{message}</p>}
      <div className="footer-data-ecosystem">
        <h4>Built for public data</h4>
        <div><span>PAIMANA-style data</span><span>State insights</span><span>Sector analytics</span></div>
      </div>
    </section>
  )
}

export function SiteFooter() {
  const [socialMessage, setSocialMessage] = useState('')

  return (
    <footer className="site-footer" style={{ '--footer-callout-image': `url(${assistantBackground})` }}>
      <div className="footer-container">
        <FooterCallout />
        <div className="footer-main">
          <div className="footer-about">
            <div className="footer-brand"><Logo government href="#home" /><span>Transparent Projects. Stronger India.</span></div>
            <p>An AI-powered platform to track, analyze and make government infrastructure projects transparent, accessible and actionable for every citizen.</p>
            <div aria-label="Social channels" className="footer-socials">
              {socialChannels.map((channel) => <button aria-label={`${channel.label} channel preview`} key={channel.label} onClick={() => setSocialMessage('Social channels will be linked when they are available.')} type="button">{channel.icon ? <Icon name={channel.icon} size={17} /> : <span aria-hidden="true">{channel.mark}</span>}</button>)}
            </div>
            {socialMessage && <p className="footer-feedback" role="status">{socialMessage}</p>}
          </div>
          <nav aria-label="Footer platform links" className="footer-platform">
            <h3>Platform</h3>
            {platformLinks.map((link) => <a href={link.href} key={link.label}>{link.label}</a>)}
          </nav>
          <FooterUpdates />
        </div>
      </div>
      <img alt="" aria-hidden="true" className="footer-skyline" src={footerSkyline} />
      <div className="footer-bottom"><div className="footer-bottom-inner"><span>© {new Date().getFullYear()} GovTrack AI. All rights reserved.</span><a href="#home">Back to top ↑</a></div></div>
    </footer>
  )
}
