import React, { useState, useCallback } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import CameraView from './components/CameraView';
import PreviewScreen from './components/PreviewScreen';
import ConsentPopup from './components/ConsentPopup';
import Gallery from './components/Gallery';
import type { View, AspectRatio } from './types';

const getInitialAspectRatio = (): AspectRatio => {
  return window.innerHeight > window.innerWidth ? '9:16' : '16:9';
};

const App: React.FC = () => {
  const [view, setView] = useState<View>('welcome');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showConsent, setShowConsent] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(getInitialAspectRatio());
  const [imageSource, setImageSource] = useState<'camera' | 'upload' | null>(null);

  const handleStart = () => {
    setShowConsent(true);
  };
  
  const handleConsent = (agreed: boolean) => {
    setShowConsent(false);
    if (agreed) {
      setView('camera');
    }
  };

  const handlePhotoCapture = useCallback((image: string) => {
    setCapturedImage(image);
    setImageSource('camera');
    setView('preview');
  }, []);

  const handlePhotoUpload = useCallback((image: string) => {
    const img = new Image();
    img.onload = () => {
      const ratio = img.width / img.height;
      // if wider than 1 (landscape), treat as landscape. Otherwise, portrait.
      setAspectRatio(ratio > 1 ? '16:9' : '9:16');
      setCapturedImage(image);
      setImageSource('upload');
      setView('preview');
    };
    img.src = image;
  }, []);


  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    // if source was camera, go back to camera.
    // if source was upload or null, go back to welcome.
    setView(imageSource === 'camera' ? 'camera' : 'welcome');
    setImageSource(null);
  }, [imageSource]);

  const handleDone = useCallback(() => {
    setCapturedImage(null);
    // Go back to camera for the next guest if they used the camera
    // Otherwise, go to the welcome screen
    setView(imageSource === 'camera' ? 'camera' : 'welcome');
    setImageSource(null);
  }, [imageSource]);

  const renderView = () => {
    switch (view) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStart} onPhotoUpload={handlePhotoUpload} onViewGallery={() => setView('gallery')} />;
      case 'camera':
        return <CameraView 
                  onPhotoCapture={handlePhotoCapture} 
                  onAspectRatioChange={setAspectRatio}
                  onHome={() => setView('welcome')}
                />;
      case 'preview':
        if (capturedImage) {
          return <PreviewScreen 
                    imageSrc={capturedImage} 
                    onRetake={handleRetake} 
                    onDone={handleDone}
                    aspectRatio={aspectRatio}
                  />;
        }
        // Fallback to camera if no image
        setView('camera');
        return null;
      case 'gallery':
        return <Gallery onBack={() => setView('welcome')} />;
      default:
        return <WelcomeScreen onStart={handleStart} onPhotoUpload={handlePhotoUpload} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-900 text-white overflow-hidden relative">
      {/* Background Ambience - Blue and Violet Accents on Dark */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[120px] pointer-events-none" />
      
      {renderView()}
      {showConsent && <ConsentPopup onConsent={handleConsent} />}
    </div>
  );
};

export default App;