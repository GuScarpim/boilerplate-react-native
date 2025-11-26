import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@/navigation/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useAppStore } from '@/store';

export const HomeScreen: React.FC = () => {
  try {
    const { t } = useTranslation();
    const navigation = useNavigation<NavigationProp>();
    const { theme } = useAppStore();

    return (
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ padding: 16 }}
      >
        <View className="gap-4">
          <Card>
            <Text className="text-2xl font-bold mb-2 text-foreground">
              {t('welcome')}
            </Text>
            <Text className="text-muted">
              {t('description')}
            </Text>
          </Card>

          <Card>
            <Text className="text-xl font-semibold mb-4 text-foreground">
              {t('hello', { name: 'User' })}
            </Text>
            <Text className="text-muted">
              {t('currentLanguage', { language: t('language') })}
            </Text>
            <Text className="mt-2 text-muted">
              {t('currentTheme', { theme: theme })}
            </Text>
          </Card>

          <Card>
            <Text className="text-lg font-semibold mb-3 text-foreground">
              {t('changeLanguage')}
            </Text>
            <LanguageSwitcher />
          </Card>

          <Card>
            <Text className="text-xl font-semibold mb-3 text-foreground">
              Offline First Demo
            </Text>
            <Text className="text-muted mb-4">
              Exemplo simples e visual demonstrando offline-first com:
              {'\n'}• SQLite para dados locais
              {'\n'}• TanStack Query com persistência
              {'\n'}• Fila de sincronização
              {'\n'}• Detecção de rede
            </Text>
            <Button
              title="Ver Tarefas (Offline First)"
              onPress={() => navigation.navigate('Tasks')}
              variant="primary"
            />
          </Card>

          <Button
            title={t('settings')}
            onPress={() => navigation.navigate('Settings')}
            variant="secondary"
          />
        </View>
      </ScrollView>
    );
  } catch (error) {
    console.error('HomeScreen error:', error);
    return (
      <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
        <Text style={{ color: '#000000', fontSize: 18 }}>Error loading HomeScreen</Text>
        <Text style={{ color: '#666666', marginTop: 10 }}>{String(error)}</Text>
      </View>
    );
  }
};

