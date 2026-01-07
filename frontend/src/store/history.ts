import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HistoryEntry {
  path: string;
  title: string;
  type: 'navigation' | 'category' | 'product';
  id?: string;
  timestamp: number;
}

interface HistoryStore {
  history: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, 'timestamp'>) => void;
  clearHistory: () => void;
  removeEntry: (path: string) => void;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      history: [],
      addEntry: (entry) =>
        set((state) => ({
          history: [
            { ...entry, timestamp: Date.now() },
            ...state.history.filter((h) => h.path !== entry.path),
          ].slice(0, 50),
        })),
      clearHistory: () => set({ history: [] }),
      removeEntry: (path) =>
        set((state) => ({
          history: state.history.filter((h) => h.path !== path),
        })),
    }),
    {
      name: 'navigation-history',
      version: 1,
    },
  ),
);
