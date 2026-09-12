'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Upload, 
  RotateCw, 
  ShoppingBag, 
  Layers, 
  Check, 
  Info,
  Zap,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Scissors
} from 'lucide-react';
import confetti from 'canvas-confetti';
import TeeCanvas from './TeeCanvas';
import { 
  THREAD_COLORS, 
  EMBROIDERY_FONTS, 
  TSHIRT_COLORS, 
  INITIAL_PRODUCTS 
} from '@/lib/mock-data';
import { 
  StitchPlacement, 
  ThreadColor, 
  EmbroideryFont, 
  StitchType, 
  CustomEmbroiderySpec,
  ProductVariant 
} from '@/lib/types';
import { useAtelier } from '@/lib/store';

export default function CustomizerStudio() {
  const { addToCart, showToast } = useAtelier();

  // Active step in guided customer flow
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Selected T-shirt properties
  const [selectedColor, setSelectedColor] = useState(TSHIRT_COLORS[2] || TSHIRT_COLORS[0]); // Default to Vintage Onyx/Black
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>('L');
  const [view, setView] = useState<'front' | 'back'>('front');
  
  // Embroidery mode & placement
  const [mode, setMode] = useState<'TEXT' | 'ARTWORK'>('TEXT');
  const [placement, setPlacement] = useState<StitchPlacement>('CHEST_CENTER');
  
  // Text Mode state
  const [customText, setCustomText] = useState('GETTOO');
  const [selectedFont, setSelectedFont] = useState<EmbroideryFont>(EMBROIDERY_FONTS[0]);
  const [selectedThread, setSelectedThread] = useState<ThreadColor>(THREAD_COLORS[0]);
  const [stitchType, setStitchType] = useState<StitchType>('SATIN');

  // Artwork Mode state
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [artworkScale, setArtworkScale] = useState<number>(1);
  const [artworkRotation, setArtworkRotation] = useState<number>(0);
  const [artworkOffsetX, setArtworkOffsetX] = useState<number>(0);
  const [artworkOffsetY, setArtworkOffsetY] = useState<number>(0);
  const [artworkNotes, setArtworkNotes] = useState('');

  // Sample artwork presets for instant demo
  const sampleArtworks = [
    { label: 'Dragon Crest', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80' },
    { label: 'Tokyo Tiger', url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80' },
    { label: 'Street Icon', url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=400&q=80' },
  ];

  // Quick 1-Click Design Starters for Customers
  const designStarters = [
    {
      name: 'VINTAGE 94',
      text: 'PARIS 94',
      font: EMBROIDERY_FONTS[2] || EMBROIDERY_FONTS[0], // Varsity
      thread: THREAD_COLORS[0], // Gold
      placement: 'CHEST_CENTER' as StitchPlacement,
      view: 'front' as const,
    },
    {
      name: 'HEAVY GOTHIC',
      text: 'ARCHIVE',
      font: EMBROIDERY_FONTS[0], // Heavy block
      thread: THREAD_COLORS[1] || THREAD_COLORS[0], // Silver
      placement: 'CHEST_CENTER' as StitchPlacement,
      view: 'front' as const,
    },
    {
      name: 'MINIMAL CHEST',
      text: 'GT-01',
      font: EMBROIDERY_FONTS[1] || EMBROIDERY_FONTS[0], // Grotesk Mono
      thread: THREAD_COLORS[3] || THREAD_COLORS[0], // Ivory
      placement: 'CHEST_LEFT' as StitchPlacement,
      view: 'front' as const,
    },
    {
      name: 'FULL BACK HIT',
      text: 'GETTOO',
      font: EMBROIDERY_FONTS[0],
      thread: THREAD_COLORS[0],
      placement: 'FULL_BACK' as StitchPlacement,
      view: 'back' as const,
    },
  ];

  // Apply quick design starter
  const applyPreset = (preset: typeof designStarters[0]) => {
    setMode('TEXT');
    setCustomText(preset.text);
    setSelectedFont(preset.font);
    setSelectedThread(preset.thread);
    handlePlacementSelect(preset.placement);
    showToast(`Loaded "${preset.name}" preset! Feel free to edit your text.`, 'info');
  };

  // Auto-switch view when placement requires it
  const handlePlacementSelect = (p: StitchPlacement) => {
    setPlacement(p);
    if (['BACK_NAPE', 'FULL_BACK'].includes(p)) {
      setView('back');
    } else {
      setView('front');
    }
  };

  // Pricing calculations
  const baseTeePrice = 1499;
  const customFee = mode === 'TEXT' ? 399 : 599;
  const totalPrice = baseTeePrice + customFee;
  const estimatedStitches = mode === 'TEXT' 
    ? Math.max(3200, (customText.length || 1) * 850) 
    : 14500;

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImageUrl(event.target?.result as string);
        showToast('Artwork loaded! Adjust placement or size as needed.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Add customized item to bag
  const handleAddToBag = () => {
    const customBlank = INITIAL_PRODUCTS.find((p) => p.slug === 'atelier-bespoke-custom-blank-tee') || INITIAL_PRODUCTS[2];
    
    const variant: ProductVariant = {
      id: `custom-var-${Date.now()}`,
      size: selectedSize,
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
      sku: `CUSTOM-${selectedSize}-${selectedColor.name.replace(/\s+/g, '').toUpperCase()}`,
      stockCount: 50,
    };

    const embroiderySpec: CustomEmbroiderySpec = {
      type: mode,
      placement,
      customText: mode === 'TEXT' ? customText : undefined,
      fontStyle: mode === 'TEXT' ? selectedFont.name : undefined,
      threadColor: selectedThread.name,
      threadColorHex: selectedThread.hex,
      stitchType,
      uploadedImageUrl: mode === 'ARTWORK' ? uploadedImageUrl : undefined,
      artworkNotes: mode === 'ARTWORK' ? artworkNotes : undefined,
      artworkScale,
      artworkRotation,
      artworkOffsetX,
      artworkOffsetY,
      estimatedStitches,
      customCharge: customFee,
    };

    addToCart(customBlank, variant, 1, embroiderySpec);

    // Celebratory confetti
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#CCFF00', '#0A0A0C', '#FFFFFF', '#FF4600']
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      
      {/* Studio Customer-Friendly Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded bg-black text-[#CCFF00] text-[10px] font-mono font-bold uppercase tracking-widest">
            3-STEP BUILDER
          </span>
          <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">
            // EASY CUSTOM T-SHIRT STUDIO
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-wide text-black uppercase">
          DESIGN YOUR CUSTOM EMBROIDERED TEE
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 font-sans leading-relaxed">
          Craft your one-of-a-kind heavyweight tee in 3 simple steps. Pick your blank, customize your text or logo, and we stitch it with industrial high-density precision.
        </p>
      </div>

      {/* Customer Guided Step Indicator Tabs */}
      <div className="max-w-3xl mx-auto grid grid-cols-3 gap-2 p-1.5 bg-zinc-100 rounded-2xl border border-zinc-200">
        <button
          onClick={() => setCurrentStep(1)}
          className={`py-2.5 px-3 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 ${
            currentStep === 1
              ? 'bg-black text-[#CCFF00] shadow-sm'
              : 'text-zinc-600 hover:text-black hover:bg-zinc-200/60'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-zinc-800 text-white text-[10px] flex items-center justify-center">1</span>
          <span className="hidden sm:inline">BLANK T-SHIRT</span>
          <span className="sm:hidden">BLANK</span>
        </button>

        <button
          onClick={() => setCurrentStep(2)}
          className={`py-2.5 px-3 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 ${
            currentStep === 2
              ? 'bg-black text-[#CCFF00] shadow-sm'
              : 'text-zinc-600 hover:text-black hover:bg-zinc-200/60'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-zinc-800 text-white text-[10px] flex items-center justify-center">2</span>
          <span className="hidden sm:inline">YOUR EMBROIDERY</span>
          <span className="sm:hidden">DESIGN</span>
        </button>

        <button
          onClick={() => setCurrentStep(3)}
          className={`py-2.5 px-3 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 ${
            currentStep === 3
              ? 'bg-black text-[#CCFF00] shadow-sm'
              : 'text-zinc-600 hover:text-black hover:bg-zinc-200/60'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-zinc-800 text-white text-[10px] flex items-center justify-center">3</span>
          <span className="hidden sm:inline">PLACEMENT & PROOF</span>
          <span className="sm:hidden">POSITION</span>
        </button>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Live Visualizer & Canvas (6 cols) */}
        <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-28">
          <div className="bg-white p-4 sm:p-6 rounded-2xl border-2 border-zinc-200 shadow-sm">
            
            {/* View Switcher (Front vs Back) */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl border border-zinc-200">
                <button
                  onClick={() => setView('front')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                    view === 'front'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  FRONT VIEW
                </button>
                <button
                  onClick={() => setView('back')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                    view === 'back'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  BACK VIEW
                </button>
              </div>

              <span className="text-[11px] text-zinc-500 font-mono font-bold flex items-center gap-1">
                <RotateCw size={13} />
                LIVE 1:1 RENDER
              </span>
            </div>

            {/* Interactive Tee Canvas */}
            <TeeCanvas
              colorHex={selectedColor.hex}
              colorName={selectedColor.name}
              view={view}
              placement={placement}
              customText={mode === 'TEXT' ? customText : undefined}
              selectedFont={selectedFont}
              selectedThread={selectedThread}
              stitchType={stitchType}
              uploadedImageUrl={mode === 'ARTWORK' ? uploadedImageUrl : undefined}
              artworkScale={artworkScale}
              artworkRotation={artworkRotation}
              artworkOffsetX={artworkOffsetX}
              artworkOffsetY={artworkOffsetY}
              onSelectPlacement={handlePlacementSelect}
            />

            {/* Quick Presets Ribbon (Instant gratification for customers) */}
            <div className="mt-4 pt-4 border-t border-zinc-200">
              <span className="block text-[10px] font-mono font-bold uppercase text-zinc-500 mb-2">
                ⚡ CLICK A PRESET TO GET STARTED INSTANTLY:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {designStarters.map((starter) => (
                  <button
                    key={starter.name}
                    onClick={() => applyPreset(starter)}
                    className="py-1.5 px-2 bg-zinc-50 hover:bg-black hover:text-[#CCFF00] border border-zinc-300 rounded-lg text-[10px] font-mono font-bold uppercase transition-all text-center truncate"
                  >
                    {starter.name}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Guided Customer Steps (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border-2 border-zinc-200 shadow-sm space-y-6">
            
            {/* STEP 1: BLANK T-SHIRT (Color & Size) */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#FF4600] uppercase tracking-wider block">
                      STEP 1 OF 3
                    </span>
                    <h3 className="font-mono text-base font-bold uppercase text-black">
                      CHOOSE YOUR HEAVYWEIGHT BLANK
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold bg-zinc-100 text-black px-2.5 py-1 rounded">
                    280 GSM KNIT
                  </span>
                </div>

                {/* Color Swatches */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-zinc-600">
                      FABRIC COLORWAY: <strong className="text-black">{selectedColor.name}</strong>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                    {TSHIRT_COLORS.map((col) => (
                      <button
                        key={col.name}
                        onClick={() => setSelectedColor(col)}
                        className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 ${
                          selectedColor.name === col.name
                            ? 'border-black bg-zinc-50 shadow-xs ring-1 ring-black'
                            : 'border-zinc-200 hover:border-zinc-400 bg-white'
                        }`}
                      >
                        <span
                          className="w-7 h-7 rounded-full border border-black/20 shadow-xs"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span className="text-[10px] font-mono font-bold text-black truncate max-w-full">
                          {col.name.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-zinc-600">
                      CHOOSE SIZE: <strong className="text-black">{selectedSize} (BOXY OVERSIZED)</strong>
                    </span>
                    <span className="text-[11px] text-zinc-400 font-bold">TRUE TO BOXY FIT</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {(['S', 'M', 'L', 'XL', 'XXL'] as const).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-3 text-center text-xs font-mono font-bold rounded-xl border-2 transition-all ${
                          selectedSize === sz
                            ? 'bg-black text-[#CCFF00] border-black shadow-xs'
                            : 'bg-zinc-50 text-zinc-800 border-zinc-200 hover:border-black'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Next Step Button */}
                <div className="pt-4 border-t border-zinc-200 flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="w-full sm:w-auto px-6 py-3 bg-black hover:bg-zinc-800 text-[#CCFF00] rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>PROCEED TO EMBROIDERY DESIGN</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: EMBROIDERY DESIGN (Text vs Logo) */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#FF4600] uppercase tracking-wider block">
                      STEP 2 OF 3
                    </span>
                    <h3 className="font-mono text-base font-bold uppercase text-black">
                      CHOOSE EMBROIDERY STYLE
                    </h3>
                  </div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-mono text-zinc-500 hover:text-black font-bold"
                  >
                    &larr; Edit Blank
                  </button>
                </div>

                {/* Mode Switcher Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMode('TEXT')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      mode === 'TEXT'
                        ? 'bg-zinc-50 border-black ring-1 ring-black shadow-xs'
                        : 'bg-white border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-black uppercase">TEXT / MONOGRAM</span>
                      <span className="text-[10px] font-mono font-bold text-black bg-[#CCFF00] px-1.5 py-0.5 rounded border border-black">+₹399</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1 font-sans">
                      Type your words, brand initials, or numerals in archival streetwear fonts.
                    </p>
                  </button>

                  <button
                    onClick={() => setMode('ARTWORK')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      mode === 'ARTWORK'
                        ? 'bg-zinc-50 border-black ring-1 ring-black shadow-xs'
                        : 'bg-white border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-black uppercase">UPLOAD LOGO / ART</span>
                      <span className="text-[10px] font-mono font-bold text-black bg-[#CCFF00] px-1.5 py-0.5 rounded border border-black">+₹599</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1 font-sans">
                      Upload your PNG, JPG, or vector. We digitize with high needle density.
                    </p>
                  </button>
                </div>

                {/* Text Customizer Fields */}
                {mode === 'TEXT' ? (
                  <div className="space-y-5 pt-2">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-zinc-700 mb-1">
                        ENTER TEXT OR WORD (UP TO 24 CHARS):
                      </label>
                      <input
                        type="text"
                        maxLength={24}
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value.toUpperCase())}
                        placeholder="E.G. GETTOO, LOS ANGELES, 1998"
                        className="w-full px-3.5 py-2.5 bg-zinc-50 border-2 border-zinc-300 focus:border-black rounded-xl text-sm font-mono font-black tracking-widest text-black uppercase focus:outline-none transition-colors"
                      />
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 mt-1">
                        <span>Characters: {customText.length}/24</span>
                        <span>Estimated Stitches: ~{estimatedStitches.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Font Selector */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-zinc-700 mb-1.5">
                        SELECT TYPOGRAPHY FONT:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {EMBROIDERY_FONTS.map((f) => (
                          <button
                            key={f.id}
                            onClick={() => setSelectedFont(f)}
                            className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                              selectedFont.id === f.id
                                ? 'bg-black text-[#CCFF00] border-black shadow-xs'
                                : 'bg-white text-zinc-800 border-zinc-200 hover:border-black'
                            }`}
                          >
                            <span className={`block text-xs font-bold ${f.previewClass}`}>{f.name}</span>
                            <span className="text-[9px] uppercase tracking-wider font-mono opacity-70">
                              {f.category}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Thread Color */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-mono font-bold uppercase text-zinc-700">
                          THREAD COLOR: <strong className="text-black">{selectedThread.name}</strong>
                        </label>
                        <span className="text-[10px] font-mono text-zinc-500 font-bold">{selectedThread.sheen}</span>
                      </div>
                      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                        {THREAD_COLORS.map((tc) => (
                          <button
                            key={tc.id}
                            onClick={() => setSelectedThread(tc)}
                            className={`relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                              selectedThread.id === tc.id
                                ? 'border-black scale-110 shadow-xs ring-2 ring-black/20'
                                : 'border-black/20 hover:scale-105'
                            }`}
                            style={{ backgroundColor: tc.hex }}
                            title={tc.name}
                          >
                            {selectedThread.id === tc.id && (
                              <Check size={14} className={['#F9F6EE', '#E6D7BD', '#D1D5DB'].includes(tc.hex) ? 'text-black' : 'text-white'} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Artwork Customizer Fields */
                  <div className="space-y-4 pt-2">
                    <div className="border-2 border-dashed border-zinc-300 hover:border-black rounded-2xl p-6 text-center transition-colors bg-zinc-50">
                      <Upload size={28} className="mx-auto text-zinc-400 mb-2" />
                      <p className="text-xs font-mono font-bold text-black mb-1">
                        CLICK TO BROWSE OR DRAG & DROP ARTWORK
                      </p>
                      <p className="text-[10px] font-mono text-zinc-500 mb-3">
                        PNG, JPG, or SVG with transparent background recommended.
                      </p>
                      <label className="inline-block px-4 py-2 bg-black text-[#CCFF00] rounded-xl text-xs font-mono font-bold uppercase cursor-pointer hover:bg-zinc-800 transition-all shadow-xs">
                        Browse Files
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Artwork Test Presets */}
                    <div>
                      <span className="block text-[10px] font-mono font-bold uppercase text-zinc-500 mb-1.5">
                        OR TRY OUR SAMPLE GRAPHICS:
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {sampleArtworks.map((art) => (
                          <button
                            key={art.label}
                            onClick={() => {
                              setUploadedImageUrl(art.url);
                              showToast(`Loaded "${art.label}" graphics!`, 'info');
                            }}
                            className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 ${
                              uploadedImageUrl === art.url
                                ? 'border-black bg-zinc-100 shadow-xs'
                                : 'border-zinc-200 hover:border-zinc-400 bg-white'
                            }`}
                          >
                            <img src={art.url} alt={art.label} className="w-10 h-10 object-cover rounded-lg" />
                            <span className="text-[10px] font-mono font-bold text-black">{art.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Next Step Button */}
                <div className="pt-4 border-t border-zinc-200 flex justify-between items-center">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-mono text-zinc-500 hover:text-black font-bold"
                  >
                    &larr; Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 bg-black hover:bg-zinc-800 text-[#CCFF00] rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-xs"
                  >
                    <span>PROCEED TO PLACEMENT</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PLACEMENT & DIGITAL PROOF */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#FF4600] uppercase tracking-wider block">
                      STEP 3 OF 3
                    </span>
                    <h3 className="font-mono text-base font-bold uppercase text-black">
                      STITCH PLACEMENT ZONE
                    </h3>
                  </div>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-mono text-zinc-500 hover:text-black font-bold"
                  >
                    &larr; Edit Design
                  </button>
                </div>

                {/* Placement Zone Buttons */}
                <div className="space-y-2">
                  <span className="block text-xs font-mono font-bold uppercase text-zinc-700">
                    WHERE DO YOU WANT IT EMBROIDERED?
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'CHEST_CENTER', label: 'CENTER CHEST', view: 'front' },
                      { id: 'CHEST_LEFT', label: 'LEFT CHEST', view: 'front' },
                      { id: 'SLEEVE_LEFT', label: 'LEFT SLEEVE', view: 'front' },
                      { id: 'SLEEVE_RIGHT', label: 'RIGHT SLEEVE', view: 'front' },
                      { id: 'BACK_NAPE', label: 'BACK NAPE', view: 'back' },
                      { id: 'FULL_BACK', label: 'FULL BACK', view: 'back' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handlePlacementSelect(p.id as StitchPlacement)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          placement === p.id
                            ? 'bg-black text-[#CCFF00] border-black shadow-xs font-bold'
                            : 'bg-zinc-50 text-zinc-800 border-zinc-200 hover:border-black'
                        }`}
                      >
                        <span className="block text-xs font-mono">{p.label}</span>
                        <span className="text-[9px] font-mono opacity-60">({p.view} view)</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer Peace-of-Mind Badges */}
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2 font-mono text-xs text-zinc-700">
                  <div className="flex items-center gap-2 text-black font-bold">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    <span>GETTOO QUALITY GUARANTEE</span>
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed font-sans">
                    • <strong>Digital Proof:</strong> We will review thread tension and vector resolution before running machines.
                  </p>
                  <p className="text-[11px] text-zinc-600 leading-relaxed font-sans">
                    • <strong>Pre-Shrunk 280 GSM Cotton:</strong> Fabric will not warp or pucker after laundering.
                  </p>
                </div>

                {/* Back to Step 2 */}
                <div className="pt-2 flex justify-start">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-mono text-zinc-500 hover:text-black font-bold"
                  >
                    &larr; Back to Design Options
                  </button>
                </div>
              </div>
            )}

            {/* Always Visible Customer Order Summary Card */}
            <div className="pt-4 border-t-2 border-zinc-200 space-y-4 bg-zinc-50 -mx-6 -mb-6 p-6 rounded-b-2xl">
              
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>280 GSM Boxy Tee ({selectedSize}, {selectedColor.name})</span>
                  <span className="text-black font-bold">₹{baseTeePrice}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Custom Embroidery ({mode === 'TEXT' ? customText : 'Artwork'}, {placement.replace('_', ' ')})</span>
                  <span className="text-black font-bold">+₹{customFee}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-zinc-200">
                  <div>
                    <span className="text-xs font-bold text-zinc-500 uppercase block">TOTAL PRICE:</span>
                    <span className="text-2xl font-bold text-black">₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-bold">~{estimatedStitches.toLocaleString()} STITCHES</span>
                </div>
              </div>

              {/* Prominent Add to Bag Action Button */}
              <button
                onClick={handleAddToBag}
                className="w-full py-4 px-6 bg-[#0A0A0C] hover:bg-zinc-800 text-[#CCFF00] rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 group"
              >
                <ShoppingBag size={16} />
                <span>ADD CUSTOM TEE TO BAG • ₹{totalPrice.toLocaleString('en-IN')}</span>
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-zinc-500">
                <span className="flex items-center gap-1">
                  <Check size={12} className="text-emerald-600" /> Free Digital Proof
                </span>
                <span className="flex items-center gap-1">
                  <Check size={12} className="text-emerald-600" /> PayU 100% Secure
                </span>
                <span className="flex items-center gap-1">
                  <Check size={12} className="text-emerald-600" /> Free Shipping ₹1,999+
                </span>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Sticky Mobile Bottom Bar for Easy Checkout */}
      <div className="fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md p-3 border-t border-zinc-200 lg:hidden shadow-xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono font-bold text-zinc-500 block uppercase">CUSTOM TEE TOTAL</span>
          <span className="font-mono text-lg font-bold text-black">₹{totalPrice.toLocaleString('en-IN')}</span>
        </div>
        <button
          onClick={handleAddToBag}
          className="px-5 py-2.5 bg-black text-[#CCFF00] font-mono font-bold text-xs uppercase rounded-xl shadow-md flex items-center gap-1.5"
        >
          <ShoppingBag size={14} />
          <span>ADD TO BAG</span>
        </button>
      </div>

    </div>
  );
}
