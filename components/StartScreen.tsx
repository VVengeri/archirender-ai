/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { CubeIcon, LayoutIcon, SunIcon } from './icons';

interface StartScreenProps {
  onFileSelect: (files: FileList | null) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onFileSelect }) => {
  const { t } = useTranslation();
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelect(e.target.files);
  };

  return (
    <div 
      className={`w-full max-w-5xl mx-auto text-center p-8 transition-all duration-300 rounded-2xl border-2 ${isDraggingOver ? 'bg-blue-500/10 border-dashed border-blue-400' : 'border-transparent'}`}
      onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDraggingOver(false);
        onFileSelect(e.dataTransfer.files);
      }}
    >
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-100 sm:text-6xl md:text-7xl"
          dangerouslySetInnerHTML={{ __html: t('startScreen.title') }}
        />
        <p className="max-w-3xl text-lg text-gray-400 md:text-xl">
          {t('startScreen.subtitle')}
        </p>

        <div className="mt-6 flex flex-col items-center gap-4">
            <label htmlFor="image-upload-start" className="styled-button">
                <p>{t('startScreen.uploadButton')}</p>
            </label>
            <input id="image-upload-start" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            <p className="text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: t('startScreen.dragDrop') }} />
        </div>

        <div className="mt-12 w-full max-w-3xl mx-auto bg-black/20 p-6 rounded-lg border border-gray-700/50 flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold text-gray-100">{t('startScreen.promo.title')}</h3>
            <p className="mt-2 text-gray-400">
                {t('startScreen.promo.description')}
            </p>
            <a 
                href="https://t.me/Archicad_storage_forum" 
                target="_blank" 
                rel="noopener noreferrer"
                className="promo-button"
            >
                {t('startScreen.promo.button')}
            </a>
        </div>

        <div className="mt-16 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-black/20 p-6 rounded-lg border border-gray-700/50 flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full mb-4">
                       <CubeIcon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-100">{t('startScreen.features.isometric.title')}</h3>
                    <p className="mt-2 text-gray-400">{t('startScreen.features.isometric.description')}</p>
                </div>
                <div className="bg-black/20 p-6 rounded-lg border border-gray-700/50 flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full mb-4">
                       <LayoutIcon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-100">{t('startScreen.features.plan.title')}</h3>
                    <p className="mt-2 text-gray-400">{t('startScreen.features.plan.description')}</p>
                </div>
                <div className="bg-black/20 p-6 rounded-lg border border-gray-700/50 flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full mb-4">
                       <SunIcon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-100">{t('startScreen.features.style.title')}</h3>
                    <p className="mt-2 text-gray-400">{t('startScreen.features.style.description')}</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default StartScreen;