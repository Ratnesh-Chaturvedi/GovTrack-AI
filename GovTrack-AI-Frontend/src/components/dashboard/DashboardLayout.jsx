import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { dashboardAlerts } from '../../constants/dashboardData'
import { Icon } from '../common/Icon'
import { Logo } from '../layout/SiteHeader'
import { ReportingMonthMenu } from './ReportingMonthMenu'

const navigation = [
  { label: 'Dashboard', href: '/dashboard', view: 'dashboard', icon: 'dashboard' },
  { label: 'Projects', href: '/dashboard/projects', view: 'projects', icon: 'government' },
  { label: 'Sectors', href: '/dashboard/sectors', view: 'sectors', icon: 'layers' },
  { label: 'States', href: '/dashboard/states', view: 'states', icon: 'pin' },
  { label: 'AI Assistant', href: '/dashboard/assistant', view: 'assistant', icon: 'bot' },
  { label: 'Reports', href: '/dashboard/reports', view: 'reports', icon: 'fileAlert' },
  { label: 'Bookmarks', href: '/dashboard/bookmarks', view: 'bookmarks', icon: 'bookmark' },
]

function DashboardSidebar({ onClose, onSignOut, open, view }) {
  return (
    <aside className={`dashboard-sidebar${open ? ' is-open' : ''}`} id="dashboard-sidebar">
      <div className="dashboard-sidebar-mobile-head"><strong>Menu</strong><button aria-label="Close dashboard menu" onClick={onClose} type="button"><Icon name="close" size={20} /></button></div>
      <nav aria-label="Dashboard navigation">
        {navigation.map((item) => <Link aria-current={view === item.view ? 'page' : undefined} className={`dashboard-side-link${view === item.view ? ' is-current' : ''}`} key={item.label} onClick={onClose} to={item.href}><Icon name={item.icon} size={19} /><span>{item.label}</span></Link>)}
      </nav>
      <div className="dashboard-sidebar-footer"><button onClick={onSignOut} type="button"><Icon name="logout" size={18} /><span>Sign out</span></button></div>
    </aside>
  )
}

export function DashboardLayout({ children, monthId, onMonthChange, onSearchChange, searchQuery, showProjectControls = true, userName, view }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()
  const initials = userName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()

  const signOut = () => {
    window.sessionStorage.removeItem('govtrackDemoUser')
    window.sessionStorage.removeItem('govtrackReportingMonth')
    navigate('/login')
  }

  return (
    <div className="dashboard-app">
      <header className="dashboard-topbar">
        <button aria-controls="dashboard-sidebar" aria-expanded={sidebarOpen} aria-label={sidebarOpen ? 'Close dashboard menu' : 'Open dashboard menu'} className="dashboard-menu-toggle" onClick={() => setSidebarOpen((current) => !current)} type="button"><Icon name={sidebarOpen ? 'close' : 'menu'} size={21} /></button>
        <div className="dashboard-top-brand"><Logo government href="/dashboard" /><span>India&apos;s Infrastructure Tracker</span></div>
        {showProjectControls ? <label className="dashboard-global-search"><Icon name="search" size={20} /><span className="sr-only">Search projects, states, and sectors</span><input onChange={(event) => onSearchChange(event.target.value)} placeholder="Search projects, states, sectors..." type="search" value={searchQuery} /></label> : <span className="dashboard-top-section"><Icon name="bot" size={18} /> AI Assistant</span>}
        <div className="dashboard-top-actions">
          {showProjectControls && <ReportingMonthMenu onChange={onMonthChange} value={monthId} />}
          <div className="dashboard-popover-anchor">
            <button aria-expanded={notificationsOpen} aria-label="Notifications" className="dashboard-icon-button" onClick={() => { setNotificationsOpen((current) => !current); setProfileOpen(false) }} type="button"><Icon name="bell" size={21} /><span className="dashboard-notification-dot" /></button>
            {notificationsOpen && <div className="dashboard-popover dashboard-notifications"><strong>Recent alerts</strong>{dashboardAlerts.map((alert) => <Link key={alert.id} onClick={() => setNotificationsOpen(false)} to="/dashboard/reports"><span>{alert.title}</span><small>{alert.project}</small></Link>)}</div>}
          </div>
          <div className="dashboard-popover-anchor">
            <button aria-expanded={profileOpen} aria-label="Account menu" className="dashboard-profile-button" onClick={() => { setProfileOpen((current) => !current); setNotificationsOpen(false) }} type="button"><span className="dashboard-avatar">{initials}</span><span className="dashboard-profile-name">{userName}</span><Icon name="chevron" size={14} /></button>
            {profileOpen && <div className="dashboard-popover dashboard-account-popover"><strong>Demo account</strong><span>{userName}</span><button onClick={signOut} type="button"><Icon name="logout" size={16} /> Sign out</button></div>}
          </div>
        </div>
      </header>
      <div className="dashboard-body">
        {sidebarOpen && <button aria-label="Close dashboard menu" className="dashboard-sidebar-scrim" onClick={() => setSidebarOpen(false)} type="button" />}
        <DashboardSidebar onClose={() => setSidebarOpen(false)} onSignOut={signOut} open={sidebarOpen} view={view} />
        {children}
      </div>
    </div>
  )
}
