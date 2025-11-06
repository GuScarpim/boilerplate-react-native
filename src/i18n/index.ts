import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { languageDetector } from './detector';

import enCommon from './resources/en/common.json';
import ptBRCommon from './resources/pt-BR/common.json';

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    supportedLngs: ['en', 'pt-BR'],
    defaultNS: 'common',
    ns: ['common'],
    resources: {
      en: {
        common: enCommon,
      },
      'pt-BR': {
        common: ptBRCommon,
      },
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;

