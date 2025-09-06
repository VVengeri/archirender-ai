/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect } from 'react';
import { useTranslation } from '../i18n';
import { CloseIcon } from './icons';

interface FullscreenViewerProps {
  imageUrl: string;
  onClose: () => void;
}

const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ imageUrl, onClose }) => {
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <button 
        className="absolute top-5 right-5 text-white w-12 h-12 p-3 bg-black/40 rounded-full hover:bg-black/60 transition-all focus:outline-none focus:ring-2 focus:ring-white z-10"
        onClick={onClose}
        aria-label={t('fullscreen.close')}
      >
        <CloseIcon />
      </button>
      <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <img 
          src={imageUrl} 
          alt={t('fullscreen.alt')}
          className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
};

export default FullscreenViewer;