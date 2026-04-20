// utils.js 

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

