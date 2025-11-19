import React, { useRef, useEffect, useState, useCallback } from 'react';
import FrameOverlay from './FrameOverlay';
import { AspectRatio } from '../types';

interface CameraViewProps {
  onPhotoCapture: (image: string) => void;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  onHome: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onPhotoCapture, onAspectRatioChange, onHome }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please check permissions in your browser settings.");
      }
    };
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const handleOrientationChange = () => {
      setTimeout(() => {
        const portrait = window.innerHeight > window.innerWidth;
        setIsPortrait(portrait);
        onAspectRatioChange(portrait ? '9:16' : '16:9');
      }, 100);
    };

    window.addEventListener('resize', handleOrientationChange);
    handleOrientationChange(); // Initial check

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, [onAspectRatioChange]);

  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      const canvas = document.createElement('canvas');
      
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      
      // Use aspect ratio based on orientation
      const targetAspectRatio = isPortrait ? 9 / 16 : 16 / 9;
      const videoRatio = videoWidth / videoHeight;
      
      let sx = 0, sy = 0, sWidth = 0, sHeight = 0;

      if (videoRatio > targetAspectRatio) {
        // Video is wider than target, crop sides
        sHeight = videoHeight;
        sWidth = sHeight * targetAspectRatio;
        sx = (videoWidth - sWidth) / 2;
        sy = 0;
      } else {
        // Video is taller than target, crop top/bottom
        sWidth = videoWidth;
        sHeight = sWidth / targetAspectRatio;
        sx = 0;
        sy = (videoHeight - sHeight) / 2;
      }

      canvas.width = sWidth;
      canvas.height = sHeight;
      const context = canvas.getContext('2d');
      if (context) {
        // Mirror the image (since video is mirrored, we need to flip it back for the saved image)
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onPhotoCapture(dataUrl);
      }
    }
  }, [onPhotoCapture, isPortrait]);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Camera Error</h2>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gray-900">
      {/* Header with Home Button */}
      <div className="w-full max-w-md flex justify-between items-center mb-4 relative z-10">
        <button 
          onClick={onHome}
          className="bg-white/10 hover:bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium text-white transition"
        >
          Home
        </button>
      </div>

      {/* Camera Preview Container */}
      <div className={`relative w-full max-w-md bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20 ${isPortrait ? 'aspect-[9/16]' : 'aspect-[16/9]'}`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
        />
        <FrameOverlay />
        
        {/* Banner - Raj and Manali Baby Shower Photo Booth */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-blue-600/90 via-violet-600/90 to-blue-600/90 backdrop-blur-sm border-b border-white/20">
          <div className="px-4 py-2 text-center">
            <p className="text-white font-bold text-sm md:text-base">Raj and Manali Baby Shower Photo Booth</p>
          </div>
        </div>
        
        {/* LIVE Indicator */}
        <div className="absolute top-14 right-4 z-20 bg-black/50 px-3 py-1 rounded-full text-xs font-bold text-violet-400 backdrop-blur-md border border-violet-400/30">
          LIVE
        </div>
        
        {/* Shutter Button - Centered at Bottom */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center z-20">
          <button
            onClick={handleCapture}
            className="w-20 h-20 rounded-full border-4 border-white bg-white/20 backdrop-blur-sm hover:bg-violet-500 hover:border-violet-500 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(139,92,246,0.7)] flex items-center justify-center group"
            aria-label="Take Photo"
          >
            <div className="w-16 h-16 rounded-full bg-white group-hover:bg-violet-300"></div>
          </button>
        </div>
        
        {/* Decorative framing */}
        <div className="absolute inset-0 border-[1px] border-white/10 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default CameraView;