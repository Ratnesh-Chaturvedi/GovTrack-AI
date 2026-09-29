export const assistantFeatures = [
  { icon: 'chat', tone: 'orange', title: 'Natural Language Queries', detail: 'Ask in simple English or Hinglish' },
  { icon: 'fileAlert', tone: 'blue', title: 'Grounded Responses', detail: 'Answers from project records' },
  { icon: 'chart', tone: 'green', title: 'Citations & Sources', detail: 'View the sample data source' },
  { icon: 'bolt', tone: 'purple', title: 'Project Insights', detail: 'Status, cost, timeline and more' },
]

export const assistantSuggestions = [
  'Show project route map',
  'Compare with Phase III',
  'What are the key delays?',
  'Show monthly progress',
]

export const demoConversations = [
  {
    id: 'delhi-metro',
    title: 'Status of Delhi Metro Phase IV',
    time: '2 min ago',
    messages: [
      { role: 'user', text: 'What is the current status of Delhi Metro Phase IV?' },
      {
        role: 'assistant',
        text: "Here's the latest sample information on Delhi Metro Phase IV based on government-style project reporting data:",
        project: {
          name: 'Delhi Metro Phase IV',
          location: 'Delhi',
          sector: 'Transport & Logistics Sector',
          totalCost: '₹65,000 Cr',
          revisedCost: '₹69,500 Cr',
          expenditure: '₹28,430 Cr (41%)',
          originalCompletion: 'Dec 2025',
          revisedCompletion: 'Dec 2026',
          status: 'On Track (84% progress)',
          summary: 'This sample project covers 65.1 km of new corridors across Delhi, with 84% of physical work shown as completed in the demo dataset.',
          source: 'Sample monthly progress report · April 2026',
        },
      },
    ],
  },
  {
    id: 'uttar-pradesh',
    title: 'Projects in Uttar Pradesh',
    time: '15 min ago',
    messages: [
      { role: 'user', text: 'How many infrastructure projects are in Uttar Pradesh?' },
      { role: 'assistant', text: 'The demo dataset shows 186 monitored infrastructure projects in Uttar Pradesh. Transport, energy and water account for the largest groups. Select a sector to narrow the results.' },
    ],
  },
  {
    id: 'delayed-projects',
    title: 'Show delayed projects',
    time: '1 hour ago',
    messages: [
      { role: 'user', text: 'Show delayed projects' },
      { role: 'assistant', text: 'In this sample view, 54 projects are marked delayed. The most common signals are slower physical progress, revised completion dates and gaps between expenditure and progress.' },
    ],
  },
  {
    id: 'maharashtra-roads',
    title: 'Compare road projects in Maharashtra',
    time: '3 hours ago',
    messages: [
      { role: 'user', text: 'Compare road projects in Maharashtra' },
      { role: 'assistant', text: 'The sample comparison places the Mumbai Coastal Road and Nagpur–Mumbai Expressway side by side on cost, schedule and progress. Both are shown here with illustrative figures only.' },
    ],
  },
  {
    id: 'railway-cost',
    title: 'Total cost of railway projects',
    time: '5 hours ago',
    messages: [
      { role: 'user', text: 'What is the total cost of railway projects?' },
      { role: 'assistant', text: 'The railway portfolio in this demo has a combined original project cost of ₹2.8 Lakh Cr. Revised estimates and spending are available per project in the full data view.' },
    ],
  },
]

export function createDemoReply(question, hasAttachment = false) {
  if (hasAttachment) return 'Your file is attached to this preview conversation. File analysis will be available when the assistant is connected to project records.'

  const query = question.toLowerCase()
  if (query.includes('delay')) return 'This demo highlights schedule changes, progress slowdowns and revised completion dates. Open a project record for a detailed delay breakdown.'
  if (query.includes('cost') || query.includes('budget')) return 'The sample records compare original cost, revised cost and expenditure to surface possible cost escalation. Figures shown here are illustrative.'
  if (query.includes('compare')) return 'A full comparison would place projects side by side on cost, progress, schedule and risk. This preview uses illustrative project data.'
  return 'I can help explore project status, sectors, states, costs and delays. This is a preview response using demo data; live project answers will appear when the data service is connected.'
}
