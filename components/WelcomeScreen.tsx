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
      
      {/* Floating Baby Shower Emojis */}
      <div className="absolute top-10 left-10 text-4xl animate-bounce" style={{ animationDuration: '2s' }}>👶</div>
      <div className="absolute top-20 right-16 text-3xl animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>🍼</div>
      <div className="absolute bottom-32 left-20 text-3xl animate-bounce" style={{ animationDuration: '2.2s', animationDelay: '1s' }}>🧸</div>
      <div className="absolute bottom-20 right-12 text-4xl animate-bounce" style={{ animationDuration: '2.8s', animationDelay: '0.3s' }}>🎈</div>
      <div className="absolute top-1/3 left-1/4 text-3xl animate-bounce" style={{ animationDuration: '2.3s', animationDelay: '0.7s' }}>🎁</div>
      <div className="absolute top-1/2 right-1/4 text-3xl animate-bounce" style={{ animationDuration: '2.6s', animationDelay: '1.2s' }}>🌟</div>
      
      <div className="z-10 bg-gradient-to-br from-pink-100 to-blue-100 backdrop-blur-md p-8 rounded-2xl shadow-2xl border-4 border-yellow-300">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-4xl">👶</span>
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
            Baby Shower
          </h1>
          <span className="text-4xl">🎉</span>
        </div>
        <p className="text-2xl md:text-3xl font-script text-pink-600 mb-4">
          AI Photo Booth
        </p>
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-2xl">📸</span>
          <p className="text-lg text-blue-700 font-semibold">
            Snap or upload a moment for Manali & Raj!
          </p>
          <span className="text-2xl">✨</span>
        </div>
        <p className="text-sm text-blue-600/80 mb-4 font-medium">
          Created By Vivek
        </p>
        <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
            <button
            onClick={onStart}
            className="bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg shadow-blue-500/50 hover:shadow-blue-400/70 transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center gap-2"
            >
            <span className="text-xl">📷</span>
            Take a Photo!
            </button>
            <button
            onClick={handleUploadClick}
            className="bg-gradient-to-r from-yellow-300 to-orange-300 text-blue-800 border-2 border-yellow-400 font-bold py-3 px-8 rounded-full text-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center gap-2"
            >
            <span className="text-lg">📤</span>
            Upload Photo
            </button>
            <button
            onClick={onViewGallery}
            className="bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold py-3 px-8 rounded-full text-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center gap-2"
            >
            <span className="text-lg">🖼️</span>
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