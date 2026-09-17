'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  RefreshCw,
  ShieldAlert,
  ShoppingBag,
  Headphones,
  ChevronRight,
} from 'lucide-react';

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const txnid = searchParams.get('txnid') || '';
  const orderNumber = searchParams.get('order') || '';
  const status = searchParams.get('status') || 'failed';
  const error = searchParams.get('error') || '';

  const getErrorMessage = () => {
    switch (error) {
      case 'missing_txnid':
        return 'No transaction ID was received from PayU. This may indicate a session issue.';
      case 'missing_hash':
        return 'Payment verification hash was missing. The transaction could not be validated.';
      case 'hash_mismatch':
        return 'Payment verification failed — the response hash does not match. This may indicate data tampering.';
      case 'order_not_found':
        return 'The order associated with this payment was not found in our system.';
      case 'server_error':
        return 'An internal server error occurred while processing the payment callback.';
      default:
        if (status === 'failure' || status === 'failed') {
          return 'Your payment was declined or cancelled on the PayU gateway. No amount has been charged.';
        }
        return 'The payment could not be completed. Please try again or use a different payment method.';
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 space-y-10">

      {/* Failure Icon & Title */}
      <div className="text-center space-y-5">
        <div className="relative inline-flex">
          <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-md">
            <ShieldAlert size={14} className="text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase text-[#0A0A0C] tracking-wide">
            PAYMENT UNSUCCESSFUL
          </h1>
          <p className="text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
            {getErrorMessage()}
          </p>
        </div>
      </div>

      {/* Transaction Details Card */}
      {(txnid || orderNumber) && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs space-y-3">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-600 border-b border-zinc-100 pb-2">
            TRANSACTION DETAILS
          </h3>
          <div className="space-y-2 font-mono text-xs">
            {txnid && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Transaction ID:</span>
                <span className="text-black font-bold truncate max-w-[220px]">{txnid}</span>
              </div>
            )}
            {orderNumber && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Order Number:</span>
                <span className="text-black font-bold">{orderNumber}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-zinc-500">Status:</span>
              <span className="text-red-600 font-bold uppercase">{status || 'FAILED'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Gateway:</span>
              <span className="text-black font-bold">PayU</span>
            </div>
          </div>
        </div>
      )}

      {/* What to do next */}
      <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-6 space-y-4">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-700">
          WHAT HAPPENED?
        </h3>
        <ul className="space-y-2 text-xs text-zinc-600 leading-relaxed">
          <li className="flex items-start gap-2">
            <ChevronRight size={14} className="text-zinc-400 shrink-0 mt-0.5" />
            <span>No amount has been deducted from your account. If any amount was debited, it will be automatically refunded within 5–7 business days.</span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight size={14} className="text-zinc-400 shrink-0 mt-0.5" />
            <span>This may have happened due to insufficient balance, incorrect OTP, session timeout, or a temporary bank issue.</span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight size={14} className="text-zinc-400 shrink-0 mt-0.5" />
            <span>Your cart items are still saved. You can retry the payment immediately.</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/checkout"
          className="flex-1 py-3.5 bg-[#0A0A0C] hover:bg-zinc-800 text-[#CCFF00] rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
        >
          <RefreshCw size={14} />
          <span>RETRY PAYMENT</span>
          <ArrowRight size={14} />
        </Link>

        <Link
          href="/shop"
          className="flex-1 py-3.5 bg-white border border-zinc-300 hover:border-black text-black rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
        >
          <ShoppingBag size={14} />
          <span>CONTINUE SHOPPING</span>
        </Link>
      </div>

      {/* Support Note */}
      <div className="text-center text-[11px] font-mono text-zinc-400 space-y-1">
        <div className="flex items-center justify-center gap-1.5">
          <Headphones size={12} />
          <span>Need help? Contact our support at <strong className="text-zinc-600">support@gettoo.atelier</strong></span>
        </div>
        <p>
          Reference this transaction ID when reaching out for faster resolution.
        </p>
      </div>

    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-2 border-zinc-300 border-t-black rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-xs font-mono text-zinc-500">Loading...</p>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}
