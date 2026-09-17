'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  Lock
} from 'lucide-react';
import { useAtelier } from '@/lib/store';

export default function CartDrawer() {
  const router = useRouter();
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    cartTotal,
    cartCount
  } = useAtelier();


  if (!isCartOpen) return null;

  const freeShippingThreshold = 1999;
  const progressPercent = Math.min(100, (cartTotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div 
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-[#1A1817]/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-zinc-200 animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={20} className="text-[#0A0A0C]" />
                <h3 className="font-mono text-base font-bold uppercase tracking-wider text-[#0A0A0C]">
                  YOUR BAG (DROP 01)
                </h3>
                <span className="text-xs font-mono bg-zinc-100 px-2 py-0.5 rounded-full text-black font-bold">
                  {cartCount} {cartCount === 1 ? 'TEE' : 'TEES'}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-black rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>


            {/* Free Shipping Progress Bar */}
            <div className="bg-[#F4EFE6] px-5 py-3 border-b border-[#E5DCCF]">
              <div className="flex justify-between items-center text-xs font-medium text-[#524B40] mb-1.5">
                <span>
                  {remainingForFreeShipping === 0 ? (
                    <span className="text-[#3F6649] font-semibold flex items-center gap-1">
                      <Sparkles size={13} /> You have unlocked Complimentary Express Shipping!
                    </span>
                  ) : (
                    <>Add <strong className="text-[#1A1817]">₹{remainingForFreeShipping}</strong> more for Free Pan-India Delivery</>
                  )}
                </span>
                <span className="font-mono text-[11px]">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#E2D9CA] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#C5A059] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#EFECE5] border border-[#DDD8CD] flex items-center justify-center text-[#999285]">
                    <ShoppingBag size={28} />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#1A1817]">Your bag is empty</h4>
                    <p className="text-xs text-[#7D766C] mt-1 max-w-xs">
                      Explore our bespoke embroidery studio to craft your personal statement t-shirt.
                    </p>
                  </div>
                  <Link
                    href="/studio"
                    onClick={() => setIsCartOpen(false)}
                    className="px-5 py-2.5 bg-[#1A1817] text-white text-xs font-semibold rounded-lg hover:bg-[#33302C] transition-all flex items-center gap-2"
                  >
                    <Sparkles size={14} className="text-[#C5A059]" />
                    <span>Create Custom Embroidery</span>
                  </Link>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white rounded-xl border border-[#E8E4DC] shadow-xs flex gap-3.5"
                  >
                    {/* Item Image Preview */}
                    <div className="w-20 h-24 bg-[#F5F2EB] rounded-lg overflow-hidden shrink-0 relative border border-[#E5E0D5]">
                      {item.customEmbroidery?.uploadedImageUrl ? (
                        <img 
                          src={item.customEmbroidery.uploadedImageUrl} 
                          alt="Custom Embroidery Artwork"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img 
                          src={item.product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80'} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {item.customEmbroidery && (
                        <span className="absolute bottom-1 right-1 bg-[#1A1817]/85 text-[#FAF8F5] text-[9px] px-1 py-0.5 rounded font-mono">
                          Custom
                        </span>
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-[#1A1817] line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#9E988D] hover:text-red-500 p-0.5 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {/* Variant Info */}
                        <div className="flex items-center gap-2 text-[11px] text-[#7A7367] mt-0.5">
                          <span>Size: <strong className="text-[#1A1817]">{item.variant.size}</strong></span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <span 
                              className="inline-block w-2.5 h-2.5 rounded-full border border-black/20" 
                              style={{ backgroundColor: item.variant.colorHex }}
                            />
                            {item.variant.colorName}
                          </span>
                        </div>

                        {/* Custom Embroidery Specs */}
                        {item.customEmbroidery && (
                          <div className="mt-2 p-1.5 bg-[#FAF8F5] rounded border border-[#EBE6DC] text-[10px] space-y-0.5 text-[#5C5549]">
                            <div className="flex items-center justify-between font-medium">
                              <span className="text-[#8C6D37] flex items-center gap-1">
                                <Sparkles size={10} />
                                {item.customEmbroidery.type === 'TEXT' ? 'Monogram Embroidery' : 'Bespoke Artwork'}
                              </span>
                              <span className="font-mono">+{item.customEmbroidery.customCharge ? `₹${item.customEmbroidery.customCharge}` : 'Included'}</span>
                            </div>
                            
                            {item.customEmbroidery.customText && (
                              <p className="truncate">
                                Text: <strong className="text-[#1A1817]">"{item.customEmbroidery.customText}"</strong> ({item.customEmbroidery.fontStyle})
                              </p>
                            )}

                            <div className="flex items-center gap-2 text-[9px] text-[#787165]">
                              <span>Placement: {item.customEmbroidery.placement.replace('_', ' ')}</span>
                              {item.customEmbroidery.threadColor && (
                                <>
                                  <span>•</span>
                                  <span>Thread: {item.customEmbroidery.threadColor}</span>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#F2ECE1]">
                        <div className="flex items-center border border-[#DCD6C9] rounded-md bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-[#F7F4EE] text-[#555] transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2.5 text-xs font-mono font-semibold text-[#1A1817]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-[#F7F4EE] text-[#555] transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="font-serif text-sm font-bold text-[#1A1817]">
                            ₹{item.totalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout Action */}
            {cart.length > 0 && (
              <div className="p-5 bg-white border-t border-[#E8E4DC] space-y-3">
                <div className="space-y-1.5 text-xs text-[#6B6458]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#1A1817] font-medium">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pan-India Delivery</span>
                    <span className="text-[#3F6649] font-medium">
                      {remainingForFreeShipping === 0 ? 'FREE' : '₹99'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#1A1817] pt-2 border-t border-[#F2ECE1]">
                    <span>Total Amount</span>
                    <span className="font-serif text-base text-[#1A1817]">
                      ₹{(cartTotal + (remainingForFreeShipping === 0 ? 0 : 99)).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      router.push('/checkout');
                    }}
                    className="w-full py-3.5 px-4 bg-[#0A0A0C] hover:bg-zinc-800 text-[#CCFF00] rounded-xl font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <Lock size={14} className="text-[#CCFF00]" />
                    <span>PAY VIA PAYU • SECURE CHECKOUT</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-500 pt-1">
                  <ShieldCheck size={12} className="text-black" />
                  <span>256-BIT ENCRYPTED • PAYU GATEWAY • PREPAID ONLY</span>
                </div>
              </div>

            )}

          </div>
        </div>
      </div>

    </>
  );
}
