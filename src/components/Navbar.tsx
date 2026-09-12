'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  Menu, 
  X, 
  User, 
  ShieldCheck, 
  Search, 
  LogOut, 
  ChevronDown,
  Flame,
  Zap
} from 'lucide-react';
import { useAtelier } from '@/lib/store';

export default function Navbar() {
  const pathname = usePathname();
  const { 
    cartCount, 
    setIsCartOpen, 
    wishlist, 
    setIsWishlistOpen, 
    user, 
    loginDemoUser, 
    logoutUser 
  } = useAtelier();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { label: 'CUSTOM STUDIO', href: '/studio', highlight: true },
    { label: 'DROP 01 TEES', href: '/shop' },
    { label: 'HEAVYWEIGHT BLANKS', href: '/blanks', badge: '280 GSM' },
    { label: 'STITCH RADAR', href: '/track' },
    { label: 'ADMIN LAB', href: '/admin', badge: 'Manager' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E4E4E8] transition-all">
      {/* Top Streetwear Drop Announcement Ticker */}
      <div className="bg-[#0A0A0C] text-white text-[11px] py-2 px-4 overflow-hidden border-b border-zinc-800">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#CCFF00] text-black text-[9px] font-mono font-black uppercase tracking-wider">
              LIMITED DROP
            </span>
            <span className="hidden sm:inline font-mono text-zinc-300">
              DROP 01 LIVE • 280 GSM HEAVYWEIGHT KNIT • HIGH-DENSITY EMBROIDERY LAB
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-zinc-400">
              ⚡ 100% PREPAID PAYU CHECKOUT • FREE ALL-INDIA SHIPPING OVER ₹1,999
            </span>
          </div>
        </div>
      </div>

      {/* Main Streetwear Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#0A0A0C] hover:text-black transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Streetwear Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="group flex flex-col items-start select-none">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-3xl sm:text-4xl tracking-wider text-[#0A0A0C] group-hover:text-zinc-600 transition-colors">
                  GETTOO
                </span>
                <span className="text-[#FF4600] text-lg font-bold">®</span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] uppercase font-mono tracking-widest bg-zinc-900 text-white rounded font-bold">
                  HEAVYWEIGHT
                </span>
              </div>
              <span className="text-[9px] uppercase font-mono tracking-[0.25em] text-[#71717A] -mt-1 font-bold">
                STREETWEAR & EMBROIDERY LAB
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-xs uppercase font-mono font-bold tracking-wider transition-colors py-1.5 ${
                    isActive
                      ? 'text-[#0A0A0C]'
                      : 'text-[#71717A] hover:text-[#0A0A0C]'
                  } ${
                    link.highlight
                      ? 'px-3 py-1.5 bg-[#0A0A0C] text-[#CCFF00] rounded-md hover:bg-zinc-800 flex items-center gap-1.5 shadow-sm'
                      : ''
                  }`}
                >
                  {link.highlight && <Zap size={13} className="text-[#CCFF00] fill-[#CCFF00]" />}
                  <span>{link.label}</span>
                  {link.badge && !link.highlight && (
                    <span className="ml-1.5 text-[9px] uppercase px-1.5 py-0.5 bg-zinc-100 border border-zinc-300 text-zinc-800 rounded font-mono font-bold">
                      {link.badge}
                    </span>
                  )}
                  {isActive && !link.highlight && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0A0A0C] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#0A0A0C] hover:text-zinc-600 transition-colors"
              aria-label="Search collection"
            >
              <Search size={20} />
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 text-[#0A0A0C] hover:text-zinc-600 transition-colors"
              aria-label="View Wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-mono font-bold text-white bg-[#0A0A0C] rounded-full">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger with Streetwear Bag Count */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#0A0A0C] hover:text-zinc-600 transition-colors flex items-center gap-1.5"
              aria-label="View Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="flex items-center justify-center min-w-5 h-5 px-1 text-[10px] font-mono font-bold text-black bg-[#CCFF00] border border-black rounded-full shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-[#E4E4E8] hover:border-black bg-white transition-all text-xs font-mono font-bold text-[#0A0A0C]"
              >
                <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center font-mono font-bold text-xs">
                  {user ? user.name.charAt(0).toUpperCase() : <User size={13} />}
                </div>
                <span className="hidden sm:inline-block max-w-[85px] truncate">
                  {user ? user.name.split(' ')[0] : 'SIGN IN'}
                </span>
                <ChevronDown size={14} className="text-zinc-500" />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-zinc-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {user ? (
                    <>
                      <div className="px-4 py-2.5 border-b border-zinc-100">
                        <p className="text-[11px] font-mono text-zinc-500">MEMBER ACCOUNT</p>
                        <p className="text-sm font-bold text-zinc-900 truncate">{user.name}</p>
                        <span className={`inline-block mt-1 text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded ${
                          user.role === 'ADMIN' ? 'bg-black text-[#CCFF00]' : 'bg-zinc-100 text-zinc-800'
                        }`}>
                          {user.role} ACCESS
                        </span>
                      </div>

                      <Link
                        href="/profile"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold text-zinc-800 hover:bg-zinc-50 transition-colors"
                      >
                        <User size={15} />
                        <span>MY PROFILE & ORDERS</span>
                      </Link>

                      <Link
                        href="/admin"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold text-zinc-800 hover:bg-zinc-50 transition-colors"
                      >
                        <ShieldCheck size={15} />
                        <span>ADMIN STUDIO DASHBOARD</span>
                      </Link>

                      <div className="px-4 py-2 border-t border-zinc-100 bg-zinc-50">
                        <p className="text-[10px] font-mono text-zinc-500 mb-1.5">DEMO ROLE SWITCH</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { loginDemoUser('CUSTOMER'); setAccountMenuOpen(false); }}
                            className={`flex-1 py-1 text-[10px] font-mono font-bold rounded border ${
                              user.role === 'CUSTOMER' ? 'bg-black text-white' : 'bg-white text-zinc-700 border-zinc-300'
                            }`}
                          >
                            CUSTOMER
                          </button>
                          <button
                            onClick={() => { loginDemoUser('ADMIN'); setAccountMenuOpen(false); }}
                            className={`flex-1 py-1 text-[10px] font-mono font-bold rounded border ${
                              user.role === 'ADMIN' ? 'bg-black text-white' : 'bg-white text-zinc-700 border-zinc-300'
                            }`}
                          >
                            ADMIN
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => { logoutUser(); setAccountMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold text-red-600 hover:bg-red-50 transition-colors border-t border-zinc-100"
                      >
                        <LogOut size={15} />
                        <span>SIGN OUT</span>
                      </button>
                    </>
                  ) : (
                    <div className="p-3 space-y-2">
                      <button
                        onClick={() => { loginDemoUser('CUSTOMER'); setAccountMenuOpen(false); }}
                        className="w-full py-2 px-3 bg-[#0A0A0C] text-white text-xs font-mono font-bold rounded-lg hover:bg-zinc-800 transition-colors uppercase tracking-wider"
                      >
                        Sign in as Customer
                      </button>
                      <button
                        onClick={() => { loginDemoUser('ADMIN'); setAccountMenuOpen(false); }}
                        className="w-full py-2 px-3 bg-zinc-100 border border-zinc-300 text-black text-xs font-mono font-bold rounded-lg hover:bg-zinc-200 transition-colors uppercase tracking-wider"
                      >
                        Sign in as Admin
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Search Overlay */}
      {searchOpen && (
        <div className="border-t border-zinc-200 bg-white p-4 animate-in slide-in-from-top-1 duration-150 shadow-md">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <Search size={20} className="text-zinc-400" />
            <input
              type="text"
              placeholder="Search drops, heavyweight tees, custom embroidery, blank GSM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-[#0A0A0C] text-sm font-medium focus:outline-none placeholder:text-zinc-400 font-mono"
              autoFocus
            />
            <Link
              href={`/shop?q=${encodeURIComponent(searchQuery)}`}
              onClick={() => setSearchOpen(false)}
              className="px-4 py-2 bg-[#0A0A0C] text-white text-xs font-mono font-bold rounded-lg hover:bg-zinc-800 transition-colors uppercase"
            >
              SEARCH
            </Link>
            <button
              onClick={() => setSearchOpen(false)}
              className="p-1 text-zinc-400 hover:text-black"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider ${
                pathname === link.href
                  ? 'bg-black text-white'
                  : 'text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] bg-zinc-200 text-black px-2 py-0.5 rounded font-mono font-bold">
                    {link.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
          <div className="pt-4 border-t border-zinc-200">
            <Link
              href="/studio"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-3 text-center bg-[#0A0A0C] text-[#CCFF00] font-mono font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm"
            >
              ENTER CUSTOM T-SHIRT STUDIO
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
