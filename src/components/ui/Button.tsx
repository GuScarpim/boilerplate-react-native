import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getThemeColors } from '@/theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const palette = getThemeColors(isDark ? 'dark' : 'light');

  const baseClasses =
    'px-6 py-3 rounded-lg items-center justify-center transition-all duration-150';
  const variants = {
    primary: {
      container: 'bg-primary shadow-sm',
      text: 'text-primary-foreground',
      pressed: 'active:opacity-90',
    },
    secondary: {
      container: 'bg-secondary shadow-sm',
      text: 'text-secondary-foreground',
      pressed: 'active:opacity-90',
    },
    outline: {
      container: 'border border-border bg-transparent',
      text: 'text-foreground',
      pressed: 'active:bg-border/20',
    },
  } as const;

  const { container, text, pressed } = variants[variant];

  const getActivityIndicatorColor = () => {
    if (variant === 'primary') {
      return palette.primaryForeground;
    }
    if (variant === 'secondary') {
      return palette.secondaryForeground;
    }
    return palette.text.primary;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseClasses} ${container} ${pressed} ${className} ${disabled || loading ? 'opacity-60'
          : ''
        }`}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getActivityIndicatorColor()} />
      ) : (
        <Text className={`font-semibold ${text}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

