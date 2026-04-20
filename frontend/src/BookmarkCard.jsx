// BookmarkCard.jsx — 書籤卡片元件
import React from 'react'
import Icon from './Icons'
import { getDomain, getFavicon, timeAgo } from './utils'
import { ActionBtn, TagBadge } from './ui'

export function BookmarkCard({ bm, layout, onEdit, onDelete, onTagClick, showDesc }) {
  const [hovered, setHovered] = React.useState(false);
  const [imgError, setImgError] = React.useState(false);
  const domain = getDomain(bm.url);

  const faviconEl = imgError
    ? <Icon.Link />
    : <img src={getFavicon(bm.url)} width={layout === 'list' ? 16 : 14} height={layout === 'list' ? 16 : 14}
        onError={() => setImgError(true)}
        style={{ imageRendering: 'crisp-edges', display: 'block' }} />;

  const hoverActions = (
    <div style={{ display: 'flex', gap: 4, opacity: hovered ? 1 : 0, transition: 'opacity 0.15s' }}>
      <ActionBtn onClick={() => onEdit(bm)} title="編輯"><Icon.Edit /></ActionBtn>
      <ActionBtn onClick={() => onDelete(bm)} title="刪除" danger><Icon.Trash /></ActionBtn>
    </div>
  );

  // ── List layout ─────────────────────────────────────────────────────────────
  if (layout === 'list') return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--card-hover)' : 'var(--card)',
        border: `1px solid ${hovered ? 'var(--border)' : 'var(--border-subtle)'}`,
        borderRadius: 8, padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 14,
        transition: 'all 0.15s',
      }}
    >
      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', color: 'var(--text-tertiary)' }}>
        {faviconEl}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <CardTitle url={bm.url} title={bm.title} domain={domain} />
        <div style={{ color: 'var(--text-secondary)', fontSize: 11, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{domain}</div>
      </div>
      <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
        {bm.tags.map(t => <TagBadge key={t} label={t} onClick={() => onTagClick(t)} />)}
      </div>
      <div style={{ color: 'var(--text-tertiary)', fontSize: 11, flexShrink: 0, minWidth: 60, textAlign: 'right' }}>
        {timeAgo(bm.createdAt)}
      </div>
      {hoverActions}
    </div>
  );

  // ── Grid layout ─────────────────────────────────────────────────────────────
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--card-hover)' : 'var(--card)',
        border: `1px solid ${hovered ? 'var(--border)' : 'var(--border-subtle)'}`,
        borderRadius: 8, padding: 16,
        display: 'flex', flexDirection: 'column', gap: 10,
        transition: 'all 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ width: 24, height: 24, borderRadius: 5, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', color: 'var(--text-tertiary)', marginTop: 1 }}>
          {faviconEl}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <CardTitle url={bm.url} title={bm.title} domain={domain} />
          <div style={{ color: 'var(--text-tertiary)', fontSize: 11, marginTop: 1 }}>{domain}</div>
        </div>
      </div>

      {showDesc && bm.description && (
        <p style={{ color: 'var(--text-secondary)', fontSize: 12, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textWrap: 'pretty', margin: 0 }}>
          {bm.description}
        </p>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 'auto' }}>
        {bm.tags.map(t => <TagBadge key={t} label={t} onClick={() => onTagClick(t)} />)}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
        <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>{timeAgo(bm.createdAt)}</span>
        {hoverActions}
      </div>
    </div>
  );
}

// ── CardTitle (shared between layouts) ───────────────────────────────────────
function CardTitle({ url, title, domain }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <a
      href={url} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        color: hovered ? 'var(--accent)' : 'var(--text)',
        textDecoration: 'none', fontWeight: 500, fontSize: 13,
        display: 'block', overflow: 'hidden', textOverflow: 'ellipsis',
        whiteSpace: 'nowrap', lineHeight: 1.4,
        transition: 'color 0.15s',
      }}
    >
      {title || domain}
    </a>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({ onNew, filtered }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 16, padding: 64, textAlign: 'center' }}>
      <div style={{ width: 52, height: 52, borderRadius: 12, background: 'var(--card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
        <Icon.Bookmark />
      </div>
      <div>
        <div style={{ fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>
          {filtered ? '沒有符合的書籤' : '尚無書籤'}
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: 12, maxWidth: 260, lineHeight: 1.6 }}>
          {filtered ? '試試調整搜尋條件或選擇其他標籤' : '新增你的第一個書籤，開始整理你的網路世界'}
        </div>
      </div>
      {!filtered && (
        <button onClick={onNew} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--accent)', border: 'none', borderRadius: 7, color: '#fff', fontWeight: 500, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          <Icon.Plus /> 新增書籤
        </button>
      )}
    </div>
  );
}

