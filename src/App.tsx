import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';
import { AppRoutes } from './navigation';
import { useAppStore } from './store';
import '@/i18n';
import { useColorScheme } from './hooks/useColorScheme';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const { language } = useAppStore();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    // Wait a bit for Zustand persist to hydrate
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    // Initialize i18n language from store
    if (language) {
      try {
        const i18n = require('@/i18n').default;
        i18n.changeLanguage(language);
      } catch (error) {
        console.warn('Error changing language:', error);
      }
    }

    return () => clearTimeout(timer);
  }, [language]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <Text style={{ color: '#000000' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView>
        <SafeAreaProvider>
          <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} className="flex-1 bg-white dark:bg-gray-950">
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <AppRoutes />
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

