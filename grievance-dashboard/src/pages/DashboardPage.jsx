import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import ComplaintAnalyzer from '../components/ComplaintAnalyzer'
import ResultsSection from '../components/ResultsSection'
import AnalyticsCharts from '../charts/AnalyticsCharts'
import Footer from '../components/Footer'
import FloatingParticles from '../components/FloatingParticles'
import useHealthStatus from '../hooks/useHealthStatus'
import useTypewriter from '../hooks/useTypewriter'
import { predictGrievance } from '../services/api'

const typingSeed =
  'AI triage active: classify complaints, detect sentiment, and prioritize urgent cases.'

export default function DashboardPage() {
  const healthStatus = useHealthStatus()
  const [text, setText] = useState('')
  const [prediction, setPrediction] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const typedText = useTypewriter(typingSeed)

  async function handleAnalyze() {
    if (!text.trim()) {
      setError('Please enter a grievance before analysis.')
      return
    }

    setError('')
    setIsLoading(true)
    try {
      const result = await predictGrievance(text.trim())
      setPrediction(result)
    } catch (apiError) {
      const message =
        apiError?.response?.data?.detail ||
        'Prediction failed. Please retry after a few seconds.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="dashboard-shell relative min-h-screen overflow-hidden px-4 py-6 md:px-8">
      <div className="glow-orb glow-orb--a" />
      <div className="glow-orb glow-orb--b" />
      <div className="glow-orb glow-orb--c" />
      <FloatingParticles />
      <div className="relative mx-auto w-full max-w-6xl">
        <Navbar healthStatus={healthStatus} />
        <HeroSection />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel mb-6 rounded-xl px-4 py-2 text-sm text-cyan-100"
        >
          {typedText}
          <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-cyan-100 align-middle" />
        </motion.p>

        <ComplaintAnalyzer
          text={text}
          onTextChange={setText}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          error={error}
          setExample={setText}
        />

        <ResultsSection prediction={prediction} />
        <AnalyticsCharts />
        <Footer />
      </div>
    </main>
  )
}
