import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8 text-center"
    >
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-blue-300 md:text-sm">
        AI-Powered Public Service Intelligence
      </p>
      <h2 className="hero-gradient-text text-3xl font-bold md:text-5xl">
        Analyze citizen grievances with confidence
      </h2>
      <p className="mx-auto mt-3 max-w-3xl text-sm text-slate-300 md:text-base">
        Smart classification for department routing, sentiment detection, and urgency scoring to
        accelerate response workflows.
      </p>
    </motion.section>
  )
}
