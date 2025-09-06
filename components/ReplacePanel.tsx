/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { useTranslation } from '../i18n';
import { UploadIcon } from './icons';

interface ReplacePanelProps {
  onApplyReplacement: () => void;
  onReferenceSelect: (file: File | null) => void;
  onPromptChange: (prompt: string) => void;
  isLoading: boolean;
  hotspot: { x: number, y: number } | null;
  referenceImage: File | null;
  replacementPrompt: string;
}

const ReplacePanel: React.FC<ReplacePanelProps> = ({ 
    onApplyReplacement, 
    onReferenceSelect, 
    onPromptChange,
    isLoading, 
    hotspot, 
    referenceImage,
    replacementPrompt 
}) => {
    const { t } = useTranslation();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onReferenceSelect(e.target.files[0]);
        }
    };
    
    const handlePromptInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onPromptChange(e.target.value);
    };
    
    const handleClearReference = () => {
        onReferenceSelect(null);
        const input = document.getElementById('reference-upload') as HTMLInputElement;
        if (input) input.value = '';
    };

    const canApply = hotspot && (!!referenceImage || replacementPrompt.trim() !== '');

    return (
        <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-6 flex flex-col items-center gap-4 animate-fade-in backdrop-blur-sm">
            <h3 className="text-xl font-bold text-center text-gray-100">{t('replacePanel.title')}</h3>
            
            {!hotspot ? (
                <p className="text-md text-gray-400 text-center max-w-lg">
                    {t('replacePanel.instruction1')}
                </p>
            ) : (
                <div className="w-full flex flex-col items-center gap-4 animate-fade-in">
                    <p className="text-md text-gray-400">{t('replacePanel.instruction1_complete')}</p>
                    <p className="text-md text-gray-400">{t('replacePanel.instruction2')}</p>
                    
                    <div className="w-full max-w-md flex flex-col items-center gap-4 mt-2">
                         <label htmlFor="reference-upload" className="relative w-full inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-green-600 rounded-lg cursor-pointer group hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-disabled={isLoading}>
                            <UploadIcon className="w-6 h-6 mr-3" />
                            {referenceImage ? t('replacePanel.changeReferenceButton') : t('replacePanel.uploadReferenceButton')}
                        </label>
                        <input id="reference-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isLoading} />
                        {referenceImage && (
                            <div className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 px-3 py-1 rounded-full">
                                <span>{referenceImage.name}</span>
                                <button onClick={handleClearReference} className="font-bold text-red-400 hover:text-red-300">&times;</button>
                            </div>
                        )}
                    </div>
                    
                    <div className="w-full max-w-md mt-2">
                        <input
                            type="text"
                            value={replacementPrompt}
                            onChange={handlePromptInputChange}
                            placeholder={t('replacePanel.placeholder')}
                            className="w-full bg-gray-800 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition disabled:cursor-not-allowed disabled:opacity-60 text-base"
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className="w-full max-w-sm mt-4">
                        <button
                            onClick={onApplyReplacement}
                            className="w-full bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-lg disabled:from-blue-800 disabled:to-blue-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                            disabled={isLoading || !canApply}
                        >
                            {t('replacePanel.button')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReplacePanel;