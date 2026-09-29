import { assistantFeatures } from '../../constants/assistantData'
import { Icon } from '../common/Icon'

export function AssistantIntro() {
  return (
    <section aria-labelledby="assistant-heading" className="assistant-intro">
      <span className="section-label assistant-eyebrow"><span aria-hidden="true" /> AI Assistant</span>
      <h1 id="assistant-heading">Ask Anything About<br /><span>Government Projects</span></h1>
      <p>Get instant, accurate answers about infrastructure projects across India. Ask about project status, costs, delays, sectors, states, or compare multiple projects — powered by AI.</p>
      <div className="assistant-feature-grid">
        {assistantFeatures.map((feature) => <div className="assistant-feature" key={feature.title}>
          <span className={`assistant-feature-icon ${feature.tone}`}><Icon name={feature.icon} size={23} /></span>
          <div><strong>{feature.title}</strong><small>{feature.detail}</small></div>
        </div>)}
      </div>
    </section>
  )
}
