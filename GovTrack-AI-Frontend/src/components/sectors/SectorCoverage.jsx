import { useRef, useState } from 'react'
import { allSectorNames, featuredSectors, sectorHighlights } from '../../constants/sectorData'
import { Icon } from '../common/Icon'
import './SectorCoverage.css'

function SectorShowcaseCard({ sector, isActive }) {
  const onTrackPercent = Math.round((sector.onTrack / sector.projects) * 100)

  return (
    <article className={`sector-showcase-card sector-tone-${sector.tone}${isActive ? ' is-active' : ''}`}>
      <div className="sector-showcase-image">
        <img alt={`${sector.name} infrastructure`} loading="lazy" src={sector.image} />
        <span className="sector-showcase-icon"><Icon name={sector.icon} size={28} /></span>
        <span className="sector-project-badge">{sector.projects} Projects</span>
      </div>
      <div className="sector-showcase-content">
        <h3>{sector.name}</h3>
        <p>{sector.description}</p>
        <div aria-label={`${onTrackPercent}% on track`} className="sector-progress-row">
          <span className="sector-progress-track"><span style={{ width: `${onTrackPercent}%` }} /></span>
          <span className="sector-progress-value"><strong>{onTrackPercent}%</strong><small>On Track</small></span>
        </div>
        <div className="sector-status-row">
          <span><i className="sector-status-dot on-track" /><strong>{sector.onTrack}</strong><small>On Track</small></span>
          <span><i className="sector-status-dot at-risk" /><strong>{sector.atRisk}</strong><small>At Risk</small></span>
          <span><i className="sector-status-dot delayed" /><strong>{sector.delayed}</strong><small>Delayed</small></span>
        </div>
      </div>
    </article>
  )
}

function SectorCarousel() {
  const trackRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const goTo = (index) => {
    const nextIndex = Math.max(0, Math.min(index, featuredSectors.length - 1))
    const track = trackRef.current
    if (!track) return

    const firstCard = track.children[0]
    const nextCard = track.children[nextIndex]
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollTo({ left: nextCard.offsetLeft - firstCard.offsetLeft, behavior: reducedMotion ? 'auto' : 'smooth' })
    setActiveIndex(nextIndex)
  }

  const syncActiveCard = () => {
    const track = trackRef.current
    if (!track) return

    const firstOffset = track.children[0].offsetLeft
    const nearestIndex = featuredSectors.reduce((nearest, _, index) => {
      const currentDistance = Math.abs(track.children[index].offsetLeft - firstOffset - track.scrollLeft)
      const nearestDistance = Math.abs(track.children[nearest].offsetLeft - firstOffset - track.scrollLeft)
      return currentDistance < nearestDistance ? index : nearest
    }, 0)
    setActiveIndex(nearestIndex)
  }

  return (
    <div aria-label="Featured infrastructure sectors" className="sector-carousel" role="region">
      <div className="sector-carousel-controls">
        <button aria-label="Previous sector" className="sector-carousel-arrow" disabled={activeIndex === 0} onClick={() => goTo(activeIndex - 1)} type="button"><Icon name="arrowRight" size={19} /></button>
        <button aria-label="Next sector" className="sector-carousel-arrow next" disabled={activeIndex === featuredSectors.length - 1} onClick={() => goTo(activeIndex + 1)} type="button"><Icon name="arrowRight" size={19} /></button>
      </div>
      <div className="sector-carousel-track" onScroll={syncActiveCard} ref={trackRef} tabIndex={0}>
        {featuredSectors.map((sector, index) => <SectorShowcaseCard isActive={index === activeIndex} key={sector.name} sector={sector} />)}
      </div>
      <div aria-label="Choose featured sector" className="sector-carousel-dots">
        {featuredSectors.map((sector, index) => <button aria-label={`Show ${sector.name}`} aria-pressed={index === activeIndex} className={index === activeIndex ? 'is-active' : ''} key={sector.name} onClick={() => goTo(index)} type="button" />)}
      </div>
    </div>
  )
}

export function SectorCoverage() {
  const [showAll, setShowAll] = useState(false)

  return (
    <section aria-labelledby="sector-coverage-heading" className="sector-coverage-section" id="sector-coverage-section">
      <div className="page-container sector-coverage-inner">
        <div className="sector-coverage-intro">
          <span className="section-label sector-coverage-label"><span aria-hidden="true" className="sector-label-dot" /> Sector Coverage</span>
          <h2 id="sector-coverage-heading">Across 22<br /><span>Infrastructure</span> Sectors</h2>
          <p>Monitor projects across all major infrastructure sectors with real-time data from OCMS, PAIMANA and other government sources.</p>
          <ul className="sector-highlights">
            {sectorHighlights.map((highlight) => <li key={highlight.label}><span className={`sector-highlight-icon ${highlight.tone}`}><Icon name={highlight.icon} size={22} /></span><span>{highlight.label}</span></li>)}
          </ul>
          <button aria-controls="all-sectors-list" aria-expanded={showAll} className="button button-primary sector-all-button" onClick={() => setShowAll((current) => !current)} type="button">{showAll ? 'Hide Sectors' : 'View All Sectors'} <Icon name="arrowRight" size={19} /></button>
        </div>
        <SectorCarousel />
        <div className="sector-all-list" hidden={!showAll} id="all-sectors-list">
          <h3>All 22 sectors</h3>
          <ul>{allSectorNames.map((name) => <li key={name}><Icon name="check" size={16} />{name}</li>)}</ul>
        </div>
      </div>
    </section>
  )
}
