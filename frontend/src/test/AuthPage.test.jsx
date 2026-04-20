import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { vi } from 'vitest'
import { AuthPage } from '../AuthPage'
import api from '../api/client'

// mock 整個 axios instance
vi.mock('../api/client')

// 幫助函式：render AuthPage 並包上 Router（AuthPage 內有 useNavigate）
function renderAuthPage(mode) {
  render(
    <MemoryRouter initialEntries={[mode === 'login' ? '/login' : '/register']}>
      <Routes>
        <Route path="/login"    element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('AuthPage — login', () => {
  it('驗證失敗：空白欄位不送出', async () => {
    renderAuthPage('login')
    fireEvent.click(screen.getByRole('button', { name: '登入' }))
    expect(await screen.findByText('請填寫所有欄位')).toBeInTheDocument()
    expect(api.post).not.toHaveBeenCalled()
  })

  it('驗證失敗：密碼少於 8 字元', async () => {
    renderAuthPage('login')
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: '登入' }))
    expect(await screen.findByText('密碼至少需要 8 個字元')).toBeInTheDocument()
    expect(api.post).not.toHaveBeenCalled()
  })

  it('登入成功：呼叫 API 並存 token', async () => {
    api.post.mockResolvedValueOnce({ data: { token: 'fake-token' } })
    renderAuthPage('login')
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: '12345678' } })
    fireEvent.click(screen.getByRole('button', { name: '登入' }))
    await waitFor(() => expect(localStorage.getItem('token')).toBe('fake-token'))
    expect(api.post).toHaveBeenCalledWith('/api/auth/login', { email: 'a@b.com', password: '12345678' })
  })

  it('登入失敗：顯示後端錯誤訊息', async () => {
    api.post.mockRejectedValueOnce({ response: { data: { message: 'Invalid credentials' } } })
    renderAuthPage('login')
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: '12345678' } })
    fireEvent.click(screen.getByRole('button', { name: '登入' }))
    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
  })
})

describe('AuthPage — register', () => {
  it('註冊成功：呼叫 register API', async () => {
    api.post.mockResolvedValueOnce({})
    renderAuthPage('register')
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'new@b.com' } })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: '12345678' } })
    fireEvent.click(screen.getByRole('button', { name: '建立帳號' }))
    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith('/api/auth/register', { email: 'new@b.com', password: '12345678' })
    )
  })
})
