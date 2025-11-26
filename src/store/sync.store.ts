import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SyncState {
  isSyncing: boolean;
  lastSyncAt: string | null;
  pendingActionsCount: number;
  autoSyncEnabled: boolean;
  setIsSyncing: (isSyncing: boolean) => void;
  setLastSyncAt: (date: string) => void;
  setPendingActionsCount: (count: number) => void;
  setAutoSyncEnabled: (enabled: boolean) => void;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set) => ({
      isSyncing: false,
      lastSyncAt: null,
      pendingActionsCount: 0,
      autoSyncEnabled: true,
      setIsSyncing: (isSyncing) => set({ isSyncing }),
      setLastSyncAt: (date) => set({ lastSyncAt: date }),
      setPendingActionsCount: (count) => set({ pendingActionsCount: count }),
      setAutoSyncEnabled: (enabled) => set({ autoSyncEnabled: enabled }),
    }),
    {
      name: 'sync-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

