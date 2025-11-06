import i18n from 'i18next';

// Try to import react-native-localize, but handle if it's not available
let Localization: any = null;
try {
  Localization = require('react-native-localize');
} catch (error) {
  // Module not available, will use fallback
}

export const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: (callback: (language: string) => void) => {
    try {
      if (Localization) {
        const locales = Localization.getLocales();
        const languageCode = locales[0]?.languageCode || 'en';
        const languageTag = locales[0]?.languageTag || 'en';

        // Check if we have support for the full language tag (e.g., pt-BR)
        if (i18n.hasResourceBundle(languageTag, 'common')) {
          callback(languageTag);
          return;
        } else if (i18n.hasResourceBundle(languageCode, 'common')) {
          callback(languageCode);
          return;
        }
      }
    } catch (error) {
      // Fall through to default
    }

    // Fallback to default language
    callback('en');
  },
  init: () => { },
  cacheUserLanguage: () => { },
};

