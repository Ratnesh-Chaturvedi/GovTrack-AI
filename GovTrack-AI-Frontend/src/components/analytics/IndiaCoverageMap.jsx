import { IndiaSvgMap } from 'vardhan-maps/react'
import { formatProjectCount, getCoverageResult, stateNames, stateResults } from '../../constants/analyticsData'
import { Icon } from '../common/Icon'

function stateColor(name, selectedState) {
  if (name === selectedState) return '#286ef4'
  const result = stateResults[name]
  const riskShare = (result.atRisk + result.delayed) / result.projects
  if (riskShare > 0.25) return '#ff9d38'
  if (riskShare > 0.21) return '#5b9df4'
  return '#57c891'
}

export function IndiaCoverageMap({ selectedState, onSelectState }) {
  const result = getCoverageResult(selectedState)

  return (
    <div className="coverage-map-panel">
      <div className="map-control">
        <label htmlFor="coverage-state-select">Explore a state or union territory</label>
        <select id="coverage-state-select" onChange={(event) => onSelectState(event.target.value || null)} value={selectedState ?? ''}>
          <option value="">All India</option>
          {stateNames.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
      </div>
      <div className="india-map-frame">
        <IndiaSvgMap
          className="india-state-map"
          height={580}
          level="state"
          onStateClick={onSelectState}
          padding={16}
          stateFill={(name) => stateColor(name, selectedState)}
          stateStyle={{ fill: '#dbeafe', stroke: '#fff', strokeWidth: 1.8 }}
          tooltip={({ name }) => name + ' · ' + formatProjectCount(stateResults[name]?.projects ?? 0) + ' projects'}
          width={520}
        />
      </div>
      <div aria-live="polite" className="map-result-card">
        <span className="map-result-icon"><Icon name="pin" size={25} /></span>
        <div className="map-result-main">
          <span className="map-result-name">{result.name}</span>
          <strong>{formatProjectCount(result.projects)}</strong>
          <small>Total Projects</small>
        </div>
        <div className="map-result-legend">
          <span><i className="map-dot on-track" /> On Track <b>{formatProjectCount(result.onTrack)}</b></span>
          <span><i className="map-dot at-risk" /> At Risk <b>{formatProjectCount(result.atRisk)}</b></span>
          <span><i className="map-dot delayed" /> Delayed <b>{formatProjectCount(result.delayed)}</b></span>
        </div>
      </div>
      <p className="map-instruction">Select a state on the map to see its results.</p>
      <a className="map-attribution" href="https://www.openstreetmap.org/copyright" rel="noreferrer" target="_blank">Map data © OpenStreetMap contributors</a>
    </div>
  )
}
