import { motion } from 'framer-motion'
import GlassCard from './GlassCard'

export default function ResultCard({ title, value, subtitle }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}>
      <GlassCard className="h-full">
        <p className="text-xs uppercase tracking-wide text-slate-300">{title}</p>
        <p className="mt-1 text-2xl font-semibold text-slate-100">{value}</p>
        {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
      </GlassCard>
    </motion.div>
  )
}
