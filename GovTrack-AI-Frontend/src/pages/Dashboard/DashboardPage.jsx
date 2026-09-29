import { useMemo, useState } from 'react'
import { homeBackground } from '../../assets'
import { DashboardInsights } from '../../components/dashboard/DashboardInsights'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { DashboardMetrics } from '../../components/dashboard/DashboardMetrics'
import { ProjectBrowser } from '../../components/dashboard/ProjectBrowser'
import { ProjectDetailsModal } from '../../components/dashboard/ProjectDetailsModal'
import { dashboardMonths, getDashboardSnapshot } from '../../constants/dashboardData'
import { filterAndSortProjects, formatCount, readDemoUserName, summarizeProjects } from '../../utils/dashboardUtils'
import './DashboardPage.css'

const titles = {
  dashboard: 'Welcome back',
  projects: 'Explore Projects',
  sectors: 'Infrastructure Sectors',
  states: 'Projects Across India',
  reports: 'Project Reports',
  bookmarks: 'Bookmarked Projects',
}

const descriptions = {
  dashboard: 'Track, analyse and explore infrastructure projects across India with AI-powered insights.',
  projects: 'Search and compare the projects in the current reporting snapshot.',
  sectors: 'Explore infrastructure activity across sectors and compare project status.',
  states: 'Select a state on the map or use the filters to explore its projects.',
  reports: 'Review project status, risk signals and the latest updates.',
  bookmarks: 'Projects you have saved for quick access on this device.',
}

function readBookmarks() {
  try {
    const stored = JSON.parse(window.localStorage.getItem('govtrackBookmarks') ?? '[]')
    return Array.isArray(stored) ? stored : []
  }
  catch { return [] }
}

function readReportingMonth() {
  const stored = window.sessionStorage.getItem('govtrackReportingMonth')
  return dashboardMonths.some((month) => month.id === stored) ? stored : dashboardMonths[0].id
}

export function DashboardPage({ view = 'dashboard' }) {
  const [monthId, setMonthId] = useState(readReportingMonth)
  const [filters, setFilters] = useState({ query: '', sector: '', state: '', status: '', ministry: '', sort: 'featured' })
  const [page, setPage] = useState(1)
  const [bookmarks, setBookmarks] = useState(readBookmarks)
  const [selectedProject, setSelectedProject] = useState(null)
  const userName = readDemoUserName()
  const projects = useMemo(() => getDashboardSnapshot(monthId), [monthId])
  const monthIndex = dashboardMonths.findIndex((month) => month.id === monthId)
  const previousMonthId = dashboardMonths[monthIndex + 1]?.id
  const previousSummary = useMemo(() => previousMonthId ? summarizeProjects(getDashboardSnapshot(previousMonthId)) : null, [previousMonthId])
  const summary = useMemo(() => summarizeProjects(projects), [projects])
  const bookmarkedIds = useMemo(() => new Set(bookmarks), [bookmarks])
  const scope = useMemo(() => filterAndSortProjects(projects, { ...filters, status: '', bookmarkedIds: view === 'bookmarks' ? bookmarkedIds : null }), [projects, filters, view, bookmarkedIds])
  const scopeSummary = useMemo(() => summarizeProjects(scope), [scope])
  const filteredProjects = useMemo(() => filterAndSortProjects(projects, { ...filters, bookmarkedIds: view === 'bookmarks' ? bookmarkedIds : null }), [projects, filters, view, bookmarkedIds])

  const changeFilter = (field, value) => { setFilters((current) => ({ ...current, [field]: value })); setPage(1) }
  const resetFilters = () => { setFilters({ query: '', sector: '', state: '', status: '', ministry: '', sort: 'featured' }); setPage(1) }
  const changeMonth = (value) => {
    if (!dashboardMonths.some((month) => month.id === value)) return
    window.sessionStorage.setItem('govtrackReportingMonth', value)
    setMonthId(value)
    setPage(1)
  }
  const toggleBookmark = (id) => {
    setBookmarks((current) => {
      const next = current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]
      window.localStorage.setItem('govtrackBookmarks', JSON.stringify(next))
      return next
    })
  }

  return <DashboardLayout monthId={monthId} onMonthChange={changeMonth} onSearchChange={(value) => changeFilter('query', value)} searchQuery={filters.query} userName={userName} view={view}>
    <main className="dashboard-main">
      <div className="dashboard-content-grid">
        <div className="dashboard-primary">
          <section className="dashboard-welcome" style={{ '--dashboard-hero-image': `url(${homeBackground})` }}><span className="dashboard-eyebrow"><i /> {view.toUpperCase()}</span><h1>{titles[view]}{view === 'dashboard' ? `, ${userName}` : ''}</h1><p>{descriptions[view]}</p><span className="dashboard-demo-label">Demo data · {formatCount(summary.total)} projects</span></section>
          <DashboardMetrics previousSummary={previousSummary} summary={summary} />
          <ProjectBrowser filters={filters} monthId={monthId} onChange={changeFilter} onOpenProject={setSelectedProject} onPageChange={setPage} onReset={resetFilters} page={page} projects={filteredProjects} scopeSummary={scopeSummary} view={view} />
        </div>
        <DashboardInsights onSelectSector={(value) => changeFilter('sector', value)} onSelectState={(value) => changeFilter('state', value)} projects={projects} selectedSector={filters.sector} selectedState={filters.state} />
      </div>
    </main>
    {selectedProject && <ProjectDetailsModal bookmarked={bookmarkedIds.has(selectedProject.id)} monthId={monthId} onClose={() => setSelectedProject(null)} onToggleBookmark={toggleBookmark} project={selectedProject} />}
  </DashboardLayout>
}
