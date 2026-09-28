const paths = {
  arrowRight: <><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></>,
  chevron: <path d="m6 9 6 6 6-6" />,
  close: <><path d="M5 5 19 19" /><path d="M19 5 5 19" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  play: <path d="m9 6 9 6-9 6z" fill="currentColor" stroke="none" />,
  sparkles: <><path d="m12 2 1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5z" fill="currentColor" stroke="none" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z" fill="currentColor" stroke="none" /></>,
  government: <><path d="m3 9 9-5 9 5M4 10h16M5 20h14M7 11v8M11 11v8M15 11v8M19 11v8" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
  pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
  sectors: <><circle cx="6" cy="12" r="2" fill="currentColor" stroke="none" /><circle cx="17" cy="6" r="2" fill="currentColor" stroke="none" /><circle cx="18" cy="18" r="2" fill="currentColor" stroke="none" /><path d="m8 11 7-4M8 13l8 4" /></>,
  coins: <><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v5c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 11v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" /></>,
  chart: <><path d="M5 20v-5M10 20V9M15 20v-7M20 20V4" strokeWidth="3" /></>,
  trend: <><path d="m3 18 6-6 4 3 7-8" /><path d="M16 7h4v4" /></>,
  more: <><circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" /></>,
  check: <path d="m4 12 5 5L20 6" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  shieldCheck: <><path d="m12 2 8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 9h18c0-1-3-2-3-9ZM10 21h4" /></>,
  database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" /></>,
  chip: <><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4M10 10h4v4h-4z" /></>,
  fileAlert: <><path d="M6 2h8l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM14 2v5h5" /><path d="M11 11v5M11 19h.01" /></>,
  dashboard: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M3 9h18M9 9v12M13 14h5M13 17h3" /></>,
  truck: <><path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
  bolt: <path d="m13 2-9 11h7l-1 9 10-12h-7z" />,
  drop: <path d="M12 2c-2 4-7 8.8-7 13a7 7 0 0 0 14 0c0-4.2-5-9-7-13z" />,
  signal: <><path d="M12 19V9M8 19h8M9 13l3-4 3 4M5 10a10 10 0 0 1 0 8M19 10a10 10 0 0 1 0 8M2 6a15 15 0 0 0 0 12M22 6a15 15 0 0 1 0 12" /></>,
}

export function Icon({ name, size = 20, className = '' }) {
  return <svg aria-hidden="true" className={className} fill="none" height={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" viewBox="0 0 24 24" width={size}>{paths[name]}</svg>
}
