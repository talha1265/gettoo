'use client';

import React from 'react';
import Link from 'next/link';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useAtelier } from '@/lib/store';

export default function WishlistDrawer() {
  const { 
    wishlist, 
    isWishlistOpen, 
    setIsWishlistOpen, 
    removeFromWishlist,
    addToCart 
  } = useAtelier();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        onClick={() => setIsWishlistOpen(false)}
        className="absolute inset-0 bg-[#1A1817]/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-zinc-200 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <Heart size={20} className="text-red-500 fill-red-500" />
              <h3 className="font-mono text-base font-bold uppercase tracking-wider text-[#0A0A0C]">
                SAVED DROPS
              </h3>
              <span className="text-xs font-mono bg-zinc-100 px-2 py-0.5 rounded-full text-black font-bold">
                {wishlist.length}
              </span>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-black rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>


          {/* List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EFECE5] border border-[#DDD8CD] flex items-center justify-center text-[#999285]">
                  <Heart size={28} />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-[#1A1817]">Your wishlist is empty</h4>
                  <p className="text-xs text-[#7D766C] mt-1 max-w-xs">
                    Save pieces from our curated drops or bespoke blank silhouettes to review anytime.
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={() => setIsWishlistOpen(false)}
                  className="px-5 py-2.5 bg-[#1A1817] text-white text-xs font-semibold rounded-lg hover:bg-[#33302C] transition-all"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              wishlist.map((product) => (
                <div
                  key={product.id}
                  className="p-3.5 bg-white rounded-xl border border-[#E8E4DC] shadow-xs flex gap-3.5"
                >
                  <div className="w-20 h-24 bg-[#F5F2EB] rounded-lg overflow-hidden shrink-0 border border-[#E5E0D5]">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold text-[#1A1817] line-clamp-1">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="text-[#9E988D] hover:text-red-500 p-0.5 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#787165] mt-1">{product.fabric}</p>
                      <p className="font-serif text-xs font-bold text-[#1A1817] mt-1">
                        ₹{(product.salePrice || product.basePrice).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex gap-2 mt-3 pt-2 border-t border-[#F2ECE1]">
                      <button
                        onClick={() => {
                          const variant = product.variants[0] || {
                            id: 'default',
                            size: 'M',
                            colorName: 'Bone White',
                            colorHex: '#F5F2EB',
                            sku: 'DEF',
                            stockCount: 10
                          };
                          addToCart(product, variant, 1);
                          removeFromWishlist(product.id);
                        }}
                        className="flex-1 py-1.5 px-2 bg-[#1A1817] text-white rounded-lg text-[11px] font-medium flex items-center justify-center gap-1.5 hover:bg-[#333] transition-colors"
                      >
                        <ShoppingBag size={12} />
                        <span>Move to Bag</span>
                      </button>
                      <Link
                        href={`/shop/${product.slug}`}
                        onClick={() => setIsWishlistOpen(false)}
                        className="py-1.5 px-3 bg-[#FAF8F5] border border-[#DDD7CB] text-[#333] rounded-lg text-[11px] font-medium hover:bg-[#F2ECE1] transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
