import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <View
      className={`rounded-xl p-4 bg-card border border-border/60 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};

