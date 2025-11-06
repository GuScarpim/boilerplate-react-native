import { useColorScheme as useRNColorScheme } from 'react-native';
import { useAppStore } from '@/store';

export function useColorScheme(): 'light' | 'dark' {
  try {
    const systemColorScheme = useRNColorScheme();
    const { theme } = useAppStore();

    if (theme === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }

    return theme || 'light';
  } catch (error) {
    // Fallback if store is not ready
    return 'light';
  }
}

