import { lazy, Suspense, useState } from 'react'
import { homeBackground } from './assets'
import { features, headlineStats, sectorBreakdown } from './constants/homeData'
import { Icon } from './components/common/Icon'
import { SiteHeader } from './components/layout/SiteHeader'
import { InsightCards } from './components/dashboard/InsightCards'
import { CoreCapabilities } from './components/capabilities/CoreCapabilities'
import { SectorCoverage } from './components/sectors/SectorCoverage'
const AnalyticsCoverage = lazy(() => import('./components/analytics/AnalyticsCoverage').then((module) => ({ default: module.AnalyticsCoverage })))
import './index.css'

function InfoModal({ type, onClose }) {
  const isDemo = type === 'demo'
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section aria-labelledby="modal-title" aria-modal="true" className="modal" onMouseDown={(event) => event.stopPropagation()} role="dialog">
        <button aria-label="Close dialog" className="modal-close" onClick={onClose} type="button"><Icon name="close" size={19} /></button>
        <span className="eyebrow"><Icon name="sparkles" size={15} /> GovTrack AI</span>
        <h2 id="modal-title">{isDemo ? 'Request a demo' : 'A clearer view of public projects'}</h2>
        {isDemo ? (
          submitted ? (
            <div className="modal-confirmation" role="status"><Icon name="check" size={24} /><p>This is a preview form. Your request has not been sent yet.</p></div>
          ) : (
            <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}>
              <p>See how project data, trends, and AI risk signals come together in one place.</p>
              <label htmlFor="demo-name">Name</label>
              <input autoComplete="name" id="demo-name" name="name" placeholder="Your name" required />
              <label htmlFor="demo-email">Work email</label>
              <input autoComplete="email" id="demo-email" name="email" placeholder="you@organization.gov" required type="email" />
              <button className="button button-primary modal-submit" type="submit">Preview request <Icon name="arrowRight" size={17} /></button>
            </form>
          )
        ) : (
          <div className="overview-copy">
            <p>GovTrack AI brings PAIMANA-style project information into a single view so teams can follow progress, spending, and emerging delivery risks.</p>
            <ul>
              <li><Icon name="check" size={17} /> Monitor project health at a glance</li>
              <li><Icon name="check" size={17} /> See cost and schedule risk signals early</li>
              <li><Icon name="check" size={17} /> Explore trends across sectors and ministries</li>
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}

function FeatureStrip() {
  return (
    <div className="feature-strip" id="platform">
      {features.map((feature) => (
        <div className="feature" key={feature.title}>
          <span className={`feature-icon ${feature.tone}`}><Icon name={feature.icon} size={23} /></span>
          <div><strong>{feature.title}</strong><span>{feature.description}</span></div>
        </div>
      ))}
    </div>
  )
}

function HeadlineStats() {
  return (
    <section aria-label="Platform at a glance" className="headline-stats" id="about">
      {headlineStats.map((stat) => (
        <div className="headline-stat" key={stat.label}>
          <span className={`stat-icon ${stat.tone}`}><Icon name={stat.icon} size={27} /></span>
          <div><strong>{stat.value}</strong><span>{stat.label}</span><small>{stat.detail}</small></div>
        </div>
      ))}
    </section>
  )
}

function App() {
  const [modal, setModal] = useState(null)

  return (
    <main className="landing-page" id="home" style={{ '--home-background': `url(${homeBackground})` }}>
      <SiteHeader onDemo={() => setModal('demo')} onOverview={() => setModal('overview')} />
      <div className="page-container">
        <section aria-labelledby="hero-heading" className="hero">
          <div className="hero-content">
            <span className="eyebrow"><Icon name="sparkles" size={16} /> AI for Infrastructure Monitoring</span>
            <h1 id="hero-heading">Predictive Infrastructure Monitoring for <span className="orange-text">Stronger</span> <span className="blue-text">Public Projects</span></h1>
            <p className="hero-description">Leveraging AI within the PAIMANA / MoSPI ecosystem to monitor infrastructure projects, predict risks, prevent delays and enable evidence-based decision support for a stronger, more resilient India.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#coverage">Explore Dashboard <Icon name="arrowRight" size={19} /></a>
              <button className="button button-secondary" onClick={() => setModal('overview')} type="button"><span className="play-icon"><Icon name="play" size={11} /></span> Watch Overview</button>
            </div>
            <FeatureStrip />
          </div>
          <InsightCards sectors={sectorBreakdown} />
        </section>
        <HeadlineStats />
      </div>
      <CoreCapabilities />
      <Suspense fallback={<section className="coverage-loading" id="coverage">Loading analytics…</section>}><AnalyticsCoverage /></Suspense>
      <SectorCoverage />
      {modal && <InfoModal key={modal} onClose={() => setModal(null)} type={modal} />}
    </main>
  )
}

export default App
