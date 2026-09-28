import { useState } from 'react'
import { coreCapabilitiesBackground } from '../../assets'
import { capabilities, workflowSteps } from '../../constants/capabilityData'
import { Icon } from '../common/Icon'
import './CoreCapabilities.css'

function CapabilityCard({ capability, expanded, onToggle }) {
  const detailId = 'capability-detail-' + capability.id

  return (
    <article className={'capability-card capability-' + capability.tone}>
      <span className="capability-bars" aria-hidden="true"><i /><i /><i /><i /></span>
      <span className="capability-icon"><Icon name={capability.icon} size={27} /></span>
      <h3>{capability.title}</h3>
      <p>{capability.description}</p>
      <button aria-controls={detailId} aria-expanded={expanded} className="capability-more" onClick={onToggle} type="button">
        {expanded ? 'Show Less' : 'Learn More'} <Icon name="arrowRight" size={16} />
      </button>
      <p className="capability-detail" hidden={!expanded} id={detailId}>{capability.detail}</p>
    </article>
  )
}

function WorkflowCard({ step }) {
  return (
    <li className={'workflow-card workflow-' + step.tone}>
      <span className="workflow-number">{step.number}</span>
      <span className="workflow-icon"><Icon name={step.icon} size={39} /></span>
      <h3>{step.title}</h3>
      <p>{step.description}</p>
    </li>
  )
}

export function CoreCapabilities() {
  const [expandedId, setExpandedId] = useState(null)

  return (
    <section aria-labelledby="capabilities-heading" className="capabilities-section" id="capabilities" style={{ '--capabilities-background': 'url(' + coreCapabilitiesBackground + ')' }}>
      <div className="page-container capabilities-inner">
        <div className="capabilities-intro">
          <span className="section-label"><Icon name="chip" size={15} /> Core Capabilities</span>
          <h2 id="capabilities-heading">From Data to Decisions<br />with the <span className="blue-text">Power of</span> <span className="orange-text">AI</span></h2>
          <p>GovTrack AI transforms PAIMANA and OCMS project data into predictive insights, risk signals, and actionable decision support.</p>
          <div className="capability-callouts">
            <div className="capability-callout insight-callout"><span><Icon name="chart" size={22} /></span><div><strong>Data-Driven Insights</strong><small>From project data to real impact</small></div></div>
            <div className="capability-callout decision-callout"><span><Icon name="sparkles" size={20} /></span><div><strong>Smarter Decisions</strong><small>Safer, faster, stronger projects</small></div></div>
          </div>
        </div>
        <div className="capability-grid" id="core-capability-cards">
          {capabilities.map((capability) => (
            <CapabilityCard capability={capability} expanded={expandedId === capability.id} key={capability.id} onToggle={() => setExpandedId(expandedId === capability.id ? null : capability.id)} />
          ))}
        </div>
        <div className="workflow-section" id="workflow">
          <div className="workflow-heading-row">
            <div>
              <span className="section-label"><Icon name="sectors" size={15} /> How It Works</span>
              <h2>A Simple Workflow for <span className="blue-text">Smarter Monitoring</span></h2>
              <p>Built for public-sector monitoring workflows with transparent, explainable AI outputs.</p>
            </div>
            <a className="button button-primary" href="#core-capability-cards">Explore Capabilities <Icon name="arrowRight" size={19} /></a>
          </div>
          <ol className="workflow-grid">
            {workflowSteps.map((step) => <WorkflowCard key={step.number} step={step} />)}
          </ol>
        </div>
      </div>
    </section>
  )
}
