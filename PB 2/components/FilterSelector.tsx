import React from 'react';
import { FILTER_PRESETS } from '../constants';
import { FilterPreset } from '../types';

interface FilterSelectorProps {
  onSelect: (preset: FilterPreset) => void;
  isProcessing: boolean;
}

export const FilterSelector: React.FC<FilterSelectorProps> = ({ onSelect, isProcessing }) => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 w-full max-w-2xl mx-auto">
      {FILTER_PRESETS.map((preset) => (
        <button
          key={preset.id}
          onClick={() => !isProcessing && onSelect(preset)}
          disabled={isProcessing}
          className={`
            relative group overflow-hidden rounded-2xl aspect-video text-left p-4
            bg-gradient-to-br ${preset.thumbnailColor}
            hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]
            transition-all duration-300 transform hover:-translate-y-1
            ${isProcessing ? 'opacity-50 cursor-not-allowed grayscale' : 'opacity-100'}
          `}
        >
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
          <div className="relative z-10 flex flex-col h-full justify-end">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1 text-white/80 bg-black/30 w-fit px-2 py-0.5 rounded">
              {preset.type === 'face' ? 'Face Filter' : 'Background'}
            </span>
            <h3 className="text-xl font-black text-white drop-shadow-lg leading-tight">
              {preset.name}
            </h3>
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      ))}
    </div>
  );
};
