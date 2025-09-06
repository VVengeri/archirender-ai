/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { BuildingIcon } from './icons';

type VisualizeMode = '3dview' | 'isometric' | 'floorplan' | 'exploded';

interface VisualizePanelProps {
  onApplyVisualization: (mode: VisualizeMode) => void;
  isLoading: boolean;
}

const VisualizePanel: React.FC<VisualizePanelProps> = ({ onApplyVisualization, isLoading }) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<VisualizeMode>('3dview');
  
  const modes: Record<VisualizeMode, { titleKey: string; descriptionKey: string; buttonTextKey: string; labelKey: string }> = {
    '3dview': {
        titleKey: 'visualizePanel.modes.3dview.title',
        descriptionKey: 'visualizePanel.modes.3dview.description',
        buttonTextKey: 'visualizePanel.modes.3dview.button',
        labelKey: 'visualizePanel.tabs.3dview'
    },
    'isometric': {
        titleKey: 'visualizePanel.modes.isometric.title',
        descriptionKey: 'visualizePanel.modes.isometric.description',
        buttonTextKey: 'visualizePanel.modes.isometric.button',
        labelKey: 'visualizePanel.tabs.isometric'
    },
    'floorplan': {
        titleKey: 'visualizePanel.modes.floorplan.title',
        descriptionKey: 'visualizePanel.modes.floorplan.description',
        buttonTextKey: 'visualizePanel.modes.floorplan.button',
        labelKey: 'visualizePanel.tabs.floorplan'
    },
    'exploded': {
        titleKey: 'visualizePanel.modes.exploded.title',
        descriptionKey: 'visualizePanel.modes.exploded.description',
        buttonTextKey: 'visualizePanel.modes.exploded.button',
        labelKey: 'visualizePanel.tabs.exploded'
    }
  };

  const selectedMode = modes[mode];

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-6 flex flex-col items-center gap-4 animate-fade-in backdrop-blur-sm">

      <div className="w-full flex justify-center p-1 bg-gray-700/50 rounded-lg mb-4">
        {(Object.keys(modes) as VisualizeMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`styled-button ${mode === m ? 'active' : ''}`}
            style={{fontSize: '16px', padding: '10px 15px'}}
          >
            <p>{t(modes[m].labelKey)}</p>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center w-16 h-16 bg-gray-700/50 rounded-full mb-2 border border-gray-600">
          <BuildingIcon className="w-8 h-8 text-purple-400" />
      </div>

      <h3 className="text-xl font-bold text-center text-gray-100">{t(selectedMode.titleKey)}</h3>
      <p className="text-md text-gray-400 text-center max-w-lg">
        {t(selectedMode.descriptionKey)}
      </p>
      
      <div className="w-full max-w-sm mt-4">
        <button
            onClick={() => onApplyVisualization(mode)}
            className="styled-button"
            disabled={isLoading}
        >
            <p>{t(selectedMode.buttonTextKey)}</p>
        </button>
      </div>
    </div>
  );
};

export default VisualizePanel;
