import React, { useRef, useEffect, useState } from 'react';

interface CameraCaptureProps {
  onCapture: (base64Image: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please check permissions.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Mirror the image if using front camera (common expectation)
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(imageData);
      }
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black overflow-hidden rounded-xl shadow-2xl shadow-party-pink/20">
      {error ? (
        <div className="text-party-pink font-bold text-xl p-4 text-center">{error}</div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" // CSS mirror
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Overlay UI */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center z-20">
            <button
              onClick={handleCapture}
              className="w-20 h-20 rounded-full border-4 border-white bg-white/20 backdrop-blur-sm hover:bg-party-pink hover:border-party-pink transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(255,0,153,0.6)] flex items-center justify-center group"
            >
              <div className="w-16 h-16 rounded-full bg-white group-hover:bg-white/90"></div>
            </button>
          </div>
          
          {/* Decorative framing */}
          <div className="absolute inset-0 border-[1px] border-white/10 pointer-events-none"></div>
          <div className="absolute top-4 right-4 z-20 bg-black/50 px-3 py-1 rounded-full text-xs font-bold text-party-neon backdrop-blur-md border border-party-neon/30">
            LIVE
          </div>
        </>
      )}
    </div>
  );
};
