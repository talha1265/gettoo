'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Lock,
  ShieldCheck,
  Loader2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useAtelier } from '@/lib/store';
import { ShippingAddress } from '@/lib/types';

interface PayUCheckoutModalProps {
  onClose: () => void;
}

export default function PayUCheckoutModal({ onClose }: PayUCheckoutModalProps) {
  const { cart, cartTotal, user, showToast } = useAtelier();

  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'DETAILS' | 'REDIRECTING'>('DETAILS');
  const [payuPayload, setPayuPayload] = useState<any>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Address form
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

  const freeShipping = cartTotal >= 1999;
  const shippingFee = freeShipping ? 0 : 99;
  const grandTotal = cartTotal + shippingFee;

  // Auto-submit the hidden form to PayU when payload is ready
  useEffect(() => {
    if (paymentStep === 'REDIRECTING' && payuPayload && formRef.current) {
      // Small delay to let the user see the "Redirecting" state
      const timer = setTimeout(() => {
        formRef.current?.submit();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [paymentStep, payuPayload]);

  const handleProceedToPayU = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Your bag is empty', 'error');
      return;
    }

    if (!address.fullName || !address.email || !address.phone || !address.street || !address.postalCode) {
      showToast('Please fill all required shipping fields', 'error');
      return;
    }

    setLoading(true);

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
      if (data.success) {
        setPayuPayload(data.payload);
        setPaymentStep('REDIRECTING');
      } else {
        showToast(data.message || 'Failed to initiate PayU payment', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error connecting to payment gateway', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1817]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white max-w-lg w-full rounded-2xl shadow-2xl border border-[#E8E4DC] overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="p-5 border-b border-[#E8E4DC] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1A1817] text-[#C5A059] flex items-center justify-center">
              <Lock size={15} />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#1A1817]">
                PayU Secure Checkout
              </h3>
              <p className="text-[10px] text-[#787165] font-mono uppercase tracking-wider">
                256-bit Encrypted Transaction
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={paymentStep === 'REDIRECTING'}
            className="p-1.5 text-[#8C8578] hover:text-[#1A1817] rounded-lg hover:bg-[#EFECE5] disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {paymentStep === 'DETAILS' ? (
          /* Step 1: Delivery Details */
          <form onSubmit={handleProceedToPayU} className="p-6 space-y-4">

            {/* Amount Banner */}
            <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8E4DC] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#7A7367]">Total Payable Amount</span>
                <p className="font-serif text-xl font-bold text-[#1A1817]">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </p>
              </div>
              <span className="text-[11px] font-mono px-2 py-1 bg-emerald-100 text-emerald-800 rounded font-semibold">
                Prepaid Only
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#474138]">
                Shipping & Customer Details
              </h4>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-[#666] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full p-2 bg-[#FAF8F5] border border-[#DDD7CB] rounded-lg text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#666] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full p-2 bg-[#FAF8F5] border border-[#DDD7CB] rounded-lg text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#666] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  className="w-full p-2 bg-[#FAF8F5] border border-[#DDD7CB] rounded-lg text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#666] mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full p-2 bg-[#FAF8F5] border border-[#DDD7CB] rounded-lg text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-[#666] mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full p-2 bg-[#FAF8F5] border border-[#DDD7CB] rounded-lg text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#666] mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full p-2 bg-[#FAF8F5] border border-[#DDD7CB] rounded-lg text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#666] mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full p-2 bg-[#FAF8F5] border border-[#DDD7CB] rounded-lg text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1A1817] hover:bg-[#33302C] text-white rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Lock size={14} />
                    <span>Pay ₹{grandTotal.toLocaleString('en-IN')} via PayU</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

              <p className="flex items-center justify-center gap-1.5 text-[10px] text-[#8C867B] pt-1">
                <ShieldCheck size={12} className="text-[#5A705E]" />
                <span>You will be redirected to PayU's secure hosted checkout page</span>
              </p>
            </div>
          </form>
        ) : (
          /* Step 2: Redirecting to PayU */
          <div className="p-8 space-y-6 text-center">

            {/* Animated redirecting state */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border-2 border-[#E8E4DC] flex items-center justify-center">
                  <Loader2 size={28} className="text-[#C5A059] animate-spin" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Lock size={10} className="text-white" />
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-serif text-lg font-bold text-[#1A1817]">
                  Redirecting to PayU...
                </h3>
                <p className="text-xs text-[#7A7367] max-w-xs mx-auto">
                  You are being securely redirected to PayU's hosted checkout page.
                  Please do not close this window.
                </p>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8E4DC] font-mono text-[11px] text-[#554F44] space-y-1.5">
              <div className="flex justify-between">
                <span>Transaction ID:</span>
                <span className="font-bold text-[#1A1817] truncate max-w-[200px]">{payuPayload?.txnid}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-bold text-[#1A1817]">₹{payuPayload?.amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Mode:</span>
                <span className="font-bold text-[#1A1817] uppercase">{payuPayload?.env || 'TEST'}</span>
              </div>
            </div>

            {/* Hidden form that auto-submits to PayU */}
            <form
              ref={formRef}
              action={payuPayload?.actionUrl || 'https://test.payu.in/_payment'}
              method="POST"
            >
              <input type="hidden" name="key" value={payuPayload?.key || ''} />
              <input type="hidden" name="txnid" value={payuPayload?.txnid || ''} />
              <input type="hidden" name="amount" value={payuPayload?.amount || ''} />
              <input type="hidden" name="productinfo" value={payuPayload?.productinfo || ''} />
              <input type="hidden" name="firstname" value={payuPayload?.firstname || ''} />
              <input type="hidden" name="email" value={payuPayload?.email || ''} />
              <input type="hidden" name="phone" value={payuPayload?.phone || ''} />
              <input type="hidden" name="surl" value={payuPayload?.surl || ''} />
              <input type="hidden" name="furl" value={payuPayload?.furl || ''} />
              <input type="hidden" name="hash" value={payuPayload?.hash || ''} />
              <input type="hidden" name="service_provider" value="payu_paisa" />

              {/* Manual fallback button in case auto-submit fails */}
              <button
                type="submit"
                className="w-full py-2.5 bg-white border border-[#DDD7CB] hover:bg-[#FAF8F5] text-[#1A1817] rounded-xl text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <ExternalLink size={12} />
                <span>Click here if not redirected automatically</span>
              </button>
            </form>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#8C867B]">
              <ShieldCheck size={12} className="text-[#5A705E]" />
              <span>SHA-512 Signature Verified • Secure Connection</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
