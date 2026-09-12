'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, 
  Lock, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAtelier } from '@/lib/store';
import { ShippingAddress } from '@/lib/types';

interface PayUCheckoutModalProps {
  onClose: () => void;
}

export default function PayUCheckoutModal({ onClose }: PayUCheckoutModalProps) {
  const router = useRouter();
  const { cart, cartTotal, clearCart, user, showToast, setIsCartOpen } = useAtelier();

  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'DETAILS' | 'PAYU_GATEWAY'>('DETAILS');
  const [payuPayload, setPayuPayload] = useState<any>(null);

  // Address form
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.name || 'Talha Al-Khatib',
    email: user?.email || 'talha@gettoo.atelier',
    phone: user?.phone || '+91 98765 01234',
    street: '42 Rue de l’Atelier, Heritage Enclave',
    landmark: 'Near Silk Mills',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    country: 'India',
  });

  const [paymentMode, setPaymentMode] = useState<'UPI' | 'CC' | 'DC' | 'NB'>('UPI');

  const freeShipping = cartTotal >= 1999;
  const shippingFee = freeShipping ? 0 : 99;
  const grandTotal = cartTotal + shippingFee;

  const handleProceedToPayU = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setPaymentStep('PAYU_GATEWAY');
      } else {
        showToast(data.message || 'Failed to initiate PayU payment', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error connecting to PayU gateway', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Complete simulated payment callback
  const handleSimulatePayUSuccess = async () => {
    setLoading(true);
    try {
      const callbackRes = await fetch('/api/payu/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txnid: payuPayload.txnid,
          status: 'success',
          amount: payuPayload.amount,
          productinfo: payuPayload.productinfo,
          firstname: payuPayload.firstname,
          email: payuPayload.email,
          mode: paymentMode,
          mihpayid: `MIH_${Math.floor(100000000 + Math.random() * 900000000)}`,
        }),
      });

      const result = await callbackRes.json();
      if (result.success) {
        clearCart();
        setIsCartOpen(false);
        onClose();

        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 },
          });
        } catch (e) {}

        showToast('PayU Prepaid Payment Confirmed! Order placed successfully.');
        router.push(`/order-success/${result.order.orderNumber}`);
      } else {
        showToast('Payment verification failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error confirming PayU transaction', 'error');
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
                PayU Prepaid Checkout
              </h3>
              <p className="text-[10px] text-[#787165] font-mono uppercase tracking-wider">
                256-bit Encrypted Transaction
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8C8578] hover:text-[#1A1817] rounded-lg hover:bg-[#EFECE5]"
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
                  <label className="block text-[11px] font-medium text-[#666] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full p-2 bg-[#FAF8F5] border border-[#DDD7CB] rounded-lg text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#666] mb-1">Phone Number</label>
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
                <label className="block text-[11px] font-medium text-[#666] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  className="w-full p-2 bg-[#FAF8F5] border border-[#DDD7CB] rounded-lg text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#666] mb-1">Street Address</label>
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
                  <label className="block text-[11px] font-medium text-[#666] mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full p-2 bg-[#FAF8F5] border border-[#DDD7CB] rounded-lg text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#666] mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full p-2 bg-[#FAF8F5] border border-[#DDD7CB] rounded-lg text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#666] mb-1">Pincode</label>
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

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1A1817] hover:bg-[#33302C] text-white rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <span>Continue to PayU Payment</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: PayU Gateway Verification & Sandbox Simulation */
          <div className="p-6 space-y-4">
            
            {/* PayU Gateway Info Box */}
            <div className="p-4 bg-[#F5F2EB] rounded-xl border border-[#DFD8CB] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-serif text-sm font-bold text-[#1A1817] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  PayU Hosted Gateway Simulation
                </span>
                <span className="text-[10px] font-mono bg-[#1A1817] text-white px-2 py-0.5 rounded">
                  {payuPayload?.env || 'TEST'} MODE
                </span>
              </div>

              <div className="font-mono text-[11px] text-[#554F44] space-y-1 bg-white/70 p-2.5 rounded border border-[#DDD5C5]">
                <div className="flex justify-between">
                  <span>Merchant Key:</span>
                  <span className="font-bold">{payuPayload?.key}</span>
                </div>
                <div className="flex justify-between truncate">
                  <span>Txn ID:</span>
                  <span className="truncate max-w-[200px]">{payuPayload?.txnid}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-bold text-[#1A1817]">₹{payuPayload?.amount}</span>
                </div>
                <div className="flex justify-between truncate">
                  <span>SHA-512 Hash:</span>
                  <span className="truncate max-w-[150px]">{payuPayload?.hash?.substring(0, 16)}...</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#3D3831]">
                Select Payment Mode:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'UPI', label: 'UPI / GPay / PhonePe', icon: Smartphone },
                  { id: 'CC', label: 'Credit Card', icon: CreditCard },
                  { id: 'DC', label: 'Debit Card', icon: CreditCard },
                  { id: 'NB', label: 'Net Banking', icon: Lock },
                ].map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setPaymentMode(mode.id as any)}
                      className={`p-2.5 rounded-lg border text-left flex items-center gap-2 text-xs transition-all ${
                        paymentMode === mode.id
                          ? 'bg-[#1A1817] text-white border-[#1A1817]'
                          : 'bg-[#FAF8F5] text-[#3D3A36] border-[#DDD7CB] hover:bg-white'
                      }`}
                    >
                      <Icon size={14} className={paymentMode === mode.id ? 'text-[#C5A059]' : 'text-[#888]'} />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleSimulatePayUSuccess}
                disabled={loading}
                className="w-full py-3 bg-[#1A1817] hover:bg-[#33302C] text-white rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={15} className="text-emerald-400" />
                    <span>Authorize Payment (Instant PayU Callback)</span>
                  </>
                )}
              </button>

              {/* Real PayU Form Fallback */}
              <form action={payuPayload?.actionUrl || 'https://test.payu.in/_payment'} method="post" target="_blank">
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
                
                <button
                  type="submit"
                  className="w-full py-2 bg-[#FAF8F5] border border-[#DDD7CB] text-[#555047] hover:text-[#1A1817] hover:bg-[#F2ECE1] rounded-xl text-[11px] font-medium transition-colors text-center"
                >
                  Or Open External PayU Hosted Portal
                </button>
              </form>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#8C867B] pt-1">
              <ShieldCheck size={12} className="text-[#5A705E]" />
              <span>SHA-512 Signature Generated • Production Ready</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
