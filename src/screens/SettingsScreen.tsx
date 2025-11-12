import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useAppStore, Theme } from '@/store';

export const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useAppStore();

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
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16 }}
    >
      <View className="gap-4">
        <Card>
          <Text className="text-xl font-semibold mb-4 text-foreground">
            {t('language')}
          </Text>
          <LanguageSwitcher />
        </Card>

        <Card>
          <Text className="text-xl font-semibold mb-4 text-foreground">
            {t('theme')}
          </Text>
          <View className="gap-2">
            {themes.map((themeOption) => {
              const isActive = theme === themeOption.value;
              return (
                <TouchableOpacity
                  key={themeOption.value}
                  onPress={() => handleThemeChange(themeOption.value)}
                  className={`px-4 py-3 rounded-lg ${isActive ? 'bg-primary' : 'bg-secondary'
                    }`}
                >
                  <Text
                    className={`font-medium ${isActive ? 'text-primary-foreground' : 'text-secondary-foreground'
                      }`}
                  >
                    {themeOption.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text className="mt-3 text-sm text-muted">
            {t('currentTheme', { theme: theme })}
          </Text>
        </Card>

        <Card>
          <Text className="text-lg font-semibold text-foreground">
            App Info
          </Text>
          <Text className="mt-2 text-muted">
            Version: 1.0.0
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
};

