import { motion } from 'framer-motion'

const statusConfig = {
  checking: { label: 'Checking', color: 'bg-amber-400' },
  online: { label: 'API Online', color: 'bg-emerald-400' },
  offline: { label: 'API Offline', color: 'bg-rose-500' },
}

export default function Navbar({ healthStatus }) {
  const config = statusConfig[healthStatus] ?? statusConfig.checking

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel mx-auto mb-8 flex w-full max-w-6xl items-center justify-between rounded-2xl px-5 py-4"
    >
      <h1 className="text-lg font-semibold tracking-wide text-slate-100 md:text-xl">
        Infotact Grievance AI
      </h1>
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-slate-200 md:text-sm">
        <span className={`h-2.5 w-2.5 rounded-full ${config.color}`} />
        <span>{config.label}</span>
      </div>
    </motion.nav>
  )
}
