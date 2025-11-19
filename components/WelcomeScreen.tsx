import React, { useRef } from 'react';
import FrameOverlay from './FrameOverlay';

interface WelcomeScreenProps {
  onStart: () => void;
  onPhotoUpload: (image: string) => void;
  onViewGallery: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onPhotoUpload, onViewGallery }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          onPhotoUpload(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center" style={{ backgroundColor: '#0a1929' }}>
      {/* Background Ambience - Blue Neon Accents */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="z-10 bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-blue-500/30">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">
          Baby Shower
        </h1>
        <p className="text-2xl md:text-3xl font-script text-blue-300 mb-6">
          AI Photo Booth
        </p>
        <p className="text-lg text-blue-200 mb-8">
          Snap or upload a moment for Manali & Raj!
        </p>
        <p className="text-sm text-blue-400/70 mb-4">
          Created By Vivek
        </p>
        <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
            <button
            onClick={onStart}
            className="bg-blue-500 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg shadow-blue-500/50 hover:bg-blue-400 hover:shadow-blue-400/70 transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
            Take a Photo!
            </button>
            <button
            onClick={handleUploadClick}
            className="bg-gray-700 text-blue-300 border-2 border-blue-500 font-bold py-3 px-8 rounded-full text-lg shadow-md hover:bg-gray-600 hover:border-blue-400 transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
            Upload Photo
            </button>
            <button
            onClick={onViewGallery}
            className="bg-violet-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-md hover:bg-violet-500 transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
            View Gallery
            </button>
        </div>
        <input
            type="file"
            ref={inputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,image/heic,image/heif"
        />
      </div>
    </div>
  );
};

export default WelcomeScreen;