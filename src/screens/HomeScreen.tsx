import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@/navigation/types';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useAppStore } from '@/store';

export const HomeScreen: React.FC = () => {
  try {
    const { t } = useTranslation();
    const navigation = useNavigation<NavigationProp>();
    const colorScheme = useColorScheme();
    const { theme } = useAppStore();
    const isDark = colorScheme === 'dark';

    return (
      <ScrollView
        className="flex-1 bg-white dark:bg-gray-950"
        contentContainerStyle={{ padding: 16 }}
      >
        <View className="gap-4">
          <Card>
            <Text className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              {t('welcome')}
            </Text>
            <Text className="text-gray-600 dark:text-gray-300">
              {t('description')}
            </Text>
          </Card>

          <Card>
            <Text className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {t('hello', { name: 'User' })}
            </Text>
            <Text className="text-gray-600 dark:text-gray-300">
              {t('currentLanguage', { language: t('language') })}
            </Text>
            <Text className="mt-2 text-gray-600 dark:text-gray-300">
              {t('currentTheme', { theme: theme })}
            </Text>
          </Card>

          <Card>
            <Text className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              {t('changeLanguage')}
            </Text>
            <LanguageSwitcher />
          </Card>

          <Button
            title={t('settings')}
            onPress={() => navigation.navigate('Settings')}
            variant="primary"
          />

          <Button
            title={t('getStarted')}
            onPress={() => { }}
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

