import { motion } from 'framer-motion'
import GlassCard from './GlassCard'

const examples = [
  'Roads in my locality are severely damaged and causing accidents daily.',
  'Water supply has been unavailable for three days.',
  'Street lights are not functioning in our area.',
]

export default function ComplaintAnalyzer({
  text,
  onTextChange,
  onAnalyze,
  isLoading,
  error,
  setExample,
}) {
  return (
    <GlassCard className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Complaint Analyzer</h3>
        <span className="text-xs text-slate-300">AI Classification + Priority Scoring</span>
      </div>
      <textarea
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        placeholder="Enter citizen grievance..."
        rows={6}
        className="w-full rounded-xl border border-white/20 bg-slate-950/40 p-4 text-sm text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setExample(example)}
            className="elevated-chip rounded-full px-3 py-1.5 text-xs text-slate-200 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-400/20"
          >
            {example}
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAnalyze}
          disabled={isLoading}
          className="shine-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Analyzing...
            </>
          ) : (
            'Analyze Grievance'
          )}
        </motion.button>
        {error && <p className="text-sm text-rose-300">{error}</p>}
      </div>
    </GlassCard>
  )
}
