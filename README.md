# React Native Boilerplate

A complete React Native boilerplate with TypeScript, NativeWind, i18n, Zustand, Axios, and React Navigation.

## 🚀 Features

- **TypeScript** - Type-safe development
- **NativeWind v4** - Tailwind CSS for React Native with dark mode support
- **i18n** - Internationalization with react-i18next (pt-BR and en)
- **Zustand** - Lightweight state management with persistence
- **Axios** - HTTP client with interceptors
- **React Navigation** - Native stack navigation
- **ESLint + Prettier** - Code quality and formatting
- **AsyncStorage** - Persistent storage for Zustand

## 📁 Project Structure

```
src/
├── api/
│   ├── client.ts          # Axios instance with interceptors
│   └── endpoints.ts       # API endpoint constants
├── components/
│   ├── LanguageSwitcher.tsx
│   └── ui/
│       ├── Button.tsx     # Button component with variants
│       └── Card.tsx       # Card component
├── hooks/
│   ├── useColorScheme.ts  # Custom color scheme hook
│   └── useDebounce.ts     # Debounce hook
├── i18n/
│   ├── detector.ts        # Language detector
│   ├── index.ts           # i18n configuration
│   ├── types.d.ts         # TypeScript types
│   └── resources/
│       ├── en/common.json
│       └── pt-BR/common.json
├── navigation/
│   ├── index.tsx          # Navigation setup
│   └── types.ts           # Navigation types
├── screens/
│   ├── HomeScreen.tsx
│   └── SettingsScreen.tsx
├── store/
│   ├── app.store.ts       # Zustand store
│   └── index.ts
├── theme/
│   ├── tailwind.config.js
│   └── nativewind-env.d.ts
├── utils/
│   ├── dates.ts           # Date formatting utilities
│   └── format.ts          # Number/currency formatting
├── types/
│   └── global.d.ts        # Global type definitions
└── App.tsx                # Main app component
```

## 🛠️ Setup

1. **Install dependencies** (already installed):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Run on specific platform**:
   ```bash
   npm run android  # Android
   npm run ios      # iOS
   npm run web      # Web
   ```

## 📝 Configuration

### Path Aliases

The project uses `@/` as an alias for the `src/` directory. Configured in:
- `babel.config.js` - Babel module resolver
- `tsconfig.json` - TypeScript paths

### NativeWind

Dark mode is configured using the `class` strategy. Use `dark:` prefix for dark mode styles:

```tsx
<View className="bg-white dark:bg-gray-900">
  <Text className="text-gray-900 dark:text-white">Hello</Text>
</View>
```

### i18n

Supported languages:
- English (en)
- Portuguese - Brazil (pt-BR)

To add a new language:
1. Create a new JSON file in `src/i18n/resources/[lang]/common.json`
2. Add the language code to `src/i18n/index.ts`

Usage:
```tsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
<Text>{t('welcome')}</Text>
```

### Theme Management

Theme is managed via Zustand store. Supports:
- `light` - Light mode
- `dark` - Dark mode
- `system` - Follow system preference

```tsx
import { useAppStore } from '@/store';

const { theme, setTheme } = useAppStore();
setTheme('dark');
```

### API Client

Axios client is pre-configured with interceptors. Use it like:

```tsx
import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';

// GET request
const response = await apiClient.get(API_ENDPOINTS.USERS);

// POST request
const response = await apiClient.post(API_ENDPOINTS.USERS, userData);
```

## 🎨 Components

### Button

```tsx
import { Button } from '@/components/ui/Button';

<Button
  title="Click me"
  onPress={() => {}}
  variant="primary" // primary | secondary | outline
  disabled={false}
  loading={false}
/>
```

### Card

```tsx
import { Card } from '@/components/ui/Card';

<Card>
  <Text>Card content</Text>
</Card>
```

### LanguageSwitcher

```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

<LanguageSwitcher />
```

## 📚 Utilities

### Date Formatting

```tsx
import { formatDate, formatTime, formatRelativeTime } from '@/utils/dates';

formatDate(new Date()); // "November 5, 2024"
formatTime(new Date()); // "08:30 PM"
formatRelativeTime(new Date()); // "2 hours ago"
```

### Number Formatting

```tsx
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/format';

formatCurrency(1000); // "$1,000.00"
formatNumber(1000); // "1,000"
formatPercentage(25); // "25.00%"
```

## 🔧 Development

### Linting

```bash
npm run lint
```

### Type Checking

TypeScript will check types automatically. Configure your IDE to show TypeScript errors.

## 📦 Dependencies

All required dependencies are already installed:
- `nativewind` - Tailwind CSS for React Native
- `i18next` & `react-i18next` - Internationalization
- `react-native-localize` - Device locale detection
- `zustand` - State management
- `axios` - HTTP client
- `@react-navigation/native` & `@react-navigation/native-stack` - Navigation
- `@react-native-async-storage/async-storage` - Storage

## 🎯 Next Steps

1. Customize the theme colors in `tailwind.config.js`
2. Add more screens in `src/screens/`
3. Configure API endpoints in `src/api/endpoints.ts`
4. Add more translations in `src/i18n/resources/`
5. Extend the Zustand store with more state

## 📄 License

MIT
