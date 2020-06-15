import axios from 'axios'
import config from '@/config'

const api = axios.create({
  baseURL: config.api.base
})

api.interceptors.request.use((config) => {
  const data = JSON.parse(localStorage.getItem('login'))

  if (data.token) {
    config.headers.Authorization = `Bearer ${data.token}`
  }

  return config
}, (err) => {
  return Promise.reject(err)
})

api.interceptors.response.use((response) => {
  return response
}, (error) => {
  return Promise.reject(error)
})

export default api
