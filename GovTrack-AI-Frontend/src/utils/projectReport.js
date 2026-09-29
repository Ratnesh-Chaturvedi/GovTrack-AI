import { dashboardMonths } from '../constants/dashboardData.js'
import { formatCompletion, formatCrore, statusLabels } from './dashboardUtils.js'

const agencyBySector = {
  'Transport & Logistics': 'Transport Project Implementation Unit',
  Energy: 'Energy Project Implementation Unit',
  'Water & Sanitation': 'Water and Sanitation Project Unit',
  Communication: 'Digital Connectivity Project Unit',
  'Social Infrastructure': 'Social Infrastructure Project Unit',
  Other: 'Infrastructure Project Implementation Unit',
}

const statusNotes = {
  onTrack: 'Progress is aligned with the current sample reporting plan.',
  atRisk: 'The sample status indicates a potential delivery risk that needs monitoring.',
  delayed: 'The sample status indicates that delivery is behind the current plan.',
}

function shiftMonths(value, months) {
  const date = new Date(`${value.slice(0, 7)}-01T00:00:00`)
  date.setUTCMonth(date.getUTCMonth() + months)
  return formatCompletion(date.toISOString())
}

export function getProjectReport(project, monthId) {
  const reportingMonth = dashboardMonths.find((month) => month.id === monthId)?.label.replace(' (Latest)', '') ?? monthId
  const revisedCost = project.revisedCost
  const costChange = revisedCost - project.originalCost
  const costChangePercent = Math.round((costChange / project.originalCost) * 100)
  // These fields are illustrative until the dashboard is connected to project history.
  const estimatedExpenditure = Math.round(revisedCost * project.progress / 100 * 0.89)
  const originalCompletion = shiftMonths(project.completion, project.status === 'onTrack' ? -3 : -6)

  return {
    id: project.id,
    name: project.name,
    detail: project.detail,
    reportingMonth,
    status: project.status,
    statusLabel: statusLabels[project.status],
    statusNote: statusNotes[project.status],
    progress: project.progress,
    costChangePercent,
    sections: [
      { title: 'Project information', items: [
        ['Project ID', project.id], ['Sector', project.sector], ['State / UT', project.state],
        ['Ministry', project.ministry], ['Implementing agency (sample)', project.agency ?? agencyBySector[project.sector]],
        ['Project scope', project.detail ?? `${project.sector} infrastructure project in ${project.state}`],
      ] },
      { title: 'Financial overview', items: [
        ['Original cost', `${formatCrore(project.originalCost)} Cr`],
        ['Revised cost', `${formatCrore(revisedCost)} Cr`],
        ['Cost change', `${formatCrore(costChange)} Cr (${costChangePercent}%)`],
        ['Estimated expenditure (sample)', `${formatCrore(estimatedExpenditure)} Cr`],
        ['Estimated balance (sample)', `${formatCrore(revisedCost - estimatedExpenditure)} Cr`],
      ] },
      { title: 'Schedule and delivery', items: [
        ['Original completion (sample)', originalCompletion],
        ['Expected completion', formatCompletion(project.completion)],
        ['Physical progress', `${project.progress}%`],
        ['Current status', statusLabels[project.status]],
      ] },
    ],
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
}

export function downloadProjectReport(report) {
  const sections = report.sections.map(({ title, items }) => `<section><h2>${escapeHtml(title)}</h2><dl>${items.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl></section>`).join('')
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(report.name)} | GovTrack AI Project Report</title><style>body{font-family:Inter,Arial,sans-serif;color:#10234f;margin:0;background:#f5f8fd}main{max-width:840px;margin:30px auto;padding:42px;background:#fff;border-radius:16px;box-shadow:0 10px 35px #152e5514}header{border-bottom:3px solid #ff701c;padding-bottom:20px}header strong{font-size:22px}header strong span{color:#ff701c}h1{font-size:30px;line-height:1.15;margin:28px 0 8px}h2{font-size:18px;margin:30px 0 12px}p,dt{color:#617397}.meta{font-size:13px}.status{display:inline-block;margin-top:10px;border-radius:20px;background:#e9f7f0;padding:8px 12px;font-weight:700}dl{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0}dl div{padding:12px 15px;border:1px solid #e3eaf4;border-radius:9px}dt{font-size:12px;margin-bottom:5px}dd{margin:0;font-size:14px;font-weight:600}.note{margin-top:28px;padding:15px;background:#fff5ef;border-radius:9px;font-size:13px}.actions{margin:18px auto;max-width:840px;text-align:right}.actions button{background:#ff701c;border:0;color:#fff;border-radius:8px;padding:10px 16px;font:600 14px Inter,Arial;cursor:pointer}@media(max-width:600px){main{margin:0;padding:22px;border-radius:0}dl{grid-template-columns:1fr}.actions{padding:0 18px}}@media print{body{background:#fff}main{box-shadow:none;margin:0;max-width:none;padding:0}.actions{display:none}section{break-inside:avoid}}</style></head><body><div class="actions"><button onclick="window.print()">Print / Save as PDF</button></div><main><header><strong>GovTrack <span>AI</span></strong><p class="meta">Project status report · ${escapeHtml(report.reportingMonth)} · ${escapeHtml(report.id)}</p></header><h1>${escapeHtml(report.name)}</h1>${report.detail ? `<p>${escapeHtml(report.detail)}</p>` : ''}<div class="status">${escapeHtml(report.statusLabel)} · ${escapeHtml(report.progress)}% complete</div><p>${escapeHtml(report.statusNote)}</p>${sections}<p class="note">Demo report. Project data and derived estimates are illustrative, not an official government record.</p></main></body></html>`
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `govtrack-project-report-${report.id}-${report.reportingMonth.toLowerCase().replaceAll(' ', '-')}.html`
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
