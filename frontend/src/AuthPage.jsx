// AuthPage.jsx — 登入 / 註冊頁面
// TODO: handleSubmit 中替換 mock 為真實 API：
//   POST /api/auth/login    → { email, password } → 回傳 { token }，存入 localStorage
//   POST /api/auth/register → { email, password } → 201，跳轉 /login
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from './Icons'
import { Field, inputCss } from './ui'
import api from './api/client'

export function AuthPage({ mode }) {
  const navigate = useNavigate()
  const [email, setEmail]       = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPw, setShowPw]     = React.useState(false);
  const [loading, setLoading]   = React.useState(false);
  const [error, setError]       = React.useState('');

  function validate() {
    if (!email || !password) return '請填寫所有欄位';
    if (!/\S+@\S+\.\S+/.test(email)) return '請輸入有效的電子郵件';
    if (password.length < 8) return '密碼至少需要 8 個字元';
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const { data } = await api.post('/api/auth/login', { email, password })
        localStorage.setItem('token', data.token)
        navigate('/')
      } else {
        await api.post('/api/auth/register', { email, password })
        navigate('/login')
      }
    } catch (e) {
      setError(e.response?.data?.message || '操作失敗，請稍後再試')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 4 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Icon.Bookmark />
          </div>
          <span style={{ fontWeight: 600, fontSize: 18, letterSpacing: '-0.02em', color: 'var(--text)' }}>Bookmark</span>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <h1 style={{ fontWeight: 600, fontSize: 17, margin: '0 0 4px', color: 'var(--text)' }}>
              {mode === 'login' ? '歡迎回來' : '建立帳號'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: 0 }}>
              {mode === 'login' ? '登入你的帳號以繼續' : '開始整理你的書籤收藏'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="電子郵件">
              <input
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                style={inputCss()}
              />
            </Field>

            <Field label="密碼">
              <div style={{ position: 'relative' }}>
                <input
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  style={{ ...inputCss(), paddingRight: 38 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                >
                  {showPw ? <Icon.EyeOff /> : <Icon.Eye />}
                </button>
              </div>
            </Field>

            {error && (
              <div style={{ color: 'var(--danger)', fontSize: 12, padding: '8px 10px', background: 'var(--danger-dim)', borderRadius: 6, lineHeight: 1.5 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '9px', background: 'var(--accent)', border: 'none', borderRadius: 7, color: '#fff', fontWeight: 500, fontSize: 13, cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.15s', marginTop: 4, fontFamily: 'inherit' }}
            >
              {loading ? '處理中…' : mode === 'login' ? '登入' : '建立帳號'}
            </button>
          </form>
        </div>

        {/* Switch mode */}
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13, margin: 0 }}>
          {mode === 'login' ? '還沒有帳號？' : '已有帳號？'}
          <button
            onClick={() => navigate(mode === 'login' ? '/register' : '/login')}
            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 500, marginLeft: 4, fontSize: 13, fontFamily: 'inherit' }}
          >
            {mode === 'login' ? '建立帳號' : '登入'}
          </button>
        </p>
      </div>
    </div>
  );
}

