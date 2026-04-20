// Icons.jsx — 所有 SVG icon 元件

const Icon = {
  Search:     () => <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-.691 3.516a4.5 4.5 0 1 1 .707-.707l2.838 2.837a.5.5 0 0 1-.708.708L9.309 10.016Z" fill="currentColor"/></svg>,
  Plus:       () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Tag:        () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 1h5l5.5 5.5a1 1 0 0 1 0 1.414L8.914 11.5A1 1 0 0 1 7.5 11.5L2 6V1Zm2.5 2.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>,
  Edit:       () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9 1.5 11.5 4l-7 7L2 12l.5-2.5 7-8Zm1.5 1L12 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Trash:      () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 3h10M4 3V1.5h5V3M5 5.5v4M8 5.5v4M2.5 3l.5 8h7l.5-8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  X:          () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  Bookmark:   () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 2h10a1 1 0 0 1 1 1v10.5L8 11l-6 2.5V3a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  Link:       () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M5 6.5a2.5 2.5 0 0 0 3.536.035l1.5-1.5A2.5 2.5 0 0 0 6.5 1.5L5.75 2.25M7 5.5a2.5 2.5 0 0 0-3.536-.035l-1.5 1.5A2.5 2.5 0 0 0 5.5 10.5l.75-.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  LayoutGrid: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg>,
  LayoutList: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="1" y="6.5" width="12" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="1" y="11" width="12" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg>,
  Eye:        () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><ellipse cx="6.5" cy="6.5" rx="5.5" ry="4" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>,
  EyeOff:     () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 1l11 11M5.5 4.5A4 4 0 0 1 11.5 7c-.4.7-1 1.4-1.7 2M3 5.5C2 6.2 1.3 7 1 7.5a5.5 5.5 0 0 0 7 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  Sun:        () => <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M3.05 3.05l1.06 1.06M10.89 10.89l1.06 1.06M3.05 11.95l1.06-1.06M10.89 4.11l1.06-1.06" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  Moon:       () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 8.5A5.5 5.5 0 0 1 5.5 2a5.5 5.5 0 1 0 6.5 6.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  LogOut:     () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2H2.5A1.5 1.5 0 0 0 1 3.5v7A1.5 1.5 0 0 0 2.5 12H5M9.5 10l3-3-3-3M12.5 7H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

export default Icon
