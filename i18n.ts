/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { createContext, useState, useContext, ReactNode, FC } from 'react';
import { translations } from './locales';

type Language = 'en' | 'ru';
type Translations = typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: { [key: string]: string }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getNestedTranslation = (obj: any, key: string): string => {
  return key.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
};

export const LanguageProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ru');

  const t = (key: string, options?: { [key: string]: string }): string => {
    const translationSet = translations[language] || translations.en;
    let translated = getNestedTranslation(translationSet, key) || key;

    if (options) {
      Object.keys(options).forEach(optionKey => {
        translated = translated.replace(`{{${optionKey}}}`, options[optionKey]);
      });
    }

    return translated;
  };
  
  const i18n = {
    language: language,
    changeLanguage: (lang: Language) => {
        if (['en', 'ru'].includes(lang)) {
            setLanguage(lang);
        }
    }
  }

  return React.createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  
  const { t, language, setLanguage } = context;
  
  const i18n = {
    language: language,
    changeLanguage: (lang: 'en' | 'ru') => setLanguage(lang),
  };
  
  return { t, i18n };
};