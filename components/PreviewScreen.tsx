import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { RefreshIcon, SparklesIcon, DownloadIcon, UploadIcon } from './Icons';
import { AIStyle, AspectRatio } from '../types';
import { applyAIStyle } from '../services/geminiService';
import { COUPLE_STICKER_BASE64, PHOTO_LOG_PUBLIC_URL, SECRET_TRUMP_PROMPT } from '../constants';

interface PreviewScreenProps {
  imageSrc: string;
  onRetake: () => void;
  onDone: () => void;
  aspectRatio: AspectRatio;
  onGoHome?: () => void;
  onViewGallery?: () => void;
}

interface LoadingSpinnerProps {
  message?: string;
  isSecret?: boolean;
  progress?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message, isSecret, progress }) => {
  const displayMessage = isSecret 
    ? "🎉 You found the secret preset! Creating magic..."
    : (message || "Applying AI magic...");
  
  return (
    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-40 backdrop-blur-sm">
      <div className="w-20 h-20 border-4 border-t-4 border-t-blue-400 border-gray-200 rounded-full animate-spin mb-4"></div>
      <p className="text-white mt-2 text-base sm:text-lg font-semibold text-center px-4">{displayMessage}</p>
      {progress !== undefined && (
        <div className="mt-4 w-64 sm:w-80 max-w-[80%]">
          <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            ></div>
          </div>
          <p className="text-white text-sm sm:text-base mt-2 text-center font-medium">{Math.round(progress)}%</p>
        </div>
      )}
    </div>
  );
};

const PreviewScreen: React.FC<PreviewScreenProps> = ({ imageSrc, onRetake, onDone, aspectRatio, onGoHome, onViewGallery }) => {
  const [currentImage, setCurrentImage] = useState(imageSrc);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>();
  const [isSecretLoading, setIsSecretLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Reset the current image if the original source changes (e.g., on retake)
  useEffect(() => setCurrentImage(imageSrc), [imageSrc]);

  const drawImageWithFrame = useCallback(async (canvas: HTMLCanvasElement | null, imageToDrawSrc: string) => {
    return new Promise<void>((resolve, reject) => {
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return reject('Canvas not ready');
      
      const mainImage = new Image();
      mainImage.src = imageToDrawSrc;

      const mainImagePromise = new Promise<void>((res, rej) => {
          mainImage.onload = () => res();
          mainImage.onerror = () => rej(new Error('Failed to load main image.'));
      });

      const promises: Promise<void>[] = [mainImagePromise];
      
      let stickerImage: HTMLImageElement | null = null;
      if (COUPLE_STICKER_BASE64) {
        stickerImage = new Image();
        stickerImage.src = COUPLE_STICKER_BASE64;
        const stickerImagePromise = new Promise<void>((res) => {
            if (!stickerImage) return res();
            stickerImage.onload = () => res();
            stickerImage.onerror = () => {
                console.warn('Failed to load sticker image, proceeding without it.');
                stickerImage = null; // Ensure it's not drawn
                res(); // Resolve instead of reject so saving can continue
            };
        });
        promises.push(stickerImagePromise);
      }

      Promise.all(promises).then(() => {
          canvas.width = mainImage.naturalWidth;
          canvas.height = mainImage.naturalHeight;

          // 1. Draw the photo
          ctx.drawImage(mainImage, 0, 0);

          // 2. (Removed emojis per request)

          // 3. Draw the couple sticker if it loaded (placed near the title)
          if (stickerImage && stickerImage.complete && stickerImage.naturalWidth !== 0) {
            const stickerSize = canvas.width * 0.12;
            const stickerY = canvas.height - (canvas.height * 0.24);
            const stickerX = canvas.width * 0.12; // left of title
            
            ctx.save();
            ctx.drawImage(stickerImage, stickerX, stickerY, stickerSize, stickerSize);
            ctx.restore();
          }

          // 4. Draw the frame text
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          const bottomPadding = canvas.height * 0.04;
          const titleSize = canvas.width * 0.07;
          const dateSize = canvas.width * 0.045;

          // Baby-blue glow with contrasting inner stroke
          ctx.fillStyle = 'white';
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.9)'; // baby blue stroke
          ctx.lineWidth = canvas.width * 0.01;
          ctx.shadowColor = 'rgba(147, 197, 253, 0.9)'; // soft glow blue-200
          ctx.shadowBlur = 28;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          ctx.font = `bold ${titleSize}px 'Pacifico', cursive`;
          ctx.strokeText('Manali & Raj Baby Shower', canvas.width / 2, canvas.height - bottomPadding - dateSize * 1.5);
          ctx.fillText('Manali & Raj Baby Shower', canvas.width / 2, canvas.height - bottomPadding - dateSize * 1.5);

          ctx.font = `${dateSize}px 'Pacifico', cursive`;
          ctx.strokeText('11.23.2025', canvas.width / 2, canvas.height - bottomPadding);
          ctx.fillText('11.23.2025', canvas.width / 2, canvas.height - bottomPadding);
          
          ctx.shadowColor = 'transparent'; // Reset shadow

          resolve();
      }).catch(error => reject(error));
    });
  }, []);

  // Memoize style options to prevent unnecessary re-renders
  const styleOptions = useMemo(() => Object.values(AIStyle), []);

  // Effect to draw the image and frame onto the canvas whenever the source image changes.
  useEffect(() => {
    drawImageWithFrame(canvasRef.current, currentImage);
  }, [currentImage, drawImageWithFrame]);


  const handleApplyStyle = useCallback(async (style: AIStyle) => {
    setIsLoading(true);
    setIsSecretLoading(false);
    setLoadingMessage(undefined);
    setProgress(0);
    
    // Simulate progress for better UX (since API is slow)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev; // Don't go to 100 until done
        return prev + Math.random() * 10;
      });
    }, 500);
    
    try {
      const styledImage = await applyAIStyle(imageSrc, style); // Always style the original
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setCurrentImage(styledImage);
        setIsLoading(false);
        setProgress(0);
      }, 300);
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      setIsLoading(false);
      alert("Sorry, we couldn't apply the style. Please try another one or save the original.");
    }
  }, [imageSrc]);

  const handleSecretButton = useCallback(async () => {
    setIsLoading(true);
    setIsSecretLoading(true);
    setLoadingMessage(undefined);
    setProgress(0);
    
    // Simulate progress for secret feature (takes ~20 seconds)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev; // Don't go to 100 until done
        return prev + Math.random() * 3; // Slower progress for secret feature
      });
    }, 400);
    
    try {
      // Use the Venice API directly with the secret prompt
      const { base64 } = (() => {
        const parts = imageSrc.split(',');
        return { base64: parts[1], mimeType: parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg' };
      })();

      const response = await fetch('https://api.venice.ai/api/v1/image/edit', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer lnWNeSg0pA_rQUooNpbfpPDBaj2vJnWol5WqKWrIEF',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: SECRET_TRUMP_PROMPT,
          image: base64,
        }),
      });

      if (!response.ok) {
        throw new Error(`Venice API error: ${response.status}`);
      }

      const imageBlob = await response.blob();
      const arrayBuffer = await imageBlob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64Result = btoa(binary);
      const styledImage = `data:image/png;base64,${base64Result}`;
      
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setCurrentImage(styledImage);
        setIsLoading(false);
        setIsSecretLoading(false);
        setProgress(0);
      }, 300);
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      setIsLoading(false);
      setIsSecretLoading(false);
      console.error("Secret feature error:", error);
      alert("Sorry, the secret feature couldn't be applied. Please try again.");
    }
  }, [imageSrc]);
  

  const handleSaveAndShare = async () => {
    setIsLoading(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas not ready");

      // Redraw one last time to ensure highest quality before saving
      await drawImageWithFrame(canvas, currentImage);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const filename = `Manali_Raj_Baby_Shower_${new Date().getTime()}.jpg`;

      // 1) Upload to Google Drive first (so it can't be interrupted)
      try {
        // Create a smaller upload to stay under serverless limits
        const maxSide = 1600;
        const scale = Math.min(1, maxSide / Math.max(canvas.width, canvas.height));
        let uploadDataUrl = dataUrl;
        if (scale < 1) {
          const off = document.createElement('canvas');
          off.width = Math.round(canvas.width * scale);
          off.height = Math.round(canvas.height * scale);
          const octx = off.getContext('2d');
          if (octx) {
            octx.drawImage(canvas, 0, 0, off.width, off.height);
            uploadDataUrl = off.toDataURL('image/jpeg', 0.85);
          }
        } else {
          uploadDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        }
        const res = await fetch('/api/drive-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename, dataUrl: uploadDataUrl }),
        });
        if (!res.ok) {
          console.warn('Drive upload returned non-OK:', res.status);
        }
      } catch (e) {
        console.warn('Drive upload failed (continuing):', e);
      }

      // 2) Then trigger local download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setShowSavedMessage(true);
    } catch (error) {
      console.error('Failed to save image:', error);
      alert('Could not save the image. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full relative flex flex-col bg-gray-900">
      {/* Home Button - Stands out on preview screen */}
      {onGoHome && (
        <button
          onClick={onGoHome}
          className="absolute top-2 sm:top-3 left-2 sm:left-3 z-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 px-4 sm:py-2.5 sm:px-5 rounded-full text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm border-2 border-white/30"
        >
          🏠 Home
        </button>
      )}
      
      {isLoading && <LoadingSpinner message={loadingMessage} isSecret={isSecretLoading} progress={progress} />}
      
      <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden p-1 sm:p-2 bg-gray-100">
         <div className={`w-full max-w-full max-h-full relative shadow-2xl bg-white rounded-lg p-1 sm:p-2 ${aspectRatio === '16:9' ? 'aspect-[16/9]' : 'aspect-[9/16]'}`}>
            <canvas ref={canvasRef} className="w-full h-full object-contain rounded" />
         </div>
      </div>

      {showSavedMessage ? (
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 z-30 flex flex-col items-center">
            <p className="text-xl font-semibold text-blue-800 mb-3 text-center">Photo Saved to your Device!</p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <a href={PHOTO_LOG_PUBLIC_URL || '/'} target="_blank" rel="noopener noreferrer"
                   className="flex-1 bg-purple-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-800 transition-colors text-center">
                    <UploadIcon className="w-6 h-6" />
                    <span>View Photo Log</span>
                </a>
                {PHOTO_LOG_PUBLIC_URL ? (
                  null
                ) : null}
                <button onClick={onDone} className="flex-1 bg-blue-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-900 transition-colors">
                    Done
                </button>
            </div>
             <p className="text-sm text-gray-600 mt-3 text-center">Your photo will also appear in the shared photo log shortly.</p>
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-sm p-2 sm:p-3 z-30 relative">
          {/* Secret Button - Disguised as emoji */}
          <button
            onClick={handleSecretButton}
            className="absolute top-2 right-2 text-xl sm:text-2xl hover:scale-110 transition-transform cursor-pointer z-40"
            title="Secret feature"
            aria-label="Secret feature"
          >
            🎭
          </button>
          
          {/* Header with Retake button on left */}
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
            <button 
              onClick={onRetake} 
              className="bg-yellow-400 text-yellow-900 font-semibold py-1.5 px-3 rounded-full text-xs sm:text-sm flex items-center justify-center gap-1.5 hover:bg-yellow-500 transition-all shadow-md active:scale-95"
            >
              <RefreshIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Retake</span>
            </button>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-1">
              <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
              <h3 className="text-center font-semibold text-blue-800 text-sm sm:text-base">Add an AI Style</h3>
            </div>
            <div className="w-16 sm:w-20"></div> {/* Spacer for balance */}
          </div>
          
          {/* Preset buttons with material design - bigger and more rounded */}
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-2 sm:mb-3">
            {styleOptions.map(style => (
              <button 
                key={style} 
                onClick={() => handleApplyStyle(style)} 
                className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-semibold py-3 sm:py-3.5 px-2 sm:px-3 rounded-2xl hover:bg-blue-200 active:scale-95 transition-all duration-200 text-center shadow-sm hover:shadow-md"
                style={{ 
                  borderRadius: '16px',
                  touchAction: 'manipulation'
                }}
              >
                {style}
              </button>
            ))}
          </div>
          
          {/* Save button - responsive text */}
          <button 
            onClick={handleSaveAndShare} 
            className="w-full bg-blue-600 text-white font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all duration-200 text-center shadow-md hover:shadow-lg"
            style={{ 
              borderRadius: '16px',
              touchAction: 'manipulation'
            }}
          >
            <DownloadIcon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            <span className="text-xs sm:text-sm leading-tight">Save and share with Raj and Manali</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PreviewScreen;