'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Sparkles, Package, AlertCircle } from 'lucide-react';
import { INITIAL_ORDERS } from '@/lib/mock-data';
import OrderStitchTracker from '@/components/OrderStitchTracker';

function TrackContent() {
  const searchParams = useSearchParams();
  const queryId = searchParams.get('id') || '';

  const [orderQuery, setOrderQuery] = useState(queryId);
  const [matchedOrder, setMatchedOrder] = useState<any>(null);
  const [searched, setSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Initial load if queryId present
  useEffect(() => {
    if (queryId) {
      findOrder(queryId);
    } else {
      // Default to first order from mock data if none searched
      setMatchedOrder(INITIAL_ORDERS[0]);
    }
  }, [queryId]);

  const findOrder = async (query: string) => {
    const q = query.trim();
    if (!q) return;
    setIsSearching(true);
    setSearched(true);

    try {
      // 1. Try direct orderNumber lookup
      const res = await fetch(`/api/orders/${q}`);
      const data = await res.json();
      if (data.success && data.order) {
        setMatchedOrder(data.order);
        setIsSearching(false);
        return;
      }

      // 2. Try fetching all orders to match email or txn id
      const allRes = await fetch('/api/orders');
      const allData = await allRes.json();
      if (allData.success && Array.isArray(allData.orders)) {
        const found = allData.orders.find((o: any) =>
          o.orderNumber?.toLowerCase() === q.toLowerCase() ||
          o.customerEmail?.toLowerCase() === q.toLowerCase() ||
          o.customerPhone?.toLowerCase() === q.toLowerCase() ||
          o.payuTxnId?.toLowerCase() === q.toLowerCase() ||
          o.paymentTransactionId?.toLowerCase() === q.toLowerCase()
        );
        if (found) {
          setMatchedOrder(found);
          setIsSearching(false);
          return;
        }
      }

      // 3. Fallback to mock data
      const mockFound = INITIAL_ORDERS.find((o) =>
        o.orderNumber.toLowerCase() === q.toLowerCase() ||
        o.customerEmail.toLowerCase() === q.toLowerCase() ||
        o.payuTxnId?.toLowerCase() === q.toLowerCase()
      );
      setMatchedOrder(mockFound || null);
    } catch (e) {
      console.error('Error tracking order:', e);
      setMatchedOrder(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    findOrder(orderQuery);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Search Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded bg-black text-[#CCFF00] text-[10px] font-mono font-bold uppercase tracking-widest">
            RADAR
          </span>
          <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">
            // INDUSTRIAL EMBROIDERY PROGRESS
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-normal text-[#0A0A0C] uppercase tracking-wide">
          TRACK YOUR EMBROIDERY ORDER
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 font-sans">
          Enter your Order Number (e.g. <span className="font-mono font-bold text-black">GET-2026-9812</span>) or email to monitor live digitizing, needle strike rate, and courier dispatch.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            required
            placeholder="Enter GET-2026-XXXX or customer email..."
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-white border-2 border-zinc-200 rounded-xl text-xs sm:text-sm font-mono font-bold tracking-wider text-black focus:outline-none focus:border-black shadow-xs placeholder:text-zinc-400"
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-zinc-400" />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-[#0A0A0C] hover:bg-zinc-800 text-[#CCFF00] rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-md"
        >
          LOCATE
        </button>
      </form>


      {/* Result */}
      {matchedOrder ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <OrderStitchTracker order={matchedOrder} />
        </div>
      ) : searched ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-[#E8E4DC] space-y-3">
          <AlertCircle size={32} className="mx-auto text-[#A0988A]" />
          <h3 className="font-serif text-lg font-bold text-[#1A1817]">No Matching Order Found</h3>
          <p className="text-xs text-[#7A7367]">
            Please verify the order number format (e.g. GET-2026-9812). If you just completed PayU checkout, allow 30 seconds for transaction sync.
          </p>
        </div>
      ) : null}

    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#888]">Loading tracking portal...</div>}>
      <TrackContent />
    </Suspense>
  );
}
