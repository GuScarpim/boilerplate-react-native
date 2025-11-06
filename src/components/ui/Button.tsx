import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { colors } from '@/theme/colors';

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

  const baseClasses = 'px-6 py-3 rounded-lg items-center justify-center';
  const variantClasses = {
    primary:
      'bg-primary-light dark:bg-primary-dark active:bg-primary-600 dark:active:bg-primary-800',
    secondary:
      'bg-gray-200 dark:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600',
    outline:
      'border-2 border-gray-300 dark:border-gray-600 bg-transparent',
  };

  const textColorClasses = {
    primary: 'text-white',
    secondary: 'text-gray-900 dark:text-white',
    outline: 'text-gray-900 dark:text-white',
  };

  const getActivityIndicatorColor = () => {
    if (variant === 'primary') {
      return colors.text.white;
    }
    return isDark ? colors.text.white : colors.text.black;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${disabled || loading ? 'opacity-50' : ''
        }`}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getActivityIndicatorColor()} />
      ) : (
        <Text className={`font-semibold ${textColorClasses[variant]}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

