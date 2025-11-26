import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 60 * 24, // 24 horas (antigo cacheTime)
      retry: 2,
      networkMode: 'offlineFirst', // Prioriza cache quando offline
    },
    mutations: {
      networkMode: 'offlineFirst',
      retry: 1,
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'react-query-cache',
});

export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: 1000 * 60 * 60 * 24, // 24 horas
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
};

