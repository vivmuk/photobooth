import React, { useState, useEffect } from 'react';
import { checkAndRequestApiKey, openApiKeySelection, generateVeoVideo } from '../services/geminiService';

interface VeoGeneratorProps {
  imageSrc: string;
  onVideoGenerated: (videoUrl: string) => void;
  onCancel: () => void;
}

export const VeoGenerator: React.FC<VeoGeneratorProps> = ({ imageSrc, onVideoGenerated, onCancel }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [needsApiKey, setNeedsApiKey] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const verifyKey = async () => {
      const hasKey = await checkAndRequestApiKey();
      setNeedsApiKey(!hasKey);
    };
    verifyKey();
  }, []);

  const handleGenerate = async () => {
    if (needsApiKey) {
      await openApiKeySelection();
      const hasKey = await checkAndRequestApiKey();
      if (!hasKey) {
        setStatusMessage("API Key selection is required for Veo video generation.");
        return;
      }
      setNeedsApiKey(false);
    }

    setIsGenerating(true);
    setStatusMessage("Initializing creative matrix...");

    try {
      const finalPrompt = prompt.trim() || "Animate this person naturally in a cinematic style";
      
      // Simulate some status updates for UX since video gen takes time
      const messages = [
        "Dreaming up the video...",
        "Applying motion magic...",
        "Rendering neon lights...",
        "Almost there..."
      ];
      
      let msgIdx = 0;
      const interval = setInterval(() => {
        if (msgIdx < messages.length) {
          setStatusMessage(messages[msgIdx]);
          msgIdx++;
        }
      }, 4000);

      const videoUrl = await generateVeoVideo(imageSrc, finalPrompt);
      
      clearInterval(interval);
      onVideoGenerated(videoUrl);
    } catch (error) {
      console.error(error);
      setStatusMessage("Failed to generate video. Please try again.");
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto space-y-6 p-6 bg-party-light rounded-3xl border border-white/10 shadow-2xl">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-party-neon to-party-pink">
          Magic Motion
        </h2>
        <p className="text-gray-400 text-sm">Powered by Google Veo</p>
      </div>

      <div className="relative aspect-[9/16] w-32 mx-auto rounded-xl overflow-hidden border-2 border-white/20">
        <img src={imageSrc} alt="Source" className="w-full h-full object-cover" />
      </div>

      {needsApiKey ? (
        <div className="text-center p-4 bg-yellow-900/30 rounded-xl border border-yellow-500/30">
          <p className="mb-3 text-yellow-200 text-sm">Veo requires an API key selection.</p>
          <button 
            onClick={() => openApiKeySelection().then(() => setNeedsApiKey(false))}
            className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition"
          >
            Select API Key
          </button>
          <p className="mt-2 text-xs text-gray-400">
            See <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline">billing docs</a>.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              What should happen? (Optional)
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., The person smiles and waves, confetti falls..."
              className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-party-neon focus:ring-1 focus:ring-party-neon transition"
              rows={3}
              disabled={isGenerating}
            />
          </div>
          
          {isGenerating ? (
            <div className="text-center py-4 space-y-3">
              <div className="inline-block w-8 h-8 border-4 border-party-neon border-t-transparent rounded-full animate-spin"></div>
              <p className="text-party-neon animate-pulse font-medium">{statusMessage}</p>
            </div>
          ) : (
            <button
              onClick={handleGenerate}
              className="w-full py-4 bg-gradient-to-r from-party-pink to-purple-600 rounded-xl font-bold text-white text-lg shadow-lg shadow-party-pink/20 hover:shadow-party-pink/40 transform hover:scale-[1.02] transition-all"
            >
              Generate Video 🎬
            </button>
          )}
        </div>
      )}

      {!isGenerating && (
        <button onClick={onCancel} className="text-gray-400 hover:text-white text-sm w-full text-center">
          Cancel & Go Back
        </button>
      )}
    </div>
  );
};
