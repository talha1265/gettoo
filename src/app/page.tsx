'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  Heart, 
  ShoppingBag, 
  ShieldCheck, 
  Layers, 
  Star,
  Zap,
  Flame,
  CheckCircle2,
  Lock,
  Scissors,
  Eye,
  Sliders,
  RotateCw
} from 'lucide-react';
import { INITIAL_PRODUCTS, THREAD_COLORS, TSHIRT_COLORS } from '@/lib/mock-data';
import { useAtelier } from '@/lib/store';
import TeeCanvas from '@/components/TeeCanvas';

export default function HomePage() {
  const { addToCart, toggleWishlist, isInWishlist } = useAtelier();
  
  // Interactive mini preview on hero/home
  const [heroMonogram, setHeroMonogram] = useState('GETTOO');
  const [heroThread, setHeroThread] = useState(THREAD_COLORS[0]);
  const [heroTeeColor, setHeroTeeColor] = useState(TSHIRT_COLORS[2] || TSHIRT_COLORS[0]); // Default to black/onyx for heavy streetwear vibe
  const [heroView, setHeroView] = useState<'front' | 'back'>('front');
  const [heroSize, setHeroSize] = useState('L');

  // Track selected size for each product card
  const [selectedProductSizes, setSelectedProductSizes] = useState<{ [productId: string]: string }>({
    'prod-1': 'L',
    'prod-2': 'M',
    'prod-3': 'L',
    'prod-4': 'L',
  });

  return (
    <div className="space-y-12 lg:space-y-20 pb-16">
      
      {/* 1. STREETWEAR HERO SECTION */}
      <section className="relative overflow-hidden pt-6 pb-12 lg:pt-12 lg:pb-20 border-b border-zinc-200 bg-white">
        
        {/* Subtle technical background grid */}
        <div className="absolute inset-0 atelier-grid opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Hero Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Drop Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950 text-white text-xs font-mono font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
                <span>DROP 01 // 280 GSM HEAVYWEIGHT OVERSIZED TEES</span>
              </div>

              {/* Bold Streetwear Display Headline */}
              <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[#0A0A0C] uppercase leading-[0.92]">
                HEAVYWEIGHT <br />
                <span className="text-[#71717A]">STREETWEAR.</span> <br />
                <span className="bg-gradient-to-r from-black to-zinc-700 bg-clip-text text-transparent">
                  EMBROIDERY LAB.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-zinc-600 max-w-xl leading-relaxed font-sans">
                Engineered boxy drop-shoulder silhouettes milled from 240–280 GSM organic combed cotton. High-density embroidery with up to 85,000 stitches. 100% prepaid checkout via PayU.
              </p>

              {/* Streetwear Spec Badges */}
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px] font-bold">
                <span className="px-2.5 py-1 bg-zinc-100 border border-zinc-300 text-zinc-800 rounded">
                  280 GSM KNIT
                </span>
                <span className="px-2.5 py-1 bg-zinc-100 border border-zinc-300 text-zinc-800 rounded">
                  BOXY DROP-SHOULDER
                </span>
                <span className="px-2.5 py-1 bg-zinc-100 border border-zinc-300 text-zinc-800 rounded">
                  1.25" HEAVY COLLAR
                </span>
                <span className="px-2.5 py-1 bg-zinc-100 border border-zinc-300 text-zinc-800 rounded">
                  PRE-SHRUNK
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
                <Link
                  href="/studio"
                  className="px-8 py-4 bg-[#0A0A0C] hover:bg-zinc-800 text-[#CCFF00] rounded-xl font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2.5 group"
                >
                  <Zap size={16} className="fill-[#CCFF00]" />
                  <span>LAUNCH CUSTOM STUDIO</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/shop"
                  className="px-8 py-4 bg-white hover:bg-zinc-50 text-[#0A0A0C] border-2 border-zinc-900 rounded-xl font-mono font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>SHOP DROP 01 TEES</span>
                </Link>
              </div>

              {/* T-Shirt Tech Matrix Indicators */}
              <div className="pt-6 border-t border-zinc-200 grid grid-cols-3 gap-4 max-w-lg text-left font-mono">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-[#0A0A0C] block">280 GSM</span>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Heavy French Terry</p>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-[#0A0A0C] block">85K</span>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Max Stitch Density</p>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-[#0A0A0C] block">PAYU</span>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Prepaid Encrypted</p>
                </div>
              </div>

            </div>

            {/* Hero Right: Live Interactive T-Shirt Customizer Canvas (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-zinc-900 shadow-2xl relative">
                
                {/* Header Bar */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] border border-black animate-ping" />
                    <span className="text-xs font-mono font-black uppercase tracking-wider text-black">
                      LIVE T-SHIRT CUSTOMIZER
                    </span>
                  </div>
                  
                  {/* View Switcher Front / Back */}
                  <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-lg border border-zinc-300">
                    <button
                      onClick={() => setHeroView('front')}
                      className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                        heroView === 'front' ? 'bg-black text-white' : 'text-zinc-600 hover:text-black'
                      }`}
                    >
                      FRONT
                    </button>
                    <button
                      onClick={() => setHeroView('back')}
                      className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                        heroView === 'back' ? 'bg-black text-white' : 'text-zinc-600 hover:text-black'
                      }`}
                    >
                      BACK
                    </button>
                  </div>
                </div>

                {/* Live Mockup Canvas */}
                <div className="relative">
                  <TeeCanvas
                    colorHex={heroTeeColor.hex}
                    colorName={heroTeeColor.name}
                    view={heroView}
                    placement={heroView === 'front' ? 'CHEST_CENTER' : 'FULL_BACK'}
                    customText={heroMonogram}
                    selectedThread={heroThread}
                    stitchType="SATIN"
                  />
                </div>

                {/* Controls & Quick Try */}
                <div className="mt-4 pt-3 border-t border-zinc-200 space-y-3">
                  
                  {/* Text Input */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-600 mb-1">
                      ENTER EMBROIDERY TEXT / MONOGRAM:
                    </label>
                    <input
                      type="text"
                      maxLength={14}
                      value={heroMonogram}
                      onChange={(e) => setHeroMonogram(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 bg-zinc-50 border-2 border-zinc-300 focus:border-black rounded-lg text-xs font-mono font-black tracking-widest text-[#0A0A0C] uppercase focus:outline-none transition-colors"
                      placeholder="YOUR TEXT"
                    />
                  </div>

                  {/* Size Selector Pills */}
                  <div>
                    <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-600 mb-1">
                      SELECT FIT & SIZE:
                    </span>
                    <div className="flex gap-1.5">
                      {['S', 'M', 'L', 'XL', '2XL'].map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setHeroSize(sz)}
                          className={`flex-1 py-1 text-[11px] font-mono font-bold rounded border transition-all ${
                            heroSize === sz
                              ? 'bg-black text-[#CCFF00] border-black shadow-xs'
                              : 'bg-zinc-100 text-zinc-700 border-zinc-300 hover:border-black'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Color Swatches */}
                  <div className="flex items-center justify-between pt-1">
                    {/* Thread Color */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-zinc-500 font-mono font-bold">THREAD:</span>
                      {THREAD_COLORS.slice(0, 5).map((th) => (
                        <button
                          key={th.id}
                          onClick={() => setHeroThread(th)}
                          className={`w-5 h-5 rounded-full border-2 transition-transform ${
                            heroThread.id === th.id ? 'scale-125 border-black ring-2 ring-black/20' : 'border-black/20'
                          }`}
                          style={{ backgroundColor: th.hex }}
                          title={th.name}
                        />
                      ))}
                    </div>

                    {/* Tee Blank Color */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-zinc-500 font-mono font-bold">BLANK:</span>
                      {TSHIRT_COLORS.slice(0, 4).map((col) => (
                        <button
                          key={col.name}
                          onClick={() => setHeroTeeColor(col)}
                          className={`w-5 h-5 rounded-full border-2 transition-transform ${
                            heroTeeColor.name === col.name ? 'scale-125 border-black ring-2 ring-black/20' : 'border-black/20'
                          }`}
                          style={{ backgroundColor: col.hex }}
                          title={col.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Launch Studio CTA */}
                  <Link
                    href={`/studio?text=${encodeURIComponent(heroMonogram)}`}
                    className="w-full py-3 bg-[#0A0A0C] hover:bg-zinc-800 text-[#CCFF00] rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-center block transition-all shadow-md"
                  >
                    CUSTOMIZE THIS IN STUDIO LAB &rarr;
                  </Link>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CONTINUOUS STREETWEAR MARQUEE BANNER */}
      <div className="bg-[#0A0A0C] text-white py-3 border-y border-zinc-800 overflow-hidden font-mono text-xs font-bold uppercase tracking-widest select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-[#CCFF00]">
          <span>⚡ DROP 01 LIVE NOW</span>
          <span className="text-white">•</span>
          <span className="text-white">280 GSM HEAVYWEIGHT DROP-SHOULDER TEES</span>
          <span className="text-white">•</span>
          <span>100% PREPAID CHECKOUT VIA PAYU</span>
          <span className="text-white">•</span>
          <span className="text-white">HIGH-DENSITY EMBROIDERY (85K STITCHES)</span>
          <span className="text-white">•</span>
          <span>FREE EXPRESS PAN-INDIA SHIPPING OVER ₹1,999</span>
          <span className="text-white">•</span>
          <span className="text-white">PRE-SHRUNK COMBED ORGANIC COTTON</span>
          <span className="text-white">•</span>
          <span>OVERSIZED BOXY FIT</span>
          <span className="text-white">•</span>
          <span>⚡ DROP 01 LIVE NOW</span>
          <span className="text-white">•</span>
          <span className="text-white">280 GSM HEAVYWEIGHT DROP-SHOULDER TEES</span>
          <span className="text-white">•</span>
          <span>100% PREPAID CHECKOUT VIA PAYU</span>
          <span className="text-white">•</span>
        </div>
      </div>

      {/* 3. DROP 01 / READY-TO-WEAR STREETWEAR CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-zinc-200 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-black text-[#CCFF00] text-[10px] font-mono font-bold uppercase tracking-widest">
                DROP 01
              </span>
              <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">
                // ARCHIVAL STREETWEAR RELEASES
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-wide text-[#0A0A0C] uppercase">
              HEAVYWEIGHT EMBROIDERED TEES
            </h2>
          </div>

          <Link
            href="/shop"
            className="text-xs font-mono font-bold uppercase tracking-wider text-[#0A0A0C] hover:text-zinc-600 flex items-center gap-1 group"
          >
            <span>VIEW ALL TEES & BLANKS</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Streetwear Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_PRODUCTS.map((product) => {
            const inWish = isInWishlist(product.id);
            const activeSize = selectedProductSizes[product.id] || 'L';

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border-2 border-zinc-200 hover:border-black overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Product Image & Badges */}
                <div className="relative aspect-4/5 bg-zinc-100 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-zinc-300 flex items-center justify-center text-[#0A0A0C] hover:text-red-500 transition-all shadow-xs"
                    aria-label="Save to wishlist"
                  >
                    <Heart
                      size={16}
                      className={inWish ? 'fill-red-500 text-red-500' : ''}
                    />
                  </button>

                  {/* Stitch Density Tag */}
                  {product.stitchCount && (
                    <span className="absolute bottom-3 left-3 bg-black/90 backdrop-blur-xs text-[#CCFF00] text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xs border border-zinc-800">
                      {product.stitchCount.toLocaleString()} STITCHES
                    </span>
                  )}

                  {/* GSM Tag */}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-black text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xs border border-zinc-200">
                    {product.gsm} GSM
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-1">
                      <span className="font-bold">{product.fit || 'BOXY FIT'}</span>
                      {product.isCustomizable && (
                        <span className="text-black font-bold flex items-center gap-1">
                          <Zap size={10} className="fill-[#CCFF00] text-black" /> CUSTOMIZABLE
                        </span>
                      )}
                    </div>

                    <Link href={`/shop/${product.slug}`}>
                      <h3 className="font-sans font-bold text-sm text-[#0A0A0C] group-hover:text-zinc-700 transition-colors line-clamp-1 uppercase">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Quick Size Selector Pills on Card */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-zinc-400">FIT SIZE:</span>
                      <span className="text-[10px] font-mono font-bold text-black">{activeSize}</span>
                    </div>
                    <div className="flex gap-1">
                      {['S', 'M', 'L', 'XL'].map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedProductSizes(prev => ({ ...prev, [product.id]: sz }))}
                          className={`flex-1 py-1 text-[10px] font-mono font-bold rounded border ${
                            activeSize === sz
                              ? 'bg-black text-[#CCFF00] border-black'
                              : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-400'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price and Add to Bag Action */}
                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-base font-bold text-[#0A0A0C]">
                        ₹{(product.salePrice || product.basePrice).toLocaleString('en-IN')}
                      </span>
                      {product.salePrice && (
                        <span className="ml-1.5 text-xs text-zinc-400 line-through font-mono">
                          ₹{product.basePrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        const variant = product.variants.find(v => v.size === activeSize) || product.variants[0];
                        addToCart(product, variant, 1);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#0A0A0C] hover:bg-zinc-800 text-[#CCFF00] font-mono font-bold transition-all flex items-center gap-1.5 text-xs shadow-xs"
                      title="Add to bag"
                    >
                      <ShoppingBag size={14} />
                      <span>ADD</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. T-SHIRT FABRIC ENGINEERING & ANATOMY MATRIX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-950 text-white rounded-3xl p-8 sm:p-12 border border-zinc-800 relative overflow-hidden">
          
          {/* Subtle grid in background */}
          <div className="absolute inset-0 dark-grid opacity-30 pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-zinc-800 text-[#CCFF00] text-[10px] font-mono font-bold tracking-widest">
              FABRIC SCIENCE
            </div>
            <h3 className="font-display text-4xl sm:text-5xl font-normal tracking-wide uppercase leading-tight">
              ENGINEERED HEAVYWEIGHT ANATOMY
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-sans">
              Standard commercial t-shirts (160–180 GSM) collapse under dense needle strikes. We custom mill 240–280 GSM knits designed specifically for high-tension embroidery with zero puckering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            
            <div className="bg-zinc-900/80 backdrop-blur-md p-5 rounded-2xl border border-zinc-800 space-y-2.5">
              <span className="text-xs font-mono font-bold text-[#CCFF00] block">01 // DENSITY</span>
              <h4 className="font-mono text-base font-bold text-white uppercase">280 GSM Knitted Cotton</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Ultra-dense long-staple combed cotton and micro French terry that supports up to 85,000 stitches without backing distortion.
              </p>
            </div>

            <div className="bg-zinc-900/80 backdrop-blur-md p-5 rounded-2xl border border-zinc-800 space-y-2.5">
              <span className="text-xs font-mono font-bold text-[#CCFF00] block">02 // COLLAR STRUCTURE</span>
              <h4 className="font-mono text-base font-bold text-white uppercase">1.25" Heavy Ribbed Collar</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Thick 1x1 spandex-infused collar ribbing that never bacons or stretches out, maintaining crisp necklines wash after wash.
              </p>
            </div>

            <div className="bg-zinc-900/80 backdrop-blur-md p-5 rounded-2xl border border-zinc-800 space-y-2.5">
              <span className="text-xs font-mono font-bold text-[#CCFF00] block">03 // STREET SILHOUETTE</span>
              <h4 className="font-mono text-base font-bold text-white uppercase">Boxy Drop-Shoulder</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Wider chest cut with dropped armholes, relaxed sleeves, and a clean structured drape inspired by archival Tokyo streetwear.
              </p>
            </div>

            <div className="bg-zinc-900/80 backdrop-blur-md p-5 rounded-2xl border border-zinc-800 space-y-2.5">
              <span className="text-xs font-mono font-bold text-[#CCFF00] block">04 // THREAD INTEGRITY</span>
              <h4 className="font-mono text-base font-bold text-white uppercase">German Madeira Threads</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Colorfast, high-luster threads rated for 90°C washing. Resistant to bleach, abrasion, and fading in industrial conditions.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. CUSTOM STUDIO PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-black shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF4600] flex items-center gap-1.5">
              <Zap size={14} className="fill-[#FF4600]" /> BESPOKE EMBROIDERY LAB
            </span>

            <h3 className="font-display text-4xl sm:text-5xl font-normal tracking-wide text-black uppercase leading-tight">
              HAVE A VECTOR OR LOGO? <br />
              <span className="text-zinc-500">WE DIGITISE & STITCH IT.</span>
            </h3>

            <p className="text-sm text-zinc-600 leading-relaxed">
              Upload your custom streetwear artwork, brand monogram, or graphics. Our digitizers optimize needle densities, satin underlays, and 3D puff layers for a retail-grade heavyweight finish.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/studio"
                className="px-6 py-3.5 bg-[#0A0A0C] hover:bg-zinc-800 text-[#CCFF00] rounded-xl font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center gap-2"
              >
                <Zap size={15} className="fill-[#CCFF00]" />
                <span>OPEN CUSTOM STUDIO</span>
              </Link>

              <Link
                href="/blanks"
                className="px-6 py-3.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-black rounded-xl font-mono font-bold text-xs tracking-wider uppercase transition-all"
              >
                VIEW 280 GSM BLANKS
              </Link>
            </div>
          </div>

          <div className="w-full md:w-auto p-6 bg-zinc-100 rounded-2xl border border-zinc-300 font-mono text-xs space-y-2 text-zinc-800 shrink-0">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-300">
              <span className="font-bold">PRODUCTION PIPELINE</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-black text-[#CCFF00] font-bold">ACTIVE</span>
            </div>
            <p>• Vector proofing & automated stitch simulation</p>
            <p>• Machine density calibration (0.4mm pitch)</p>
            <p>• Pre-shrunk 280 GSM garment framing</p>
            <p>• PayU encrypted 100% prepaid checkout</p>
          </div>

        </div>
      </section>

      {/* 6. REAL STREETWEAR REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-zinc-500">
            VERIFIED APPAREL REVIEWS
          </span>
          <h3 className="font-display text-3xl sm:text-4xl font-normal text-black uppercase">
            STREETWEAR COMMUNITY TESTED
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: 'The 280 GSM boxy tee is by far the best blank I have felt. Heavy, structured, and the collar stays tight even after several heavy machine washes. 10/10.',
              author: 'Aman V., Bengaluru',
              tag: 'Drop 01 Sovereign Tee',
            },
            {
              quote: 'Uploaded our crew logo into the custom studio. The satin stitch and puff density came out razor-sharp. Way better than normal screen printing.',
              author: 'Kabir S., Mumbai',
              tag: 'Custom Vector Order',
            },
            {
              quote: 'The drop-shoulder fit is genuinely on point — not just a generic oversized tee. PayU checkout was super fast via UPI, tracking was live on WhatsApp.',
              author: 'Devika P., New Delhi',
              tag: 'Archival Blank Order',
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border-2 border-zinc-200 shadow-sm space-y-3">
              <div className="flex gap-1 text-black">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-black text-black" />
                ))}
              </div>
              <p className="text-xs text-zinc-700 leading-relaxed font-sans">
                "{item.quote}"
              </p>
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                <h5 className="text-xs font-bold text-black uppercase font-mono">{item.author}</h5>
                <span className="text-[10px] text-zinc-500 font-mono font-bold bg-zinc-100 px-2 py-0.5 rounded">
                  {item.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
