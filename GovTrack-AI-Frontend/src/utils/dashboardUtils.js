export const DASHBOARD_PAGE_SIZE = 8

export function readDemoUserName() {
  try { return JSON.parse(window.sessionStorage.getItem('govtrackDemoUser') ?? 'null')?.name || 'Ratnesh' }
  catch { return 'Ratnesh' }
}

export const statusLabels = {
  onTrack: 'On Track',
  atRisk: 'At Risk',
  delayed: 'Delayed',
}

export const riskLabels = {
  onTrack: 'Low',
  atRisk: 'Medium',
  delayed: 'High',
}

const riskOrder = { delayed: 0, atRisk: 1, onTrack: 2 }
const countFormatter = new Intl.NumberFormat('en-IN')
const completionFormatter = new Intl.DateTimeFormat('en-IN', { month: 'short', year: 'numeric' })

export function formatCount(value) {
  return countFormatter.format(value)
}

export function formatCrore(value) {
  return `₹${countFormatter.format(value)}`
}

export function formatCompletion(value) {
  return completionFormatter.format(new Date(`${value.slice(0, 7)}-01T00:00:00`))
}

export function summarizeProjects(projects) {
  return projects.reduce((summary, project) => {
    summary.total += 1
    summary[project.status] += 1
    return summary
  }, { total: 0, onTrack: 0, atRisk: 0, delayed: 0 })
}

export function countBy(projects, field) {
  return projects.reduce((counts, project) => {
    counts[project[field]] = (counts[project[field]] ?? 0) + 1
    return counts
  }, {})
}

export function filterAndSortProjects(projects, { query = '', sector = '', state = '', status = '', ministry = '', sort = 'featured', bookmarkedIds = null }) {
  const search = query.trim().toLowerCase()
  const filtered = projects.filter((project) => {
    if (sector && project.sector !== sector) return false
    if (state && project.state !== state) return false
    if (status && project.status !== status) return false
    if (ministry && project.ministry !== ministry) return false
    if (bookmarkedIds && !bookmarkedIds.has(project.id)) return false
    if (!search) return true
    return [project.name, project.sector, project.state, project.ministry, project.id].some((value) => value.toLowerCase().includes(search))
  })

  if (sort === 'risk') filtered.sort((a, b) => riskOrder[a.status] - riskOrder[b.status] || a.name.localeCompare(b.name))
  if (sort === 'progress') filtered.sort((a, b) => b.progress - a.progress)
  if (sort === 'cost') filtered.sort((a, b) => b.revisedCost - a.revisedCost)
  if (sort === 'completion') filtered.sort((a, b) => a.completion.localeCompare(b.completion))
  return filtered
}

function escapeCsv(value) {
  const text = String(value ?? '')
  return `"${text.replaceAll('"', '""')}"`
}

export function downloadProjectsCsv(projects, monthId) {
  const columns = ['Project ID', 'Project Name', 'Sector', 'State', 'Ministry', 'Original Cost (₹ Cr)', 'Revised Cost (₹ Cr)', 'Progress (%)', 'Status', 'Expected Completion']
  const rows = projects.map((project) => [project.id, project.name, project.sector, project.state, project.ministry, project.originalCost, project.revisedCost, project.progress, statusLabels[project.status], formatCompletion(project.completion)])
  const csv = [columns, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `govtrack-projects-${monthId}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
