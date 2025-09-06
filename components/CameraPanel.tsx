/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { CameraIcon } from './icons';

interface CameraPanelProps {
  onApplyPreset: (prompt: string) => void;
  isLoading: boolean;
}

interface Preset {
  name: string;
  nameKey: string;
  prompt: string;
}

const CameraPanel: React.FC<CameraPanelProps> = ({ onApplyPreset, isLoading }) => {
  const { t } = useTranslation();
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);

  const presets: Preset[] = [
    { name: 'Wide-Angle (16mm, f/8)', nameKey: 'wide', prompt: 'Simulate a photo taken with a 16mm wide-angle lens at an f/8 aperture. The image should have a deep depth of field with everything in sharp focus, characteristic of landscape or architectural photography. Enhance with HDR for balanced lighting.' },
    { name: 'Standard (50mm, f/4)', nameKey: 'standard', prompt: 'Simulate a photo taken with a standard 50mm lens at an f/4 aperture. The image should have a natural perspective with a moderate depth of field, keeping the main subject sharp while slightly softening the background.' },
    { name: 'Portrait (85mm, f/1.8)', nameKey: 'portrait', prompt: 'Simulate a photo taken with an 85mm portrait lens at a wide f/1.8 aperture. Create a very shallow depth of field, rendering the background into a smooth, creamy bokeh while the main subject remains exceptionally sharp.' },
    { name: 'Macro (105mm, f/5.6)', nameKey: 'macro', prompt: 'Simulate a close-up macro shot taken with a 105mm lens at f/5.6. Emphasize fine details and textures on the main subject with extreme sharpness, while the background falls off into a gentle blur.' },
  ];

  const handleApply = () => {
    if (selectedPreset) {
      onApplyPreset(selectedPreset.prompt);
    }
  };

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-6 flex flex-col items-center gap-4 animate-fade-in backdrop-blur-sm">
      <div className="flex items-center justify-center w-16 h-16 bg-gray-700/50 rounded-full mb-2 border border-gray-600">
          <CameraIcon className="w-8 h-8 text-cyan-400" />
      </div>
      <h3 className="text-xl font-bold text-center text-gray-100">{t('cameraPanel.title')}</h3>
      <p className="text-md text-gray-400 text-center max-w-lg">
        {t('cameraPanel.description')}
      </p>
      
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
        {presets.map(preset => (
          <button
            key={preset.nameKey}
            onClick={() => setSelectedPreset(preset)}
            disabled={isLoading}
            className={`styled-button ${selectedPreset?.nameKey === preset.nameKey ? 'active' : ''}`}
          >
            <p>{t(`cameraPanel.presets.${preset.nameKey}`)}</p>
          </button>
        ))}
      </div>
      
      {selectedPreset && (
        <div className="w-full max-w-sm animate-fade-in flex flex-col gap-4 pt-4">
          <button
            onClick={handleApply}
            className="styled-button"
            disabled={isLoading || !selectedPreset}
          >
            <p>{t('cameraPanel.button', { preset: t(`cameraPanel.presets.${selectedPreset.nameKey}`) })}</p>
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraPanel;
