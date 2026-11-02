import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import thCommon from './locales/th/common.json';
import thAuth from './locales/th/auth.json';
import thStudent from './locales/th/student.json';
import thEmployer from './locales/th/employer.json';

import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enStudent from './locales/en/student.json';
import enEmployer from './locales/en/employer.json';

const resources = {
  th: {
    common: thCommon,
    auth: thAuth,
    student: thStudent,
    employer: thEmployer,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    student: enStudent,
    employer: enEmployer,
  },
};

const LANGUAGE_STORAGE_KEY = 'jobboard_language';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'th',
    defaultNS: 'common',
    fallbackNS: 'common',
    ns: ['common', 'auth', 'student', 'employer'],
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, // React handles escaping
    },
    react: {
      useSuspense: false,
      nsMode: 'fallback',
    },
  });

// Ensure default fallback to 'th' if no valid language is stored
if (!localStorage.getItem(LANGUAGE_STORAGE_KEY)) {
  i18n.changeLanguage('th');
}

export default i18n;
