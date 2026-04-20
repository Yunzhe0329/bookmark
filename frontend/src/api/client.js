import axios from 'axios'

/**
 * Axios instance
 *
 * 本地開發：baseURL 為空，/api/* 請求由 vite.config.js 的 proxy 轉發到 http://localhost:8080
 * 正式部署：在 .env.production 設定 VITE_API_URL=https://your-backend.render.com
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
})

// 每個 request 自動帶上 JWT Bearer token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// token 過期或無效時自動登出，避免用戶卡在頁面
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
