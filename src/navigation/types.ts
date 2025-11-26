import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Tasks: undefined;
  Settings: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

