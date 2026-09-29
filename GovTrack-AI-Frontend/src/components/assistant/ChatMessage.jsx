import { useState } from 'react'
import { Icon } from '../common/Icon'

function ProjectSummaryCard({ project }) {
  const fields = [
    ['Total Cost', project.totalCost],
    ['Revised Cost', project.revisedCost],
    ['Expenditure', project.expenditure],
    ['Original Completion', project.originalCompletion],
    ['Revised Completion', project.revisedCompletion],
    ['Status', project.status],
  ]

  return (
    <div className="assistant-project-card">
      <header>
        <span className="assistant-project-icon"><Icon name="train" size={23} /></span>
        <div><h3>{project.name} <span className="assistant-project-status"><Icon name="check" size={12} /> On Track</span></h3><small>{project.location}, {project.sector}</small></div>
      </header>
      <dl className="assistant-project-fields">{fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <p>{project.summary}</p>
      <footer><Icon name="fileAlert" size={17} /><span><small>Source · Demo data</small><strong>{project.source}</strong></span></footer>
    </div>
  )
}

export function ChatMessage({ message }) {
  const [feedback, setFeedback] = useState(null)
  const [copied, setCopied] = useState(false)

  if (message.role === 'user') {
    return <div className="assistant-user-message"><p>{message.text}</p><span aria-label="You" className="assistant-user-avatar"><Icon name="user" size={19} /></span></div>
  }

  const copyAnswer = async () => {
    try {
      await navigator.clipboard.writeText([message.text, message.project?.summary].filter(Boolean).join('\n\n'))
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="assistant-bot-message">
      <span aria-label="GovTrack assistant" className="assistant-bot-avatar"><Icon name="bot" size={23} /></span>
      <div className="assistant-bot-content">
        <div className="assistant-answer"><p>{message.text}</p>{message.project && <ProjectSummaryCard project={message.project} />}</div>
        <div className="assistant-answer-actions">
          <button aria-label="Helpful answer" aria-pressed={feedback === 'up'} onClick={() => setFeedback(feedback === 'up' ? null : 'up')} type="button"><Icon name="thumbsUp" size={16} /></button>
          <button aria-label="Unhelpful answer" aria-pressed={feedback === 'down'} onClick={() => setFeedback(feedback === 'down' ? null : 'down')} type="button"><Icon name="thumbsDown" size={16} /></button>
          <button aria-label={copied ? 'Answer copied' : 'Copy answer'} onClick={copyAnswer} type="button"><Icon name={copied ? 'check' : 'copy'} size={16} /></button>
        </div>
      </div>
    </div>
  )
}
