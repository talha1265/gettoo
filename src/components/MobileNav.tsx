'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Zap, Heart, ShoppingBag, User } from 'lucide-react';
import { useAtelier } from '@/lib/store';

export default function MobileNav() {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen, wishlist, setIsWishlistOpen } = useAtelier();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-zinc-200 lg:hidden px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-2 text-[10px] font-mono font-bold uppercase transition-colors ${
            pathname === '/' ? 'text-black' : 'text-zinc-500'
          }`}
        >
          <Home size={19} className={pathname === '/' ? 'stroke-[2.5]' : ''} />
          <span className="mt-1">HOME</span>
        </Link>

        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center py-1 px-2 text-[10px] font-mono font-bold uppercase transition-colors ${
            pathname === '/shop' ? 'text-black' : 'text-zinc-500'
          }`}
        >
          <div className="relative">
            <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] border border-black absolute -top-0.5 -right-0.5" />
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <span className="mt-1">TEES</span>
        </Link>

        {/* Center Customizer Call to Action */}
        <Link
          href="/studio"
          className="flex flex-col items-center justify-center -mt-4"
        >
          <div className="w-12 h-12 rounded-full bg-[#0A0A0C] text-[#CCFF00] border-2 border-white shadow-xl flex items-center justify-center hover:scale-105 transition-transform">
            <Zap size={20} className="fill-[#CCFF00]" />
          </div>
          <span className="text-[10px] font-mono font-black text-black mt-0.5">STUDIO</span>
        </Link>

        {/* Wishlist */}
        <button
          onClick={() => setIsWishlistOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 px-2 text-[10px] font-mono font-bold uppercase text-zinc-500 hover:text-black transition-colors"
        >
          <Heart size={19} />
          {wishlist.length > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">
              {wishlist.length}
            </span>
          )}
          <span className="mt-1">SAVED</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 px-2 text-[10px] font-mono font-bold uppercase text-zinc-500 hover:text-black transition-colors"
        >
          <ShoppingBag size={19} />
          {cartCount > 0 && (
            <span className="absolute top-1 right-2 min-w-4 h-4 px-1 rounded-full bg-[#CCFF00] text-black border border-black text-[9px] flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
          <span className="mt-1">BAG</span>
        </button>

      </div>
    </div>
  );
}
