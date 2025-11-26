import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/database/services/task.service';
import { pendingActionService } from '@/database/services/pending-action.service';
import { Task } from '@/database/models/task.model';
import { syncService } from '@/services/sync.service';
import { useSyncStore } from '@/store/sync.store';
import { useNetworkStatus } from '@/services/network.service';

const TASKS_QUERY_KEY = ['tasks'];
const PENDING_ACTIONS_QUERY_KEY = ['pending-actions'];

export const useTasks = () => {
  const queryClient = useQueryClient();
  const { setIsSyncing, setLastSyncAt, setPendingActionsCount } = useSyncStore();
  const { isConnected } = useNetworkStatus();

  // Query para buscar tarefas do SQLite
  const { data: tasks = [], isLoading, refetch } = useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: () => taskService.getAll(),
    staleTime: 0, // Sempre busca do SQLite
  });

  // Query para contar ações pendentes
  const { data: pendingActions = [] } = useQuery({
    queryKey: PENDING_ACTIONS_QUERY_KEY,
    queryFn: () => pendingActionService.getAll(),
    refetchInterval: 5000, // Atualiza a cada 5s
  });

  // Atualizar contador de ações pendentes
  React.useEffect(() => {
    setPendingActionsCount(pendingActions.length);
  }, [pendingActions.length, setPendingActionsCount]);

  // Mutação para criar tarefa
  const createTask = useMutation({
    mutationFn: async (title: string) => {
      const newTask = taskService.create({
        id: '',
        title,
        completed: false,
        server_id: undefined,
      });

      // Se offline, adiciona à fila de ações pendentes
      if (!isConnected) {
        pendingActionService.add('CREATE', 'task', newTask.id, newTask);
      }

      return newTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PENDING_ACTIONS_QUERY_KEY });

      // Tenta sincronizar se online
      if (isConnected) {
        syncService.sync();
      }
    },
  });

  // Mutação para atualizar tarefa
  const updateTask = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string; }) => {
      const updated = taskService.update(id, updates);
      if (!updated) throw new Error('Task not found');

      // Se offline, adiciona à fila
      if (!isConnected && !updated.synced) {
        pendingActionService.add('UPDATE', 'task', id, updated);
      }

      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PENDING_ACTIONS_QUERY_KEY });

      if (isConnected) {
        syncService.sync();
      }
    },
  });

  // Mutação para deletar tarefa
  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const task = taskService.getById(id);
      if (!task) throw new Error('Task not found');

      taskService.delete(id);

      // Se offline, adiciona à fila
      if (!isConnected && task.server_id) {
        pendingActionService.add('DELETE', 'task', id, { server_id: task.server_id });
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PENDING_ACTIONS_QUERY_KEY });

      if (isConnected) {
        syncService.sync();
      }
    },
  });

  // Função para sincronizar manualmente
  const sync = async () => {
    setIsSyncing(true);
    try {
      const result = await syncService.sync();
      setLastSyncAt(new Date().toISOString());
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PENDING_ACTIONS_QUERY_KEY });
      return result;
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    tasks,
    isLoading,
    refetch,
    createTask: createTask.mutate,
    updateTask: updateTask.mutate,
    deleteTask: deleteTask.mutate,
    sync,
    pendingActionsCount: pendingActions.length,
  };
};

// Hook para sincronizar automaticamente quando voltar online
export const useAutoSync = (syncFn: () => Promise<any>) => {
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const { isSyncing, autoSyncEnabled } = useSyncStore();
  const [countdown, setCountdown] = React.useState<number>(5);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const syncFnRef = React.useRef(syncFn);
  const SYNC_INTERVAL = 5000; // 5 segundos

  // Atualizar ref da função sync
  React.useEffect(() => {
    syncFnRef.current = syncFn;
  }, [syncFn]);

  // Iniciar/reiniciar countdown quando condições mudam
  React.useEffect(() => {
    const isOnline = Boolean(isConnected && isInternetReachable);
    const shouldSync = autoSyncEnabled && isOnline && !isSyncing;

    // Limpar intervalo existente
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!shouldSync) {
      // Se não deve sincronizar, resetar countdown para 5
      setCountdown(5);
      return;
    }

    // Iniciar countdown contínuo de 5 em 5 segundos
    setCountdown(5);

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Quando chega a 1, executar sync e reiniciar para 5
          syncFnRef.current();
          return 5;
        }
        // Decrementar a cada segundo
        return prev - 1;
      });
    }, 1000); // Atualiza a cada 1 segundo para mostrar a contagem

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoSyncEnabled, isConnected, isInternetReachable, isSyncing]);

  // Cleanup ao desmontar
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const isOnline = Boolean(isConnected && isInternetReachable);
  const shouldShowCountdown = autoSyncEnabled && isOnline;

  return {
    countdown: shouldShowCountdown ? countdown : null,
    isWaitingForSync: shouldShowCountdown && countdown > 0 && !isSyncing,
  };
};

