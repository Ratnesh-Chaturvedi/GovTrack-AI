import { useEffect, useRef } from 'react'
import { downloadProjectReport, getProjectReport } from '../../utils/projectReport'
import { Icon } from '../common/Icon'

function DetailSection({ items, title }) {
  return <section className="dashboard-detail-section"><h3>{title}</h3><dl>{items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
}

export function ProjectDetailsModal({ bookmarked, monthId, onClose, onToggleBookmark, project }) {
  const dialogRef = useRef(null)
  const report = getProjectReport(project, monthId)

  useEffect(() => {
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.querySelector('button')?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return
      const buttons = [...dialogRef.current.querySelectorAll('button')]
      if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons.at(-1).focus() }
      if (!event.shiftKey && document.activeElement === buttons.at(-1)) { event.preventDefault(); buttons[0].focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      previousFocus?.focus()
    }
  }, [onClose])

  return <div className="dashboard-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section aria-labelledby="dashboard-project-dialog-title" aria-modal="true" className="dashboard-project-dialog" ref={dialogRef} role="dialog">
      <div className="dashboard-dialog-top"><span className="dashboard-dialog-label">PROJECT DETAILS · {report.id}</span><button aria-label="Close project details" onClick={onClose} type="button"><Icon name="close" size={20} /></button></div>
      <div className="dashboard-detail-header"><div><h2 id="dashboard-project-dialog-title">{report.name}</h2>{report.detail && <p>{report.detail}</p>}<span className="dashboard-detail-period">Reporting month: {report.reportingMonth}</span></div><span className={`dashboard-detail-status ${report.status}`}>{report.statusLabel}</span></div>
      <div className="dashboard-detail-summary"><div><span>Physical progress</span><strong>{report.progress}%</strong></div><div><span>Cost change</span><strong>+{report.costChangePercent}%</strong></div><div><span>Current status</span><strong>{report.statusLabel}</strong></div></div>
      <div aria-label={`Physical progress: ${report.progress}%`} className="dashboard-dialog-progress" role="progressbar" aria-valuenow={report.progress} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${report.progress}%` }} /></div>
      <div className="dashboard-detail-sections">{report.sections.map((section) => <DetailSection key={section.title} {...section} />)}</div>
      <div className="dashboard-detail-note"><Icon name="fileAlert" size={18} /><p><strong>Status note:</strong> {report.statusNote}<br />Demo data and estimated figures are illustrative, not an official government record.</p></div>
      <div className="dashboard-detail-actions"><button className="dashboard-bookmark-action" onClick={() => onToggleBookmark(project.id)} type="button"><Icon name="bookmark" size={17} />{bookmarked ? 'Remove bookmark' : 'Bookmark project'}</button><button className="dashboard-report-action" onClick={() => downloadProjectReport(report)} type="button"><Icon name="download" size={17} />Download report</button></div>
    </section>
  </div>
}
