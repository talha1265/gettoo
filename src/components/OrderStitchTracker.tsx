'use client';

import React from 'react';
import { Order, OrderStatus } from '@/lib/types';
import { CheckCircle2, Clock, Sparkles, Truck, Package, ShieldCheck } from 'lucide-react';

interface OrderStitchTrackerProps {
  order: Order;
}

export default function OrderStitchTracker({ order }: OrderStitchTrackerProps) {
  const steps: { key: OrderStatus | 'ORDER_PLACED'; title: string; desc: string; icon: any }[] = [
    {
      key: 'ORDER_PLACED',
      title: 'Order Authorized',
      desc: `PayU Prepaid Verified (${order.payuMode || 'Prepaid'})`,
      icon: CheckCircle2,
    },
    {
      key: 'DIGITIZING',
      title: 'Digitizing Artwork',
      desc: 'Calculating needle coordinates & stitch density',
      icon: Sparkles,
    },
    {
      key: 'STITCHING',
      title: 'Atelier Stitching',
      desc: 'Precision Madeira silk thread embroidery in progress',
      icon: Clock,
    },
    {
      key: 'QUALITY_CHECK',
      title: 'Quality Inspection',
      desc: 'Hand trimming, steam pressing & QA approval',
      icon: ShieldCheck,
    },
    {
      key: 'DISPATCHED',
      title: 'Dispatched',
      desc: order.trackingNumber 
        ? `${order.courierName || 'Express Courier'}: ${order.trackingNumber}`
        : 'Preparing courier airway bill',
      icon: Truck,
    },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'CONFIRMED':
        return 0;
      case 'DIGITIZING':
        return 1;
      case 'STITCHING':
        return 2;
      case 'QUALITY_CHECK':
        return 3;
      case 'DISPATCHED':
      case 'DELIVERED':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E4DC] shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F0ECE1]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-bold text-[#1A1817]">
              Atelier Craft Progress
            </h3>
            <span className="px-2 py-0.5 bg-[#FAF8F5] border border-[#DDD7CB] text-[#787165] text-[10px] font-mono rounded">
              {order.orderNumber}
            </span>
          </div>
          <p className="text-xs text-[#7A7367] mt-0.5">
            Real-time physical manufacturing tracker for your bespoke piece
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1A1817]">
            Stage: {order.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Progress Line */}
      <div className="relative">
        {/* Connection Bar */}
        <div className="hidden sm:block absolute top-5 left-6 right-6 h-0.5 bg-[#EAE5DA] z-0">
          <div 
            className="h-full bg-[#C5A059] transition-all duration-500"
            style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            const Icon = step.icon;

            return (
              <div key={step.title} className="flex sm:flex-col items-start sm:items-center gap-3 sm:text-center">
                {/* Icon Node */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                    isCurrent
                      ? 'bg-[#1A1817] text-[#C5A059] border-[#C5A059] shadow-md scale-105'
                      : isCompleted
                      ? 'bg-[#F5EFE6] text-[#8C6D37] border-[#C5A059]'
                      : 'bg-[#FAF8F5] text-[#BBB5A8] border-[#E3DCCF]'
                  }`}
                >
                  <Icon size={18} />
                </div>

                {/* Text Content */}
                <div>
                  <h4 className={`text-xs font-bold ${isCompleted ? 'text-[#1A1817]' : 'text-[#A0998E]'}`}>
                    {step.title}
                  </h4>
                  <p className="text-[10px] text-[#7A7367] mt-0.5 leading-snug max-w-[140px] sm:mx-auto">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PayU Verification & Shipping Snapshot Footer */}
      <div className="pt-4 border-t border-[#F0ECE1] bg-[#FAF8F5] -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-4 sm:px-8 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A7367] gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-[#4A4540]">PayU Txn:</span>
          <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-[#E0D9CC] text-[#1A1817]">
            {order.payuTxnId || 'N/A'}
          </span>
        </div>

        {order.trackingNumber && (
          <div className="flex items-center gap-2">
            <span className="text-[#3F6649] font-medium flex items-center gap-1">
              <Truck size={14} /> Tracking Number:
            </span>
            <span className="font-mono font-bold text-[#1A1817] underline">
              {order.trackingNumber}
            </span>
          </div>
        )}
      </div>

    </div>
  );
}
