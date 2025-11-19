import React, { useRef, useEffect, useState, useCallback } from 'react';
import FrameOverlay from './FrameOverlay';
import { AspectRatio } from '../types';

interface CameraViewProps {
  onPhotoCapture: (image: string) => void;
  onAspectRatioChange: (ratio: AspectRatio) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onPhotoCapture, onAspectRatioChange }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        // Set aspect ratio to 9:16 (portrait) to match 3:4 container
        onAspectRatioChange('9:16');
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
  }, [onAspectRatioChange]);

  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      const canvas = document.createElement('canvas');
      
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      
      // Use 3:4 aspect ratio (matching the container)
      const targetAspectRatio = 3 / 4;
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
  }, [onPhotoCapture]);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Camera Error</h2>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-br from-blue-200 to-yellow-100">
      <div className="relative w-full max-w-md aspect-[3/4] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
        />
        <FrameOverlay />
        
        {/* LIVE Indicator */}
        <div className="absolute top-4 right-4 z-20 bg-black/50 px-3 py-1 rounded-full text-xs font-bold text-blue-400 backdrop-blur-md border border-blue-400/30">
          LIVE
        </div>
        
        {/* Shutter Button - Centered at Bottom */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center z-20">
          <button
            onClick={handleCapture}
            className="w-20 h-20 rounded-full border-4 border-white bg-white/20 backdrop-blur-sm hover:bg-blue-500 hover:border-blue-500 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(59,130,246,0.7)] flex items-center justify-center group"
            aria-label="Take Photo"
          >
            <div className="w-16 h-16 rounded-full bg-white group-hover:bg-yellow-200"></div>
          </button>
        </div>
        
        {/* Decorative framing */}
        <div className="absolute inset-0 border-[1px] border-white/10 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default CameraView;