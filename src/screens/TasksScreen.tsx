import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTasks, useAutoSync } from '@/hooks/useTasks';
import { useNetworkStatus } from '@/services/network.service';
import { useSyncStore } from '@/store/sync.store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';

export const TasksScreen: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const { tasks, isLoading, createTask, updateTask, deleteTask, sync, pendingActionsCount } =
    useTasks();
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const { isSyncing, lastSyncAt, autoSyncEnabled, setAutoSyncEnabled } = useSyncStore();

  const { countdown, isWaitingForSync } = useAutoSync(sync);

  const handleToggleAutoSync = () => {
    setAutoSyncEnabled(!autoSyncEnabled);
  };

  const handleAddTask = () => {
    if (!inputValue.trim()) return;

    createTask(inputValue.trim());
    setInputValue('');
  };

  const handleToggleTask = (task: any) => {
    updateTask({ id: task.id, completed: !task.completed });
  };

  const handleDeleteTask = (task: any) => {
    Alert.alert(
      'Deletar Tarefa',
      `Deseja realmente deletar "${task.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: () => deleteTask(task.id),
        },
      ]
    );
  };

  const handleManualSync = async () => {
    if (!isConnected) {
      Alert.alert('Offline', 'Você está offline. Conecte-se à internet para sincronizar.');
      return;
    }

    await sync();
    Alert.alert('Sincronização', 'Sincronização concluída!');
  };

  const isOnline = isConnected && isInternetReachable;

  return (
    <View className="flex-1 bg-background">
      {/* Status Bar */}
      <View className="bg-blue-500 dark:bg-blue-700 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View
              className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'
                }`}
            />
            <Text className="text-white font-semibold">
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            {pendingActionsCount > 0 && (
              <View className="bg-orange-500 px-2 py-1 rounded">
                <Text className="text-white text-xs font-bold">
                  {pendingActionsCount} pendente{pendingActionsCount > 1 ? 's' : ''}
                </Text>
              </View>
            )}
            {isSyncing && <ActivityIndicator size="small" color="white" />}
          </View>
        </View>
        {lastSyncAt && (
          <Text className="text-white/80 text-xs mt-1">
            Última sincronização: {new Date(lastSyncAt).toLocaleTimeString()}
          </Text>
        )}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        <View className="gap-4">
          {/* Adicionar Tarefa */}
          <Card>
            <Text className="text-xl font-bold mb-3 text-foreground">
              Nova Tarefa
            </Text>
            <View className="flex-row gap-2">
              <TextInput
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-foreground bg-background"
                placeholder="Digite uma tarefa..."
                placeholderTextColor="#999"
                value={inputValue}
                onChangeText={setInputValue}
                onSubmitEditing={handleAddTask}
              />
              <Button
                title="+"
                onPress={handleAddTask}
                variant="primary"
                className="min-w-[50px]"
              />
            </View>
          </Card>

          {/* Controles de Sincronização */}
          <Card>
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground">
                  Sincronização Automática
                </Text>
                <Text className="text-sm text-muted mt-1">
                  {autoSyncEnabled
                    ? 'Ativada - Sincroniza automaticamente quando online'
                    : 'Desativada - Sincronize manualmente'}
                </Text>
              </View>
              <Toggle value={autoSyncEnabled} onValueChange={setAutoSyncEnabled} />
            </View>

            {autoSyncEnabled && isOnline && countdown !== null && (
              <View className="flex-row items-center gap-2 mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                {!isSyncing && (
                  <ActivityIndicator size="small" color="#3B82F6" />
                )}
                <Text className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {isSyncing
                    ? 'Sincronizando...'
                    : `Próxima sincronização em ${countdown} segundo${countdown !== 1 ? 's' : ''}`}
                </Text>
              </View>
            )}

            <Button
              title={isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
              onPress={handleManualSync}
              variant="secondary"
              disabled={isSyncing || !isOnline}
            />
          </Card>

          {/* Lista de Tarefas */}
          <View>
            <Text className="text-lg font-semibold mb-3 text-foreground">
              Tarefas ({tasks.length})
            </Text>

            {isLoading ? (
              <View className="items-center py-8">
                <ActivityIndicator size="large" />
              </View>
            ) : tasks.length === 0 ? (
              <Card>
                <Text className="text-center text-muted">
                  Nenhuma tarefa ainda. Adicione uma acima!
                </Text>
              </Card>
            ) : (
              <View className="gap-2">
                {tasks.map((task) => (
                  <Card key={task.id}>
                    <View className="flex-row items-center justify-between">
                      <TouchableOpacity
                        className="flex-1 flex-row items-center gap-3"
                        onPress={() => handleToggleTask(task)}
                      >
                        <View
                          className={`w-6 h-6 rounded border-2 items-center justify-center ${task.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-400'
                            }`}
                        >
                          {task.completed && (
                            <Text className="text-white text-xs font-bold">✓</Text>
                          )}
                        </View>
                        <Text
                          className={`flex-1 ${task.completed
                            ? 'line-through text-muted'
                            : 'text-foreground'
                            }`}
                        >
                          {task.title}
                        </Text>
                      </TouchableOpacity>
                      <View className="flex-row items-center gap-2">
                        {!task.synced && (
                          <View className="w-2 h-2 rounded-full bg-orange-500" />
                        )}
                        <TouchableOpacity
                          onPress={() => handleDeleteTask(task)}
                          className="p-2"
                        >
                          <Text className="text-red-500 font-bold">×</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {task.synced && task.server_id && (
                      <Text className="text-xs text-muted mt-2">
                        Sincronizada • ID: {task.server_id}
                      </Text>
                    )}
                  </Card>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

