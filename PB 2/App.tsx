import React, { useState } from 'react';
import { CameraCapture } from './components/CameraCapture';
import { FilterSelector } from './components/FilterSelector';
import { VeoGenerator } from './components/VeoGenerator';
import { generateStyledImage } from './services/geminiService';
import { AppMode, FilterPreset, GeneratedMedia } from './types';
import { FILTER_PRESETS } from './constants';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.CAMERA);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [resultMedia, setResultMedia] = useState<GeneratedMedia | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCapture = (base64: string) => {
    setCapturedImage(base64);
    setMode(AppMode.PREVIEW);
  };

  const handleFilterSelect = async (preset: FilterPreset) => {
    if (!capturedImage) return;
    
    setIsProcessing(true);
    setMode(AppMode.FILTERS); // Keep showing filters but maybe show loading overlay
    
    try {
      const resultBase64 = await generateStyledImage(capturedImage, preset.prompt);
      setResultMedia({ type: 'image', url: resultBase64 });
      setMode(AppMode.RESULT);
    } catch (error) {
      alert("Oops! The AI party gremlins caused an error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVeoGenerated = (videoUrl: string) => {
    setResultMedia({ type: 'video', url: videoUrl });
    setMode(AppMode.RESULT);
  };

  const handleSave = () => {
    if (resultMedia) {
      const link = document.createElement('a');
      link.href = resultMedia.url;
      link.download = resultMedia.type === 'video' ? 'party-video.mp4' : 'party-photo.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetApp = () => {
    setMode(AppMode.CAMERA);
    setCapturedImage(null);
    setResultMedia(null);
  };

  return (
    <div className="min-h-screen bg-party-dark flex flex-col items-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-party-pink/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-party-neon/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center py-6 mb-4 relative z-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter italic">
          <span className="text-white">PARTY</span>
          <span className="text-party-pink">BOOTH</span>
          <span className="text-party-neon text-2xl md:text-4xl not-italic ml-2">AI ✨</span>
        </h1>
        {mode !== AppMode.CAMERA && (
          <button 
            onClick={resetApp}
            className="bg-white/10 hover:bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium transition"
          >
            Start Over
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl flex-grow flex flex-col items-center justify-center relative z-10">
        
        {/* Mode: CAMERA */}
        {mode === AppMode.CAMERA && (
          <div className="w-full max-w-md aspect-[3/4] md:aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <CameraCapture onCapture={handleCapture} />
          </div>
        )}

        {/* Mode: PREVIEW (Choice) */}
        {mode === AppMode.PREVIEW && capturedImage && (
          <div className="flex flex-col items-center w-full animate-fade-in-up">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden mb-8 border-4 border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
              <button
                onClick={() => setMode(AppMode.FILTERS)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-2xl shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1 transition text-left group"
              >
                <div className="text-2xl mb-2">🎨</div>
                <div className="font-bold text-lg">Photo Filters</div>
                <div className="text-sm text-white/60 group-hover:text-white transition-colors">Remix your style or background</div>
              </button>

              <button
                onClick={() => setMode(AppMode.VEO)}
                className="bg-gradient-to-r from-party-pink to-red-600 p-6 rounded-2xl shadow-lg hover:shadow-pink-500/30 transform hover:-translate-y-1 transition text-left group"
              >
                <div className="text-2xl mb-2">🎬</div>
                <div className="font-bold text-lg">Video Magic</div>
                <div className="text-sm text-white/60 group-hover:text-white transition-colors">Animate with Veo</div>
              </button>
            </div>
          </div>
        )}

        {/* Mode: FILTERS */}
        {mode === AppMode.FILTERS && (
          <div className="w-full flex flex-col items-center">
             {isProcessing && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-party-neon border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-xl font-bold text-white animate-pulse">Applying Party Magic...</p>
                </div>
              )}
            <h2 className="text-2xl font-bold mb-4 text-center">Choose a Vibe</h2>
            <FilterSelector onSelect={handleFilterSelect} isProcessing={isProcessing} />
            <button onClick={() => setMode(AppMode.PREVIEW)} className="mt-6 text-white/50 hover:text-white">Cancel</button>
          </div>
        )}

        {/* Mode: VEO */}
        {mode === AppMode.VEO && capturedImage && (
          <VeoGenerator 
            imageSrc={capturedImage}
            onVideoGenerated={handleVeoGenerated}
            onCancel={() => setMode(AppMode.PREVIEW)}
          />
        )}

        {/* Mode: RESULT */}
        {mode === AppMode.RESULT && resultMedia && (
          <div className="flex flex-col items-center w-full animate-fade-in">
            <div className="p-1 rounded-3xl bg-gradient-to-b from-party-neon via-purple-500 to-party-pink shadow-[0_0_60px_rgba(255,0,153,0.4)] mb-8">
              <div className="bg-black rounded-[20px] overflow-hidden">
                {resultMedia.type === 'image' ? (
                   <img src={resultMedia.url} alt="Result" className="max-h-[60vh] w-auto max-w-full" />
                ) : (
                   <video src={resultMedia.url} controls autoPlay loop className="max-h-[60vh] w-auto max-w-full" />
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-white text-black font-black px-8 py-4 rounded-full hover:bg-gray-200 transition shadow-xl transform hover:scale-105 active:scale-95"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                SAVE TO PHONE
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
