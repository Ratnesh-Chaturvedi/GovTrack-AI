import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IndiaSvgMap } from 'vardhan-maps/react'
import { dashboardAlerts, dashboardRiskFactors, dashboardSectors } from '../../constants/dashboardData'
import { countBy, formatCount, summarizeProjects } from '../../utils/dashboardUtils'
import { Icon } from '../common/Icon'

const statusColors = { onTrack: '#35c990', atRisk: '#ff9f39', delayed: '#ff554e' }

function MapOverview({ onSelectState, projects, selectedState }) {
  const [metric, setMetric] = useState('status')
  const [zoom, setZoom] = useState(1)
  const stateProjects = selectedState ? projects.filter((project) => project.state === selectedState) : projects
  const summary = summarizeProjects(stateProjects)
  const byState = projects.reduce((groups, project) => {
    const group = groups[project.state] ?? { total: 0, onTrack: 0, atRisk: 0, delayed: 0 }
    group.total += 1
    group[project.status] += 1
    groups[project.state] = group
    return groups
  }, {})
  const stateFill = (name) => {
    if (selectedState === name) return '#2878ed'
    const state = byState[name]
    if (!state) return '#d9e2ec'
    if (metric === 'projects') return state.total > 55 ? '#28bd84' : state.total > 40 ? '#85d9ad' : '#c5efd9'
    const risk = (state.atRisk + state.delayed) / state.total
    return risk > 0.4 ? '#ff8764' : risk > 0.32 ? '#ffbd72' : '#72d8a9'
  }

  return <section className="dashboard-insight-card dashboard-map-card" aria-labelledby="dashboard-map-title">
    <div className="dashboard-card-heading"><h2 id="dashboard-map-title">India Map Overview</h2><select aria-label="Map view" onChange={(event) => setMetric(event.target.value)} value={metric}><option value="status">Project Status</option><option value="projects">Project Count</option></select></div>
    <div className="dashboard-map-content">
      <div className="dashboard-map-visual"><div className="dashboard-map-svg" style={{ transform: `scale(${zoom})` }}><IndiaSvgMap className="dashboard-india-svg" height={228} level="state" onStateClick={onSelectState} padding={8} stateFill={stateFill} stateStyle={{ stroke: '#fff', strokeWidth: 1.4 }} tooltip={({ name }) => `${name} · ${formatCount(byState[name]?.total ?? 0)} projects`} width={220} /></div><div className="dashboard-map-zoom"><button aria-label="Zoom in on map" disabled={zoom >= 1.35} onClick={() => setZoom((value) => Math.min(1.35, +(value + .15).toFixed(2)))} type="button">+</button><button aria-label="Zoom out on map" disabled={zoom <= .85} onClick={() => setZoom((value) => Math.max(.85, +(value - .15).toFixed(2)))} type="button">−</button></div></div>
      <div aria-live="polite" className="dashboard-map-legend"><strong>{selectedState || 'All India'}</strong>{[['onTrack', 'On Track'], ['atRisk', 'At Risk'], ['delayed', 'Delayed']].map(([key, label]) => <span key={key}><i style={{ background: statusColors[key] }} />{label}<b>{formatCount(summary[key])}</b></span>)}<span><i style={{ background: '#c9d0df' }} />Total<b>{formatCount(summary.total)}</b></span>{selectedState && <button onClick={() => onSelectState('')} type="button">Clear state</button>}</div>
    </div>
  </section>
}

function SectorDistribution({ onSelectSector, projects, selectedSector }) {
  const counts = countBy(projects, 'sector')
  const total = projects.length
  let cursor = 0
  const stops = dashboardSectors.map((sector) => {
    const start = cursor
    cursor += total ? (counts[sector.name] ?? 0) / total * 100 : 0
    return `${sector.color} ${start}% ${cursor}%`
  })
  const donutStyle = { background: total ? `conic-gradient(${stops.join(', ')})` : '#e9eef7' }

  return <section className="dashboard-insight-card dashboard-sector-card" aria-labelledby="dashboard-sector-title"><div className="dashboard-card-heading"><h2 id="dashboard-sector-title">Sector-wise Distribution</h2><select aria-label="Select sector" onChange={(event) => onSelectSector(event.target.value)} value={selectedSector}><option value="">All Sectors</option>{dashboardSectors.map((sector) => <option key={sector.name} value={sector.name}>{sector.name}</option>)}</select></div><div className="dashboard-sector-content"><div aria-label={`${formatCount(total)} projects across sectors`} className="dashboard-donut" style={donutStyle}><div><strong>{formatCount(total)}</strong><span>Projects</span></div></div><div className="dashboard-sector-legend">{dashboardSectors.map((sector) => <button aria-pressed={selectedSector === sector.name} key={sector.name} onClick={() => onSelectSector(selectedSector === sector.name ? '' : sector.name)} type="button"><i style={{ background: sector.color }} /><span>{sector.name}</span><b>{total ? Math.round((counts[sector.name] ?? 0) / total * 100) : 0}%</b></button>)}</div></div></section>
}

function RiskFactors() {
  const [expanded, setExpanded] = useState(false)
  return <section className="dashboard-insight-card dashboard-risk-card" aria-labelledby="dashboard-risk-title"><div className="dashboard-card-heading"><h2 id="dashboard-risk-title">Top Risk Factors</h2><button onClick={() => setExpanded((value) => !value)} type="button">{expanded ? 'Hide details' : 'View All'} <Icon name="arrowRight" size={15} /></button></div><div className="dashboard-factor-list">{dashboardRiskFactors.map((factor) => <div className="dashboard-factor" key={factor.name}><span className="dashboard-factor-icon" style={{ color: factor.color, background: `${factor.color}18` }}><Icon name={factor.icon} size={15} /></span><span>{factor.name}</span><div className="dashboard-factor-bar"><i style={{ background: factor.color, width: `${factor.percent / 32 * 100}%` }} /></div><b>{factor.percent}%</b></div>)}</div>{expanded && <p className="dashboard-card-note">Illustrative shares of common infrastructure risk factors in this demo dataset.</p>}</section>
}

function RecentAlerts() {
  return <section className="dashboard-insight-card dashboard-alert-card" aria-labelledby="dashboard-alert-title"><div className="dashboard-card-heading"><h2 id="dashboard-alert-title">Recent Alerts</h2><Link to="/dashboard/reports">View All <Icon name="arrowRight" size={15} /></Link></div><div className="dashboard-alert-list">{dashboardAlerts.map((alert) => <div className="dashboard-alert" key={alert.id}><span className={`dashboard-alert-icon ${alert.tone}`}><Icon name={alert.icon} size={16} /></span><div><strong>{alert.title}</strong><span>{alert.project}</span></div><small>{alert.time}</small></div>)}</div></section>
}

export function DashboardInsights({ onSelectSector, onSelectState, projects, selectedSector, selectedState }) {
  const sectorProjects = selectedState ? projects.filter((project) => project.state === selectedState) : projects
  return <aside aria-label="Dashboard insights" className="dashboard-insights"><MapOverview onSelectState={onSelectState} projects={projects} selectedState={selectedState} /><SectorDistribution onSelectSector={onSelectSector} projects={sectorProjects} selectedSector={selectedSector} /><RiskFactors /><RecentAlerts /></aside>
}
