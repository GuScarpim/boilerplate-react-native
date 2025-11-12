export const colors = {
  light: {
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: {
      primary: '#111827',
      secondary: '#4B5563',
      inverse: '#FFFFFF',
    },
    primary: '#EF4444',
    primaryForeground: '#FFFFFF',
    secondary: '#E5E7EB',
    secondaryForeground: '#111827',
    border: '#E5E7EB',
    shadow: 'rgba(0, 0, 0, 0.1)',
    header: '#EF4444',
  },
  dark: {
    background: '#0F0F0F',
    card: '#1F1F1F',
    text: {
      primary: '#F8FAFC',
      secondary: '#9CA3AF',
      inverse: '#0F0F0F',
    },
    primary: '#B91C1C',
    primaryForeground: '#F8FAFC',
    secondary: '#374151',
    secondaryForeground: '#F8FAFC',
    border: '#3F3F46',
    shadow: 'rgba(0, 0, 0, 0.3)',
    header: '#1F1F1F',
  },
} as const;

export type ThemeMode = keyof typeof colors;

export const getThemeColors = (mode: ThemeMode = 'light') => colors[mode];

