import { useRef } from 'react'
import { dashboardProjects, dashboardSectors } from '../../constants/dashboardData'
import { stateNames } from '../../constants/analyticsData'
import { DASHBOARD_PAGE_SIZE, downloadProjectsCsv, formatCompletion, formatCount, formatCrore, riskLabels } from '../../utils/dashboardUtils'
import { Icon } from '../common/Icon'

const ministries = [...new Set(dashboardProjects.map((project) => project.ministry))].sort()
const sectorsByName = new Map(dashboardSectors.map((sector) => [sector.name, sector]))
const tabs = [
  { label: 'All Projects', value: '', countKey: 'total' },
  { label: 'On Track', value: 'onTrack', countKey: 'onTrack' },
  { label: 'At Risk', value: 'atRisk', countKey: 'atRisk' },
  { label: 'Delayed', value: 'delayed', countKey: 'delayed' },
]

function FilterSelect({ children, label, onChange, value }) {
  return <label className="dashboard-filter-select"><span className="sr-only">{label}</span><select aria-label={label} onChange={(event) => onChange(event.target.value)} value={value}>{children}</select><Icon name="chevron" size={14} /></label>
}

function ProjectFilters({ filters, onChange, onReset }) {
  return <div className="dashboard-filterbar">
    <label className="dashboard-project-search"><Icon name="search" size={18} /><span className="sr-only">Search projects</span><input onChange={(event) => onChange('query', event.target.value)} placeholder="Search projects..." type="search" value={filters.query} /></label>
    <FilterSelect label="Filter by sector" onChange={(value) => onChange('sector', value)} value={filters.sector}><option value="">All Sectors</option>{dashboardSectors.map((sector) => <option key={sector.name} value={sector.name}>{sector.name}</option>)}</FilterSelect>
    <FilterSelect label="Filter by state" onChange={(value) => onChange('state', value)} value={filters.state}><option value="">All States</option>{stateNames.map((state) => <option key={state} value={state}>{state}</option>)}</FilterSelect>
    <FilterSelect label="Filter by status" onChange={(value) => onChange('status', value)} value={filters.status}><option value="">All Status</option><option value="onTrack">On Track</option><option value="atRisk">At Risk</option><option value="delayed">Delayed</option></FilterSelect>
    <FilterSelect label="Filter by ministry" onChange={(value) => onChange('ministry', value)} value={filters.ministry}><option value="">All Ministries</option>{ministries.map((ministry) => <option key={ministry} value={ministry}>{ministry}</option>)}</FilterSelect>
    <button className="dashboard-reset" onClick={onReset} type="button"><Icon name="reset" size={16} /> Reset</button>
  </div>
}

function SectorLabel({ name, full = false }) {
  const sector = sectorsByName.get(name)
  return <span className="dashboard-table-sector"><span className="dashboard-sector-symbol" style={{ backgroundColor: `${sector.color}1b`, color: sector.color }}><Icon name={sector.icon} size={16} /></span><span>{full ? sector.name : sector.shortName}</span></span>
}

function RiskPill({ status }) {
  const icon = status === 'onTrack' ? 'check' : status === 'atRisk' ? 'alertTriangle' : 'clock'
  return <span className={`dashboard-risk-pill ${status}`}><Icon name={icon} size={12} />{riskLabels[status]}</span>
}

function ProgressIndicator({ project }) {
  return <div className="dashboard-progress-cell"><div className="dashboard-progress"><span className={project.status} style={{ width: `${project.progress}%` }} /></div><b>{project.progress}%</b></div>
}

function ProjectRow({ onOpenProject, project }) {
  return <tr>
    <td><button className="dashboard-project-name" onClick={() => onOpenProject(project)} type="button"><strong>{project.name}</strong>{project.detail && <small>({project.detail})</small>}</button></td>
    <td><SectorLabel name={project.sector} /></td>
    <td>{project.state}</td>
    <td><strong>{formatCrore(project.originalCost)}</strong><small>({formatCrore(project.revisedCost)} revised)</small></td>
    <td><ProgressIndicator project={project} /></td>
    <td><RiskPill status={project.status} /></td>
    <td>{formatCompletion(project.completion)}</td>
    <td><button aria-label={`View details for ${project.name}`} className="dashboard-row-action" onClick={() => onOpenProject(project)} type="button"><Icon name="more" size={19} /></button></td>
  </tr>
}

function MobileProjectCard({ onOpenProject, project }) {
  return <article className="dashboard-mobile-project">
    <div className="dashboard-mobile-project-top"><SectorLabel full name={project.sector} /><RiskPill status={project.status} /></div>
    <button className="dashboard-mobile-project-title" onClick={() => onOpenProject(project)} type="button"><strong>{project.name}</strong>{project.detail && <small>{project.detail}</small>}</button>
    <dl className="dashboard-mobile-project-facts"><div><dt>State</dt><dd>{project.state}</dd></div><div><dt>Original cost</dt><dd>{formatCrore(project.originalCost)} Cr</dd></div><div><dt>Expected completion</dt><dd>{formatCompletion(project.completion)}</dd></div></dl>
    <div className="dashboard-mobile-project-progress"><span>Progress</span><ProgressIndicator project={project} /></div>
    <button className="dashboard-mobile-project-action" onClick={() => onOpenProject(project)} type="button">View project details <Icon name="arrowRight" size={15} /></button>
  </article>
}

function visiblePageNumbers(page, pageCount) {
  if (pageCount <= 5) return Array.from({ length: pageCount }, (_, index) => index + 1)
  if (page <= 3) return [1, 2, 3, 4, 5]
  if (page >= pageCount - 2) return Array.from({ length: 5 }, (_, index) => pageCount - 4 + index)
  return [page - 2, page - 1, page, page + 1, page + 2]
}

export function ProjectBrowser({ filters, monthId, onChange, onOpenProject, onPageChange, onReset, page, projects, scopeSummary, view }) {
  const cardRef = useRef(null)
  const pageCount = Math.max(1, Math.ceil(projects.length / DASHBOARD_PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const firstIndex = (currentPage - 1) * DASHBOARD_PAGE_SIZE
  const rows = projects.slice(firstIndex, firstIndex + DASHBOARD_PAGE_SIZE)
  const numbers = visiblePageNumbers(currentPage, pageCount)
  const changePage = (nextPage) => {
    onPageChange(nextPage)
    requestAnimationFrame(() => cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return <>
    <ProjectFilters filters={filters} onChange={onChange} onReset={onReset} />
    <section aria-label="Infrastructure projects" className="dashboard-project-card" ref={cardRef}>
      <div className="dashboard-project-toolbar">
        <div aria-label="Project status" className="dashboard-project-tabs">{tabs.map((tab) => <button aria-pressed={filters.status === tab.value} className={filters.status === tab.value ? 'is-active' : ''} key={tab.label} onClick={() => onChange('status', tab.value)} type="button">{tab.label} ({formatCount(scopeSummary[tab.countKey])})</button>)}</div>
        <div className="dashboard-table-actions"><FilterSelect label="Sort projects" onChange={(value) => onChange('sort', value)} value={filters.sort}><option value="featured">Sort by: Featured</option><option value="risk">Sort by: Risk Level</option><option value="progress">Sort by: Progress</option><option value="cost">Sort by: Revised Cost</option><option value="completion">Sort by: Completion</option></FilterSelect><button disabled={projects.length === 0} onClick={() => downloadProjectsCsv(projects, monthId)} type="button"><Icon name="download" size={16} /> Export</button></div>
      </div>
      <div className="dashboard-table-scroll"><table className="dashboard-project-table"><thead><tr><th>Project Name</th><th>Sector</th><th>State</th><th>Cost (₹ Cr)</th><th>Progress</th><th>Risk</th><th>Expected Completion</th><th>Actions</th></tr></thead><tbody>{rows.map((project) => <ProjectRow key={project.id} onOpenProject={onOpenProject} project={project} />)}</tbody></table></div>
      {rows.length > 0 && <div className="dashboard-mobile-projects">{rows.map((project) => <MobileProjectCard key={project.id} onOpenProject={onOpenProject} project={project} />)}</div>}
      {rows.length === 0 && <div className="dashboard-table-empty"><Icon name={view === 'bookmarks' ? 'bookmark' : 'search'} size={27} /><strong>{view === 'bookmarks' ? 'No bookmarked projects yet' : 'No projects match these filters'}</strong><p>{view === 'bookmarks' ? 'Open a project and bookmark it to keep it here.' : 'Try a different search or reset the filters.'}</p></div>}
      <div className="dashboard-table-footer"><span>{rows.length ? `Showing ${formatCount(firstIndex + 1)}–${formatCount(firstIndex + rows.length)} of ${formatCount(projects.length)} projects` : 'Showing 0 projects'}</span><div className="dashboard-pagination"><button aria-label="Previous page" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)} type="button">‹</button>{numbers.map((number) => <button aria-current={number === currentPage ? 'page' : undefined} className={number === currentPage ? 'is-active' : ''} key={number} onClick={() => changePage(number)} type="button">{number}</button>)}{pageCount > 5 && numbers.at(-1) < pageCount && <><span>···</span><button onClick={() => changePage(pageCount)} type="button">{pageCount}</button></>}<button aria-label="Next page" disabled={currentPage === pageCount} onClick={() => changePage(currentPage + 1)} type="button">›</button></div><div className="dashboard-pagination-compact"><button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)} type="button">Previous</button><span>Page {formatCount(currentPage)} of {formatCount(pageCount)}</span><button disabled={currentPage === pageCount} onClick={() => changePage(currentPage + 1)} type="button">Next</button></div></div>
    </section>
  </>
}
