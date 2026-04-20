// hooks.jsx — 自定義 React Hooks
import React from 'react'
import api from './api/client'

// ── useToast ─────────────────────────────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = React.useState([]);

  const add = React.useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const remove = React.useCallback(id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, add, remove };
}

// ── useBookmarks ──────────────────────────────────────────────────────────────
export function useBookmarks() {
  const [bookmarks, setBookmarks] = React.useState(null) // null = 載入中
  const [error, setError] = React.useState(null)

  // GET /api/bookmarks
  React.useEffect(() => {
    api.get('/api/bookmarks')
      .then(res => setBookmarks(res.data))
      .catch(err => { setError(err); setBookmarks([]) })
  }, [])

  // POST /api/bookmarks，再逐一加 tag
  const createBookmark = React.useCallback(async ({ url, title, description, tags }) => {
    let { data: bm } = await api.post('/api/bookmarks', { url, title, description })
    for (const tag of tags) {
      const { data } = await api.post(`/api/bookmarks/${bm.id}/tags`, { name: tag })
      bm = data // 每次回傳都帶最新 tags
    }
    setBookmarks(prev => [bm, ...prev])
    return bm
  }, [])

  // PUT /api/bookmarks/{id}（只更新本體），再計算 tag diff 逐一同步
  const updateBookmark = React.useCallback(async (id, { url, title, description, tags: newTags }) => {
    const oldTags = bookmarks?.find(b => b.id === id)?.tags ?? []
    const toAdd    = newTags.filter(t => !oldTags.includes(t))
    const toRemove = oldTags.filter(t => !newTags.includes(t))

    let { data: bm } = await api.put(`/api/bookmarks/${id}`, { url, title, description })
    for (const tag of toAdd) {
      const { data } = await api.post(`/api/bookmarks/${id}/tags`, { name: tag })
      bm = data
    }
    for (const tag of toRemove) {
      const { data } = await api.delete(`/api/bookmarks/${id}/tags/${encodeURIComponent(tag)}`)
      bm = data
    }
    setBookmarks(prev => prev.map(b => b.id === id ? bm : b))
  }, [bookmarks])

  // DELETE /api/bookmarks/{id}
  const deleteBookmark = React.useCallback(async (id) => {
    await api.delete(`/api/bookmarks/${id}`)
    setBookmarks(prev => prev.filter(b => b.id !== id))
  }, [])

  return { bookmarks, error, createBookmark, updateBookmark, deleteBookmark }
}

