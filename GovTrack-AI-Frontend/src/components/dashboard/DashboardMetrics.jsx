import { Icon } from '../common/Icon'
import { formatCount } from '../../utils/dashboardUtils'

const metrics = [
  { key: 'total', label: 'Total Projects', icon: 'folder', tone: 'blue' },
  { key: 'onTrack', label: 'On Track', icon: 'check', tone: 'green' },
  { key: 'atRisk', label: 'At Risk', icon: 'alertTriangle', tone: 'orange' },
  { key: 'delayed', label: 'Delayed', icon: 'clock', tone: 'red' },
]

function MetricCard({ metric, previous, value }) {
  const change = previous ? Math.round((value - previous) / previous * 100) : null
  const positive = change !== null && change >= 0

  return (
    <div className={`dashboard-metric dashboard-metric-${metric.tone}`}>
      <span className="dashboard-metric-icon"><Icon name={metric.icon} size={30} /></span>
      <div className="dashboard-metric-copy"><strong>{formatCount(value)}</strong><span>{metric.label}</span>{change !== null && <small><b className={positive ? 'is-up' : 'is-down'}>{positive ? '↑' : '↓'} {Math.abs(change)}%</b><span>vs last month</span></small>}</div>
    </div>
  )
}

export function DashboardMetrics({ previousSummary, summary }) {
  return <section aria-label="Project summary" className="dashboard-metrics">{metrics.map((metric) => <MetricCard key={metric.key} metric={metric} previous={previousSummary?.[metric.key]} value={summary[metric.key]} />)}</section>
}
