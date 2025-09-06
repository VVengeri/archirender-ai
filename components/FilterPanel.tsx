/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { PaletteIcon } from './icons';

interface FilterPanelProps {
  onApplyFilter: (prompt: string) => void;
  isLoading: boolean;
}

interface Filter {
  nameKey: string;
  prompt: string;
}

type FilterCategoryName = 'Quality' | 'Atmosphere' | 'Style' | 'Effects';
type FilterCategoryKey = 'quality' | 'atmosphere' | 'style' | 'effects';

interface FilterCategory {
  name: FilterCategoryName;
  nameKey: FilterCategoryKey;
  filters: Filter[];
}

const filterStudio: FilterCategory[] = [
  {
    name: 'Quality',
    nameKey: 'quality',
    filters: [
      { nameKey: 'hdrBalance', prompt: 'Apply filter: HDR Balance. Evenly adjust highlights and shadows, recover details in bright and dark areas, preserve geometry and materials, photorealistic output.' },
      { nameKey: 'clarityBoost', prompt: 'Apply filter: Clarity Boost. Enhance micro-textures of surfaces like fabric, stone, and wood, increase depth without oversharpening, keep photorealism.' },
      { nameKey: 'noiseReduction', prompt: 'Apply filter: Noise Reduction. Remove digital noise and grain while keeping fine details and textures intact, photorealistic high-quality render.' },
      { nameKey: 'sharpnessPro', prompt: 'Apply filter: Sharpness Pro. Accentuate edges, lines, and architectural geometry, improve definition without artifacts, photorealistic finish.' },
    ]
  },
  {
    name: 'Atmosphere',
    nameKey: 'atmosphere',
    filters: [
      { nameKey: 'warmLight', prompt: 'Apply filter: Warm Light. Add soft golden tones, simulate warm evening lamp glow, preserve realism and natural textures.' },
      { nameKey: 'coolLight', prompt: 'Apply filter: Cool Light. Introduce subtle cold bluish tones, simulate daylight in modern high-tech interiors, photorealistic look.' },
      { nameKey: 'naturalDaylight', prompt: 'Apply filter: Natural Daylight. Create soft diffuse sunlight, balanced contrast, simulate realistic daylight from windows, photorealistic output.' },
      { nameKey: 'moodyShadows', prompt: 'Apply filter: Moody Shadows. Enhance contrast, deepen shadows, add dramatic cinematic mood, keep geometry and realism intact.' },
    ]
  },
  {
    name: 'Style',
    nameKey: 'style',
    filters: [
      { nameKey: 'minimalistWhite', prompt: 'Apply filter: Minimalist White. Brighten whites, reduce color saturation slightly, create clean Scandinavian-style mood, keep photorealistic textures.' },
      { nameKey: 'industrialGrey', prompt: 'Apply filter: Industrial Grey. Shift tones toward neutral greys, add slight metallic feel, preserve realistic concrete and metal surfaces.' },
      { nameKey: 'earthTones', prompt: 'Apply filter: Earth Tones. Add warm natural colors like beige, terracotta, olive, maintain soft shadows and realistic surfaces.' },
      { nameKey: 'retroFilm', prompt: 'Apply filter: Retro Film. Add subtle analog film effect, slight warm grain and vignette, preserve realism and clarity of architecture.' },
    ]
  },
  {
    name: 'Effects',
    nameKey: 'effects',
    filters: [
      { nameKey: 'bloom', prompt: 'Apply filter: Bloom. Add soft glow around light sources, simulate realistic lens diffusion, preserve photorealistic materials.' },
      { nameKey: 'lensFlare', prompt: 'Apply filter: Lens Flare. Introduce subtle camera-like light streaks and reflections, integrated naturally with scene lighting, photorealistic.' },
      { nameKey: 'depthBlur', prompt: 'Apply filter: Depth Blur. Apply shallow depth of field, keep foreground sharp while softly blurring background, simulate DSLR lens, photorealistic.' },
      { nameKey: 'vignette', prompt: 'Apply filter: Vignette. Add soft darkening around edges, focus viewer’s eye on central area, maintain photorealism and textures.' },
    ]
  },
];

const FilterPanel: React.FC<FilterPanelProps> = ({ onApplyFilter, isLoading }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<FilterCategoryKey>('quality');
  
  const activeCategory = filterStudio.find(cat => cat.nameKey === activeTab);

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-6 flex flex-col gap-6 animate-fade-in backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-700/50 rounded-full border border-gray-600">
            <PaletteIcon className="w-6 h-6 text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-center text-gray-100">{t('filterPanel.title')}</h3>
        <p className="text-sm text-gray-400">{t('filterPanel.description')}</p>
      </div>
      
      <div className="w-full flex p-1 bg-gray-700/50 rounded-lg">
        {filterStudio.map(cat => (
          <button
            key={cat.nameKey}
            onClick={() => setActiveTab(cat.nameKey)}
            disabled={isLoading}
            className={`styled-button ${activeTab === cat.nameKey ? 'active' : ''}`}
          >
            <p>{t(`filterPanel.tabs.${cat.nameKey}`)}</p>
          </button>
        ))}
      </div>

      <div className="w-full">
        {activeCategory && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in">
                {activeCategory.filters.map(filter => (
                    <button
                        key={filter.nameKey}
                        onClick={() => onApplyFilter(filter.prompt)}
                        disabled={isLoading}
                        className="styled-button"
                    >
                        <p>{t(`filterPanel.filters.${activeCategory.nameKey}.${filter.nameKey}`)}</p>
                    </button>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
