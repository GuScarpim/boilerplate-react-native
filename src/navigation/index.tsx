import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from '@/hooks/useColorScheme';
import { RootStackParamList } from './types';
import { HomeScreen } from '@/screens/HomeScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { useAppStore } from '@/store';
import { colors } from '@/theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppRoutes: React.FC = () => {
  const colorScheme = useColorScheme();
  const { theme } = useAppStore();
  const isDark = colorScheme === 'dark';

  const navigationTheme = isDark ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? colors.header.dark : colors.header.light,
          },
          headerTintColor: colors.text.white,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: colors.text.white,
          },
          contentStyle: {
            backgroundColor: isDark ? colors.background.dark : colors.background.light,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Home',
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Settings',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

