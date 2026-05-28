import { useCallback, useEffect, useState } from 'react'
import { fetchHealth } from '../services/api'

export default function useHealthStatus(intervalMs = 5000) {
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
    const onFocus = () => checkHealth()
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      clearInterval(timer)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [checkHealth, intervalMs])

  return status
}
