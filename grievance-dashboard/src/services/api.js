import axios from 'axios'

const api = axios.create({
  baseURL: 'https://infotact-grievance-ai.onrender.com',
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
