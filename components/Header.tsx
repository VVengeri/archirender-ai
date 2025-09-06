/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { useTranslation } from '../i18n';
import HeartIcon from './HeartIcon';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const changeLanguage = (lang: 'en' | 'ru') => {
    i18n.changeLanguage(lang);
  };

  return (
    <header className="w-full py-4 px-8 border-b border-gray-700 bg-gray-800/30 backdrop-blur-sm sticky top-0 z-50 flex items-center justify-between">
      <div className="flex items-center gap-3">
          <HeartIcon />
          <h1 className="text-xl font-bold tracking-tight text-gray-100">
            {t('header.title')}
          </h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => changeLanguage('en')}
          className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${currentLang.startsWith('en') ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-white/10'}`}
        >
          EN
        </button>
        <button
          onClick={() => changeLanguage('ru')}
          className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${currentLang.startsWith('ru') ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-white/10'}`}
        >
          RU
        </button>
      </div>
    </header>
  );
};

export default Header;