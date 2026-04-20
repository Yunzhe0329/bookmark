// ui.jsx — 共用基礎 UI 元件
import React from 'react'
import Icon from './Icons'

// ── 共用樣式函式 ──────────────────────────────────────────────────────────────
export function inputCss() {
  return {
    width: '100%',
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 7,
    padding: '8px 10px',
    color: 'var(--text)',
    fontSize: 13,
    outline: 'none',
    transition: 'border-color 0.15s',
    fontFamily: 'inherit',
  };
}

// ── Field ─────────────────────────────────────────────────────────────────────
export function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>
      {children}
    </div>
  );
}

// ── Btn ───────────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, secondary, danger, loading, type = 'button', fullWidth }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: fullWidth ? '100%' : undefined,
        padding: '8px 16px',
        borderRadius: 7,
        border: secondary ? '1px solid var(--border)' : 'none',
        background: secondary
          ? hovered ? 'var(--surface-hover)' : 'transparent'
          : danger ? 'var(--danger)' : 'var(--accent)',
        color: secondary ? 'var(--text-secondary)' : '#fff',
        fontWeight: 500,
        fontSize: 13,
        cursor: loading ? 'wait' : 'pointer',
        opacity: loading ? 0.7 : 1,
        transition: 'all 0.15s',
        fontFamily: 'inherit',
      }}
    >
      {loading ? '處理中…' : children}
    </button>
  );
}

// ── ActionBtn ─────────────────────────────────────────────────────────────────
export function ActionBtn({ children, onClick, danger, title }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? danger ? 'var(--danger-dim)' : 'var(--accent-dim)'
          : 'transparent',
        border: 'none',
        borderRadius: 5,
        padding: '4px 6px',
        cursor: 'pointer',
        color: hovered
          ? danger ? 'var(--danger)' : 'var(--accent)'
          : 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}

// ── IconToggle ────────────────────────────────────────────────────────────────
export function IconToggle({ children, active, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        padding: '4px 7px',
        border: 'none',
        borderRadius: 5,
        background: active ? 'var(--card)' : 'transparent',
        color: active ? 'var(--text)' : 'var(--text-tertiary)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}

// ── TagBadge ──────────────────────────────────────────────────────────────────
export function TagBadge({ label, onClick, removable, onRemove, active }) {
  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 500,
        border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
        background: active ? 'var(--accent-dim)' : 'transparent',
        color: active ? 'var(--accent)' : 'var(--text-secondary)',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        transition: 'all 0.15s',
      }}
    >
      {label}
      {removable && (
        <span
          role="button"
          aria-label={`Remove ${label}`}
          onClick={e => { e.stopPropagation(); onRemove(); }}
          style={{ display: 'flex', alignItems: 'center', opacity: 0.6, cursor: 'pointer' }}
        >
          <Icon.X />
        </span>
      )}
    </span>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
export function Skeleton({ w = '100%', h = 14, style = {} }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: 4,
      background: 'linear-gradient(90deg, var(--skeleton-a) 25%, var(--skeleton-b) 50%, var(--skeleton-a) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      ...style,
    }} />
  );
}

export function SkeletonCard({ layout }) {
  if (layout === 'list') return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <Skeleton w={28} h={28} style={{ borderRadius: 6, flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skeleton w="60%" h={14} />
        <Skeleton w="40%" h={11} />
      </div>
      <Skeleton w={80} h={11} />
    </div>
  );
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Skeleton w={24} h={24} style={{ borderRadius: 5, flexShrink: 0 }} />
        <Skeleton w="70%" h={14} />
      </div>
      <Skeleton h={11} />
      <Skeleton w="80%" h={11} />
      <div style={{ display: 'flex', gap: 6 }}>
        <Skeleton w={50} h={20} style={{ borderRadius: 4 }} />
        <Skeleton w={40} h={20} style={{ borderRadius: 4 }} />
      </div>
    </div>
  );
}

// ── SidebarItem ───────────────────────────────────────────────────────────────
export function SidebarItem({ label, count, active, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 8px', borderRadius: 6, border: 'none',
        width: '100%', textAlign: 'left',
        background: active ? 'var(--accent-dim)' : hovered ? 'var(--surface-hover)' : 'transparent',
        color: active ? 'var(--accent)' : hovered ? 'var(--text)' : 'var(--text-secondary)',
        cursor: 'pointer', transition: 'all 0.15s',
        fontSize: 13, fontWeight: active ? 500 : 400, fontFamily: 'inherit',
      }}
    >
      <Icon.Tag />
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ fontSize: 11, color: active ? 'var(--accent)' : 'var(--text-tertiary)' }}>{count}</span>
    </button>
  );
}

// ── ToastContainer ────────────────────────────────────────────────────────────
export function ToastContainer({ toasts, remove }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: 'var(--surface)',
          border: `1px solid ${t.type === 'error' ? 'var(--danger)' : 'var(--border)'}`,
          borderRadius: 8, padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
          minWidth: 240, boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          animation: 'slideIn 0.2s ease',
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
            background: t.type === 'error' ? 'var(--danger)' : t.type === 'success' ? 'var(--success)' : 'var(--accent)',
          }} />
          <span style={{ color: 'var(--text)', fontSize: 13 }}>{t.msg}</span>
          <button onClick={() => remove(t.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center' }}>
            <Icon.X />
          </button>
        </div>
      ))}
    </div>
  );
}

