import { FilterPreset } from './types';
import React from 'react';

export const FILTER_PRESETS: FilterPreset[] = [
  // Background Transformations
  {
    id: 'bg-cyberpunk',
    name: 'Neon City',
    description: 'Transports you to a futuristic cyberpunk street.',
    prompt: 'Change the background to a futuristic cyberpunk neon city street at night. Keep the person in the foreground realistic.',
    type: 'background',
    thumbnailColor: 'from-blue-500 to-purple-600',
  },
  {
    id: 'bg-tropical',
    name: 'Sunset Beach',
    description: 'Relax on a tropical beach at golden hour.',
    prompt: 'Change the background to a stunning tropical beach at sunset with palm trees. Keep the person in the foreground realistic.',
    type: 'background',
    thumbnailColor: 'from-orange-400 to-red-500',
  },
  {
    id: 'bg-space',
    name: 'Galactic',
    description: 'Floating in deep space among the stars.',
    prompt: 'Change the background to deep outer space with colorful nebulas and planets. Keep the person in the foreground realistic.',
    type: 'background',
    thumbnailColor: 'from-indigo-900 to-purple-900',
  },
  // Face/Style Transformations
  {
    id: 'style-3d',
    name: 'Toon 3D',
    description: 'Become a 3D animated movie character.',
    prompt: 'Transform the person into a high-quality 3D Pixar-style animated character. Keep the composition the same.',
    type: 'face',
    thumbnailColor: 'from-blue-400 to-cyan-400',
  },
  {
    id: 'style-vintage',
    name: '1920s Film',
    description: 'Classic black and white movie star look.',
    prompt: 'Transform the image into a vintage 1920s black and white film style, with film grain and dramatic lighting.',
    type: 'face',
    thumbnailColor: 'from-gray-700 to-gray-900',
  },
  {
    id: 'style-popart',
    name: 'Pop Art',
    description: 'Colorful comic book style.',
    prompt: 'Transform the image into a colorful Pop Art style illustration like Andy Warhol or Roy Lichtenstein. Vibrant colors.',
    type: 'face',
    thumbnailColor: 'from-yellow-400 to-pink-500',
  },
];
