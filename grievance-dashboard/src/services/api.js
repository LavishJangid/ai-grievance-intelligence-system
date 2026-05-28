import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function fetchHealth() {
  const { data } = await api.get('/health')
  return data
}

export async function predictGrievance(text) {
  const { data } = await api.post('/predict', { text })
  return data
}
