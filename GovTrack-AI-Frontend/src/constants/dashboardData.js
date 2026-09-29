import { stateNames } from './analyticsData.js'

export const dashboardMonths = [
  { id: '2026-04', label: 'April 2026 (Latest)', offset: 0 },
  { id: '2026-03', label: 'March 2026', offset: 1 },
  { id: '2026-02', label: 'February 2026', offset: 2 },
]

export const dashboardSectors = [
  { name: 'Transport & Logistics', shortName: 'Transport', count: 694, color: '#3485f7', icon: 'train' },
  { name: 'Energy', shortName: 'Energy', count: 297, color: '#ffad2d', icon: 'bolt' },
  { name: 'Water & Sanitation', shortName: 'Water & Sanitation', count: 218, color: '#78acc7', icon: 'drop' },
  { name: 'Communication', shortName: 'Communication', count: 198, color: '#56c99b', icon: 'signal' },
  { name: 'Social Infrastructure', shortName: 'Social Infrastructure', count: 178, color: '#a774ee', icon: 'government' },
  { name: 'Other', shortName: 'Other', count: 396, color: '#b5bfd5', icon: 'layers' },
]

const statusCounts = { onTrack: 1462, atRisk: 389, delayed: 130 }

const ministryBySector = {
  'Transport & Logistics': 'Ministry of Road Transport',
  Energy: 'Ministry of Power',
  'Water & Sanitation': 'Ministry of Jal Shakti',
  Communication: 'Ministry of Communications',
  'Social Infrastructure': 'Ministry of Health',
  Other: 'Ministry of Housing & Urban Affairs',
}

const namesBySector = {
  'Transport & Logistics': ['Regional Rail Corridor', 'National Highway Upgrade', 'Metro Network Expansion', 'Freight Corridor Link', 'Port Connectivity Road'],
  Energy: ['Solar Park Development', 'Grid Modernisation', 'Renewable Energy Zone', 'Power Transmission Upgrade'],
  'Water & Sanitation': ['Rural Water Supply Mission', 'Urban Sewage Treatment', 'River Rejuvenation Programme', 'Water Network Expansion'],
  Communication: ['BharatNet Rural Connectivity', '4G Coverage Expansion', 'Digital Village Network', 'Telecom Infrastructure Upgrade'],
  'Social Infrastructure': ['District Hospital Expansion', 'Public School Infrastructure', 'Community Health Facility', 'Medical College Upgrade'],
  Other: ['Smart City Infrastructure', 'Urban Housing Development', 'Irrigation Network Upgrade', 'Public Service Complex'],
}

const featuredProjects = [
  { name: 'Delhi Metro Phase IV', detail: '65.1 km new corridors', sector: 'Transport & Logistics', state: 'Delhi', ministry: 'Ministry of Housing & Urban Affairs', originalCost: 65000, revisedCost: 69500, progress: 84, status: 'onTrack', completion: '2026-12-01' },
  { name: 'Saturation 4G Mobile Coverage to Uncovered Villages', sector: 'Communication', state: 'Uttar Pradesh', ministry: 'Ministry of Communications', originalCost: 26316, revisedCost: 30620, progress: 68, status: 'atRisk', completion: '2027-03-01' },
  { name: 'Jal Jeevan Mission – Rural Water Supply', sector: 'Water & Sanitation', state: 'Madhya Pradesh', ministry: 'Ministry of Jal Shakti', originalCost: 8920, revisedCost: 9450, progress: 52, status: 'delayed', completion: '2027-06-01' },
  { name: 'Bharatmala Expressway Phase II', sector: 'Transport & Logistics', state: 'Maharashtra', ministry: 'Ministry of Road Transport', originalCost: 12430, revisedCost: 15200, progress: 76, status: 'atRisk', completion: '2026-12-01' },
  { name: 'Solar Power Generation Expansion', sector: 'Energy', state: 'Rajasthan', ministry: 'Ministry of Power', originalCost: 9840, revisedCost: 11200, progress: 71, status: 'onTrack', completion: '2027-03-01' },
  { name: 'Urban Sewage Treatment Infrastructure', sector: 'Water & Sanitation', state: 'Gujarat', ministry: 'Ministry of Jal Shakti', originalCost: 6210, revisedCost: 7890, progress: 39, status: 'delayed', completion: '2027-09-01' },
  { name: 'National Highway Widening (NH–48)', sector: 'Transport & Logistics', state: 'Karnataka', ministry: 'Ministry of Road Transport', originalCost: 14500, revisedCost: 16800, progress: 67, status: 'atRisk', completion: '2028-01-01' },
  { name: 'Rural Broadband Connectivity', sector: 'Communication', state: 'Bihar', ministry: 'Ministry of Communications', originalCost: 5630, revisedCost: 6200, progress: 58, status: 'atRisk', completion: '2027-04-01' },
]

function shuffle(values, seed) {
  const result = [...values]
  let current = seed
  for (let index = result.length - 1; index > 0; index -= 1) {
    current = (current * 1664525 + 1013904223) >>> 0
    const swapIndex = current % (index + 1)
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

function remainingPool(targets, field) {
  return Object.entries(targets).flatMap(([name, count]) => Array(count - featuredProjects.filter((project) => project[field] === name).length).fill(name))
}

const statuses = shuffle(remainingPool(statusCounts, 'status'), 42)
const sectors = shuffle(remainingPool(Object.fromEntries(dashboardSectors.map((sector) => [sector.name, sector.count])), 'sector'), 99)

const generatedProjects = statuses.map((status, index) => {
  const sector = sectors[index]
  const state = stateNames[(index * 17 + 5) % stateNames.length]
  const templates = namesBySector[sector]
  const name = `${templates[index % templates.length]} – ${state} Package ${index + 1}`
  const originalCost = 1800 + (index * 137) % 28500
  const revisedCost = Math.round(originalCost * (1.04 + (index % 16) / 100))
  const progressBase = status === 'onTrack' ? 57 : status === 'atRisk' ? 39 : 23
  const progress = Math.min(96, progressBase + (index * 7) % 31)
  const year = 2026 + Math.floor((index % 42) / 12)
  const month = index % 12 + 1

  return {
    id: `GT-${String(index + 9).padStart(5, '0')}`,
    name,
    sector,
    state,
    ministry: ministryBySector[sector],
    originalCost,
    revisedCost,
    progress,
    status,
    completion: `${year}-${String(month).padStart(2, '0')}-01`,
  }
})

export const dashboardProjects = [
  ...featuredProjects.map((project, index) => ({ ...project, id: `GT-${String(index + 1).padStart(5, '0')}` })),
  ...generatedProjects,
]

export const dashboardRiskFactors = [
  { name: 'Land Acquisition Delays', percent: 32, icon: 'fileAlert', color: '#ff4b4b' },
  { name: 'Funding Constraints', percent: 24, icon: 'coins', color: '#ff7830' },
  { name: 'Regulatory Approvals', percent: 18, icon: 'fileAlert', color: '#ff9b1b' },
  { name: 'Environmental Clearances', percent: 14, icon: 'shieldCheck', color: '#25bb83' },
  { name: 'Contractor Performance', percent: 12, icon: 'government', color: '#ffbd28' },
]

export const dashboardAlerts = [
  { id: 'alert-1', title: 'Delay risk detected', project: 'Mumbai–Ahmedabad Bullet Train', time: '2 hours ago', tone: 'red', icon: 'fileAlert' },
  { id: 'alert-2', title: 'Cost overrun likely', project: 'Eastern Freight Corridor', time: '5 hours ago', tone: 'orange', icon: 'bell' },
  { id: 'alert-3', title: 'Progress update available', project: 'Delhi Metro Phase IV', time: '1 day ago', tone: 'blue', icon: 'check' },
]

export function getDashboardSnapshot(monthId) {
  const offset = dashboardMonths.find((month) => month.id === monthId)?.offset ?? 0
  if (offset === 0) return dashboardProjects

  return dashboardProjects.slice(0, dashboardProjects.length - offset * 160).map((project, index) => {
    let status = project.status
    if (status === 'onTrack' && index % 23 < offset * 2) status = 'atRisk'
    else if (status === 'atRisk' && index % 29 < offset * 2) status = 'delayed'
    return { ...project, status, progress: Math.max(0, project.progress - offset * (2 + index % 3)) }
  })
}
