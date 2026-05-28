import { useEffect, useMemo, useState } from 'react'
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

const ROUTES = [
  { key: 'dashboard', label: 'Dashboard', icon: HomeIcon },
  { key: 'new-complaint', label: 'New Complaint', icon: FilePlusIcon },
  { key: 'analytics', label: 'Analytics', icon: ChartIcon },
  { key: 'departments', label: 'Departments', icon: BuildingIcon },
  { key: 'reports', label: 'Reports', icon: ReportIcon },
  { key: 'history', label: 'History', icon: HistoryIcon },
  { key: 'settings', label: 'Settings', icon: SettingsIcon },
  { key: 'about', label: 'About', icon: InfoIcon },
]

const ROUTE_META = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'AI-Powered Analysis of Citizen Grievances',
    intro: 'Track complaint flow, urgency, and operational activity.',
  },
  'new-complaint': {
    title: 'New Complaint',
    subtitle: 'Analyze a grievance and route it intelligently.',
    intro: 'Enter a citizen issue and generate an AI prediction.',
  },
  analytics: {
    title: 'Analytics',
    subtitle: 'Complaint distribution and urgency insights',
    intro: 'Review where complaints are coming from and how severe they are.',
  },
  departments: {
    title: 'Departments',
    subtitle: 'Routing coverage and operational status',
    intro: 'See department workload, SLA, and assignment details.',
  },
  reports: {
    title: 'Reports',
    subtitle: 'Exportable operational reporting',
    intro: 'Generate and download the latest governance reports.',
  },
  history: {
    title: 'History',
    subtitle: 'Complaint timeline and outcomes',
    intro: 'Review recently processed grievances and resolution states.',
  },
  settings: {
    title: 'Settings',
    subtitle: 'Dashboard preferences and backend configuration',
    intro: 'Tune your local experience and API preferences.',
  },
  about: {
    title: 'About',
    subtitle: 'System information and project details',
    intro: 'Learn what this platform does and how it is wired.',
  },
}

const DASHBOARD_STATS = [
  { title: 'Total Complaints', value: '12,458', delta: '+ 12.5% vs last month', tone: 'positive', icon: DocumentIcon },
  { title: 'Resolved', value: '8,721', delta: '+ 10.3% vs last month', tone: 'positive', icon: CheckCircleIcon },
  { title: 'In Progress', value: '2,145', delta: '+ 8.1% vs last month', tone: 'warning', icon: ClockIcon },
  { title: 'Departments', value: '8', delta: 'Active Departments', tone: 'blue', icon: BuildingIcon },
]

const dashboardActivities = [
  { icon: FileIcon, title: 'New complaint analyzed', desc: 'Roads in my locality are damaged badly.', time: '2 min ago', tone: 'green' },
  { icon: AlertIcon, title: 'High priority detected', desc: 'Water supply unavailable since 3 days.', time: '5 min ago', tone: 'red' },
  { icon: CheckIcon, title: 'Complaint resolved', desc: 'Street light not working issue resolved.', time: '15 min ago', tone: 'green' },
  { icon: FileIcon, title: 'New complaint analyzed', desc: 'Garbage collection is irregular.', time: '20 min ago', tone: 'blue' },
]

const departmentChartData = [
  { name: 'Roads', value: 3456, color: '#2a7bff' },
  { name: 'Water Supply', value: 2789, color: '#29c6d1' },
  { name: 'Electricity', value: 2345, color: '#ffb321' },
  { name: 'Sanitation', value: 1987, color: '#a95cf7' },
  { name: 'Others', value: 1881, color: '#7e8aa6' },
]

const urgencyChartData = [
  { name: 'Low', value: 2145, color: '#27d47f' },
  { name: 'Medium', value: 4289, color: '#ffb321' },
  { name: 'High', value: 6024, color: '#ff4d5e' },
]

const departments = [
  { name: 'Roads', open: 18, avg: '2.4 hrs', status: 'Healthy', color: 'blue' },
  { name: 'Water Supply', open: 12, avg: '1.9 hrs', status: 'Healthy', color: 'green' },
  { name: 'Electricity', open: 8, avg: '3.6 hrs', status: 'Review', color: 'orange' },
  { name: 'Sanitation', open: 14, avg: '2.8 hrs', status: 'Healthy', color: 'purple' },
]

const reports = [
  { title: 'Monthly Complaint Summary', detail: 'Overview of complaints, departments, and SLA adherence.' },
  { title: 'Priority Escalation Report', detail: 'Highlights all critical grievances from the last 30 days.' },
  { title: 'Department Workload Export', detail: 'CSV-ready view of department cases and routing load.' },
]

const historyItems = [
  { title: 'Roads complaint resolved', meta: 'Roads · 2 min ago · Closed', tone: 'green' },
  { title: 'Water supply escalation', meta: 'Water Supply · 5 min ago · High', tone: 'red' },
  { title: 'Electricity outage analyzed', meta: 'Electricity · 15 min ago · In Review', tone: 'orange' },
  { title: 'Sanitation follow-up', meta: 'Sanitation · 20 min ago · Open', tone: 'blue' },
]

function getRouteFromHash() {
  const value = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase()
  return ROUTES.some((route) => route.key === value) ? value : 'dashboard'
}

function useHashRoute() {
  const [route, setRoute] = useState(getRouteFromHash)

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = '#/dashboard'
    }

    const onHashChange = () => setRoute(getRouteFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  function navigate(nextRoute) {
    if (nextRoute !== route) {
      window.location.hash = `#/${nextRoute}`
    }
  }

  return [route, navigate]
}

function IconShell({ children }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  )
}

export default function ModernConsole() {
  const [route, navigate] = useHashRoute()
  const healthStatus = useHealthStatus()
  const meta = ROUTE_META[route] ?? ROUTE_META.dashboard
  const [complaintText, setComplaintText] = useState('')
  const [prediction, setPrediction] = useState(null)
  const [complaintError, setComplaintError] = useState('')
  const [complaintLoading, setComplaintLoading] = useState(false)
  const [settings, setSettings] = useState({
    autoRefresh: true,
    compactMode: false,
    notifications: true,
  })

  useEffect(() => {
    document.title = `Infotact Grievance AI · ${meta.title}`
  }, [meta.title])

  const selectedRouteLabel = useMemo(
    () => ROUTES.find((item) => item.key === route)?.label ?? 'Dashboard',
    [route],
  )

  async function handleAnalyzeComplaint() {
    if (!complaintText.trim()) {
      setComplaintError('Please enter a grievance before analysis.')
      return
    }

    setComplaintError('')
    setComplaintLoading(true)
    try {
      const result = await predictGrievance(complaintText.trim())
      setPrediction({
        ...result,
        timestamp: result.timestamp ?? new Date().toISOString(),
      })
      navigate('new-complaint')
    } catch {
      setPrediction(fallbackPrediction(complaintText.trim()))
      navigate('new-complaint')
    } finally {
      setComplaintLoading(false)
    }
  }

  const section = meta

  return (
    <main className="dashboard-shell">
      <div className="dashboard-noise" />
      <div className="dashboard-orb orb-a" />
      <div className="dashboard-orb orb-b" />
      <div className="dashboard-orb orb-c" />

      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="brand-row">
            <div className="brand-mark">
              <BuildingIcon />
            </div>
            <div className="brand-text">Infotact Grievance AI</div>
            <button type="button" className="menu-toggle" aria-label="Menu">
              <MenuIcon />
            </button>
          </div>

          <nav className="sidebar-nav" aria-label="Sidebar">
            {ROUTES.map((item) => (
              <a
                key={item.key}
                href={`#/${item.key}`}
                className={`sidebar-item${route === item.key ? ' active' : ''}`}
                aria-current={route === item.key ? 'page' : undefined}
              >
                <item.icon />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="promo-card"
            onClick={() => navigate('new-complaint')}
          >
            <div className="promo-illustration">
              <GovernmentBuilding />
            </div>
            <div className="promo-copy">
              <div className="promo-title">AI-Powered</div>
              <div className="promo-body">Grievance Management for Better Governance</div>
            </div>
          </button>
        </aside>

        <section className="content">
          <header className="topbar">
            <div>
              <h1>{section.title}</h1>
              <p>{section.subtitle}</p>
            </div>

            <div className="topbar-actions">
              <div className="health-pill">
                <span className={`health-dot ${healthStatus === 'online' ? 'online' : 'offline'}`} />
                <span>{healthStatus === 'offline' ? 'System Offline' : 'System Healthy'}</span>
                <Heartbeat />
              </div>
              <IconButton label="Profile">
                <UserIcon />
              </IconButton>
            </div>
          </header>

          <section className="section-banner" aria-live="polite">
            <div className="section-banner-label">{selectedRouteLabel}</div>
            <div className="section-banner-desc">{section.intro}</div>
          </section>

          <div className="content-frame">
            {route === 'dashboard' && <DashboardView onNavigate={navigate} />}
            {route === 'new-complaint' && (
              <ComplaintPage
                complaintText={complaintText}
                setComplaintText={setComplaintText}
                complaintError={complaintError}
                complaintLoading={complaintLoading}
                handleAnalyzeComplaint={handleAnalyzeComplaint}
                prediction={prediction}
              />
            )}
            {route === 'analytics' && <AnalyticsPage />}
            {route === 'departments' && <DepartmentsPage />}
            {route === 'reports' && <ReportsPage />}
            {route === 'history' && <HistoryPage />}
            {route === 'settings' && (
              <SettingsPage settings={settings} setSettings={setSettings} />
            )}
            {route === 'about' && <AboutPage />}
          </div>
        </section>
      </div>
    </main>
  )
}

function DashboardView({ onNavigate }) {
  return (
    <div className="page-stack">
      <section className="stat-grid">
        {DASHBOARD_STATS.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </section>

      <section className="analyzer-grid">
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel analyzer-panel"
        >
          <PanelHeader
            icon={SparklesIcon}
            title="Analyze New Grievance"
            subtitle="Use the New Complaint page for full routing and prediction"
            action={
              <button type="button" className="ghost-button" onClick={() => onNavigate('new-complaint')}>
                Open
              </button>
            }
          />

          <div className="dashboard-cta-grid">
            <button type="button" className="cta-card" onClick={() => onNavigate('new-complaint')}>
              <span className="cta-title">New Complaint</span>
              <span className="cta-subtitle">Analyze a grievance</span>
            </button>
            <button type="button" className="cta-card" onClick={() => onNavigate('analytics')}>
              <span className="cta-title">Analytics</span>
              <span className="cta-subtitle">Open visual reports</span>
            </button>
            <button type="button" className="cta-card" onClick={() => onNavigate('reports')}>
              <span className="cta-title">Reports</span>
              <span className="cta-subtitle">Export summaries</span>
            </button>
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel results-panel"
        >
          <PanelHeader icon={BrainIcon} title="AI Prediction Results" subtitle="Latest routing snapshot" />
          <div className="result-grid">
            <ResultTile icon={RoadIcon} title="Department" value="Roads" confidence="94% Confidence" tone="blue" />
            <ResultTile icon={SadIcon} title="Sentiment" value="Critical" confidence="91% Confidence" tone="red" />
            <ResultTile icon={AlertShieldIcon} title="Priority Band" value="High" note="Immediate Action Required" tone="red" />
            <ResultTile icon={ClockIcon} title="Urgency Score" value="92/100" tone="blue" />
          </div>
        </motion.article>
      </section>

      <section className="analytics-grid">
        <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel chart-panel">
          <div className="chart-head">
            <div className="chart-title">Recent Activity</div>
          </div>
          <div className="activity-list">
            {dashboardActivities.map((item) => (
              <ActivityRow key={item.title} item={item} />
            ))}
          </div>
        </motion.article>

        <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel chart-panel">
          <div className="chart-head">
            <div className="chart-title">Complaints by Department</div>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={departmentChartData} dataKey="value" nameKey="name" innerRadius={72} outerRadius={108} stroke="#0f1630" strokeWidth={2}>
                  {departmentChartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.article>
      </section>
    </div>
  )
}

function ComplaintPage({
  complaintText,
  setComplaintText,
  complaintError,
  complaintLoading,
  handleAnalyzeComplaint,
  prediction,
}) {
  return (
    <div className="page-stack">
      <section className="analyzer-grid">
        <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel analyzer-panel">
          <PanelHeader icon={SparklesIcon} title="Analyze New Grievance" subtitle="Enter the grievance details below for AI analysis" />

          <textarea
            className="grievance-input"
            placeholder="Enter citizen grievance..."
            value={complaintText}
            onChange={(event) => setComplaintText(event.target.value)}
            maxLength={2000}
          />
          <div className="input-footer">
            <span>{complaintText.length}/2000</span>
          </div>

          <div className="examples-label">Quick Examples:</div>
          <div className="examples-grid">
            {[
              'Roads in my locality are damaged badly.',
              'Water supply is not available since 3 days.',
              'Street lights are not working in our area.',
            ].map((example) => (
              <button key={example} type="button" className="example-chip" onClick={() => setComplaintText(example)}>
                {example}
              </button>
            ))}
          </div>

          <div className="analyzer-actions">
            <button type="button" className="primary-action" onClick={handleAnalyzeComplaint} disabled={complaintLoading}>
              {complaintLoading ? 'Analyzing...' : 'Analyze Grievance'}
            </button>
            {complaintError ? <div className="error-text">{complaintError}</div> : null}
          </div>
        </motion.article>

        <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel results-panel">
          <PanelHeader icon={BrainIcon} title="AI Prediction Results" subtitle="Live result from the local backend" />
          <div className="result-grid">
            {prediction ? (
              <>
                <ResultTile
                  icon={RoadIcon}
                  title="Department"
                  value={prediction.department ?? 'N/A'}
                  confidence={prediction.department_confidence ? `${Math.round(prediction.department_confidence * 100)}% Confidence` : null}
                  tone="blue"
                />
                <ResultTile
                  icon={SadIcon}
                  title="Sentiment"
                  value={prediction.sentiment ?? 'N/A'}
                  confidence={prediction.sentiment_confidence ? `${Math.round(prediction.sentiment_confidence * 100)}% Confidence` : null}
                  tone="red"
                />
                <ResultTile
                  icon={ClockIcon}
                  title="Urgency Score"
                  value={`${prediction.urgency_score ?? 0}/100`}
                  tone="blue"
                />
                <ResultTile
                  icon={AlertShieldIcon}
                  title="Priority Band"
                  value={prediction.priority_band ?? 'N/A'}
                  note={prediction.recommendation ?? 'Immediate Action Required'}
                  tone="red"
                />
              </>
            ) : (
              <div className="empty-state">
                Run a complaint analysis to see department, sentiment, urgency, and routing output here.
              </div>
            )}
          </div>
        </motion.article>
      </section>
    </div>
  )
}

function AnalyticsPage() {
  return (
    <div className="page-stack">
      <section className="analytics-grid">
        <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel chart-panel">
          <div className="chart-head">
            <div className="chart-title">Complaints by Department</div>
          </div>
          <div className="chart-body chart-body-donut">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={departmentChartData} dataKey="value" nameKey="name" innerRadius={78} outerRadius={118} stroke="#0f1630" strokeWidth={2}>
                  {departmentChartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="legend-list">
              {departmentChartData.map((item) => (
                <div className="legend-row" key={item.name}>
                  <span className="legend-swatch" style={{ background: item.color }} />
                  <span className="legend-name">{item.name}</span>
                  <span className="legend-value">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.article>

        <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel chart-panel">
          <div className="chart-head">
            <div className="chart-title">Urgency Distribution</div>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={urgencyChartData} margin={{ top: 20, right: 8, left: -16, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#c7d2fe" />
                <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" tickFormatter={(value) => `${value / 1000}K`} />
                <Tooltip />
                <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={52}>
                  {urgencyChartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.article>
      </section>
    </div>
  )
}

function DepartmentsPage() {
  return (
    <div className="page-stack">
      <section className="department-grid">
        {departments.map((department) => (
          <div className="panel department-card" key={department.name}>
            <div className="department-name">{department.name}</div>
            <div className="department-meta">Open Cases: {department.open}</div>
            <div className="department-meta">Average SLA: {department.avg}</div>
            <div className={`department-status ${department.color}`}>{department.status}</div>
          </div>
        ))}
      </section>
    </div>
  )
}

function ReportsPage() {
  return (
    <div className="page-stack">
      <section className="reports-grid">
        {reports.map((report) => (
          <div className="panel report-card" key={report.title}>
            <div className="chart-title">{report.title}</div>
            <p className="report-detail">{report.detail}</p>
            <button type="button" className="ghost-button">
              Generate Report
            </button>
          </div>
        ))}
      </section>
    </div>
  )
}

function HistoryPage() {
  return (
    <div className="page-stack">
      <section className="panel history-panel">
        <div className="chart-title">Recent Complaint History</div>
        <div className="activity-list">
          {historyItems.map((item) => (
            <div className="activity-row" key={item.title}>
              <div className={`activity-icon ${item.tone}`}>
                <CheckIcon />
              </div>
              <div className="activity-copy">
                <div className="activity-title">{item.title}</div>
                <div className="activity-desc">{item.meta}</div>
              </div>
              <div className="activity-time">Open</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function SettingsPage({ settings, setSettings }) {
  function toggle(name) {
    setSettings((current) => ({ ...current, [name]: !current[name] }))
  }

  return (
    <div className="page-stack">
      <section className="settings-grid">
        <div className="panel settings-panel">
          <div className="chart-title">Preferences</div>
          <ToggleRow label="Auto refresh" enabled={settings.autoRefresh} onToggle={() => toggle('autoRefresh')} />
          <ToggleRow label="Compact mode" enabled={settings.compactMode} onToggle={() => toggle('compactMode')} />
          <ToggleRow label="Notifications" enabled={settings.notifications} onToggle={() => toggle('notifications')} />
        </div>

        <div className="panel settings-panel">
          <div className="chart-title">API Connection</div>
          <div className="settings-note">Connected to the local FastAPI server at `http://127.0.0.1:8000`.</div>
          <div className="settings-note">Model version: week4-1.0.0</div>
          <button type="button" className="primary-action">Save Settings</button>
        </div>
      </section>
    </div>
  )
}

function AboutPage() {
  return (
    <div className="page-stack">
      <section className="about-grid">
        <div className="panel about-card">
          <div className="chart-title">Project Overview</div>
          <p className="report-detail">
            Infotact Grievance AI classifies public complaints, detects sentiment, and scores urgency for
            faster routing and response.
          </p>
        </div>
        <div className="panel about-card">
          <div className="chart-title">Endpoints</div>
          <p className="report-detail">GET `/health` and POST `/predict` served by the local FastAPI app.</p>
        </div>
      </section>
    </div>
  )
}

function ToggleRow({ label, enabled, onToggle }) {
  return (
    <label className="toggle-row">
      <span>{label}</span>
      <button type="button" className={`toggle-switch ${enabled ? 'on' : 'off'}`} onClick={onToggle}>
        <span className="toggle-knob" />
      </button>
    </label>
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

function StatCard({ title, value, delta, tone, icon: Icon }) {
  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="panel stat-card">
      <div>
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        <div className={`stat-delta ${tone}`}>{delta}</div>
      </div>
      <div className={`stat-icon ${tone}`}>
        <Icon />
      </div>
    </motion.section>
  )
}

function IconButton({ children, label }) {
  return (
    <button type="button" className="icon-button" aria-label={label}>
      {children}
    </button>
  )
}

function fallbackPrediction(text) {
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
      model_version: 'week4-1.0.0',
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
      model_version: 'week4-1.0.0',
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
    model_version: 'week4-1.0.0',
    timestamp: new Date().toISOString(),
  }
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

function Heartbeat() {
  return (
    <svg viewBox="0 0 74 18" className="heartbeat" aria-hidden="true">
      <path d="M1 9h10l3-6 4 12 5-9 4 3 3-3h43" />
    </svg>
  )
}
