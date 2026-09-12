'use client';

import React from 'react';
import { useAtelier } from '@/lib/store';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useAtelier();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 bg-[#1A1817] text-[#FAF8F5] rounded-xl shadow-2xl border border-[#3D3A36] text-xs font-medium animate-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' && <CheckCircle2 size={16} className="text-[#C5A059] shrink-0" />}
            {toast.type === 'error' && <AlertCircle size={16} className="text-red-400 shrink-0" />}
            {toast.type === 'info' && <Info size={16} className="text-[#A8A196] shrink-0" />}
            <p className="leading-snug">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 text-[#8E887E] hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
