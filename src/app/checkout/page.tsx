'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Loader2,
  ShoppingBag,
  Sparkles,
  Tag,
  Truck,
  ExternalLink,
} from 'lucide-react';
import { useAtelier } from '@/lib/store';
import { ShippingAddress } from '@/lib/types';

export default function CheckoutPage() {
  const { cart, cartTotal, user, showToast } = useAtelier();

  // Address State
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');

  // PayU redirect state
  const [payuRedirectPayload, setPayuRedirectPayload] = useState<any>(null);
  const payuFormRef = useRef<HTMLFormElement>(null);

  // Processing
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculation Logic
  const freeShippingThreshold = 1999;
  const rawShipping = cartTotal >= freeShippingThreshold ? 0 : 99;

  let discount = 0;
  if (appliedCoupon === 'DROP01' || appliedCoupon === 'GETTOO10') {
    discount = Math.round(cartTotal * 0.1);
  } else if (appliedCoupon === 'STREET20') {
    discount = Math.round(cartTotal * 0.2);
  }

  const shippingFee = appliedCoupon === 'FREESHIP' ? 0 : rawShipping;
  const grandTotal = Math.max(0, cartTotal + shippingFee - discount);

  // Auto-submit PayU form when payload is ready
  useEffect(() => {
    if (payuRedirectPayload && payuFormRef.current) {
      const timer = setTimeout(() => {
        payuFormRef.current?.submit();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [payuRedirectPayload]);

  // Apply Coupon Code
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (['DROP01', 'GETTOO10', 'STREET20', 'FREESHIP'].includes(code)) {
      setAppliedCoupon(code);
      setCouponError('');
      showToast(`Coupon "${code}" applied successfully!`, 'success');
    } else {
      setCouponError('Invalid coupon code. Try DROP01 or GETTOO10');
      showToast('Invalid coupon code', 'error');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  // PayU Checkout Handler
  const handlePayUCheckout = async () => {
    if (cart.length === 0) {
      showToast('Your bag is empty', 'error');
      return;
    }

    if (!address.fullName || !address.email || !address.phone || !address.street || !address.postalCode) {
      showToast('Please fill all mandatory shipping address fields', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch('/api/payu/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: grandTotal,
          customerName: address.fullName,
          customerEmail: address.email,
          customerPhone: address.phone,
          shippingAddress: address,
          items: cart,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        showToast(data.message || 'Failed to initiate payment. Please try again.', 'error');
        setIsProcessing(false);
        return;
      }

      // Set payload — useEffect will auto-submit the hidden form to PayU
      setPayuRedirectPayload(data.payload);
    } catch (error) {
      console.error('Checkout error:', error);
      showToast('Error connecting to payment gateway. Please retry.', 'error');
      setIsProcessing(false);
    }
  };

  // Empty Cart State
  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-400 border border-zinc-200">
          <ShoppingBag size={36} />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold uppercase text-black">YOUR BAG IS CURRENTLY EMPTY</h1>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto font-mono">
            Load custom embroidery tees or heavyweight blanks into your bag to initialize the checkout terminal.
          </p>
        </div>
        <div className="flex justify-center gap-4 pt-2">
          <Link
            href="/studio"
            className="px-6 py-3 bg-[#0A0A0C] hover:bg-zinc-800 text-[#CCFF00] font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            <Sparkles size={14} />
            <span>CUSTOM STUDIO LAB</span>
          </Link>
          <Link
            href="/shop"
            className="px-6 py-3 bg-white border border-zinc-300 hover:border-black text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            DROP 01 TEES
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">

      {/* Checkout Terminal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-black text-[#CCFF00] text-[10px] font-mono font-bold uppercase tracking-widest">
              SECURE CHECKOUT
            </span>
            <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">
              // PREPAID VIA PAYU
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-[#0A0A0C] tracking-wide uppercase">
            COMMISSION ORDER & PAYMENT
          </h1>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-zinc-600 bg-zinc-50 px-3.5 py-2 rounded-xl border border-zinc-200">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span>PAYU ENCRYPTED GATEWAY • 256-BIT SSL</span>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT: Shipping Details */}
        <div className="lg:col-span-7 space-y-6">

          {/* SHIPPING & CONTACT INFORMATION */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-black text-[#CCFF00] font-mono font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-black">
                  SHIPPING & RECIPIENT INFORMATION
                </h2>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">EXPRESS PAN-INDIA</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-600 font-bold uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  placeholder="Your full name"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-black font-sans text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-zinc-600 font-bold uppercase mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  placeholder="+91 98765 01234"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-black font-sans text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-600 font-bold uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-black font-sans text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-600 font-bold uppercase mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="Flat/House No., Street, Society"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-black font-sans text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-zinc-600 font-bold uppercase mb-1">Landmark (Optional)</label>
                <input
                  type="text"
                  value={address.landmark || ''}
                  onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                  placeholder="Near Silk Mills"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-black font-sans text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-zinc-600 font-bold uppercase mb-1">PIN / Postal Code *</label>
                <input
                  type="text"
                  required
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  placeholder="400001"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-black font-sans text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-zinc-600 font-bold uppercase mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="Mumbai"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-black font-sans text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-zinc-600 font-bold uppercase mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  placeholder="Maharashtra"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-black font-sans text-xs focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* PAYMENT METHOD — PayU Only */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-black text-[#CCFF00] font-mono font-bold text-xs flex items-center justify-center">
                  2
                </div>
                <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-black">
                  PAYMENT VIA PAYU
                </h2>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                PREPAID ONLY
              </span>
            </div>

            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
              <div className="flex items-center gap-2">
                <Lock size={15} className="text-black" />
                <span className="font-mono text-xs font-bold text-black uppercase">
                  PayU Secure Hosted Checkout
                </span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                You will be securely redirected to PayU&apos;s official payment page where you can pay using <strong>UPI, Credit/Debit Cards, Net Banking,</strong> or <strong>Wallets</strong>. All payment methods are handled by PayU with bank-grade encryption.
              </p>
              <div className="flex items-center gap-4 pt-1 text-[10px] font-mono text-zinc-400">
                <span className="flex items-center gap-1"><ShieldCheck size={11} className="text-emerald-600" /> PCI-DSS Certified</span>
                <span className="flex items-center gap-1"><Lock size={11} className="text-emerald-600" /> SHA-512 Signed</span>
              </div>
            </div>

            {/* PayU Redirect State */}
            {payuRedirectPayload && (
              <div className="p-5 bg-white rounded-xl border-2 border-black space-y-4 text-center animate-in fade-in duration-200">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span className="font-mono text-sm font-bold text-black uppercase">Redirecting to PayU...</span>
                </div>
                <p className="text-[11px] text-zinc-500 font-mono">
                  Please do not close this window. You will be redirected to PayU&apos;s secure checkout.
                </p>
                <div className="p-3 bg-zinc-50 rounded-lg font-mono text-[11px] text-zinc-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="font-bold text-black truncate max-w-[200px]">{payuRedirectPayload.txnid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-bold text-black">₹{payuRedirectPayload.amount}</span>
                  </div>
                </div>
                <form
                  ref={payuFormRef}
                  action={payuRedirectPayload.actionUrl || 'https://test.payu.in/_payment'}
                  method="POST"
                >
                  <input type="hidden" name="key" value={payuRedirectPayload.key || ''} />
                  <input type="hidden" name="txnid" value={payuRedirectPayload.txnid || ''} />
                  <input type="hidden" name="amount" value={payuRedirectPayload.amount || ''} />
                  <input type="hidden" name="productinfo" value={payuRedirectPayload.productinfo || ''} />
                  <input type="hidden" name="firstname" value={payuRedirectPayload.firstname || ''} />
                  <input type="hidden" name="email" value={payuRedirectPayload.email || ''} />
                  <input type="hidden" name="phone" value={payuRedirectPayload.phone || ''} />
                  <input type="hidden" name="surl" value={payuRedirectPayload.surl || ''} />
                  <input type="hidden" name="furl" value={payuRedirectPayload.furl || ''} />
                  <input type="hidden" name="hash" value={payuRedirectPayload.hash || ''} />
                  <input type="hidden" name="service_provider" value="payu_paisa" />
                  <button
                    type="submit"
                    className="text-[11px] font-mono text-zinc-500 hover:text-black underline flex items-center justify-center gap-1 mx-auto"
                  >
                    <ExternalLink size={11} />
                    <span>Click here if not redirected automatically</span>
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* PAY BUTTON */}
          {!payuRedirectPayload && (
            <div className="pt-1">
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePayUCheckout}
                className="w-full py-4 bg-[#0A0A0C] hover:bg-zinc-800 text-[#CCFF00] rounded-xl font-mono font-bold text-sm tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-75 cursor-pointer"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Connecting to PayU Gateway...</span>
                  </div>
                ) : (
                  <>
                    <Lock size={16} className="text-[#CCFF00]" />
                    <span>PAY ₹{grandTotal.toLocaleString('en-IN')} VIA PAYU</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 text-[11px] font-mono text-zinc-500 pt-3">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>SECURE PREPAID CHECKOUT • PCI-DSS CERTIFIED • MONEY BACK GUARANTEE</span>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-6 sticky top-28">

            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 font-mono">
              <h3 className="text-sm font-bold uppercase tracking-wider text-black">
                ORDER SUMMARY ({cart.length} {cart.length === 1 ? 'TEE' : 'TEES'})
              </h3>
              <Link href="/shop" className="text-[11px] text-zinc-400 hover:text-black">
                Edit Bag
              </Link>
            </div>

            {/* Cart Items */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3.5 pb-3 border-b border-zinc-100">
                  <div className="w-16 h-20 bg-zinc-100 rounded-lg overflow-hidden shrink-0 relative border border-zinc-200">
                    {item.customEmbroidery?.uploadedImageUrl ? (
                      <img
                        src={item.customEmbroidery.uploadedImageUrl}
                        alt="Artwork"
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
                      <span className="absolute bottom-0.5 right-0.5 bg-black text-[#CCFF00] text-[8px] font-mono px-1 rounded font-bold">
                        EMB
                      </span>
                    )}
                  </div>

                  <div className="flex-1 text-xs">
                    <div className="flex justify-between font-bold text-black font-mono">
                      <span className="line-clamp-1">{item.product.name}</span>
                      <span>₹{item.totalPrice.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 mt-0.5">
                      <span>SIZE: <strong className="text-black">{item.variant.size}</strong></span>
                      <span>•</span>
                      <span>QTY: <strong className="text-black">{item.quantity}</strong></span>
                    </div>

                    {item.customEmbroidery && (
                      <div className="mt-1.5 p-1.5 bg-zinc-50 rounded border border-zinc-200 text-[10px] font-mono text-zinc-700 space-y-0.5">
                        <div className="flex justify-between text-black font-bold">
                          <span>{item.customEmbroidery.type === 'TEXT' ? 'MONOGRAM STITCH' : 'CUSTOM ARTWORK'}</span>
                          {item.customEmbroidery.customCharge ? (
                            <span>+₹{item.customEmbroidery.customCharge}</span>
                          ) : null}
                        </div>
                        {item.customEmbroidery.customText && (
                          <div className="text-zinc-600 truncate">
                            Text: &quot;{item.customEmbroidery.customText}&quot; ({item.customEmbroidery.threadColor})
                          </div>
                        )}
                        <div className="text-zinc-500">
                          Zone: {item.customEmbroidery.placement.replace('_', ' ')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code */}
            <div className="space-y-2 pt-1 font-mono">
              <span className="block text-[11px] font-bold text-zinc-600 uppercase">
                DISCOUNT COUPON:
              </span>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-zinc-100 rounded-xl border border-zinc-300 text-xs">
                  <div className="flex items-center gap-2 text-black font-bold">
                    <Tag size={14} className="text-[#0A0A0C]" />
                    <span>{appliedCoupon}</span>
                    <span className="text-[10px] bg-black text-[#CCFF00] px-1.5 py-0.5 rounded">
                      {appliedCoupon === 'DROP01' || appliedCoupon === 'GETTOO10' ? '10% OFF' : appliedCoupon === 'STREET20' ? '20% OFF' : 'FREE SHIPPING'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs text-red-600 hover:underline font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. DROP01 or GETTOO10"
                    className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-xs font-mono uppercase focus:outline-none focus:border-black"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-black text-[#CCFF00] font-mono text-xs font-bold uppercase rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    APPLY
                  </button>
                </form>
              )}

              {couponError && (
                <p className="text-[10px] text-red-500 font-mono">{couponError}</p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs font-mono text-zinc-600 border-t border-zinc-100 pt-3">
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <span className="text-black font-bold">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>DISCOUNT ({appliedCoupon})</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>PAN-INDIA EXPRESS SHIPPING</span>
                <span className={shippingFee === 0 ? 'text-emerald-700 font-bold' : 'text-black'}>
                  {shippingFee === 0 ? 'COMPLIMENTARY' : `₹${shippingFee}`}
                </span>
              </div>

              <div className="flex justify-between text-sm font-bold text-black border-t border-zinc-200 pt-3">
                <span className="font-mono">GRAND TOTAL</span>
                <span className="font-mono text-base">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment Method Badge */}
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-zinc-600">
                <Lock size={14} className="text-black" />
                <span>PAYMENT VIA</span>
              </div>
              <span className="font-bold text-black bg-white px-2.5 py-1 rounded-lg border border-zinc-200">
                PayU Gateway
              </span>
            </div>

            {/* Delivery Timeline */}
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs font-mono text-zinc-600 space-y-1">
              <div className="flex items-center gap-1.5 text-black font-bold">
                <Truck size={14} className="text-black" />
                <span>EXPRESS DISPATCH TIMELINE</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-normal">
                Bespoke needle digitizing starts within 6 hours. Pan-India air courier arrives in 3-5 business days with live radar tracking.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
