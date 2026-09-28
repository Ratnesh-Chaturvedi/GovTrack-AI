import { useState } from 'react'
import { formatCost, formatProjectCount, getCoverageResult } from '../../constants/analyticsData'
import { Icon } from '../common/Icon'
import { IndiaCoverageMap } from './IndiaCoverageMap'
import './AnalyticsCoverage.css'

const sectorIcons = ['trend', 'chart', 'pin', 'government', 'sectors']
const sectorColors = ['#2d72ef', '#ff8a23', '#8554f4', '#22bc7d', '#50a2f4']

function PanelTitle({ children }) {
  return <div className="coverage-panel-title"><strong>{children}</strong><Icon name="more" size={17} /></div>
}

function RiskDistribution({ result }) {
  const onTrack = Math.round(result.onTrack / result.projects * 100)
  const atRisk = Math.round(result.atRisk / result.projects * 100)
  const delayed = 100 - onTrack - atRisk
  const gradient = 'conic-gradient(#35bc82 0 ' + onTrack + '%, #ff9a36 ' + onTrack + '% ' + (onTrack + atRisk) + '%, #f4565c ' + (onTrack + atRisk) + '% 100%)'
  const rows = [
    { label: 'On Track', count: result.onTrack, percent: onTrack, color: 'on-track' },
    { label: 'At Risk', count: result.atRisk, percent: atRisk, color: 'at-risk' },
    { label: 'Delayed', count: result.delayed, percent: delayed, color: 'delayed' },
  ]

  return (
    <div className="coverage-panel risk-panel">
      <PanelTitle>Project Risk Distribution</PanelTitle>
      <div className="risk-panel-body">
        <div className="coverage-donut" style={{ background: gradient }}><div><strong>{formatProjectCount(result.projects)}</strong><span>Total Projects</span></div></div>
        <div className="coverage-risk-legend">{rows.map((row) => (
          <div key={row.label}><i className={'map-dot ' + row.color} /><span>{row.label}</span><strong>{row.percent}%</strong><small>{formatProjectCount(row.count)}</small></div>
        ))}</div>
      </div>
    </div>
  )
}

function trendPoints(result, field) {
  const factors = [0.37, 0.42, 0.48, 0.54, 0.59, 0.64, 0.70, 0.75, 0.81, 0.88, 0.94, 1]
  const max = result.projects * 1.06
  return factors.map((factor, index) => {
    const wobble = index % 3 === 1 ? 1.03 : index % 4 === 0 ? 0.97 : 1
    const value = result[field] * factor * wobble
    return (8 + index * 25.8).toFixed(1) + ',' + (112 - value / max * 94).toFixed(1)
  }).join(' ')
}

function ProjectTrend({ result }) {
  return (
    <div className="coverage-panel coverage-trend-panel">
      <PanelTitle>Project Trend <span>({result.name})</span></PanelTitle>
      <div className="coverage-trend-chart">
        <svg aria-label={'Illustrative project risk trend for ' + result.name} role="img" viewBox="0 0 310 125">
          <path d="M8 18H301M8 48H301M8 78H301M8 108H301" fill="none" stroke="#e7edf7" strokeDasharray="4 5" />
          <polyline fill="none" points={trendPoints(result, 'onTrack')} stroke="#2bc781" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          <polyline fill="none" points={trendPoints(result, 'atRisk')} stroke="#ff922f" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          <polyline fill="none" points={trendPoints(result, 'delayed')} stroke="#f1555d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
        </svg>
        <span className="trend-callout"><strong>+24%</strong><small>On Track Projects</small></span>
      </div>
      <div className="coverage-chart-years"><span>2021</span><span>2022</span><span>2023</span><span>2024</span><span>2025</span></div>
      <div className="coverage-chart-legend"><span><i className="map-dot on-track" /> On Track</span><span><i className="map-dot at-risk" /> At Risk</span><span><i className="map-dot delayed" /> Delayed</span></div>
    </div>
  )
}

function MetricCard({ icon, tone, value, label, change, direction }) {
  return (
    <div className={'coverage-metric metric-' + tone}>
      <span className="coverage-metric-icon"><Icon name={icon} size={24} /></span>
      <strong>{value}</strong>
      <span>{label}</span>
      <small className={'metric-change ' + direction}>{change}</small>
    </div>
  )
}

function TopSectors({ result }) {
  return (
    <div className="coverage-panel top-sectors">
      <PanelTitle>Top Performing Sectors</PanelTitle>
      <div className="sector-bars">
        {result.sectors.map((sector, index) => (
          <div className="sector-bar-row" key={sector.name}>
            <span className="sector-bar-icon" style={{ color: sectorColors[index], backgroundColor: sectorColors[index] + '1c' }}><Icon name={sectorIcons[index]} size={15} /></span>
            <span className="sector-bar-name">{sector.name}</span>
            <span aria-label={sector.percentage + '%'} className="sector-bar-track"><i style={{ width: sector.percentage * 2.8 + '%', backgroundColor: sectorColors[index] }} /></span>
            <strong>{sector.percentage}%</strong>
            <small>{formatProjectCount(sector.projects)} projects</small>
          </div>
        ))}
      </div>
    </div>
  )
}

function SectorExplorer({ result, selectedSector, onSelectSector }) {
  const selected = result.sectors.find((sector) => sector.name === selectedSector)
  return (
    <div className="coverage-panel sector-explorer" id="sector-coverage">
      <PanelTitle>Explore by Sector</PanelTitle>
      <div className="sector-chip-grid">
        {result.sectors.map((sector, index) => (
          <button aria-pressed={selectedSector === sector.name} className={'sector-chip ' + (selectedSector === sector.name ? 'is-selected' : '')} key={sector.name} onClick={() => onSelectSector(selectedSector === sector.name ? null : sector.name)} type="button">
            <span style={{ color: sectorColors[index], backgroundColor: sectorColors[index] + '1c' }}><Icon name={sectorIcons[index]} size={18} /></span>
            {sector.name}
          </button>
        ))}
      </div>
      {selected && <p className="sector-selection" role="status">{selected.name}: {formatProjectCount(selected.projects)} projects in {result.name}</p>}
    </div>
  )
}

export function AnalyticsCoverage() {
  const [selectedState, setSelectedState] = useState(null)
  const [selectedSector, setSelectedSector] = useState(null)
  const result = getCoverageResult(selectedState)

  return (
    <section aria-labelledby="coverage-heading" className="coverage-section" id="coverage">
      <div className="page-container coverage-grid">
        <div className="coverage-left">
          <div className="coverage-intro">
            <span className="section-label"><Icon name="chart" size={15} /> Analytics &amp; Coverage</span>
            <h2 id="coverage-heading">Real-Time Insights<br /><span className="orange-text">Across</span> <span className="blue-text">India</span></h2>
            <p>Monitor project trends, state-level risk signals, and sector performance with AI-powered analytics.</p>
          </div>
          <div aria-live="polite" className="coverage-chart-grid">
            <RiskDistribution result={result} />
            <ProjectTrend result={result} />
          </div>
          <div aria-live="polite" className="coverage-metrics">
            <MetricCard change="↓ 18% vs. last quarter" direction="down" icon="fileAlert" label="Projects at Risk" tone="orange" value={formatProjectCount(result.atRisk)} />
            <MetricCard change={'↑ ' + result.costChange + '% vs. last quarter'} direction="up" icon="coins" label="Tracked Project Cost" tone="blue" value={formatCost(result.costLakhCrore)} />
            <MetricCard change="↑ 18% vs. last quarter" direction="up" icon="clock" label="Avg. Time Overrun" tone="green" value={result.avgDelayMonths + ' Months'} />
            <MetricCard change="↓ 27% vs. last quarter" direction="down" icon="bell" label="Active Alerts" tone="purple" value={formatProjectCount(result.alerts)} />
          </div>
          <TopSectors result={result} />
        </div>
        <div className="coverage-right">
          <IndiaCoverageMap onSelectState={setSelectedState} selectedState={selectedState} />
          <SectorExplorer onSelectSector={setSelectedSector} result={result} selectedSector={selectedSector} />
          <a className="button button-primary coverage-cta" href="#sector-coverage">Explore Full Analytics <Icon name="arrowRight" size={19} /></a>
        </div>
      </div>
    </section>
  )
}
