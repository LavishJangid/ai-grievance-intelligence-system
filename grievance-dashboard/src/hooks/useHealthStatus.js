import { useCallback, useEffect, useState } from 'react'
import { fetchHealth } from '../services/api'

export default function useHealthStatus(intervalMs = 30000) {
  const [status, setStatus] = useState('checking')

  const checkHealth = useCallback(async () => {
    try {
      await fetchHealth()
      setStatus('online')
    } catch {
      setStatus('offline')
    }
  }, [])

  useEffect(() => {
    checkHealth()
    const timer = setInterval(checkHealth, intervalMs)
    return () => clearInterval(timer)
  }, [checkHealth, intervalMs])

  return status
}
