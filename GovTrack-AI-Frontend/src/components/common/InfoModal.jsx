import { Icon } from './Icon'

export function InfoModal({ onClose }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section aria-labelledby="modal-title" aria-modal="true" className="modal" onMouseDown={(event) => event.stopPropagation()} role="dialog">
        <button aria-label="Close dialog" className="modal-close" onClick={onClose} type="button"><Icon name="close" size={19} /></button>
        <span className="eyebrow"><Icon name="sparkles" size={15} /> GovTrack AI</span>
        <h2 id="modal-title">A clearer view of public projects</h2>
        <div className="overview-copy">
          <p>GovTrack AI brings PAIMANA-style project information into a single view so teams can follow progress, spending, and emerging delivery risks.</p>
          <ul>
            <li><Icon name="check" size={17} /> Monitor project health at a glance</li>
            <li><Icon name="check" size={17} /> See cost and schedule risk signals early</li>
            <li><Icon name="check" size={17} /> Explore trends across sectors and ministries</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
