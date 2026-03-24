import { VisitItem } from '../types';

const RECENT_KEY = 'idp.recent.v1';
const PINNED_KEY = 'idp.pinned.v1';
const MAX_RECENT = 8;

const hasStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

const safeRead = (key: string): VisitItem[] => {
  if (!hasStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const safeWrite = (key: string, value: VisitItem[]) => {
  if (!hasStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

export const loadRecent = () => safeRead(RECENT_KEY);

export const loadPinned = () => safeRead(PINNED_KEY);

export const recordVisit = (item: VisitItem) => {
  const next = [item, ...loadRecent().filter(existing => existing.id !== item.id)].slice(
    0,
    MAX_RECENT,
  );
  safeWrite(RECENT_KEY, next);
};

export const togglePinned = (item: VisitItem) => {
  const current = loadPinned();
  const exists = current.some(existing => existing.id === item.id);

  const next = exists
    ? current.filter(existing => existing.id !== item.id)
    : [item, ...current].slice(0, MAX_RECENT);

  safeWrite(PINNED_KEY, next);
  return next;
};
