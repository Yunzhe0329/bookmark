// TweaksPanel.jsx — 設計微調面板（僅原型使用，實際專案不需要此檔案）

function TweaksPanel({ tweaks, setTweaks, visible }) {
  if (!visible) return null;

  function setLayout(v) { setTweaks(p => ({ ...p, layout: v })); }
  function toggleDesc() { setTweaks(p => ({ ...p, showDesc: !p.showDesc })); }
  function setHue(h) {
    setTweaks(p => ({ ...p, accentHue: h }));
    document.documentElement.style.setProperty('--accent',       `oklch(0.65 0.15 ${h})`);
    document.documentElement.style.setProperty('--accent-dim',   `oklch(0.65 0.15 ${h} / 0.12)`);
    document.documentElement.style.setProperty('--accent-hover', `oklch(0.70 0.15 ${h})`);
  }

  const panelStyle = {
    position: 'fixed', bottom: 24, left: 24, zIndex: 900,
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 10, padding: 16, width: 220,
    display: 'flex', flexDirection: 'column', gap: 14,
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  };

  return (
    <div style={panelStyle}>
      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>Tweaks</div>

      {/* Layout */}
      <TweakSection label="卡片佈局">
        <div style={{ display: 'flex', gap: 6 }}>
          {['grid', 'list'].map(v => (
            <TweakChip key={v} active={tweaks.layout === v} onClick={() => setLayout(v)}>
              {v === 'grid' ? '格狀' : '列表'}
            </TweakChip>
          ))}
        </div>
      </TweakSection>

      {/* Show description */}
      <TweakSection label="顯示描述">
        <TweakChip active={tweaks.showDesc} onClick={toggleDesc}>
          {tweaks.showDesc ? '開啟' : '關閉'}
        </TweakChip>
      </TweakSection>

      {/* Accent hue */}
      <TweakSection label={`強調色色調 (${tweaks.accentHue}°)`}>
        <input
          type="range" min={0} max={360} value={tweaks.accentHue}
          onChange={e => setHue(+e.target.value)}
          style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
        />
      </TweakSection>
    </div>
  );
}

function TweakSection({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</label>
      {children}
    </div>
  );
}

function TweakChip({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '5px 0', fontSize: 12,
        border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
        background: active ? 'var(--accent-dim)' : 'transparent',
        color: active ? 'var(--accent)' : 'var(--text-secondary)',
        borderRadius: 5, cursor: 'pointer',
        fontWeight: active ? 500 : 400,
        fontFamily: 'inherit', transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}

Object.assign(window, { TweaksPanel });
