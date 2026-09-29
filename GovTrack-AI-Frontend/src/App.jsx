import { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { homeBackground } from './assets'
import { features, headlineStats, sectorBreakdown } from './constants/homeData'
import { Icon } from './components/common/Icon'
import { InfoModal } from './components/common/InfoModal'
import { SiteHeader } from './components/layout/SiteHeader'
import { SiteFooter } from './components/layout/SiteFooter'
import { InsightCards } from './components/dashboard/InsightCards'
import { CoreCapabilities } from './components/capabilities/CoreCapabilities'
import { SectorCoverage } from './components/sectors/SectorCoverage'
import { AssistantPage } from './pages/Assistant/AssistantPage'
import { AuthPage } from './pages/Auth/AuthPage'
const AnalyticsCoverage = lazy(() => import('./components/analytics/AnalyticsCoverage').then((module) => ({ default: module.AnalyticsCoverage })))
const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage').then((module) => ({ default: module.DashboardPage })))
const DashboardAssistantPage = lazy(() => import('./pages/Dashboard/DashboardAssistantPage').then((module) => ({ default: module.DashboardAssistantPage })))
import './index.css'

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

function LandingPage() {
  const [overviewOpen, setOverviewOpen] = useState(false)

  useEffect(() => {
    const sectionId = decodeURIComponent(window.location.hash.slice(1))
    if (!sectionId) return undefined

    const scrollToSection = () => document.getElementById(sectionId)?.scrollIntoView({ block: 'start', behavior: 'instant' })
    const frame = requestAnimationFrame(scrollToSection)
    const page = document.querySelector('.landing-page')
    let observer

    if (page && document.querySelector('.coverage-loading')) {
      observer = new MutationObserver(() => {
        if (document.querySelector('.coverage-loading')) return
        requestAnimationFrame(scrollToSection)
        observer.disconnect()
      })
      observer.observe(page, { childList: true, subtree: true })
    }

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [])

  return (
    <>
      <main className="landing-page" id="home" style={{ '--home-background': `url(${homeBackground})` }}>
        <SiteHeader />
        <div className="page-container">
          <section aria-labelledby="hero-heading" className="hero">
            <div className="hero-content">
              <span className="eyebrow"><Icon name="sparkles" size={16} /> AI for Infrastructure Monitoring</span>
              <h1 id="hero-heading">Predictive Infrastructure Monitoring for <span className="orange-text">Stronger</span> <span className="blue-text">Public Projects</span></h1>
              <p className="hero-description">Leveraging AI within the PAIMANA / MoSPI ecosystem to monitor infrastructure projects, predict risks, prevent delays and enable evidence-based decision support for a stronger, more resilient India.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#coverage">Explore Dashboard <Icon name="arrowRight" size={19} /></a>
                <button className="button button-secondary" onClick={() => setOverviewOpen(true)} type="button"><span className="play-icon"><Icon name="play" size={11} /></span> Watch Overview</button>
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
      </main>
      <SiteFooter />
      {overviewOpen && <InfoModal onClose={() => setOverviewOpen(false)} />}
    </>
  )
}

function DashboardScreen({ view = 'dashboard' }) {
  return <Suspense fallback={<main className="dashboard-loading" role="status">Loading dashboard…</main>}><DashboardPage view={view} /></Suspense>
}

function App() {
  return <Routes>
    <Route element={<LandingPage />} path="/" />
    <Route element={<AssistantPage />} path="/assistant" />
    <Route element={<AuthPage mode="login" />} path="/login" />
    <Route element={<AuthPage mode="signup" />} path="/signup" />
    <Route element={<AuthPage mode="reset" />} path="/forgot-password" />
    <Route element={<DashboardScreen />} path="/dashboard" />
    <Route element={<DashboardScreen view="projects" />} path="/dashboard/projects" />
    <Route element={<DashboardScreen view="sectors" />} path="/dashboard/sectors" />
    <Route element={<DashboardScreen view="states" />} path="/dashboard/states" />
    <Route element={<DashboardScreen view="reports" />} path="/dashboard/reports" />
    <Route element={<DashboardScreen view="bookmarks" />} path="/dashboard/bookmarks" />
    <Route element={<Suspense fallback={<main className="dashboard-loading" role="status">Loading assistant…</main>}><DashboardAssistantPage /></Suspense>} path="/dashboard/assistant" />
    <Route element={<LandingPage />} path="*" />
    </Routes>
}

export default App
