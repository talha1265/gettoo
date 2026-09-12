'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { 
  Heart, 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Layers, 
  Scissors, 
  ArrowLeft,
  Check,
  Lock,
  Zap
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/lib/mock-data';
import { useAtelier } from '@/lib/store';
import { ProductVariant } from '@/lib/types';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const product = INITIAL_PRODUCTS.find((p) => p.slug === slug);
  const { addToCart, toggleWishlist, isInWishlist } = useAtelier();

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="font-mono text-2xl font-bold text-[#0A0A0C]">GARMENT NOT FOUND</h2>
        <p className="text-xs font-mono text-zinc-500">This drop may have sold out or retired from our active catalog.</p>
        <Link href="/shop" className="px-5 py-2.5 bg-black text-[#CCFF00] text-xs font-mono font-bold uppercase rounded-lg inline-block">
          RETURN TO TEES & DROPS
        </Link>
      </div>
    );
  }

  const inWish = isInWishlist(product.id);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [quantity, setQuantity] = useState(1);

  const price = product.salePrice || product.basePrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-500 hover:text-black uppercase"
        >
          <ArrowLeft size={14} />
          <span>BACK TO COLLECTION</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        
        {/* Left: Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/5 bg-zinc-100 rounded-2xl border-2 border-zinc-200 overflow-hidden shadow-sm">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.stitchCount && (
              <span className="absolute bottom-4 left-4 bg-black/90 backdrop-blur-xs text-[#CCFF00] text-xs font-mono font-bold px-3 py-1 rounded-md shadow-xs border border-zinc-800">
                {product.stitchCount.toLocaleString()} TOTAL NEEDLE STITCHES
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img ? 'border-black scale-105' : 'border-zinc-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Purchase Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5">
              <span className="bg-zinc-100 text-zinc-800 px-2.5 py-0.5 rounded border border-zinc-200">{product.category}</span>
              <span className="text-black font-bold flex items-center gap-1">
                <Check size={14} className="text-emerald-600" /> QUALITY LAB VERIFIED
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-normal text-[#0A0A0C] uppercase leading-tight mt-2">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mt-3">
              <span className="font-mono text-3xl font-bold text-[#0A0A0C]">
                ₹{price.toLocaleString('en-IN')}
              </span>
              {product.salePrice && (
                <span className="text-base text-zinc-400 line-through font-mono">
                  ₹{product.basePrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs text-zinc-500 font-mono">
                (Taxes Included • Prepaid PayU)
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-sans">
            {product.description}
          </p>

          {product.story && (
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-700 leading-relaxed font-mono">
              <strong className="text-black block mb-1">TECHNICAL SPECIFICATIONS:</strong> {product.story}
            </div>
          )}

          {/* Thread colors used */}
          {product.threadColorsUsed && (
            <div>
              <span className="block text-xs font-mono font-bold text-zinc-500 mb-1.5 uppercase">
                THREAD COLORWAYS:
              </span>
              <div className="flex flex-wrap gap-2">
                {product.threadColorsUsed.map((th) => (
                  <span key={th} className="px-2.5 py-1 bg-zinc-100 border border-zinc-300 rounded-md text-[11px] font-mono font-bold text-black">
                    {th}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Size & Stock Selector */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-zinc-700">
                FIT SIZE: <strong className="text-black">{selectedVariant.size}</strong>
              </span>
              <span className="text-[11px] text-zinc-500 font-bold">
                STOCK: {selectedVariant.stockCount} UNITS AVAILABLE
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`py-2 text-center text-xs font-mono font-bold rounded-xl border-2 transition-all ${
                    selectedVariant.id === v.id
                      ? 'bg-black text-[#CCFF00] border-black shadow-xs'
                      : 'bg-white text-zinc-700 border-zinc-200 hover:border-black'
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <button
                onClick={() => addToCart(product, selectedVariant, quantity)}
                className="flex-1 py-3.5 px-6 bg-[#0A0A0C] hover:bg-zinc-800 text-[#CCFF00] rounded-xl font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} />
                <span>ADD TO BAG</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-xl border-2 transition-all ${
                  inWish
                    ? 'bg-red-50 border-red-500 text-red-500'
                    : 'bg-white border-zinc-300 text-black hover:border-black'
                }`}
                aria-label="Wishlist toggle"
              >
                <Heart size={18} className={inWish ? 'fill-red-500' : ''} />
              </button>
            </div>

            {/* Custom Studio Link */}
            {product.isCustomizable && (
              <Link
                href="/studio"
                className="w-full py-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-black rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-center block transition-all flex items-center justify-center gap-2"
              >
                <Zap size={14} className="fill-black" />
                <span>CUSTOMIZE THIS DESIGN IN STUDIO LAB</span>
              </Link>
            )}
          </div>

          {/* Value Assurance Badges */}
          <div className="pt-4 border-t border-zinc-200 grid grid-cols-2 gap-3 text-xs font-mono text-zinc-600">
            <div className="flex items-center gap-2">
              <Layers size={15} className="text-black" />
              <span>{product.gsm} GSM COMBED COTTON</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock size={15} className="text-black" />
              <span>PAYU 100% PREPAID</span>
            </div>
            <div className="flex items-center gap-2">
              <Scissors size={15} className="text-black" />
              <span>MADEIRA GERMAN THREAD</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck size={15} className="text-black" />
              <span>EXPRESS PAN-INDIA</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
