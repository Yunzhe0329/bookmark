// App.jsx — 根元件：全域主題 + React Router 路由
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthPage } from './AuthPage'
import { AppLayout } from './AppLayout'

// 未登入時導向 /login
function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" replace />
}

export default function App() {
  const [theme, setTheme] = React.useState(
    () => localStorage.getItem('bm_theme') || 'dark'
  )

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('bm_theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }

  return (
    <Routes>
      <Route path="/login"    element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/" element={
        <PrivateRoute>
          <AppLayout theme={theme} onToggleTheme={toggleTheme} />
        </PrivateRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
