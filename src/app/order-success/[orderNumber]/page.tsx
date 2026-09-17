'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  CheckCircle2, 
  Sparkles, 
  Package, 
  Lock, 
  ArrowRight, 
  Printer, 
  ExternalLink,
  Smartphone,
  CreditCard,
  Building2,
  Banknote,
  MapPin,
  Calendar,
  Layers
} from 'lucide-react';
import OrderStitchTracker from '@/components/OrderStitchTracker';
import { Order } from '@/lib/types';
import { INITIAL_ORDERS } from '@/lib/mock-data';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderNumber = params?.orderNumber as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) return;

    // Fetch live order from backend
    fetch(`/api/orders/${orderNumber}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          // Fallback to initial orders or demo fallback
          const localFallback = INITIAL_ORDERS.find((o) => o.orderNumber === orderNumber);
          if (localFallback) {
            setOrder(localFallback as Order);
          } else {
            setOrder({
              id: `ord-${orderNumber}`,
              orderNumber: orderNumber,
              customerName: 'Talha Al-Khatib',
              customerEmail: 'talha@gettoo.atelier',
              customerPhone: '+91 98765 01234',
              subtotal: 1898,
              customizationFee: 399,
              shippingFee: 0,
              discount: 0,
              totalAmount: 1898,
              status: 'DIGITIZING',
              paymentStatus: 'PAID',
              paymentGateway: 'UPI',
              paymentTransactionId: `TXN_UPI_${Date.now().toString().slice(-8)}`,
              payuMode: 'UPI_DYNAMIC_QR',
              stitchProgressPercentage: 30,
              shippingAddress: {
                fullName: 'Talha Al-Khatib',
                phone: '+91 98765 01234',
                email: 'talha@gettoo.atelier',
                street: '42 Rue de l’Atelier, Heavyweight Enclave',
                city: 'Mumbai',
                state: 'Maharashtra',
                postalCode: '400001',
                country: 'India',
              },
              items: [INITIAL_ORDERS[0].items[0]],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        }
      })
      .catch((err) => {
        console.error('Error loading order details:', err);
      })
      .finally(() => setLoading(false));
  }, [orderNumber]);

  const handlePrint = () => {
    window.print();
  };

  if (loading && !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
          Syncing order authorization and embroidery queue...
        </p>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-8">
      
      {/* Confirmation Hero Card */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200 shadow-xl text-center space-y-5 relative overflow-hidden">
        
        <div className="w-16 h-16 rounded-full bg-black text-[#CCFF00] flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 size={36} />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest text-zinc-500 font-bold">
            {order.paymentStatus === 'PAID' ? '⚡ PAYMENT AUTHORIZED & CONFIRMED' : '⏳ ORDER REGISTERED (PAY ON DELIVERY)'}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-[#0A0A0C] tracking-wide uppercase">
            COMMISSION RECEIVED • STITCH DIGITIZING ACTIVE
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-lg mx-auto leading-relaxed font-sans">
            Thank you, <strong className="text-black">{order.customerName}</strong>. Your payment of{' '}
            <strong className="text-black font-mono">₹{order.totalAmount.toLocaleString('en-IN')}</strong> has been confirmed. 
            Our master digitizer is preparing your embroidery machine coordinates.
          </p>
        </div>

        {/* Order Details Chip Strip */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2.5 p-3 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs font-mono">
          <span className="text-zinc-500">ORDER: <strong className="text-black">{order.orderNumber}</strong></span>
          <span className="text-zinc-300">•</span>
          <span className="text-zinc-500">TXN: <strong className="text-black">{order.paymentTransactionId || order.payuTxnId || 'GATEWAY_OK'}</strong></span>
          <span className="text-zinc-300">•</span>
          <span className="text-zinc-500">METHOD: <strong className="text-black">{order.paymentGateway} {order.payuMode ? `(${order.payuMode})` : ''}</strong></span>
          <span className="text-zinc-300">•</span>
          <span className="text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-md">
            {order.paymentStatus === 'PAID' ? '100% PREPAID' : 'COD (PAY ON DELIVERY)'}
          </span>
        </div>

      </div>

      {/* Ordered Items & Specs Breakdown */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2">
            <Package size={15} />
            <span>COMMISSIONED GARMENTS ({order.items.length})</span>
          </h2>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-black transition-colors"
          >
            <Printer size={14} />
            <span>Print Invoice</span>
          </button>
        </div>

        <div className="space-y-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex gap-4 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
              <div className="w-16 h-20 bg-zinc-200 rounded-lg overflow-hidden shrink-0 relative">
                {item.customEmbroidery?.uploadedImageUrl ? (
                  <img
                    src={item.customEmbroidery.uploadedImageUrl}
                    alt="Custom artwork"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80'}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="flex-1 text-xs">
                <div className="flex justify-between font-bold text-black">
                  <span>{item.product.name}</span>
                  <span>₹{item.totalPrice.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center gap-2 text-zinc-500 mt-1">
                  <span>SIZE: <strong className="text-black">{item.variant.size}</strong></span>
                  <span>•</span>
                  <span>COLOR: <strong className="text-black">{item.variant.colorName}</strong></span>
                  <span>•</span>
                  <span>QTY: <strong className="text-black">{item.quantity}</strong></span>
                </div>

                {item.customEmbroidery && (
                  <div className="mt-2 p-2 bg-white rounded border border-zinc-200 text-[10px] space-y-0.5 text-zinc-700">
                    <div className="text-black font-bold flex justify-between">
                      <span>{item.customEmbroidery.type === 'TEXT' ? 'CUSTOM MONOGRAM' : 'BESPOKE ARTWORK'}</span>
                      {item.customEmbroidery.customCharge ? (
                        <span>+₹{item.customEmbroidery.customCharge}</span>
                      ) : null}
                    </div>
                    {item.customEmbroidery.customText && (
                      <div>Text: <strong className="text-black">"{item.customEmbroidery.customText}"</strong> ({item.customEmbroidery.fontStyle})</div>
                    )}
                    <div>Placement: {item.customEmbroidery.placement.replace('_', ' ')} • Thread: {item.customEmbroidery.threadColor}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Shipping Address Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-zinc-100 text-xs text-zinc-600">
          <div>
            <span className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">DELIVERING TO:</span>
            <p className="text-black font-bold">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
            <p className="text-zinc-500 mt-1">Phone: {order.shippingAddress.phone}</p>
          </div>
          <div className="space-y-1 sm:text-right">
            <span className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">ORDER TOTALS:</span>
            <div className="flex justify-between sm:justify-end gap-3">
              <span>Subtotal:</span>
              <span className="text-black font-bold">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between sm:justify-end gap-3 text-emerald-700">
                <span>Discount ({order.discountCode || 'PROMO'}):</span>
                <span>-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between sm:justify-end gap-3">
              <span>Pan-India Shipping:</span>
              <span className="text-black font-bold">{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
            </div>
            <div className="flex justify-between sm:justify-end gap-3 text-sm font-bold text-black pt-1 border-t border-zinc-200">
              <span>Paid:</span>
              <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Live Physical Stitch Radar Tracker */}
      <div>
        <OrderStitchTracker order={order as any} />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 font-mono">
        <Link
          href={`/track?id=${order.orderNumber}`}
          className="w-full sm:w-auto px-6 py-3.5 bg-[#0A0A0C] hover:bg-zinc-800 text-[#CCFF00] text-xs font-bold uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          <span>MONITOR LIVE IN STITCH RADAR</span>
          <ArrowRight size={14} />
        </Link>
        
        <Link
          href="/shop"
          className="w-full sm:w-auto px-6 py-3.5 bg-white border border-zinc-300 hover:border-black text-black text-xs font-bold uppercase rounded-xl transition-all flex items-center justify-center"
        >
          EXPLORE MORE STREETWEAR
        </Link>
      </div>

    </div>
  );
}
