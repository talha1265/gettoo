import React from 'react';
import Link from 'next/link';
import { Sparkles, Layers, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { TSHIRT_COLORS } from '@/lib/mock-data';

export const metadata = {
  title: 'Engineered Heavyweight Blanks (240–280 GSM) • GETTOO® APPAREL',
  description: 'Engineered heavyweight streetwear blanks. 240 GSM organic combed cotton & 280 GSM French terry designed to hold high-density embroidery stitches with zero puckering.',
};

export default function BlanksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="max-w-2xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-black text-[#CCFF00] text-[10px] font-mono font-bold uppercase tracking-widest">
            FABRIC LAB
          </span>
          <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">
            // STREETWEAR BLANK ENGINEERING
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-normal text-[#0A0A0C] uppercase tracking-wide">
          THE 240–280 GSM HEAVYWEIGHT CANVAS
        </h1>
        <p className="text-sm text-zinc-600 leading-relaxed font-sans">
          High-density embroidery exerts severe tensile pull on fabrics. Commercial lightweight tees (160–180 GSM) buckle and wrinkle under 40,000+ needle strikes. 
          We custom milled heavyweight organic combed cotton and micro French terry blanks to withstand extreme thread densities with zero puckering.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 240 GSM */}
        <div className="bg-white p-8 rounded-2xl border-2 border-zinc-200 hover:border-black transition-all shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-300 flex items-center justify-center text-black">
            <Layers size={22} />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xl font-bold text-[#0A0A0C] uppercase">
              240 GSM Boxy Street Tee
            </h3>
            <span className="text-[10px] font-mono font-bold bg-zinc-100 text-black px-2 py-0.5 rounded">
              STANDARD HEAVY
            </span>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed font-sans">
            Milled from long-staple Peruvian pima cotton. Features a relaxed drop-shoulder cut, 1.25-inch reinforced ribbed collar, and double-needle hem stitching. Ideal for chest monograms, sleeve hits, and medium-density graphics.
          </p>
          <ul className="text-xs space-y-2 text-zinc-800 font-mono pt-2">
            <li>• Fabric: 100% Ring-Spun Combed Cotton</li>
            <li>• Pre-shrunk with enzyme vintage wash</li>
            <li>• 1.25" Spandex-reinforced ribbed collar</li>
            <li>• Max Needle Density: Up to 50,000 Stitches</li>
          </ul>
          <div className="pt-4 border-t border-zinc-100">
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-black hover:text-[#CCFF00] hover:bg-black px-4 py-2 rounded-lg transition-all"
            >
              <span>CUSTOMISE IN STUDIO LAB</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 280 GSM */}
        <div className="bg-white p-8 rounded-2xl border-2 border-zinc-200 hover:border-black transition-all shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-black text-[#CCFF00] flex items-center justify-center">
            <Zap size={22} className="fill-[#CCFF00]" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xl font-bold text-[#0A0A0C] uppercase">
              280 GSM Micro-French Terry
            </h3>
            <span className="text-[10px] font-mono font-bold bg-black text-[#CCFF00] px-2 py-0.5 rounded">
              ULTRA-HEAVYWEIGHT
            </span>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed font-sans">
            Our thickest and most structured streetwear silhouette. The loop-back micro French terry interior anchors 3D puff foam and full-back archival crests without show-through, collar sag, or tension warping.
          </p>
          <ul className="text-xs space-y-2 text-zinc-800 font-mono pt-2">
            <li>• Fabric: 100% Micro French Terry Loop-Back Cotton</li>
            <li>• Archival drop-shoulder Tokyo box cut</li>
            <li>• Anti-bacon reinforced ribbed collar</li>
            <li>• Max Needle Density: Up to 95,000 Stitches</li>
          </ul>
          <div className="pt-4 border-t border-zinc-100">
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-black hover:text-[#CCFF00] hover:bg-black px-4 py-2 rounded-lg transition-all"
            >
              <span>CUSTOMISE IN STUDIO LAB</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>

      {/* Streetwear Color Palette */}
      <div className="bg-white p-8 rounded-2xl border-2 border-zinc-200 space-y-6">
        <div>
          <h3 className="font-display text-2xl font-normal text-black uppercase tracking-wide">
            STREETWEAR COLORWAYS & PIGMENT PALETTES
          </h3>
          <p className="text-xs text-zinc-500 mt-1 font-mono">
            Low-impact reactive dyes and vintage stone washes that resist fading under continuous laundering and steam pressing.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {TSHIRT_COLORS.map((col) => (
            <div key={col.name} className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 text-center space-y-2">
              <div 
                className="w-12 h-12 rounded-full mx-auto border-2 border-black/20 shadow-xs" 
                style={{ backgroundColor: col.hex }}
              />
              <span className="block text-xs font-mono font-bold text-black uppercase">{col.name}</span>
              <span className="block text-[10px] font-mono text-zinc-400 font-bold">{col.hex}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
