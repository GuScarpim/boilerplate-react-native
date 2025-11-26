import { taskService } from '@/database/services/task.service';
import { pendingActionService } from '@/database/services/pending-action.service';
import { getNetworkStatus } from './network.service';

const API_BASE = 'https://jsonplaceholder.typicode.com';

const syncTask = async (task: any) => {
  try {
    const response = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: task.title,
        body: JSON.stringify({ completed: task.completed }),
        userId: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { id: String(data.id), success: true };
  } catch (error) {
    console.error('Sync task error:', error);
    throw error;
  }
};

const updateTaskOnServer = async (serverId: string, task: any) => {
  try {
    const response = await fetch(`${API_BASE}/posts/${serverId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: serverId,
        title: task.title,
        body: JSON.stringify({ completed: task.completed }),
        userId: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Update task error:', error);
    throw error;
  }
};

const deleteTaskOnServer = async (serverId: string) => {
  try {
    const response = await fetch(`${API_BASE}/posts/${serverId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Delete task error:', error);
    throw error;
  }
};

export const syncService = {
  sync: async (): Promise<{ synced: number; errors: number; }> => {
    const networkStatus = await getNetworkStatus();

    if (!networkStatus.isConnected || !networkStatus.isInternetReachable) {
      console.log('Offline - skipping sync');
      return { synced: 0, errors: 0 };
    }

    let synced = 0;
    let errors = 0;

    // Sync tasks não sincronizadas
    const unsyncedTasks = taskService.getUnsynced();
    for (const task of unsyncedTasks) {
      try {
        if (!task.server_id) {
          // Criar no servidor
          const result = await syncTask(task);
          taskService.update(task.id, {
            synced: true,
            server_id: String(result.id)
          });
        } else {
          // atualizar no servidor
          await updateTaskOnServer(task.server_id, task);
          taskService.update(task.id, { synced: true });
        }
        synced++;
      } catch (error) {
        console.error(`Failed to sync task ${task.id}:`, error);
        errors++;
      }
    }

    // Fila maneira de ações pendentes
    const pendingActions = pendingActionService.getAll();
    for (const action of pendingActions) {
      try {
        const payload = JSON.parse(action.payload);

        switch (action.action_type) {
          case 'CREATE':
            if (!payload.server_id) {
              const result = await syncTask(payload);
              taskService.update(action.entity_id, {
                synced: true,
                server_id: String(result.id),
              });
            }
            break;
          case 'UPDATE':
            if (payload.server_id) {
              await updateTaskOnServer(payload.server_id, payload);
              taskService.update(action.entity_id, { synced: true });
            }
            break;
          case 'DELETE':
            if (payload.server_id) {
              await deleteTaskOnServer(payload.server_id);
            }
            break;
        }
        pendingActionService.delete(action.id);
        synced++;
      } catch (error) {
        console.error(`Failed to process action ${action.id}:`, error);
        pendingActionService.incrementRetry(action.id);
        // Isso aqui foi adicionado para evitar um loop infinito (Descobri da pior forma...)
        if (action.retry_count > 5) {
          pendingActionService.delete(action.id);
        }
        errors++;
      }
    }

    return { synced, errors };
  },
};

