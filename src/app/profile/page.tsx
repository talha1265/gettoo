'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  Package, 
  MapPin, 
  Sparkles, 
  Settings, 
  ShieldCheck, 
  ExternalLink,
  Clock,
  CheckCircle2,
  Lock,
  Truck
} from 'lucide-react';
import { useAtelier } from '@/lib/store';
import { INITIAL_ORDERS } from '@/lib/mock-data';
import OrderStitchTracker from '@/components/OrderStitchTracker';

export default function ProfilePage() {
  const { user, loginDemoUser } = useAtelier();
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'ADDRESSES' | 'DESIGNS'>('ORDERS');
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<any>(INITIAL_ORDERS[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profile Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E4DC] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border-2 border-[#C5A059] flex items-center justify-center text-[#8C6D37] text-2xl font-serif font-bold">
            {user ? user.name.charAt(0).toUpperCase() : 'T'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1817]">
                {user?.name || 'Talha Al-Khatib'}
              </h1>
              <span className="px-2 py-0.5 bg-[#FAF8F5] border border-[#DDD7CB] text-[#6E675B] text-[10px] font-mono rounded">
                {user?.role || 'CUSTOMER'}
              </span>
            </div>
            <p className="text-xs text-[#7A7367] mt-0.5">{user?.email || 'talha@gettoo.atelier'}</p>
            <p className="text-[11px] text-[#8C867B] font-mono mt-1">
              Member of the Bespoke Embroidery Circle since 2026
            </p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-2.5">
          <Link
            href="/studio"
            className="px-4 py-2 bg-[#1A1817] text-white text-xs font-semibold rounded-xl hover:bg-[#33302C] transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles size={14} className="text-[#C5A059]" />
            <span>New Custom Design</span>
          </Link>

          {user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="px-4 py-2 bg-[#FAF8F5] border border-[#DDD7CB] text-[#1A1817] text-xs font-semibold rounded-xl hover:bg-[#F2ECE1] transition-all flex items-center gap-1.5"
            >
              <ShieldCheck size={14} className="text-[#5A705E]" />
              <span>Admin Studio</span>
            </Link>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#E8E4DC] gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`pb-3 flex items-center gap-2 transition-all ${
            activeTab === 'ORDERS'
              ? 'text-[#1A1817] font-bold border-b-2 border-[#1A1817]'
              : 'text-[#8C8578] hover:text-[#1A1817]'
          }`}
        >
          <Package size={15} />
          <span>My Orders & Live Stitch Progress</span>
        </button>

        <button
          onClick={() => setActiveTab('ADDRESSES')}
          className={`pb-3 flex items-center gap-2 transition-all ${
            activeTab === 'ADDRESSES'
              ? 'text-[#1A1817] font-bold border-b-2 border-[#1A1817]'
              : 'text-[#8C8578] hover:text-[#1A1817]'
          }`}
        >
          <MapPin size={15} />
          <span>Saved Addresses</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-8">
          
          {/* Active Stitch Tracker Highlight */}
          {selectedOrderForTracking && (
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-[#8C6D37] block mb-2">
                Active In-Production Order
              </span>
              <OrderStitchTracker order={selectedOrderForTracking} />
            </div>
          )}

          {/* Orders History List */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-bold text-[#1A1817]">
              All Orders ({INITIAL_ORDERS.length})
            </h3>

            <div className="space-y-4">
              {INITIAL_ORDERS.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0ECE1] gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-[#1A1817]">
                          {ord.orderNumber}
                        </span>
                        <span className="text-xs text-[#7A7367]">
                          • Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-[#8C867B] mt-0.5">
                        <span>PayU Txn: {ord.payuTxnId}</span>
                        <span>•</span>
                        <span>Payment: {ord.paymentStatus} ({ord.payuMode})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                        ord.status === 'STITCHING' 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-blue-100 text-blue-900 border border-blue-300'
                      }`}>
                        Stage: {ord.status.replace('_', ' ')}
                      </span>

                      <button
                        onClick={() => setSelectedOrderForTracking(ord)}
                        className="px-3 py-1 bg-[#1A1817] text-white rounded-lg text-xs font-medium hover:bg-[#333]"
                      >
                        Inspect Stitch Tracker
                      </button>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {ord.items.map((it) => (
                      <div key={it.id} className="flex gap-3.5 items-center">
                        <div className="w-14 h-16 bg-[#F5F2EB] rounded-lg overflow-hidden shrink-0 border border-[#DDD7CB]">
                          <img 
                            src={it.customEmbroidery?.uploadedImageUrl || it.product.images[0]} 
                            alt={it.product.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 text-xs">
                          <h4 className="font-bold text-[#1A1817]">{it.product.name}</h4>
                          <p className="text-[11px] text-[#7A7367]">
                            Size: {it.variant?.size || 'M'} • {it.variant?.colorName || 'Bone White'} • Qty: {it.quantity}
                          </p>
                          {it.customEmbroidery && (
                            <div className="mt-1 text-[10px] text-[#8C6D37] font-mono">
                              Custom: {it.customEmbroidery.customText ? `"${it.customEmbroidery.customText}" (${it.customEmbroidery.fontStyle})` : 'Bespoke Artwork'} • {it.customEmbroidery.placement.replace('_', ' ')}
                            </div>
                          )}
                        </div>
                        <span className="font-serif font-bold text-sm text-[#1A1817]">
                          ₹{it.totalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="pt-3 border-t border-[#F0ECE1] flex justify-between items-center text-xs">
                    <span className="text-[#7A7367]">Total Paid via PayU Prepaid:</span>
                    <span className="font-serif font-bold text-base text-[#1A1817]">
                      ₹{ord.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Addresses */}
      {activeTab === 'ADDRESSES' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E8E4DC] space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-serif font-bold text-sm text-[#1A1817]">Primary Atelier Residence</h4>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">
                Default
              </span>
            </div>
            <p className="text-xs text-[#555047] leading-relaxed">
              <strong>Talha Al-Khatib</strong><br />
              42 Rue de l’Atelier, Heritage Enclave<br />
              Near Silk Mills, Mumbai, Maharashtra 400001<br />
              India • +91 98765 01234
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
