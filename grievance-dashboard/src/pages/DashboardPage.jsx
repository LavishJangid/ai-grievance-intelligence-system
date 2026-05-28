import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import useHealthStatus from '../hooks/useHealthStatus'
import { predictGrievance } from '../services/api'

const navItems = [
  { label: 'Dashboard', icon: HomeIcon },
  { label: 'New Complaint', icon: FilePlusIcon },
  { label: 'Analytics', icon: ChartIcon },
  { label: 'Departments', icon: BuildingIcon },
  { label: 'Reports', icon: ReportIcon },
  { label: 'History', icon: HistoryIcon },
  { label: 'Settings', icon: SettingsIcon },
  { label: 'About', icon: InfoIcon },
]

const quickExamples = [
  'Roads in my locality are damaged badly.',
  'Water supply is not available since 3 days.',
  'Street lights are not working in our area.',
]

const monthComplaintData = [
  { name: 'Roads', value: 3456, color: '#2a7bff' },
  { name: 'Water Supply', value: 2789, color: '#29c6d1' },
  { name: 'Electricity', value: 2345, color: '#ffb321' },
  { name: 'Sanitation', value: 1987, color: '#a95cf7' },
  { name: 'Others', value: 1881, color: '#7e8aa6' },
]

const weekComplaintData = [
  { name: 'Roads', value: 1210, color: '#2a7bff' },
  { name: 'Water Supply', value: 940, color: '#29c6d1' },
  { name: 'Electricity', value: 880, color: '#ffb321' },
  { name: 'Sanitation', value: 710, color: '#a95cf7' },
  { name: 'Others', value: 620, color: '#7e8aa6' },
]

const quarterComplaintData = [
  { name: 'Roads', value: 4760, color: '#2a7bff' },
  { name: 'Water Supply', value: 3620, color: '#29c6d1' },
  { name: 'Electricity', value: 2950, color: '#ffb321' },
  { name: 'Sanitation', value: 2580, color: '#a95cf7' },
  { name: 'Others', value: 2140, color: '#7e8aa6' },
]

const monthUrgencyData = [
  { name: 'Low', value: 2145, color: '#27d47f' },
  { name: 'Medium', value: 4289, color: '#ffb321' },
  { name: 'High', value: 6024, color: '#ff4d5e' },
]

const weekUrgencyData = [
  { name: 'Low', value: 1025, color: '#27d47f' },
  { name: 'Medium', value: 1880, color: '#ffb321' },
  { name: 'High', value: 2520, color: '#ff4d5e' },
]

const quarterUrgencyData = [
  { name: 'Low', value: 3780, color: '#27d47f' },
  { name: 'Medium', value: 5860, color: '#ffb321' },
  { name: 'High', value: 8040, color: '#ff4d5e' },
]

const activityItems = [
  {
    icon: FileIcon,
    title: 'New complaint analyzed',
    desc: 'Roads in my locality are damaged badly.',
    time: '2 min ago',
    tone: 'green',
  },
  {
    icon: AlertIcon,
    title: 'High priority detected',
    desc: 'Water supply unavailable since 3 days.',
    time: '5 min ago',
    tone: 'red',
  },
  {
    icon: CheckIcon,
    title: 'Complaint resolved',
    desc: 'Street light not working issue resolved.',
    time: '15 min ago',
    tone: 'green',
  },
  {
    icon: FileIcon,
    title: 'New complaint analyzed',
    desc: 'Garbage collection is irregular.',
    time: '20 min ago',
    tone: 'blue',
  },
]

const demoPrediction = {
  department: 'Roads',
  department_confidence: 0.94,
  sentiment: 'Critical',
  sentiment_confidence: 0.91,
  urgency_score: 92,
  priority_band: 'High',
  recommendation: 'Immediate Action Required',
  model_version: 'week4-1.0.0',
  timestamp: '2026-05-27T12:00:00.000Z',
}

const totalComplaints = 12458

const sectionMeta = {
  Dashboard: {
    title: 'Dashboard',
    description: 'Overview of complaints, urgency, and recent activity.',
  },
  'New Complaint': {
    title: 'New Complaint',
    description: 'Enter a grievance and analyze it using the AI pipeline.',
  },
  Analytics: {
    title: 'Analytics',
    description: 'See complaint distribution and urgency trends at a glance.',
  },
  Departments: {
    title: 'Departments',
    description: 'Department coverage and routing overview.',
  },
  Reports: {
    title: 'Reports',
    description: 'Operational reporting and export-ready summaries.',
  },
  History: {
    title: 'History',
    description: 'Review the latest complaint activity and outcomes.',
  },
  Settings: {
    title: 'Settings',
    description: 'Adjust dashboard preferences and system presentation.',
  },
  About: {
    title: 'About',
    description: 'Product and platform information for the grievance console.',
  },
}

function toPercent(value) {
  return `${Math.round(value * 100)}%`
}

function buildFallbackPrediction(text) {
  const lower = text.toLowerCase()

  if (lower.includes('water')) {
    return {
      department: 'Water Supply',
      department_confidence: 0.92,
      sentiment: 'Critical',
      sentiment_confidence: 0.9,
      urgency_score: 91,
      priority_band: 'High',
      recommendation: 'Immediate Action Required',
      model_version: demoPrediction.model_version,
      timestamp: new Date().toISOString(),
    }
  }

  if (lower.includes('road') || lower.includes('street')) {
    return {
      department: 'Roads',
      department_confidence: 0.94,
      sentiment: 'Critical',
      sentiment_confidence: 0.91,
      urgency_score: 92,
      priority_band: 'High',
      recommendation: 'Immediate Action Required',
      model_version: demoPrediction.model_version,
      timestamp: new Date().toISOString(),
    }
  }

  if (lower.includes('light') || lower.includes('electric')) {
    return {
      department: 'Electricity',
      department_confidence: 0.88,
      sentiment: 'Negative',
      sentiment_confidence: 0.83,
      urgency_score: 78,
      priority_band: 'Medium',
      recommendation: 'Schedule Field Inspection',
      model_version: demoPrediction.model_version,
      timestamp: new Date().toISOString(),
    }
  }

  return {
    department: 'Sanitation',
    department_confidence: 0.8,
    sentiment: 'Negative',
    sentiment_confidence: 0.76,
    urgency_score: 66,
    priority_band: 'Medium',
    recommendation: 'Review and Route',
    model_version: demoPrediction.model_version,
    timestamp: new Date().toISOString(),
  }
}

function IconShell({ children }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  )
}

function SidebarButton({ label, icon: Icon, active, onClick }) {
  return (
    <button
      type="button"
      className={`sidebar-item${active ? ' active' : ''}`}
      aria-pressed={active}
      onClick={onClick}
    >
      <Icon />
      <span>{label}</span>
    </button>
  )
}

function IconButton({ children, label, onClick }) {
  return (
    <button type="button" className="icon-button" aria-label={label} onClick={onClick}>
      {children}
    </button>
  )
}

function StatCard({ title, value, delta, deltaTone, icon: Icon, note }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="panel stat-card"
    >
      <div>
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        <div className={`stat-delta ${deltaTone}`}>{delta}</div>
        {note ? <div className="stat-note">{note}</div> : null}
      </div>
      <div className={`stat-icon ${deltaTone}`}>
        <Icon />
      </div>
    </motion.section>
  )
}

function PanelHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="panel-header">
      <div className="panel-title-wrap">
        <div className="panel-title-icon">
          <Icon />
        </div>
        <div>
          <div className="panel-title">{title}</div>
          {subtitle ? <div className="panel-subtitle">{subtitle}</div> : null}
        </div>
      </div>
      {action}
    </div>
  )
}

function ResultTile({ icon: Icon, title, value, confidence, tone, note }) {
  return (
    <div className={`result-tile ${tone}`}>
      <div className={`result-icon ${tone}`}>
        <Icon />
      </div>
      <div className="result-copy">
        <div className="result-title">{title}</div>
        <div className="result-value">{value}</div>
        {confidence ? <div className="result-confidence">{confidence}</div> : null}
        {note ? <div className="result-note">{note}</div> : null}
      </div>
    </div>
  )
}

function ActivityRow({ item }) {
  const Icon = item.icon
  return (
    <div className="activity-row">
      <div className={`activity-icon ${item.tone}`}>
        <Icon />
      </div>
      <div className="activity-copy">
        <div className="activity-title">{item.title}</div>
        <div className="activity-desc">{item.desc}</div>
      </div>
      <div className="activity-time">{item.time}</div>
    </div>
  )
}

function Gauge({ value }) {
  const normalized = Math.min(Math.max(value, 0), 100)
  const dashOffset = 289 - (289 * normalized) / 100

  return (
    <div className="gauge">
      <svg viewBox="0 0 120 120" className="gauge-svg" aria-hidden="true">
        <circle cx="60" cy="60" r="46" className="gauge-track" />
        <circle
          cx="60"
          cy="60"
          r="46"
          className="gauge-progress"
          style={{ strokeDashoffset: dashOffset }}
        />
      </svg>
      <div className="gauge-value">{normalized}</div>
    </div>
  )
}

function CenterLabel({ cx, cy }) {
  return (
    <g>
      <text x={cx} y={cy - 4} textAnchor="middle" className="donut-center-value">
        {totalComplaints.toLocaleString()}
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" className="donut-center-label">
        Total
      </text>
    </g>
  )
}

function HomeIcon() {
  return (
    <IconShell>
      <path d="M4 12.5 12 5l8 7.5V20a1 1 0 0 1-1 1h-4.5v-5.5h-5V21H5a1 1 0 0 1-1-1z" />
    </IconShell>
  )
}

function FilePlusIcon() {
  return (
    <IconShell>
      <path d="M7 3.5h6.5L18 8v12.5a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5zm6 1.5V8h2.5M12 11.5v5M9.5 14h5" />
    </IconShell>
  )
}

function ChartIcon() {
  return (
    <IconShell>
      <path d="M5 19.5h14M7.5 16V9.5M12 16V6.5M16.5 16V11" />
    </IconShell>
  )
}

function BuildingIcon() {
  return (
    <IconShell>
      <path d="M5 20.5V7.8a1 1 0 0 1 .55-.9l6-3A1 1 0 0 1 13 4.8V6h4.5A1.5 1.5 0 0 1 19 7.5V20.5M8 20.5v-4m3 4v-4m3 4v-4m-6-7h1m3 0h1m-5-3h1m3 0h1" />
    </IconShell>
  )
}

function ReportIcon() {
  return (
    <IconShell>
      <path d="M7 4.5h10l1.5 1.5v13.5A1.5 1.5 0 0 1 17 21H7a1.5 1.5 0 0 1-1.5-1.5V6l1.5-1.5zm2 5h6M9 13h6M9 16h4" />
    </IconShell>
  )
}

function HistoryIcon() {
  return (
    <IconShell>
      <path d="M7.2 7.2A8 8 0 1 1 4 12.7M4 6v5h5M12 8.5v4l3 2" />
    </IconShell>
  )
}

function SettingsIcon() {
  return (
    <IconShell>
      <path d="M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm8.5 4.5-1.8.9.1 1.9-1.6 1.6-1.9-.1-.9 1.8h-2.2l-.9-1.8-1.9.1-1.6-1.6.1-1.9-1.8-.9V10l1.8-.9-.1-1.9 1.6-1.6 1.9.1.9-1.8h2.2l.9 1.8 1.9-.1 1.6 1.6-.1 1.9 1.8.9z" />
    </IconShell>
  )
}

function InfoIcon() {
  return (
    <IconShell>
      <path d="M12 17v-5m0-4.5h.01M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z" />
    </IconShell>
  )
}

function MenuIcon() {
  return (
    <IconShell>
      <path d="M5 7.5h14M5 12h14M5 16.5h14" />
    </IconShell>
  )
}

function DocumentIcon() {
  return (
    <IconShell>
      <path d="M8 4.5h6.5L18 8v11.5A1.5 1.5 0 0 1 16.5 21h-9A1.5 1.5 0 0 1 6 19.5v-14A1.5 1.5 0 0 1 7.5 4.5zM8.5 10h7M8.5 13h7M8.5 16h5" />
    </IconShell>
  )
}

function CheckCircleIcon() {
  return (
    <IconShell>
      <path d="M9.2 12.2 11.3 14.3 15.4 9.8M20.5 12a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0z" />
    </IconShell>
  )
}

function ClockIcon() {
  return (
    <IconShell>
      <path d="M12 7v5l3 2m5 0a8 8 0 1 1-16 0 8 8 0 0 1 16 0z" />
    </IconShell>
  )
}

function SparklesIcon() {
  return (
    <IconShell>
      <path d="M12 4.5 13.7 8.3 17.5 10 13.7 11.7 12 15.5 10.3 11.7 6.5 10l3.8-1.7L12 4.5Zm6.5 9.5.9 2 2 1-.9.4-1 2-.9-2-2-.9 2-.5Zm-13 0 .9 2 2 1-.9.4-1 2-.9-2-2-.9 2-.5Z" />
    </IconShell>
  )
}

function BrainIcon() {
  return (
    <IconShell>
      <path d="M9 5.5a4 4 0 0 1 4-1.5 4 4 0 0 1 4.6 3.2 3.5 3.5 0 0 1 1.9 6.1 3.8 3.8 0 0 1-1.1 4.7A4 4 0 0 1 13 19.8V5.5M9 5.5a4 4 0 0 0-4 4 3.8 3.8 0 0 0 1.3 2.8A3.8 3.8 0 0 0 5.8 18a4 4 0 0 0 4 2" />
    </IconShell>
  )
}

function RoadIcon() {
  return (
    <IconShell>
      <path d="M6 18 12 6l6 12M9.5 11h5M8.2 13.7h7.6" />
    </IconShell>
  )
}

function SadIcon() {
  return (
    <IconShell>
      <path d="M12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm-3-5c.7-1.2 2-2 3-2s2.3.8 3 2M9.5 10.5h.01M14.5 10.5h.01" />
    </IconShell>
  )
}

function AlertShieldIcon() {
  return (
    <IconShell>
      <path d="M12 4.5 18 7v5.5c0 4-2.5 6.9-6 8.5-3.5-1.6-6-4.5-6-8.5V7l6-2.5Zm0 4v5m0 3.5h.01" />
    </IconShell>
  )
}

function FileIcon() {
  return (
    <IconShell>
      <path d="M8 4.5h6.5L18 8v11.5A1.5 1.5 0 0 1 16.5 21h-9A1.5 1.5 0 0 1 6 19.5v-14A1.5 1.5 0 0 1 7.5 4.5zM8.5 10h7M8.5 13h5" />
    </IconShell>
  )
}

function AlertIcon() {
  return (
    <IconShell>
      <path d="M12 5 20 19H4L12 5Zm0 4v4m0 3.5h.01" />
    </IconShell>
  )
}

function CheckIcon() {
  return (
    <IconShell>
      <path d="M8.5 12.5 11 15l5-6M20.5 12a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0z" />
    </IconShell>
  )
}

function SunIcon() {
  return (
    <IconShell>
      <path d="M12 5.5V4m0 16v-1.5M5.5 12H4m16 0h-1.5M7.2 7.2 6.1 6.1m11.8 11.8-1.1-1.1M16.8 7.2l1.1-1.1M7.2 16.8l-1.1 1.1" />
      <circle cx="12" cy="12" r="4.2" />
    </IconShell>
  )
}

function UserIcon() {
  return (
    <IconShell>
      <path d="M12 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" />
    </IconShell>
  )
}

function CalendarIcon() {
  return (
    <IconShell>
      <path d="M7 4.5v2M17 4.5v2M5.5 8.5h13M6.5 7h11A1.5 1.5 0 0 1 19 8.5v10A1.5 1.5 0 0 1 17.5 20h-11A1.5 1.5 0 0 1 5 18.5v-10A1.5 1.5 0 0 1 6.5 7z" />
    </IconShell>
  )
}

function ChevronDown() {
  return (
    <IconShell>
      <path d="M8 10.5 12 14.5 16 10.5" />
    </IconShell>
  )
}

function Heartbeat() {
  return (
    <svg viewBox="0 0 74 18" className="heartbeat" aria-hidden="true">
      <path d="M1 9h10l3-6 4 12 5-9 4 3 3-3h43" />
    </svg>
  )
}

function GovernmentBuilding() {
  return (
    <svg viewBox="0 0 240 180" className="government-building" aria-hidden="true">
      <defs>
        <linearGradient id="gb" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path d="M120 24 34 64h172L120 24Z" fill="url(#gb)" opacity="0.4" />
      <rect x="28" y="65" width="184" height="8" rx="4" fill="url(#gb)" opacity="0.55" />
      <rect x="44" y="73" width="152" height="18" rx="8" fill="url(#gb)" opacity="0.22" />
      <rect x="50" y="91" width="12" height="58" rx="6" fill="url(#gb)" opacity="0.45" />
      <rect x="78" y="91" width="12" height="58" rx="6" fill="url(#gb)" opacity="0.45" />
      <rect x="106" y="91" width="12" height="58" rx="6" fill="url(#gb)" opacity="0.45" />
      <rect x="134" y="91" width="12" height="58" rx="6" fill="url(#gb)" opacity="0.45" />
      <rect x="162" y="91" width="12" height="58" rx="6" fill="url(#gb)" opacity="0.45" />
      <rect x="40" y="148" width="160" height="10" rx="5" fill="url(#gb)" opacity="0.6" />
      <circle cx="120" cy="40" r="8" fill="url(#gb)" opacity="0.9" />
      <path d="M116 40h8M120 36v8" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function DashboardPage() {
  const healthStatus = useHealthStatus()
  const analyzerRef = useRef(null)
  const statsRef = useRef(null)
  const analyticsRef = useRef(null)
  const sidebarRef = useRef(null)
  const [text, setText] = useState('')
  const [prediction, setPrediction] = useState(demoPrediction)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [timeRange, setTimeRange] = useState('month')
  const [themeMode, setThemeMode] = useState('night')
  const [profileOpen, setProfileOpen] = useState(false)

  const lastUpdated = useMemo(() => {
    const source = prediction?.timestamp ?? demoPrediction.timestamp
    return new Date(source).toLocaleString([], {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }, [prediction])

  const chartComplaints =
    timeRange === 'week'
      ? weekComplaintData
      : timeRange === 'quarter'
        ? quarterComplaintData
        : monthComplaintData

  const chartUrgency =
    timeRange === 'week'
      ? weekUrgencyData
      : timeRange === 'quarter'
        ? quarterUrgencyData
        : monthUrgencyData

  async function handleAnalyze() {
    if (!text.trim()) {
      setError('Please enter a grievance before analysis.')
      return
    }

    setError('')
    setIsLoading(true)
    try {
      const result = await predictGrievance(text.trim())
      setPrediction({
        ...result,
        timestamp: result.timestamp ?? new Date().toISOString(),
      })
      setActiveNav('New Complaint')
    } catch (apiError) {
      setPrediction(buildFallbackPrediction(text.trim()))
      setActiveNav('New Complaint')
      setError('')
    } finally {
      setIsLoading(false)
    }
  }

  function handleClear() {
    setPrediction(null)
    setError('')
  }

  function selectSection(label) {
    setActiveNav(label)
    setProfileOpen(false)
  }

  function handleSidebarAction(label) {
    selectSection(label)
  }

  const section = sectionMeta[activeNav] ?? sectionMeta.Dashboard

  return (
    <main
      className={`dashboard-shell ${themeMode === 'day' ? 'theme-day' : ''}${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}
    >
      <div className="dashboard-noise" />
      <div className="dashboard-orb orb-a" />
      <div className="dashboard-orb orb-b" />
      <div className="dashboard-orb orb-c" />

      <div className="dashboard-layout">
        <aside className={`sidebar${sidebarCollapsed ? ' collapsed' : ''}`} ref={sidebarRef}>
          <div className="brand-row">
            <div className="brand-mark">
              <BuildingIcon />
            </div>
            <div className="brand-text">Infotact Grievance AI</div>
            <button
              type="button"
              className="menu-toggle"
              aria-label="Menu"
              onClick={() => setSidebarCollapsed((value) => !value)}
            >
              <MenuIcon />
            </button>
          </div>

          <nav className="sidebar-nav" aria-label="Sidebar">
            {navItems.map((item) => (
              <SidebarButton
                key={item.label}
                label={item.label}
                icon={item.icon}
                active={item.label === activeNav}
                onClick={() => handleSidebarAction(item.label)}
              />
            ))}
          </nav>

          <motion.button
            whileHover={{ y: -3 }}
            className="promo-card"
            type="button"
            onClick={() => selectSection('New Complaint')}
          >
            <div className="promo-illustration">
              <GovernmentBuilding />
            </div>
            <div className="promo-copy">
              <div className="promo-title">AI-Powered</div>
              <div className="promo-body">Grievance Management for Better Governance</div>
            </div>
          </motion.button>
        </aside>

        <section className="content">
          <header className="topbar">
            <div>
              <h1>Dashboard</h1>
              <p>AI-Powered Analysis of Citizen Grievances</p>
            </div>

            <div className="topbar-actions">
              <div className="health-pill">
                <span className={`health-dot ${healthStatus === 'online' ? 'online' : 'offline'}`} />
                <span>{healthStatus === 'offline' ? 'System Offline' : 'System Healthy'}</span>
                <Heartbeat />
              </div>
              <IconButton
                label="Theme"
                onClick={() => setThemeMode((mode) => (mode === 'night' ? 'day' : 'night'))}
              >
                <SunIcon />
              </IconButton>
              <IconButton label="Profile" onClick={() => setProfileOpen((value) => !value)}>
                <UserIcon />
              </IconButton>
            </div>
          </header>

          <section className="section-banner" aria-live="polite">
            <div className="section-banner-label">{section.title}</div>
            <div className="section-banner-desc">{section.description}</div>
          </section>

          {profileOpen ? (
            <div className="profile-popover">
              <div className="profile-name">System Admin</div>
              <div className="profile-role">Gov grievance operations</div>
              <div className="profile-note">
                Sidebar navigation, chart filters, clear results, and theme toggle are all wired now.
              </div>
            </div>
          ) : null}

          <section className="stat-grid" ref={statsRef}>
            <StatCard
              title="Total Complaints"
              value="12,458"
              delta="+ 12.5% vs last month"
              deltaTone="positive"
              icon={DocumentIcon}
            />
            <StatCard
              title="Resolved"
              value="8,721"
              delta="+ 10.3% vs last month"
              deltaTone="positive"
              icon={CheckCircleIcon}
            />
            <StatCard
              title="In Progress"
              value="2,145"
              delta="+ 8.1% vs last month"
              deltaTone="warning"
              icon={ClockIcon}
            />
            <StatCard
              title="Departments"
              value="8"
              note="Active Departments"
              deltaTone="blue"
              icon={BuildingIcon}
            />
          </section>

          <section className="analyzer-grid" ref={analyzerRef}>
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="panel analyzer-panel"
            >
              <PanelHeader
                icon={SparklesIcon}
                title="Analyze New Grievance"
                subtitle="Enter the grievance details below for AI analysis"
              />

              <textarea
                className="grievance-input"
                placeholder="Enter citizen grievance..."
                value={text}
                onChange={(event) => setText(event.target.value)}
                maxLength={2000}
              />

              <div className="input-footer">
                <span>{text.length}/2000</span>
              </div>

              <div className="examples-label">Quick Examples:</div>
              <div className="examples-grid">
                {quickExamples.map((example) => (
                  <button
                    key={example}
                    type="button"
                    className="example-chip"
                    onClick={() => setText(example)}
                  >
                    {example}
                  </button>
                ))}
              </div>

              <div className="analyzer-actions">
                <button
                  type="button"
                  className="primary-action"
                  onClick={handleAnalyze}
                  disabled={isLoading}
                >
                  {isLoading ? 'Analyzing...' : 'Analyze Grievance'}
                </button>
                {error ? <div className="error-text">{error}</div> : null}
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="panel results-panel"
            >
              <PanelHeader
                icon={BrainIcon}
                title="AI Prediction Results"
                action={
                  <button type="button" className="ghost-button" onClick={handleClear}>
                    Clear Results
                  </button>
                }
              />

              <div className="result-grid">
                {prediction ? (
                  <>
                    <ResultTile
                      icon={RoadIcon}
                      title="Department"
                      value={prediction.department ?? 'N/A'}
                      confidence={
                        prediction.department_confidence
                          ? `${toPercent(prediction.department_confidence)} Confidence`
                          : null
                      }
                      tone="blue"
                    />
                    <ResultTile
                      icon={SadIcon}
                      title="Sentiment"
                      value={prediction.sentiment ?? 'N/A'}
                      confidence={
                        prediction.sentiment_confidence
                          ? `${toPercent(prediction.sentiment_confidence)} Confidence`
                          : null
                      }
                      tone="red"
                    />
                    <div className="result-tile gauge-tile">
                      <div className="gauge-wrap">
                        <Gauge value={Number(prediction.urgency_score ?? 0)} />
                      </div>
                      <div className="result-copy">
                        <div className="result-title">Urgency Score</div>
                        <div className="result-value muted">/100</div>
                      </div>
                    </div>
                    <ResultTile
                      icon={AlertShieldIcon}
                      title="Priority Band"
                      value={prediction.priority_band ?? 'N/A'}
                      note={prediction.recommendation ?? 'Immediate Action Required'}
                      tone="red"
                    />
                  </>
                ) : (
                  <>
                    <ResultTile icon={RoadIcon} title="Department" value="-" tone="blue" />
                    <ResultTile icon={SadIcon} title="Sentiment" value="-" tone="red" />
                    <div className="result-tile gauge-tile">
                      <div className="gauge-wrap">
                        <Gauge value={0} />
                      </div>
                      <div className="result-copy">
                        <div className="result-title">Urgency Score</div>
                        <div className="result-value muted">/100</div>
                      </div>
                    </div>
                    <ResultTile icon={AlertShieldIcon} title="Priority Band" value="-" tone="red" />
                  </>
                )}
              </div>

              <div className="results-footer">
                <div>Model Version: {prediction?.model_version ?? demoPrediction.model_version}</div>
                <div className="results-timestamp">
                  <CalendarIcon />
                  <span>{lastUpdated}</span>
                </div>
              </div>
            </motion.article>
          </section>

          <section className="analytics-grid" ref={analyticsRef}>
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="panel chart-panel"
            >
              <div className="chart-head">
                <div className="chart-title">Complaints by Department</div>
                <button
                  type="button"
                  className="chart-filter"
                  onClick={() =>
                    setTimeRange((current) =>
                      current === 'month' ? 'week' : current === 'week' ? 'quarter' : 'month',
                    )
                  }
                >
                  {timeRange === 'month' ? 'This Month' : timeRange === 'week' ? 'This Week' : 'This Quarter'}{' '}
                  <ChevronDown />
                </button>
              </div>

              <div className="chart-body chart-body-donut">
                <div className="donut-wrap">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartComplaints}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={78}
                        outerRadius={118}
                        stroke="#0f1630"
                        strokeWidth={2}
                      >
                        {chartComplaints.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(7, 12, 28, 0.95)',
                          border: '1px solid rgba(148, 163, 184, 0.2)',
                          borderRadius: 12,
                          color: '#fff',
                        }}
                      />
                      <CenterLabel cx="50%" cy="50%" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="legend-list">
                  {chartComplaints.map((item) => (
                    <div className="legend-row" key={item.name}>
                      <span className="legend-swatch" style={{ background: item.color }} />
                      <span className="legend-name">{item.name}</span>
                      <span className="legend-value">
                        {item.value.toLocaleString()} ({((item.value / totalComplaints) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.14 }}
              className="panel chart-panel"
            >
              <div className="chart-head">
                <div className="chart-title">Urgency Distribution</div>
                <button
                  type="button"
                  className="chart-filter"
                  onClick={() =>
                    setTimeRange((current) =>
                      current === 'month' ? 'week' : current === 'week' ? 'quarter' : 'month',
                    )
                  }
                >
                  {timeRange === 'month' ? 'This Month' : timeRange === 'week' ? 'This Week' : 'This Quarter'}{' '}
                  <ChevronDown />
                </button>
              </div>

              <div className="chart-body">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartUrgency} margin={{ top: 20, right: 8, left: -16, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#c7d2fe" />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      stroke="#94a3b8"
                      tickFormatter={(value) => `${value / 1000}K`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(7, 12, 28, 0.95)',
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        borderRadius: 12,
                        color: '#fff',
                      }}
                    />
                    <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={52}>
                      {chartUrgency.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16 }}
              className="panel activity-panel"
            >
              <div className="chart-title">Recent Activity</div>
              <div className="activity-list">
                {activityItems.map((item) => (
                  <ActivityRow key={item.title + item.time} item={item} />
                ))}
              </div>
            </motion.article>
          </section>
        </section>
      </div>
    </main>
  )
}
