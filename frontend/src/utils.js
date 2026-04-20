// utils.js — 工具函式 + 模擬資料（串接完成後可刪除 MOCK_BOOKMARKS）

export const MOCK_BOOKMARKS = [
  { id: 1, url: 'https://linear.app',             title: 'Linear – Plan and build products',      description: '專案管理工具，以速度和簡潔著稱，深受工程團隊喜愛。',         tags: ['design', 'tools'],      createdAt: '2026-04-16T10:00:00' },
  { id: 2, url: 'https://vercel.com',              title: 'Vercel – Develop. Preview. Ship.',       description: '前端部署平台，支援 Next.js、邊緣運算與全球 CDN。',            tags: ['dev', 'deployment'],    createdAt: '2026-04-15T09:30:00' },
  { id: 3, url: 'https://tailwindcss.com',         title: 'Tailwind CSS',                          description: 'Utility-first CSS 框架，讓你直接在 HTML 中撰寫樣式。',       tags: ['dev', 'css'],           createdAt: '2026-04-14T14:20:00' },
  { id: 4, url: 'https://ui.shadcn.com',           title: 'shadcn/ui – Component Library',         description: '可複製到專案的開源元件庫，基於 Radix UI 與 Tailwind。',      tags: ['dev', 'design'],        createdAt: '2026-04-13T11:00:00' },
  { id: 5, url: 'https://react.dev',               title: 'React – The Library for Web UIs',       description: '官方 React 文件，涵蓋 Hooks、Server Components 等概念。',    tags: ['dev', 'reading'],       createdAt: '2026-04-12T08:00:00' },
  { id: 6, url: 'https://dribbble.com',            title: 'Dribbble – Design Inspiration',         description: '設計師作品展示平台，適合尋找 UI/UX 靈感。',                  tags: ['design', 'reading'],    createdAt: '2026-04-11T16:45:00' },
  { id: 7, url: 'https://www.typescriptlang.org',  title: 'TypeScript Documentation',              description: 'TypeScript 官方文件，強型別 JavaScript 超集。',              tags: ['dev'],                  createdAt: '2026-04-10T10:10:00' },
  { id: 8, url: 'https://framer.com/motion',       title: 'Framer Motion – Animation Library',     description: 'React 動畫函式庫，支援手勢、佈局動畫與 SVG 路徑。',          tags: ['dev', 'design'],        createdAt: '2026-04-09T13:00:00' },
];

export function timeAgo(dateStr) {
  const diff = (new Date() - new Date(dateStr)) / 1000;
  if (diff < 60)          return '剛剛';
  if (diff < 3600)        return `${Math.floor(diff / 60)} 分鐘前`;
  if (diff < 86400)       return `${Math.floor(diff / 3600)} 小時前`;
  if (diff < 86400 * 30)  return `${Math.floor(diff / 86400)} 天前`;
  return `${Math.floor(diff / 86400 / 30)} 個月前`;
}

export function getDomain(url) {
  try { return new URL(url).hostname; } catch { return url; }
}

export function getFavicon(url) {
  return `https://www.google.com/s2/favicons?domain=${getDomain(url)}&sz=32`;
}

