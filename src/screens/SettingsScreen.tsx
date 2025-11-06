import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Card } from '@/components/ui/Card';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useAppStore, Theme } from '@/store';

export const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const { theme, setTheme } = useAppStore();
  const isDark = colorScheme === 'dark';

  const themes: { value: Theme; label: string; }[] = [
    { value: 'light', label: t('light') },
    { value: 'dark', label: t('dark') },
    { value: 'system', label: t('system') },
  ];

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-gray-950"
      contentContainerStyle={{ padding: 16 }}
    >
      <View className="gap-4">
        <Card>
          <Text className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {t('language')}
          </Text>
          <LanguageSwitcher />
        </Card>

        <Card>
          <Text className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {t('theme')}
          </Text>
          <View className="gap-2">
            {themes.map((themeOption) => {
              const isActive = theme === themeOption.value;
              return (
                <TouchableOpacity
                  key={themeOption.value}
                  onPress={() => handleThemeChange(themeOption.value)}
                  className={`px-4 py-3 rounded-lg ${isActive
                    ? 'bg-primary-light dark:bg-primary-dark'
                    : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                >
                  <Text
                    className={`font-medium ${isActive
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                      }`}
                  >
                    {themeOption.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            {t('currentTheme', { theme: theme })}
          </Text>
        </Card>

        <Card>
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            App Info
          </Text>
          <Text className="mt-2 text-gray-600 dark:text-gray-300">
            Version: 1.0.0
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
};

