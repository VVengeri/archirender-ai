/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from './i18n';
import { generateEditedImage, generateFilteredImage, generateAdjustedImage, generateVisualization, generateStyledImageByReference, generateStyledImageByPrompt, generateCameraPresetImage, generateRetouchedImage, generateLightingChange, generateQuickNightScene } from './services/geminiService';
import Header from './components/Header';
import Spinner from './components/Spinner';
import FilterPanel from './components/FilterPanel';
import AdjustmentPanel from './components/AdjustmentPanel';
import { UndoIcon, RedoIcon, EyeIcon } from './components/icons';
import StartScreen from './components/StartScreen';
import VisualizePanel from './components/VisualizePanel';
import StylizePanel from './components/StylizePanel';
import CameraPanel from './components/CameraPanel';
import RetouchPanel from './components/RetouchPanel';
import NightPanel from './components/NightPanel';
import FullscreenViewer from './components/FullscreenViewer';

// Helper to convert a data URL string to a File object
const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    if (arr.length < 2) throw new Error("Invalid data URL");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || !mimeMatch[1]) throw new Error("Could not parse MIME type from data URL");

    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

type Tab = 'retouch' | 'visualize' | 'stylize' | 'camera' | 'night' | 'adjust' | 'filters';

const App: React.FC = () => {
  const { t } = useTranslation();
  const [history, setHistory] = useState<File[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSegmenting, setIsSegmenting] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [editHotspot, setEditHotspot] = useState<{ x: number, y: number } | null>(null);
  const [displayHotspot, setDisplayHotspot] = useState<{ x: number, y: number } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('retouch');
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [styleReferenceImage, setStyleReferenceImage] = useState<File | null>(null);
  const [retouchPrompt, setRetouchPrompt] = useState<string>('');
  
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const currentImage = history[historyIndex] ?? null;
  const originalImage = history[0] ?? null;

  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

  // Effect to create and revoke object URLs safely for the current image
  useEffect(() => {
    if (currentImage) {
      const url = URL.createObjectURL(currentImage);
      setCurrentImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setCurrentImageUrl(null);
    }
  }, [currentImage]);
  
  // Effect to create and revoke object URLs safely for the original image
  useEffect(() => {
    if (originalImage) {
      const url = URL.createObjectURL(originalImage);
      setOriginalImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setOriginalImageUrl(null);
    }
  }, [originalImage]);


  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const addImageToHistory = useCallback((newImageFile: File) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newImageFile);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleImageUpload = useCallback((file: File) => {
    setError(null);
    setHistory([file]);
    setHistoryIndex(0);
    setEditHotspot(null);
    setDisplayHotspot(null);
    setActiveTab('retouch');
    setReferenceImage(null);
    setStyleReferenceImage(null);
    setRetouchPrompt('');
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!currentImage) {
      setError(t('error.noImageToEdit'));
      return;
    }
    
    if (!prompt.trim()) {
        setError(t('error.promptRequired'));
        return;
    }

    if (!editHotspot) {
        setError(t('error.hotspotRequired'));
        return;
    }

    setIsLoading(true);
    setLoadingMessage(t('loading.message'));
    setError(null);
    
    try {
        const editedImageUrl = await generateEditedImage(currentImage, prompt, editHotspot);
        const newImageFile = dataURLtoFile(editedImageUrl, `edited-${Date.now()}.png`);
        addImageToHistory(newImageFile);
        setEditHotspot(null);
        setDisplayHotspot(null);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('error.unknown');
        setError(t('error.generateFailed', { error: errorMessage }));
        console.error(err);
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  }, [currentImage, prompt, editHotspot, addImageToHistory, t]);
  
  const handleApplyRetouch = useCallback(async () => {
    if (!currentImage) {
        setError(t('error.noImageToEdit'));
        return;
    }
    if (!editHotspot) {
        setError(t('error.hotspotRequiredRetouch'));
        return;
    }

    if (!referenceImage && !retouchPrompt.trim()) {
        setError(t('error.referenceOrPromptRequired'));
        return;
    }

    setIsLoading(true);
    setLoadingMessage(t('loading.message'));
    setError(null);
    
    try {
        const newImageUrl = await generateRetouchedImage(
            currentImage, 
            editHotspot,
            referenceImage, 
            retouchPrompt,
        );
        
        const newImageFile = dataURLtoFile(newImageUrl, `retouched-${Date.now()}.png`);
        addImageToHistory(newImageFile);
        setEditHotspot(null);
        setDisplayHotspot(null);
        setReferenceImage(null);
        setRetouchPrompt('');
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('error.unknown');
        setError(t('error.retouchFailed', { error: errorMessage }));
        console.error(err);
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  }, [currentImage, referenceImage, retouchPrompt, editHotspot, addImageToHistory, t]);

  const handleApplyFilter = useCallback(async (filterPrompt: string) => {
    if (!currentImage) {
      setError(t('error.noImageToFilter'));
      return;
    }
    
    setIsLoading(true);
    setLoadingMessage(t('loading.message'));
    setError(null);

    try {
        const filteredImageUrl = await generateFilteredImage(currentImage, filterPrompt);
        const newImageFile = dataURLtoFile(filteredImageUrl, `filtered-${Date.now()}.png`);
        addImageToHistory(newImageFile);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('error.unknown');
        setError(t('error.filterFailed', { error: errorMessage }));
        console.error(err);
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  }, [currentImage, addImageToHistory, t]);
  
  const handleApplyAdjustment = useCallback(async (adjustmentPrompt: string) => {
    if (!currentImage) {
      setError(t('error.noImageToAdjust'));
      return;
    }
    
    setIsLoading(true);
    setLoadingMessage(t('loading.message'));
    setError(null);
    
    try {
        const adjustedImageUrl = await generateAdjustedImage(currentImage, adjustmentPrompt);
        const newImageFile = dataURLtoFile(adjustedImageUrl, `adjusted-${Date.now()}.png`);
        addImageToHistory(newImageFile);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('error.unknown');
        setError(t('error.adjustFailed', { error: errorMessage }));
        console.error(err);
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  }, [currentImage, addImageToHistory, t]);

  const handleApplyVisualization = useCallback(async (mode: 'isometric' | 'floorplan' | '3dview' | 'exploded') => {
    if (!currentImage) {
      setError(t('error.noImageToVisualize'));
      return;
    }
    
    setIsLoading(true);
    setLoadingMessage(t('loading.message'));
    setError(null);
    
    try {
        const visualizedImageUrl = await generateVisualization(currentImage, mode);
        const newImageFile = dataURLtoFile(visualizedImageUrl, `visualized-${Date.now()}.png`);
        addImageToHistory(newImageFile);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('error.unknown');
        setError(t('error.visualizeFailed', { error: errorMessage }));
        console.error(err);
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  }, [currentImage, addImageToHistory, t]);

  const handleApplyStyle = useCallback(async (prompt?: string) => {
    if (!currentImage) {
      setError(t('error.noImageToStyle'));
      return;
    }
    
    setIsLoading(true);
    setLoadingMessage(t('loading.message'));
    setError(null);
    
    try {
        let restyledImageUrl: string;
        if (prompt) {
             restyledImageUrl = await generateStyledImageByPrompt(currentImage, prompt);
        } else {
            if (!styleReferenceImage) {
                setError(t('error.styleReferenceRequired'));
                setIsLoading(false);
                return;
            }
            restyledImageUrl = await generateStyledImageByReference(currentImage, styleReferenceImage);
        }
        
        const newImageFile = dataURLtoFile(restyledImageUrl, `styled-${Date.now()}.png`);
        addImageToHistory(newImageFile);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('error.unknown');
        setError(t('error.styleFailed', { error: errorMessage }));
        console.error(err);
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
}, [currentImage, styleReferenceImage, addImageToHistory, t]);

  const handleApplyCameraPreset = useCallback(async (prompt: string) => {
    if (!currentImage) {
      setError(t('error.noImageToPreset'));
      return;
    }
    
    setIsLoading(true);
    setLoadingMessage(t('loading.message'));
    setError(null);
    
    try {
        const presetImageUrl = await generateCameraPresetImage(currentImage, prompt);
        const newImageFile = dataURLtoFile(presetImageUrl, `preset-${Date.now()}.png`);
        addImageToHistory(newImageFile);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('error.unknown');
        setError(t('error.presetFailed', { error: errorMessage }));
        console.error(err);
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  }, [currentImage, addImageToHistory, t]);

  const handleApplyLightingChange = useCallback(async (lightingPrompt: string) => {
    if (!currentImage) {
      setError(t('error.noImageToEdit'));
      return;
    }
    if (!lightingPrompt.trim()) {
      setError(t('error.promptRequired'));
      return;
    }

    setIsLoading(true);
    setLoadingMessage(t('loading.night.applyingChange'));
    setError(null);

    try {
        const newSceneUrl = await generateLightingChange(currentImage, lightingPrompt);
        const newImageFile = dataURLtoFile(newSceneUrl, `night-change-${Date.now()}.png`);
        addImageToHistory(newImageFile);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('error.unknown');
        setError(t('error.nightSceneFailed', { error: errorMessage }));
        console.error(err);
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  }, [currentImage, addImageToHistory, t]);

  const handleGenerateQuickNightScene = useCallback(async () => {
    if (!currentImage) {
      setError(t('error.noImageToVisualize'));
      return;
    }
    
    setIsLoading(true);
    setLoadingMessage(t('loading.night.generatingBase'));
    setError(null);
    
    try {
        const nightSceneUrl = await generateQuickNightScene(currentImage);
        const newImageFile = dataURLtoFile(nightSceneUrl, `quick-night-scene-${Date.now()}.png`);
        addImageToHistory(newImageFile);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('error.unknown');
        setError(t('error.nightSceneFailed', { error: errorMessage }));
        console.error(err);
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  }, [currentImage, addImageToHistory, t]);

  const handleUndo = useCallback(() => {
    if (canUndo) {
      setHistoryIndex(historyIndex - 1);
      setEditHotspot(null);
      setDisplayHotspot(null);
      setReferenceImage(null);
      setStyleReferenceImage(null);
      setRetouchPrompt('');
    }
  }, [canUndo, historyIndex]);
  
  const handleRedo = useCallback(() => {
    if (canRedo) {
      setHistoryIndex(historyIndex + 1);
      setEditHotspot(null);
      setDisplayHotspot(null);
      setReferenceImage(null);
      setStyleReferenceImage(null);
      setRetouchPrompt('');
    }
  }, [canRedo, historyIndex]);

  const handleReset = useCallback(() => {
    if (history.length > 0) {
      setHistoryIndex(0);
      setError(null);
      setEditHotspot(null);
      setDisplayHotspot(null);
      setReferenceImage(null);
      setStyleReferenceImage(null);
      setRetouchPrompt('');
    }
  }, [history]);

  const handleUploadNew = useCallback(() => {
      setHistory([]);
      setHistoryIndex(-1);
      setError(null);
      setPrompt('');
      setEditHotspot(null);
      setDisplayHotspot(null);
      setReferenceImage(null);
      setStyleReferenceImage(null);
      setRetouchPrompt('');
  }, []);

  const handleDownload = useCallback(() => {
      if (currentImage) {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(currentImage);
          link.download = `edited-${currentImage.name}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
      }
  }, [currentImage]);
  
  const handleFileSelect = (files: FileList | null) => {
    if (files && files[0]) {
      handleImageUpload(files[0]);
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (activeTab === 'retouch' && currentImage) {
        const img = e.currentTarget;
        const rect = img.getBoundingClientRect();

        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        
        const { naturalWidth, naturalHeight, clientWidth, clientHeight } = img;
        const scaleX = naturalWidth / clientWidth;
        const scaleY = naturalHeight / clientHeight;

        const originalX = Math.round(offsetX * scaleX);
        const originalY = Math.round(offsetY * scaleY);
        
        setDisplayHotspot({ x: offsetX, y: offsetY });
        setEditHotspot({ x: originalX, y: originalY });
    } else if (currentImageUrl) {
        setIsFullscreen(true);
    }
  };

  const renderPanel = () => {
    switch (activeTab) {
        case 'retouch': return <RetouchPanel onApplyRetouch={handleApplyRetouch} onReferenceSelect={setReferenceImage} onPromptChange={setRetouchPrompt} isLoading={isLoading} hotspot={editHotspot} referenceImage={referenceImage} retouchPrompt={retouchPrompt} />;
        case 'visualize': return <VisualizePanel onApplyVisualization={handleApplyVisualization} isLoading={isLoading} />;
        case 'stylize': return <StylizePanel onApplyStyle={handleApplyStyle} onReferenceSelect={setStyleReferenceImage} referenceImage={styleReferenceImage} isLoading={isLoading} />;
        case 'camera': return <CameraPanel onApplyPreset={handleApplyCameraPreset} isLoading={isLoading} />;
        case 'night': return <NightPanel onApplyLightingChange={handleApplyLightingChange} onGenerateQuick={handleGenerateQuickNightScene} isLoading={isLoading} />;
        case 'adjust': return <AdjustmentPanel onApplyAdjustment={handleApplyAdjustment} isLoading={isLoading} />;
        case 'filters': return <FilterPanel onApplyFilter={handleApplyFilter} isLoading={isLoading} />;
        default: return null;
    }
  };

  const renderMainContent = () => {
    if (error) {
       return (
           <div className="text-center animate-fade-in bg-red-500/10 border border-red-500/20 p-8 rounded-lg max-w-2xl mx-auto flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold text-red-300">{t('error.generic')}</h2>
            <p className="text-md text-red-400">{error}</p>
            <button
                onClick={() => setError(null)}
                className="styled-button"
              >
                <p>{t('error.tryAgain')}</p>
            </button>
          </div>
        );
    }
    
    const imageDisplay = (
      <div className="relative">
        <img
            ref={imgRef}
            key={currentImageUrl}
            src={currentImageUrl!}
            alt="Current"
            onClick={handleImageClick}
            className={`w-full h-auto object-contain max-h-[70vh] rounded-xl transition-transform duration-300 ${activeTab === 'retouch' ? 'cursor-crosshair' : 'cursor-zoom-in hover:scale-[1.02]'}`}
        />
        {originalImageUrl && (
          <img
              key={originalImageUrl}
              src={originalImageUrl}
              alt="Original"
              className={`absolute top-0 left-0 w-full h-auto object-contain max-h-[70vh] rounded-xl transition-opacity duration-200 ease-in-out pointer-events-none ${isComparing ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
      </div>
    );

    return (
      <div className="w-full flex flex-col items-center gap-6 animate-fade-in">
        <div className="relative w-full shadow-2xl rounded-xl overflow-hidden bg-black/20">
            {(isLoading || isSegmenting) && (
                <div className="absolute inset-0 bg-black/70 z-30 flex flex-col items-center justify-center gap-4 animate-fade-in">
                    <Spinner />
                    <p className="text-gray-300">{loadingMessage || (isSegmenting ? t('loading.night.segmenting') : t('loading.message'))}</p>
                </div>
            )}
            
            {imageDisplay}

            {displayHotspot && !isLoading && (activeTab === 'retouch') && (
                <div 
                    className="absolute rounded-full w-6 h-6 bg-blue-500/50 border-2 border-white pointer-events-none -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{ left: `${displayHotspot.x}px`, top: `${displayHotspot.y}px` }}
                >
                    <div className="absolute inset-0 rounded-full w-6 h-6 animate-ping bg-blue-400"></div>
                </div>
            )}
        </div>
        
        <div className="w-full">
            {renderPanel()}
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button 
                onClick={handleUndo}
                disabled={!canUndo}
                className="styled-button"
                aria-label="Undo last action"
            >
                <p><UndoIcon className="w-5 h-5" />{t('controls.undo')}</p>
            </button>
            <button 
                onClick={handleRedo}
                disabled={!canRedo}
                className="styled-button"
                aria-label="Redo last action"
            >
                <p><RedoIcon className="w-5 h-5" />{t('controls.redo')}</p>
            </button>
            
            <div className="h-6 w-px bg-gray-600 mx-1 hidden sm:block"></div>

            {canUndo && (
              <button 
                  onMouseDown={() => setIsComparing(true)}
                  onMouseUp={() => setIsComparing(false)}
                  onMouseLeave={() => setIsComparing(false)}
                  onTouchStart={() => setIsComparing(true)}
                  onTouchEnd={() => setIsComparing(false)}
                  className="styled-button"
                  aria-label="Press and hold to see original image"
              >
                  <p><EyeIcon className="w-5 h-5" />{t('controls.compare')}</p>
              </button>
            )}

            <button 
                onClick={handleReset}
                disabled={!canUndo}
                className="styled-button"
              >
                <p>{t('controls.reset')}</p>
            </button>
            <button 
                onClick={handleUploadNew}
                className="styled-button"
            >
                <p>{t('controls.uploadNew')}</p>
            </button>

            <button 
                onClick={handleDownload}
                className="styled-button"
            >
                <p>{t('controls.download')}</p>
            </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen text-gray-100 flex flex-col">
      <Header />
      <main className={`flex-grow w-full max-w-[1600px] mx-auto p-4 md:p-8 flex ${!currentImage ? 'justify-center items-center' : 'items-start'}`}>
        {!currentImage ? (
           <StartScreen onFileSelect={handleFileSelect} />
        ) : (
          <div className="flex w-full gap-8">
            <aside>
                <ul className="side-menu-ul">
                    {(['retouch', 'visualize', 'stylize', 'camera', 'night', 'adjust', 'filters'] as Tab[]).map(tab => (
                        <li key={tab} className="side-menu-li">
                            <button
                                onClick={() => {
                                    if (tab !== 'retouch') {
                                        setEditHotspot(null);
                                        setDisplayHotspot(null);
                                        setReferenceImage(null);
                                        setRetouchPrompt('');
                                    }
                                    if (tab !== 'stylize') {
                                        setStyleReferenceImage(null);
                                    }
                                    setActiveTab(tab);
                                }}
                                className={`styled-button ${activeTab === tab ? 'active' : ''}`}
                            >
                                <p>{t(`tabs.${tab}`)}</p>
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>
            <div className="flex-grow">
              {renderMainContent()}
            </div>
          </div>
        )}
      </main>
      {isFullscreen && currentImageUrl && (
        <FullscreenViewer imageUrl={currentImageUrl} onClose={() => setIsFullscreen(false)} />
      )}
    </div>
  );
};

export default App;
