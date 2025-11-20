export enum AppMode {
  CAMERA = 'CAMERA',
  PREVIEW = 'PREVIEW',
  FILTERS = 'FILTERS',
  VEO = 'VEO',
  RESULT = 'RESULT',
}

export interface FilterPreset {
  id: string;
  name: string;
  description: string;
  prompt: string;
  type: 'background' | 'face';
  thumbnailColor: string;
}

export interface GeneratedMedia {
  type: 'image' | 'video';
  url: string;
}

// Extend window to support the AI Studio specific API key selection
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}