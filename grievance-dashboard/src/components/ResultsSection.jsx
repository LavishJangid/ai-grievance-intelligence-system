import { motion } from 'framer-motion'
import ResultCard from './ResultCard'
import GlassCard from './GlassCard'

function formatConfidence(value) {
  if (typeof value !== 'number') return 'N/A'
  return `${Math.round(value * 100)}%`
}

export default function ResultsSection({ prediction }) {
  if (!prediction) return null

  const urgency = Number(prediction.urgency_score ?? 0)

  return (
    <section className="mb-8">
      <h3 className="mb-4 text-lg font-semibold text-slate-100">Prediction Results</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ResultCard title="Department" value={prediction.department ?? 'N/A'} />
        <ResultCard
          title="Department Confidence"
          value={formatConfidence(prediction.department_confidence)}
        />
        <ResultCard title="Sentiment" value={prediction.sentiment ?? 'N/A'} />
        <ResultCard
          title="Sentiment Confidence"
          value={formatConfidence(prediction.sentiment_confidence)}
        />
        <ResultCard title="Priority Band" value={prediction.priority_band ?? 'N/A'} />
        <ResultCard
          title="Timestamp"
          value={prediction.timestamp ? new Date(prediction.timestamp).toLocaleString() : 'N/A'}
        />
      </div>

      <GlassCard className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm text-slate-200">Urgency Score</p>
          <p className="text-sm font-semibold text-cyan-200">{urgency}/100</p>
        </div>
        <div className="h-3 rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(Math.max(urgency, 0), 100)}%` }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-400"
          />
        </div>
      </GlassCard>
    </section>
  )
}
