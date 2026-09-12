'use client';

import React from 'react';
import { StitchPlacement, ThreadColor, EmbroideryFont, StitchType } from '@/lib/types';
import { Eye, RotateCw, ZoomIn, Sparkles } from 'lucide-react';

interface TeeCanvasProps {
  colorHex: string;
  colorName: string;
  view: 'front' | 'back';
  placement: StitchPlacement;
  customText?: string;
  selectedFont?: EmbroideryFont;
  selectedThread?: ThreadColor;
  stitchType?: StitchType;
  uploadedImageUrl?: string;
  artworkScale?: number;
  artworkRotation?: number;
  artworkOffsetX?: number;
  artworkOffsetY?: number;
  onSelectPlacement?: (placement: StitchPlacement) => void;
}

export default function TeeCanvas({
  colorHex,
  colorName,
  view,
  placement,
  customText,
  selectedFont,
  selectedThread,
  stitchType = 'SATIN',
  uploadedImageUrl,
  artworkScale = 1,
  artworkRotation = 0,
  artworkOffsetX = 0,
  artworkOffsetY = 0,
  onSelectPlacement,
}: TeeCanvasProps) {
  // Determine if active placement is visible in current view
  const isPlacementVisible = () => {
    if (view === 'front') {
      return ['CHEST_LEFT', 'CHEST_CENTER', 'SLEEVE_LEFT', 'SLEEVE_RIGHT'].includes(placement);
    }
    return ['BACK_NAPE', 'FULL_BACK'].includes(placement);
  };

  // Compute CSS position for active embroidery placement box
  const getPlacementCoordinates = () => {
    switch (placement) {
      case 'CHEST_LEFT':
        return { top: '32%', left: '60%', width: '100px', height: '90px' };
      case 'CHEST_CENTER':
        return { top: '35%', left: '50%', width: '180px', height: '140px', transform: 'translateX(-50%)' };
      case 'SLEEVE_LEFT':
        return { top: '32%', left: '16%', width: '70px', height: '70px' };
      case 'SLEEVE_RIGHT':
        return { top: '32%', left: '84%', width: '70px', height: '70px' };
      case 'BACK_NAPE':
        return { top: '18%', left: '50%', width: '100px', height: '60px', transform: 'translateX(-50%)' };
      case 'FULL_BACK':
        return { top: '36%', left: '50%', width: '220px', height: '220px', transform: 'translateX(-50%)' };
      default:
        return { top: '32%', left: '60%', width: '100px', height: '90px' };
    }
  };

  const isDarkTee = ['#262524', '#1C2735', '#4A5B4E'].includes(colorHex.toUpperCase());

  return (
    <div className="relative w-full aspect-square max-w-[540px] mx-auto bg-[#ECECF0] rounded-2xl border-2 border-zinc-300 shadow-inner overflow-hidden flex items-center justify-center p-4 select-none atelier-grid">
      
      {/* Visualizer Header Badges */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <span className="px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider text-black shadow-xs border border-zinc-300 flex items-center gap-1.5">
          <span 
            className="w-2.5 h-2.5 rounded-full border border-black/30" 
            style={{ backgroundColor: colorHex }} 
          />
          {colorName}
        </span>
        <span className="px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-lg text-[10px] font-mono font-bold text-zinc-700 border border-zinc-300">
          280 GSM HEAVYWEIGHT
        </span>
      </div>

      {/* Embroidery Placement Indicator Badge */}
      <div className="absolute top-4 right-4 z-20">
        <span className="px-3 py-1 bg-black text-[#CCFF00] rounded-lg text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm border border-zinc-800">
          <Sparkles size={11} className="text-[#CCFF00]" />
          {placement.replace('_', ' ')}
        </span>
      </div>


      {/* SVG Luxury Boxy T-Shirt Mockup */}
      <div className="relative w-full h-full flex items-center justify-center">
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full drop-shadow-xl transition-all duration-300"
          style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.08))' }}
        >
          <defs>
            {/* Fabric Weave Filter */}
            <filter id="fabricTexture" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
              <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0.08 0" />
              <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
            </filter>

            {/* Realistic Tee Gradient & Lighting */}
            <linearGradient id="teeShading" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#000000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
            </linearGradient>

            <linearGradient id="collarShade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* T-Shirt Silhouette Body */}
          <g>
            {/* Main Tee Body Shape */}
            <path
              d="M170,55 
                 C195,85 305,85 330,55 
                 L405,105 
                 L460,175 
                 L395,225 
                 L375,190 
                 L375,445 
                 C375,455 365,465 350,465 
                 L150,465 
                 C135,465 125,455 125,445 
                 L125,190 
                 L105,225 
                 L40,175 
                 L95,105 Z"
              fill={colorHex}
              stroke="#000000"
              strokeOpacity="0.08"
              strokeWidth="2"
            />

            {/* Shading Overlay */}
            <path
              d="M170,55 
                 C195,85 305,85 330,55 
                 L405,105 
                 L460,175 
                 L395,225 
                 L375,190 
                 L375,445 
                 L125,445 
                 L125,190 
                 L105,225 
                 L40,175 
                 L95,105 Z"
              fill="url(#teeShading)"
            />

            {/* Collar Ribbing (Front vs Back) */}
            {view === 'front' ? (
              <path
                d="M170,55 C195,88 305,88 330,55 C310,75 190,75 170,55 Z"
                fill={colorHex}
                stroke="#000000"
                strokeOpacity="0.15"
                strokeWidth="1.5"
              />
            ) : (
              <path
                d="M170,55 C205,65 295,65 330,55 C315,60 185,60 170,55 Z"
                fill={colorHex}
                stroke="#000000"
                strokeOpacity="0.2"
                strokeWidth="1.5"
              />
            )}

            {/* Subtle Atelier Hem Stitches */}
            <line x1="130" y1="452" x2="370" y2="452" stroke="#000000" strokeOpacity="0.12" strokeDasharray="3,3" strokeWidth="1.2" />
            <line x1="45" y1="180" x2="100" y2="220" stroke="#000000" strokeOpacity="0.1" strokeDasharray="3,3" strokeWidth="1.2" />
            <line x1="455" y1="180" x2="400" y2="220" stroke="#000000" strokeOpacity="0.1" strokeDasharray="3,3" strokeWidth="1.2" />
          </g>
        </svg>

        {/* Live Embroidery Placement Layer */}
        {isPlacementVisible() && (
          <div
            className="absolute z-10 flex items-center justify-center pointer-events-none transition-all duration-300"
            style={{
              ...getPlacementCoordinates(),
              transform: `${getPlacementCoordinates().transform || ''} translate(${artworkOffsetX}px, ${artworkOffsetY}px)`,
            }}
          >
            {/* Guide Box (Dashed luxury border) */}
            <div className="absolute inset-0 border border-dashed border-[#C5A059]/60 rounded-md pointer-events-none" />

            {/* Custom Text Mode Render */}
            {customText && (
              <div 
                className="relative text-center select-none font-bold transition-all"
                style={{
                  fontFamily: selectedFont?.fontFamily || 'Georgia, serif',
                  color: selectedThread?.hex || '#C5A059',
                  fontSize: customText.length > 12 ? '14px' : customText.length > 6 ? '18px' : '22px',
                  textShadow: stitchType === 'PUFF_3D' 
                    ? `1px 2px 0px rgba(0,0,0,0.5), -0.5px -0.5px 0px rgba(255,255,255,0.4)`
                    : `0.5px 0.5px 0px rgba(0,0,0,0.25), -0.5px -0.5px 0px rgba(255,255,255,0.3)`,
                  letterSpacing: '0.08em',
                  lineHeight: 1.1,
                  filter: selectedThread?.isMetallic ? 'contrast(1.2) brightness(1.08)' : 'none',
                }}
              >
                {/* Thread texture overlay simulation */}
                <div className="absolute inset-0 satin-stitch opacity-30 mix-blend-overlay pointer-events-none" />
                <span>{customText}</span>
              </div>
            )}

            {/* Uploaded Artwork / Image Mode Render */}
            {uploadedImageUrl && (
              <div
                className="relative flex items-center justify-center transition-transform"
                style={{
                  transform: `scale(${artworkScale}) rotate(${artworkRotation}deg)`,
                  width: '80%',
                  height: '80%',
                }}
              >
                <img
                  src={uploadedImageUrl}
                  alt="Embroidered Custom Artwork"
                  className="max-w-full max-h-full object-contain filter drop-shadow-md rounded"
                  style={{
                    filter: stitchType === 'PUFF_3D' 
                      ? 'drop-shadow(2px 3px 3px rgba(0,0,0,0.45)) contrast(1.15)' 
                      : 'drop-shadow(1px 1px 1px rgba(0,0,0,0.25))',
                  }}
                />
                {/* Satin thread texture overlay */}
                <div className="absolute inset-0 satin-stitch opacity-25 mix-blend-overlay pointer-events-none rounded" />
              </div>
            )}

            {/* Empty state placement helper when nothing typed/uploaded */}
            {!customText && !uploadedImageUrl && (
              <div className="text-[10px] uppercase font-mono text-zinc-600 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-zinc-300 text-center shadow-xs font-bold">
                <span>{placement.replace('_', ' ')}</span>
                <span className="block text-[8px] text-zinc-400">EMBROIDERY ZONE</span>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Bottom Canvas Toolbar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-700 shadow-lg text-white">
        <span className="text-[11px] font-mono font-bold text-white px-1">
          {view === 'front' ? 'FRONT SILHOUETTE' : 'BACK SILHOUETTE'}
        </span>
        <div className="w-px h-3 bg-zinc-700" />
        <span className="text-[10px] text-[#CCFF00] font-mono font-bold">
          1:1 SCALE RENDER
        </span>
      </div>


    </div>
  );
}
