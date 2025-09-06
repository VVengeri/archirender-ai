/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { useTranslation } from '../i18n';
import { UploadIcon } from './icons';

interface RetouchPanelProps {
  onApplyRetouch: () => void;
  onReferenceSelect: (file: File | null) => void;
  onPromptChange: (prompt: string) => void;
  isLoading: boolean;
  hotspot: { x: number, y: number } | null;
  referenceImage: File | null;
  retouchPrompt: string;
}

const RetouchPanel: React.FC<RetouchPanelProps> = ({ 
    onApplyRetouch, 
    onReferenceSelect, 
    onPromptChange,
    isLoading, 
    hotspot, 
    referenceImage,
    retouchPrompt 
}) => {
    const { t } = useTranslation();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onReferenceSelect(e.target.files[0]);
        }
    };
    
    const handlePromptInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onPromptChange(e.target.value);
    };
    
    const handleClearReference = () => {
        onReferenceSelect(null);
        const input = document.getElementById('reference-upload') as HTMLInputElement;
        if (input) input.value = '';
    };

    const canApply = hotspot && (!!referenceImage || retouchPrompt.trim() !== '');

    return (
        <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-6 flex flex-col items-center gap-4 animate-fade-in backdrop-blur-sm">
            <h3 className="text-xl font-bold text-center text-gray-100">{t('retouchPanel.title')}</h3>
            
            {!hotspot ? (
                <p className="text-md text-gray-400 text-center max-w-lg">
                    {t('retouchPanel.instruction1')}
                </p>
            ) : (
                <div className="w-full flex flex-col items-center gap-4 animate-fade-in">
                    <p className="text-md text-gray-400">{t('retouchPanel.instruction1_complete')}</p>
                    <p className="text-md text-gray-400">{t('retouchPanel.instruction2')}</p>
                    
                    <div className="w-full max-w-xl mt-2">
                        <textarea
                            value={retouchPrompt}
                            onChange={handlePromptInputChange}
                            placeholder={t('retouchPanel.placeholder')}
                            className="w-full bg-gray-800 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition disabled:cursor-not-allowed disabled:opacity-60 text-base"
                            disabled={isLoading}
                            rows={3}
                        />
                    </div>

                    <div className="w-full max-w-md flex flex-col items-center gap-4 mt-2">
                         <label htmlFor="reference-upload" className="styled-button" aria-disabled={isLoading}>
                            <p><UploadIcon className="w-5 h-5" />
                            {referenceImage ? t('retouchPanel.changeReferenceButton') : t('retouchPanel.uploadReferenceButton')}</p>
                        </label>
                        <input id="reference-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isLoading} />
                        {referenceImage && (
                            <div className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 px-3 py-1 rounded-full">
                                <span>{referenceImage.name}</span>
                                <button onClick={handleClearReference} className="font-bold text-red-400 hover:text-red-300">&times;</button>
                            </div>
                        )}
                    </div>
                    
                    <div className="w-full max-w-sm mt-4">
                        <button
                            onClick={onApplyRetouch}
                            className="styled-button"
                            disabled={isLoading || !canApply}
                        >
                            <p>{t('retouchPanel.button')}</p>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RetouchPanel;
