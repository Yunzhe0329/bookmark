// Modals.jsx — 新增/編輯書籤 Modal + 刪除確認 Modal
import React from 'react'
import Icon from './Icons'
import { getDomain } from './utils'
import { Field, Btn, TagBadge, inputCss } from './ui'

// ── BookmarkModal ─────────────────────────────────────────────────────────────
export function BookmarkModal({ mode, bm, onClose, onSave, toast }) {
  const [url, setUrl]   = React.useState(bm?.url         || '');
  const [title, setTitle] = React.useState(bm?.title     || '');
  const [desc, setDesc] = React.useState(bm?.description || '');
  const [tagInput, setTagInput] = React.useState('');
  const [tags, setTags] = React.useState(bm?.tags ? [...bm.tags] : []);
  const [loading, setLoading] = React.useState(false);
  const urlRef = React.useRef();

  React.useEffect(() => { urlRef.current?.focus(); }, []);

  function addTag() {
    const t = tagInput.trim().replace(/,$/, '');
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput('');
  }

  function handleTagKey(e) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); }
    if (e.key === 'Backspace' && !tagInput && tags.length > 0)
      setTags(prev => prev.slice(0, -1));
  }

  async function handleSave() {
    if (!url.trim()) { toast('請輸入網址', 'error'); return; }
    setLoading(true);
    try {
      await onSave({ url: url.trim(), title: title.trim(), description: desc.trim(), tags });
      onClose();
    } catch (e) {
      toast(e.response?.data?.message || '操作失敗，請稍後再試', 'error');
      setLoading(false);
    }
  }

  return (
    <Overlay onClose={onClose}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, width: 480, maxWidth: '92vw', padding: 24, display: 'flex', flexDirection: 'column', gap: 20, boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
        <ModalHeader title={mode === 'create' ? '新增書籤' : '編輯書籤'} onClose={onClose} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="網址 *">
            <input ref={urlRef} value={url} onChange={e => setUrl(e.target.value)}
              placeholder="https://example.com" style={inputCss()} />
          </Field>
          <Field label="標題">
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="留空將自動使用網頁標題" style={inputCss()} />
          </Field>
          <Field label="描述">
            <textarea value={desc} onChange={e => setDesc(e.target.value)}
              placeholder="簡短描述這個書籤的內容…" rows={3}
              style={{ ...inputCss(), resize: 'vertical', minHeight: 72 }} />
          </Field>
          <Field label="標籤">
            <div
              onClick={() => document.getElementById('tagInput').focus()}
              style={{ border: '1px solid var(--border)', borderRadius: 7, background: 'var(--card)', padding: '6px 10px', display: 'flex', flexWrap: 'wrap', gap: 6, cursor: 'text', minHeight: 40 }}
            >
              {tags.map(t => (
                <TagBadge key={t} label={t} removable onRemove={() => setTags(prev => prev.filter(x => x !== t))} />
              ))}
              <input
                id="tagInput"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKey}
                placeholder={tags.length ? '' : '輸入標籤後按 Enter'}
                style={{ border: 'none', background: 'transparent', color: 'var(--text)', outline: 'none', fontSize: 13, minWidth: 120, flex: 1, fontFamily: 'inherit' }}
              />
            </div>
          </Field>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Btn onClick={onClose} secondary>取消</Btn>
          <Btn onClick={handleSave} loading={loading}>{mode === 'create' ? '新增' : '儲存'}</Btn>
        </div>
      </div>
    </Overlay>
  );
}

// ── DeleteConfirmModal ────────────────────────────────────────────────────────
export function DeleteConfirmModal({ bm, onClose, onConfirm }) {
  const [loading, setLoading] = React.useState(false);

  async function handleConfirm() {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    onClose();
  }

  return (
    <Overlay onClose={onClose}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, width: 380, maxWidth: '92vw', padding: 24, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
        <ModalHeader title="刪除書籤" onClose={onClose} />
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
          確定要刪除「<span style={{ color: 'var(--text)', fontWeight: 500 }}>{bm.title || getDomain(bm.url)}</span>」嗎？此操作無法復原。
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Btn onClick={onClose} secondary>取消</Btn>
          <Btn onClick={handleConfirm} danger loading={loading}>刪除</Btn>
        </div>
      </div>
    </Overlay>
  );
}

// ── Shared modal helpers ──────────────────────────────────────────────────────
function Overlay({ children, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
    >
      <div onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function ModalHeader({ title, onClose }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h2 style={{ fontWeight: 600, fontSize: 15, margin: 0 }}>{title}</h2>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 4, borderRadius: 5, display: 'flex', alignItems: 'center' }}>
        <Icon.X />
      </button>
    </div>
  );
}

