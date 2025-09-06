/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { MoonIcon } from './icons';
import LightSwitch from './LightSwitch';

interface NightPanelProps {
  onApplyLightingChange: (prompt: string) => void;
  onGenerateQuick: () => void;
  isLoading: boolean;
}

const NightPanel: React.FC<NightPanelProps> = ({ 
    onApplyLightingChange, 
    onGenerateQuick, 
    isLoading 
}) => {
  const { t } = useTranslation();
  const [lightingPrompt, setLightingPrompt] = useState('');

  const handleGenerate = () => {
    if (lightingPrompt.trim()) {
      onApplyLightingChange(lightingPrompt);
      setLightingPrompt(''); // Clear after submitting
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && lightingPrompt.trim()) {
        handleGenerate();
    }
  };

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-6 flex flex-col items-center gap-6 animate-fade-in backdrop-blur-sm">
        <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-700/50 rounded-full border border-gray-600">
                <MoonIcon className="w-6 h-6 text-yellow-300" />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-100">{t('nightPanel.title')}</h3>
        </div>

        <div className="w-full flex flex-col items-center gap-4">
            <h4 className="font-semibold text-gray-300">{t('nightPanel.step1.title')}</h4>
            <LightSwitch
                label={t('nightPanel.step1.button')}
                onClick={onGenerateQuick}
                disabled={isLoading}
            />
        </div>

        <div className="w-full max-w-sm flex items-center gap-4">
            <div className="flex-grow h-px bg-gray-600"></div>
            <span className="text-gray-400 font-semibold">{t('nightPanel.dividerText')}</span>
            <div className="flex-grow h-px bg-gray-600"></div>
        </div>
      
        <div className="w-full flex flex-col gap-4 items-center">
            <div className="w-full max-w-xl text-center">
              <h4 className="font-semibold text-gray-300">{t('nightPanel.step2.title')}</h4>
              <p className="text-sm text-gray-400 mt-1">{t('nightPanel.step2.description')}</p>
            </div>
            
            <div className="w-full max-w-xl flex items-center gap-2 mt-2">
                <input
                    type="text"
                    value={lightingPrompt}
                    onChange={(e) => setLightingPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('nightPanel.step2.placeholder')}
                    className="flex-grow bg-gray-800 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base"
                    disabled={isLoading}
                />
                <button
                    onClick={handleGenerate}
                    className="styled-button"
                    disabled={isLoading || !lightingPrompt.trim()}
                >
                    <p>{t('common.generate')}</p>
                </button>
            </div>
        </div>
    </div>
  );
};

export default NightPanel;
