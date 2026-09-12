'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Heart, 
  ShoppingBag, 
  Filter, 
  Sparkles, 
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  Zap
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/lib/mock-data';
import { useAtelier } from '@/lib/store';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('cat') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const { addToCart, toggleWishlist, isInWishlist } = useAtelier();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'stitches'>('featured');
  const [selectedSizes, setSelectedSizes] = useState<{ [id: string]: string }>({
    'prod-1': 'L',
    'prod-2': 'M',
    'prod-3': 'L',
    'prod-4': 'L',
  });

  const categories = [
    { id: 'all', label: 'ALL TEES & BLANKS' },
    { id: 'heritage', label: 'DROP 01: SOVEREIGN' },
    { id: 'blanks', label: 'HEAVY BLANKS (240–280 GSM)' },
  ];

  // Filter products
  let filtered = INITIAL_PRODUCTS.filter((product) => {
    const matchesCategory = 
      selectedCategory === 'all' ||
      (selectedCategory === 'heritage' && product.category.includes('Heritage')) ||
      (selectedCategory === 'blanks' && product.category.includes('Blanks'));

    const matchesQuery = 
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesQuery;
  });

  // Sort
  if (sortBy === 'price-asc') {
    filtered.sort((a, b) => (a.salePrice || a.basePrice) - (b.salePrice || b.basePrice));
  } else if (sortBy === 'price-desc') {
    filtered.sort((a, b) => (b.salePrice || b.basePrice) - (a.salePrice || a.basePrice));
  } else if (sortBy === 'stitches') {
    filtered.sort((a, b) => (b.stitchCount || 0) - (a.stitchCount || 0));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      
      {/* Streetwear Header */}
      <div className="border-b border-zinc-200 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded bg-black text-[#CCFF00] text-[10px] font-mono font-bold uppercase tracking-widest">
            CATALOG
          </span>
          <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">
            // ARCHIVAL DROPS & HEAVYWEIGHT CANVAS
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-wide text-[#0A0A0C] uppercase mt-1">
          DROP 01 & HEAVYWEIGHT TEES
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 mt-2 max-w-xl font-sans">
          Engineered on 240–280 GSM heavyweight organic cotton. Select a completed archival design, or customize any silhouette in our bespoke embroidery studio.
        </p>
      </div>

      {/* Filter & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider whitespace-nowrap transition-all uppercase ${
                selectedCategory === cat.id
                  ? 'bg-black text-[#CCFF00] shadow-sm'
                  : 'bg-white text-zinc-700 border border-zinc-300 hover:border-black'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort & Search */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tees & blanks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 pl-8 bg-white border border-zinc-300 rounded-xl text-xs text-black font-mono focus:outline-none focus:border-black w-40 sm:w-48 placeholder:text-zinc-400"
            />
            <Search size={14} className="absolute left-2.5 top-3 text-zinc-400" />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs text-black focus:outline-none focus:border-black font-mono font-bold uppercase"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="stitches">Highest Stitches</option>
          </select>
        </div>

      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center space-y-3 bg-white rounded-2xl border-2 border-zinc-200">
            <p className="font-mono text-lg font-bold text-black">NO PRODUCTS MATCH YOUR FILTER</p>
            <p className="text-xs font-mono text-zinc-500">Try resetting your search query or selecting ALL TEES.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-black text-[#CCFF00] text-xs font-mono font-bold uppercase rounded-lg"
            >
              RESET FILTERS
            </button>
          </div>
        ) : (
          filtered.map((product) => {
            const inWish = isInWishlist(product.id);
            const currentSize = selectedSizes[product.id] || 'L';

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border-2 border-zinc-200 hover:border-black overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image */}
                <div className="relative aspect-4/5 bg-zinc-100 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-zinc-300 flex items-center justify-center text-black hover:text-red-500 transition-all shadow-xs"
                    aria-label="Save to wishlist"
                  >
                    <Heart
                      size={16}
                      className={inWish ? 'fill-red-500 text-red-500' : ''}
                    />
                  </button>

                  {/* GSM Tag */}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-black text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xs border border-zinc-200">
                    {product.gsm} GSM
                  </span>

                  {/* Stitch Density Tag */}
                  {product.stitchCount && (
                    <span className="absolute bottom-3 left-3 bg-black/90 backdrop-blur-xs text-[#CCFF00] text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xs border border-zinc-800">
                      {product.stitchCount.toLocaleString()} STITCHES
                    </span>
                  )}
                </div>

                {/* Info */}
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

                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed font-sans">
                      {product.description}
                    </p>
                  </div>

                  {/* Quick Size Selector Pills on Card */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-zinc-400">SIZE:</span>
                      <span className="text-[10px] font-mono font-bold text-black">{currentSize}</span>
                    </div>
                    <div className="flex gap-1">
                      {['S', 'M', 'L', 'XL'].map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: sz }))}
                          className={`flex-1 py-1 text-[10px] font-mono font-bold rounded border ${
                            currentSize === sz
                              ? 'bg-black text-[#CCFF00] border-black'
                              : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-400'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price & Actions */}
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

                    <div className="flex gap-1.5">
                      <Link
                        href={`/shop/${product.slug}`}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-black text-xs font-mono font-bold uppercase"
                      >
                        INSPECT
                      </Link>
                      <button
                        onClick={() => {
                          const variant = product.variants.find(v => v.size === currentSize) || product.variants[0];
                          addToCart(product, variant, 1);
                        }}
                        className="p-1.5 rounded-lg bg-black text-[#CCFF00] hover:bg-zinc-800 transition-colors"
                        title="Add to bag"
                      >
                        <ShoppingBag size={15} />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-mono text-zinc-500">LOADING STREETWEAR COLLECTION...</div>}>
      <ShopContent />
    </Suspense>
  );
}
