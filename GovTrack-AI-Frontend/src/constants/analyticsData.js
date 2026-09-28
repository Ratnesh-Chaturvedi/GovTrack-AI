import { stateList } from 'vardhan-maps/data'

const TOTAL_PROJECTS = 1432
const TOTAL_COST_LAKH_CRORE = 22.6
const MAHARASHTRA_PROJECTS = 186

const stateWeights = {
  'Andhra Pradesh': 65, Assam: 35, Bihar: 60, Chhattisgarh: 38,
  Gujarat: 95, Haryana: 44, Karnataka: 90, Kerala: 55,
  'Madhya Pradesh': 70, Odisha: 55, Punjab: 43, Rajasthan: 80,
  'Tamil Nadu': 85, Telangana: 60, 'Uttar Pradesh': 140,
  'West Bengal': 63,
}

export const stateNames = stateList.map(({ name }) => name)

function nameSeed(name) {
  return [...name].reduce((total, character) => total + character.charCodeAt(0), 0)
}

function allocate(total, entries) {
  const weightSum = entries.reduce((sum, entry) => sum + entry.weight, 0)
  const allocated = entries.map((entry) => {
    const exact = total * entry.weight / weightSum
    return { ...entry, value: Math.floor(exact), remainder: exact % 1 }
  })
  let left = total - allocated.reduce((sum, entry) => sum + entry.value, 0)
  allocated.sort((a, b) => b.remainder - a.remainder)
  for (const entry of allocated) {
    if (left === 0) break
    entry.value += 1
    left -= 1
  }
  return Object.fromEntries(allocated.map(({ name, value }) => [name, value]))
}

const otherStates = stateNames.filter((name) => name !== 'Maharashtra')
const allocatedCounts = allocate(
  TOTAL_PROJECTS - MAHARASHTRA_PROJECTS,
  otherStates.map((name) => ({ name, weight: stateWeights[name] ?? (name.includes('Islands') || name === 'Lakshadweep' ? 4 : 16) })),
)
allocatedCounts.Maharashtra = MAHARASHTRA_PROJECTS

const sectorNames = ['Transport', 'Energy', 'Water Resources', 'Urban Infra', 'Social Infrastructure']
const sectorWeights = [34, 22, 18, 14, 12]

function createSectors(projects, seed) {
  const entries = sectorNames.map((name, index) => ({
    name,
    weight: sectorWeights[index] + (seed % (index + 5)) - 2,
  }))
  const counts = allocate(projects, entries)
  return sectorNames.map((name) => ({ name, projects: counts[name], percentage: Math.round(counts[name] / projects * 100) }))
}

export const stateResults = Object.fromEntries(stateNames.map((name) => {
  const seed = nameSeed(name)
  const projects = allocatedCounts[name]
  const atRisk = Math.max(1, Math.round(projects * (0.14 + seed % 6 * 0.007)))
  const delayed = Math.max(0, Math.round(projects * (0.05 + seed % 5 * 0.006)))
  const onTrack = projects - atRisk - delayed

  return [name, {
    name,
    projects,
    onTrack,
    atRisk,
    delayed,
    alerts: Math.max(1, Math.round(atRisk * 0.22)),
    avgDelayMonths: (7.2 + seed % 39 / 10).toFixed(1),
    costLakhCrore: TOTAL_COST_LAKH_CRORE * projects / TOTAL_PROJECTS,
    costChange: 8 + seed % 12,
    sectors: createSectors(projects, seed),
  }]
}))

const sum = (field) => Object.values(stateResults).reduce((total, result) => total + result[field], 0)
const nationalSectorCounts = Object.fromEntries(sectorNames.map((name) => [
  name,
  Object.values(stateResults).reduce((total, result) => total + result.sectors.find((sector) => sector.name === name).projects, 0),
]))

export const nationalResult = {
  name: 'All India',
  projects: TOTAL_PROJECTS,
  onTrack: sum('onTrack'),
  atRisk: sum('atRisk'),
  delayed: sum('delayed'),
  alerts: sum('alerts'),
  avgDelayMonths: '9.4',
  costLakhCrore: TOTAL_COST_LAKH_CRORE,
  costChange: 12,
  sectors: sectorNames.map((name) => ({
    name,
    projects: nationalSectorCounts[name],
    percentage: Math.round(nationalSectorCounts[name] / TOTAL_PROJECTS * 100),
  })),
}

export function getCoverageResult(stateName) {
  return stateResults[stateName] ?? nationalResult
}

export function formatProjectCount(value) {
  return new Intl.NumberFormat('en-IN').format(value)
}

export function formatCost(value) {
  return '₹' + value.toFixed(value < 1 ? 2 : 1) + ' Lakh Cr'
}
