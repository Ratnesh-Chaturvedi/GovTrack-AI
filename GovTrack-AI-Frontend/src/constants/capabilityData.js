export const capabilities = [
  {
    id: 'cost',
    title: 'Cost Overrun Prediction',
    description: 'Forecast likely cost escalations before they materialize.',
    detail: 'Compare project spending and progress trends to spot rising cost pressure early.',
    icon: 'coins',
    tone: 'orange',
  },
  {
    id: 'delay',
    title: 'Time Delay Prediction',
    description: 'Identify projects at risk of schedule slippage early.',
    detail: 'Review delivery pace and revised milestones to focus attention where delays may grow.',
    icon: 'clock',
    tone: 'blue',
  },
  {
    id: 'risk',
    title: 'Project Risk Scoring',
    description: 'Generate unified risk scores using multiple project parameters.',
    detail: 'Bring cost and schedule signals together in one explainable project-level view.',
    icon: 'shieldCheck',
    tone: 'green',
  },
  {
    id: 'alerts',
    title: 'Early Warning Alerts',
    description: 'Surface emerging implementation issues for timely intervention.',
    detail: 'Highlight unusual changes so teams can investigate and act before issues escalate.',
    icon: 'bell',
    tone: 'purple',
  },
]

export const workflowSteps = [
  { number: '01', title: 'Data Ingestion', description: 'Monthly project data from PAIMANA, OCMS and related sources', icon: 'database', tone: 'orange' },
  { number: '02', title: 'AI / ML Models', description: 'Prediction models for cost, delay and implementation risks', icon: 'chip', tone: 'blue' },
  { number: '03', title: 'Risk & Alerts', description: 'Project-level scoring, early warnings and anomaly detection', icon: 'fileAlert', tone: 'green' },
  { number: '04', title: 'Decision Support', description: 'Dashboards, recommendations and monitoring insights for policymakers', icon: 'dashboard', tone: 'purple' },
]
