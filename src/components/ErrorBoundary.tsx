import React, { Component, ReactNode } from 'react';
import { View, Text, ScrollView } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 p-5 justify-center items-center bg-white dark:bg-gray-950">
          <Text className="text-lg font-bold mb-2.5 text-gray-900 dark:text-white">
            Something went wrong
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-5">
            {this.state.error?.message || 'Unknown error'}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-500">
            Check the console for more details
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

