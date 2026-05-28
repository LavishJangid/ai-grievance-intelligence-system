import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts'
import GlassCard from '../components/GlassCard'

const pieData = [
  { name: 'Roads', value: 38 },
  { name: 'Water', value: 26 },
  { name: 'Electricity', value: 20 },
  { name: 'Sanitation', value: 16 },
]

const barData = [
  { week: 'W1', resolved: 46, pending: 18 },
  { week: 'W2', resolved: 52, pending: 15 },
  { week: 'W3', resolved: 58, pending: 12 },
  { week: 'W4', resolved: 63, pending: 10 },
]

const colors = ['#38bdf8', '#60a5fa', '#818cf8', '#22d3ee']

export default function AnalyticsCharts() {
  return (
    <section className="mb-8 grid gap-4 lg:grid-cols-2">
      <GlassCard>
        <h3 className="mb-3 text-lg font-semibold text-slate-100">Department Share</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={colors[pieData.indexOf(entry) % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="mb-3 text-lg font-semibold text-slate-100">Weekly Resolution Trend</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="week" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip />
              <Bar dataKey="resolved" fill="#22d3ee" radius={[8, 8, 0, 0]} />
              <Bar dataKey="pending" fill="#818cf8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </section>
  )
}
