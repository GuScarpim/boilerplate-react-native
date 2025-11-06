import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store';

export const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useAppStore();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'pt-BR', label: 'Português' },
  ];

  const handleLanguageChange = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
    setLanguage(langCode);
  };

  return (
    <View className="flex-row gap-2">
      {languages.map((lang) => {
        const isActive = i18n.language === lang.code || language === lang.code;
        return (
          <TouchableOpacity
            key={lang.code}
            onPress={() => handleLanguageChange(lang.code)}
            className={`px-4 py-2 rounded-lg ${isActive
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
              {lang.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

