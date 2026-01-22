// Watchlist management with localStorage
export const addToWatchlist = (metroId: string): void => {
  if (typeof window === 'undefined') return;

  const watchlist = getWatchlist();
  if (!watchlist.includes(metroId)) {
    watchlist.push(metroId);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }
};

export const removeFromWatchlist = (metroId: string): void => {
  if (typeof window === 'undefined') return;

  const watchlist = getWatchlist();
  const filtered = watchlist.filter(id => id !== metroId);
  localStorage.setItem('watchlist', JSON.stringify(filtered));
};

export const isInWatchlist = (metroId: string): boolean => {
  if (typeof window === 'undefined') return false;

  const watchlist = getWatchlist();
  return watchlist.includes(metroId);
};

export const getWatchlist = (): string[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem('watchlist');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const clearWatchlist = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('watchlist');
};
