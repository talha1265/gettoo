'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  CheckCircle2, 
  Sparkles, 
  Package, 
  Lock, 
  ArrowRight, 
  Printer, 
  ExternalLink 
} from 'lucide-react';
import { INITIAL_ORDERS } from '@/lib/mock-data';
import OrderStitchTracker from '@/components/OrderStitchTracker';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderNumber = params?.orderNumber as string;

  // Locate the order from mock data or recent state
  const order = INITIAL_ORDERS.find((o) => o.orderNumber === orderNumber) || {
    id: 'ord-new',
    orderNumber: orderNumber || 'GET-2026-9820',
    customerName: 'Talha Al-Khatib',
    customerEmail: 'talha@gettoo.atelier',
    customerPhone: '+91 98765 01234',
    subtotal: 1898,
    customizationFee: 399,
    shippingFee: 0,
    discount: 0,
    totalAmount: 1898,
    status: 'DIGITIZING' as const,
    paymentStatus: 'PAID' as const,
    paymentGateway: 'PAYU' as const,
    payuTxnId: `TXN_PAYU_${Date.now().toString().slice(-8)}`,
    payuMihpayId: `MIH_${Date.now().toString().slice(-8)}`,
    payuMode: 'UPI',
    stitchProgressPercentage: 35,
    shippingAddress: {
      fullName: 'Talha Al-Khatib',
      phone: '+91 98765 01234',
      email: 'talha@gettoo.atelier',
      street: '42 Rue de l’Atelier, Heritage Enclave',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
    },
    items: [INITIAL_ORDERS[0].items[0]],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Confirmation Hero Card */}
      <div className="bg-white p-8 rounded-3xl border border-[#E8E4DC] shadow-lg text-center space-y-4">
        
        <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 size={32} />
        </div>

        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-[#C5A059]">
            Payment Authorized via PayU
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1817] mt-1">
            Thank You for Your Bespoke Commission
          </h1>
          <p className="text-xs sm:text-sm text-[#7D766C] mt-2 max-w-lg mx-auto leading-relaxed">
            Your payment of <strong className="text-[#1A1817]">₹{order.totalAmount.toLocaleString('en-IN')}</strong> has been confirmed. 
            Our master digitizer is preparing your embroidery machine coordinates.
          </p>
        </div>

        {/* Order & PayU Verification Bar */}
        <div className="inline-flex flex-wrap items-center justify-center gap-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#E3DCCF] text-xs font-mono">
          <span className="text-[#666]">Order: <strong className="text-[#1A1817]">{order.orderNumber}</strong></span>
          <span className="text-[#BBB]">•</span>
          <span className="text-[#666]">PayU Txn: <strong className="text-[#1A1817]">{order.payuTxnId}</strong></span>
          <span className="text-[#BBB]">•</span>
          <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
            Prepaid (100% PAID)
          </span>
        </div>

      </div>

      {/* Live Physical Stitch Radar Tracker */}
      <div>
        <OrderStitchTracker order={order as any} />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/profile"
          className="w-full sm:w-auto px-6 py-3 bg-[#1A1817] text-white text-xs font-semibold rounded-xl hover:bg-[#333] transition-all flex items-center justify-center gap-2"
        >
          <span>View in My Profile & Orders</span>
          <ArrowRight size={14} />
        </Link>
        
        <Link
          href="/shop"
          className="w-full sm:w-auto px-6 py-3 bg-white border border-[#DDD7CB] text-[#1A1817] text-xs font-semibold rounded-xl hover:bg-[#FAF8F5] transition-all flex items-center justify-center"
        >
          Continue Shopping Collection
        </Link>
      </div>

    </div>
  );
}
