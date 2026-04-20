// AppLayout.jsx — 主應用畫面（Header + Sidebar + 書籤列表）
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from './Icons'
import { inputCss, IconToggle, SidebarItem, ToastContainer, SkeletonCard } from './ui'
import { BookmarkCard, EmptyState } from './BookmarkCard'
import { BookmarkModal, DeleteConfirmModal } from './Modals'
import { useBookmarks, useToast } from './hooks'

export function AppLayout({ theme, onToggleTheme }) {
  const navigate = useNavigate()
  const { bookmarks, createBookmark, updateBookmark, deleteBookmark } = useBookmarks();
  const { toasts, add: toast, remove: removeToast } = useToast();

  const [selectedTag, setSelectedTag] = React.useState(null);
  const [search, setSearch]           = React.useState('');
  const [layout, setLayout]           = React.useState('grid');
  const [modal, setModal]             = React.useState(null); // {mode:'create'|'edit', bm?}
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const showDesc = true;

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  // ── Derived state ───────────────────────────────────────────────────────────
  const allTags = bookmarks
    ? [...new Set(bookmarks.flatMap(b => b.tags))].sort()
    : [];

  const tagCounts = bookmarks
    ? Object.fromEntries(allTags.map(t => [t, bookmarks.filter(b => b.tags.includes(t)).length]))
    : {};

  const filtered = (bookmarks || []).filter(b => {
    const matchTag    = !selectedTag || b.tags.includes(selectedTag);
    const matchSearch = !search || [b.title, b.url, b.description, ...b.tags]
      .some(f => f?.toLowerCase().includes(search.toLowerCase()));
    return matchTag && matchSearch;
  });

  const isFiltered = !!(search || selectedTag);

  // ── Handlers ────────────────────────────────────────────────────────────────
  async function handleSave(data) {
    if (modal.mode === 'create') {
      await createBookmark(data);
      toast('書籤已新增', 'success');
    } else {
      await updateBookmark(modal.bm.id, data);
      toast('書籤已更新', 'success');
    }
  }

  async function handleDelete() {
    await deleteBookmark(deleteTarget.id);
    toast('書籤已刪除');
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header style={{ height: 52, borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', flexShrink: 0, background: 'var(--bg)' }}>

        {/* 標誌 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8, flexShrink: 0 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Icon.Bookmark />
          </div>
          <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: '-0.02em', color: 'var(--text)' }}>Bookmark</span>
        </div>

        {/* 搜尋 */}
        <div style={{ flex: 1, maxWidth: 420, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }}>
            <Icon.Search />
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜尋書籤…"
            style={{ ...inputCss(), paddingLeft: 32, background: 'var(--surface)', border: '1px solid transparent', height: 33, transition: 'border-color 0.15s' }}
            onFocus={e => e.target.style.borderColor = 'var(--border)'}
            onBlur={e => e.target.style.borderColor = 'transparent'}
          />
        </div>

        {/* 操作列 */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {/* 版面切換 */}
          <div style={{ display: 'flex', gap: 2, background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 7, padding: 2 }}>
            <IconToggle active={layout === 'grid'} onClick={() => setLayout('grid')} title="格狀"><Icon.LayoutGrid /></IconToggle>
            <IconToggle active={layout === 'list'} onClick={() => setLayout('list')} title="列表"><Icon.LayoutList /></IconToggle>
          </div>

          {/* 主題切換 */}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          {/* 新增書籤 */}
          <button
            onClick={() => setModal({ mode: 'create' })}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'var(--accent)', border: 'none', borderRadius: 7, color: '#fff', fontWeight: 500, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <Icon.Plus /> 新增
          </button>

          {/* 登出 */}
          <button
            onClick={handleLogout}
            title="登出"
            style={{ padding: '6px 8px', background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 7, color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit' }}
          >
            <Icon.LogOut />
          </button>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── Sidebar ───────────────────────────────────────────────────────── */}
        <aside style={{ width: 200, flexShrink: 0, borderRight: '1px solid var(--border-subtle)', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', background: 'var(--bg)' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)', padding: '0 8px', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            標籤
          </div>
          <SidebarItem
            label="所有書籤"
            count={bookmarks?.length ?? 0}
            active={!selectedTag}
            onClick={() => setSelectedTag(null)}
          />
          {allTags.map(t => (
            <SidebarItem
              key={t}
              label={t}
              count={tagCounts[t]}
              active={selectedTag === t}
              onClick={() => setSelectedTag(t === selectedTag ? null : t)}
            />
          ))}
        </aside>

        {/* ── Main content ──────────────────────────────────────────────────── */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* 工具列 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 500, fontSize: 14, color: 'var(--text)' }}>
                {selectedTag ? `#${selectedTag}` : '所有書籤'}
              </span>
              {bookmarks && (
                <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>{filtered.length}</span>
              )}
            </div>
            {search && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>搜尋：「{search}」</span>
                <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Icon.X />
                </button>
              </div>
            )}
          </div>

          {/* Cards */}
          {bookmarks === null ? (
            <div style={layout === 'grid' ? gridStyle : listStyle}>
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} layout={layout} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState onNew={() => setModal({ mode: 'create' })} filtered={isFiltered} />
          ) : (
            <div style={layout === 'grid' ? gridStyle : listStyle}>
              {filtered.map(bm => (
                <BookmarkCard
                  key={bm.id}
                  bm={bm}
                  layout={layout}
                  showDesc={showDesc}
                  onEdit={b => setModal({ mode: 'edit', bm: b })}
                  onDelete={b => setDeleteTarget(b)}
                  onTagClick={t => setSelectedTag(t)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      {modal && (
        <BookmarkModal
          mode={modal.mode}
          bm={modal.bm}
          onClose={() => setModal(null)}
          onSave={handleSave}
          toast={toast}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          bm={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}

      <ToastContainer toasts={toasts} remove={removeToast} />
    </div>
  );
}

// ── ThemeToggle ───────────────────────────────────────────────────────────────
function ThemeToggle({ theme, onToggle }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onToggle}
      title={theme === 'dark' ? '切換淺色主題' : '切換深色主題'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '6px 8px',
        background: hovered ? 'var(--surface-hover)' : 'var(--surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 7,
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.15s',
      }}
    >
      {theme === 'dark' ? <Icon.Sun /> : <Icon.Moon />}
    </button>
  );
}

// ── Layout constants ──────────────────────────────────────────────────────────
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10, alignContent: 'start' };
const listStyle = { display: 'flex', flexDirection: 'column', gap: 6 };

