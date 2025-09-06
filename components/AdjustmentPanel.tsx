/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { useTranslation } from '../i18n';

interface AdjustmentPanelProps {
  onApplyAdjustment: (prompt: string) => void;
  isLoading: boolean;
}

const AdjustmentPanel: React.FC<AdjustmentPanelProps> = ({ onApplyAdjustment, isLoading }) => {
  const { t } = useTranslation();
  const [selectedPresetPrompt, setSelectedPresetPrompt] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');

  const presets = [
    { nameKey: 'blurBackground', prompt: 'Apply a realistic depth-of-field effect, making the background blurry while keeping the main subject in sharp focus.' },
    { nameKey: 'enhanceDetails', prompt: 'Slightly enhance the sharpness and details of the image without making it look unnatural.' },
    { nameKey: 'warmerLighting', prompt: 'Adjust the color temperature to give the image warmer, golden-hour style lighting.' },
    { nameKey: 'studioLight', prompt: 'Add dramatic, professional studio lighting to the main subject.' },
  ];

  const activePrompt = selectedPresetPrompt || customPrompt;

  const handlePresetClick = (prompt: string) => {
    setSelectedPresetPrompt(prompt);
    setCustomPrompt('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomPrompt(e.target.value);
    setSelectedPresetPrompt(null);
  };

  const handleApply = () => {
    if (activePrompt) {
      onApplyAdjustment(activePrompt);
    }
  };

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-center text-gray-300">{t('adjustmentPanel.title')}</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {presets.map(preset => (
          <button
            key={preset.nameKey}
            onClick={() => handlePresetClick(preset.prompt)}
            disabled={isLoading}
            className={`styled-button ${selectedPresetPrompt === preset.prompt ? 'active' : ''}`}
          >
            <p>{t(`adjustmentPanel.presets.${preset.nameKey}`)}</p>
          </button>
        ))}
      </div>

      <input
        type="text"
        value={customPrompt}
        onChange={handleCustomChange}
        placeholder={t('adjustmentPanel.placeholder')}
        className="flex-grow bg-gray-800 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base"
        disabled={isLoading}
      />

      {activePrompt && (
        <div className="animate-fade-in flex flex-col gap-4 pt-2">
            <button
                onClick={handleApply}
                className="styled-button"
                disabled={isLoading || !activePrompt.trim()}
            >
                <p>{t('adjustmentPanel.button')}</p>
            </button>
        </div>
      )}
    </div>
  );
};

export default AdjustmentPanel;
