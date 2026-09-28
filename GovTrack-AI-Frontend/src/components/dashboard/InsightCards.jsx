import { Icon } from '../common/Icon'

function CardTitle({ children }) {
  return <div className="card-title"><strong>{children}</strong><Icon name="more" size={17} /></div>
}

function HealthCard() {
  return (
    <div className="insight-card health-card">
      <CardTitle>Project Health</CardTitle>
      <div className="health-body">
        <div className="gauge"><div className="gauge-center"><strong>76%</strong><span>On Track</span></div></div>
        <div className="health-legend">
          <div><i className="dot green-dot" />On Track <strong>342</strong></div>
          <div><i className="dot orange-dot" />At Risk <strong>96</strong></div>
          <div><i className="dot red-dot" />Delayed <strong>54</strong></div>
        </div>
      </div>
    </div>
  )
}

function ProjectsCard() {
  return (
    <div className="insight-card projects-card">
      <CardTitle>Total Infrastructure Projects</CardTitle>
      <div className="projects-body">
        <strong>1,432</strong>
        <div className="growth"><span>↑ 12%</span><small>vs. last quarter</small></div>
        <svg aria-hidden="true" className="mini-bars" viewBox="0 0 70 46"><path d="M5 33v9M14 26v16M23 30v12M32 18v24M41 23v19M50 8v34M59 14v28M68 3v39" stroke="#c9e2ff" strokeWidth="6" /></svg>
      </div>
    </div>
  )
}

function DelayCard() {
  return (
    <div className="insight-card delay-card">
      <div className="card-title"><span className="delay-title"><Icon name="trend" size={19} /> Delay Risk <small>(AI Prediction)</small></span><Icon name="more" size={17} /></div>
      <div className="delay-body"><div><strong>18%</strong><span>Medium Risk</span></div><svg aria-label="Delay risk trend" role="img" viewBox="0 0 128 50"><path d="M1 39c13 0 16-7 25-8 10 0 10-20 20-19 8 1 8 23 18 18 7-3 12-5 19-10 7-5 12 1 18-4 7-6 17 5 26-3" fill="none" stroke="#ff7b1a" strokeLinecap="round" strokeWidth="2" /></svg></div>
    </div>
  )
}

function SectorCard({ sectors }) {
  return (
    <div className="insight-card sector-card" id="sectors">
      <CardTitle>Projects by Sector</CardTitle>
      <div className="sector-body">
        <div className="donut"><div><strong>1,432</strong><span>Projects</span></div></div>
        <div className="sector-legend">{sectors.map((sector) => <div key={sector.label}><i className="dot" style={{ backgroundColor: sector.color }} /><span>{sector.label}</span><strong>{sector.value}%</strong></div>)}</div>
      </div>
    </div>
  )
}

function TrendCard() {
  return (
    <div className="insight-card trend-card">
      <CardTitle>Project Trend</CardTitle>
      <div className="chart-key"><span><i className="line-blue" />Original Cost</span><span><i className="line-orange" />Revised Cost</span></div>
      <div className="trend-body">
        <div className="chart-y"><span>₹ Lakhs Cr</span><span>3.0</span><span>2.0</span><span>1.0</span><span>0</span></div>
        <svg aria-label="Original and revised cost increased from 2021 to 2025" className="trend-plot" preserveAspectRatio="none" role="img" viewBox="0 0 300 100">
          <path d="M0 78H300M0 53H300M0 28H300" stroke="#e8edf7" strokeDasharray="4 5" />
          <path d="M0 78 18 72 36 67 53 69 70 60 87 62 104 56 122 59 140 50 157 52 175 44 191 46 209 38 227 35 245 27 263 29 281 21 300 17" fill="none" stroke="#2776ff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d="M0 86 18 83 36 79 53 77 70 73 87 70 104 72 122 67 140 64 157 65 175 59 191 59 209 54 227 50 245 43 263 42 281 35 300 31" fill="none" stroke="#ff842d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <circle cx="300" cy="31" fill="#ff842d" r="4" />
        </svg>
        <div className="variation"><strong>+18%</strong><span>Cost Variation</span></div>
      </div>
      <div className="chart-years"><span>2021</span><span>2022</span><span>2023</span><span>2024</span><span>2025</span></div>
    </div>
  )
}

export function InsightCards({ sectors }) {
  return <div aria-label="Example analytics dashboard" className="insights" id="dashboard-preview"><HealthCard /><ProjectsCard /><DelayCard /><SectorCard sectors={sectors} /><TrendCard /></div>
}
