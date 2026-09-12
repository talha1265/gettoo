import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Sparkles, Truck, Lock, Zap, RefreshCw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0C] text-zinc-300 pt-16 pb-24 lg:pb-12 border-t border-zinc-800">
      {/* Streetwear Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0 text-[#CCFF00]">
              <Zap size={18} className="fill-[#CCFF00]" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">240–280 GSM Knitted Cotton</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Engineered heavyweight blanks with zero fabric puckering under heavy needle strikes.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0 text-[#CCFF00]">
              <Lock size={18} />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">PayU Prepaid Encryption</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">100% verified prepaid checkout via UPI, Cards, NetBanking, and Wallets.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0 text-[#CCFF00]">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Digital Stitch Verification</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Each custom vector proof is calibrated for needle density before running industrial machines.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0 text-[#CCFF00]">
              <Truck size={18} />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">All-India Express Dispatch</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Real-time tracking via Delhivery and Bluedart. Free dispatch on orders above ₹1,999.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links & Care Label */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-4xl tracking-wider text-white">
                GETTOO
              </span>
              <span className="text-[#FF4600] text-xl font-bold">®</span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#CCFF00] font-mono font-bold">
              HEAVYWEIGHT APPAREL CO. // STREETWEAR LAB
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm font-sans">
              Engineered boxy drop-shoulder t-shirts combined with high-density industrial embroidery. 
              Milled from dense long-staple organic cotton.
            </p>
            
            {/* Garment Care Label Mockup */}
            <div className="p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-xl font-mono text-[10px] space-y-1 text-zinc-300 max-w-sm">
              <div className="flex items-center justify-between pb-1 border-b border-zinc-800 text-[#CCFF00] font-bold">
                <span>WASH & CARE PROTOCOL</span>
                <span>RN# 89124</span>
              </div>
              <p>• MACHINE WASH COLD (30°C) INSIDE OUT</p>
              <p>• DO NOT IRON DIRECTLY ON EMBROIDERED PATCHES</p>
              <p>• HANG DRY RECOMMENDED • DO NOT BLEACH</p>
            </div>
          </div>

          {/* Col 1 */}
          <div>
            <h5 className="text-xs uppercase font-mono font-bold tracking-widest text-white mb-4">CUSTOM LAB</h5>
            <ul className="space-y-2.5 text-xs font-mono text-zinc-400">
              <li><Link href="/studio" className="hover:text-[#CCFF00] transition-colors">START CUSTOM T-SHIRT</Link></li>
              <li><Link href="/studio?mode=text" className="hover:text-[#CCFF00] transition-colors">MONOGRAM & TEXT STUDIO</Link></li>
              <li><Link href="/studio?mode=artwork" className="hover:text-[#CCFF00] transition-colors">UPLOAD LOGO / VECTOR</Link></li>
              <li><Link href="/blanks" className="hover:text-[#CCFF00] transition-colors">240–280 GSM BLANKS</Link></li>
              <li><Link href="/track" className="hover:text-[#CCFF00] transition-colors">LIVE STITCH RADAR</Link></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h5 className="text-xs uppercase font-mono font-bold tracking-widest text-white mb-4">DROPS & CATALOG</h5>
            <ul className="space-y-2.5 text-xs font-mono text-zinc-400">
              <li><Link href="/shop" className="hover:text-[#CCFF00] transition-colors">ALL DROPS & TEES</Link></li>
              <li><Link href="/shop?cat=heritage" className="hover:text-[#CCFF00] transition-colors">DROP 01: SOVEREIGN</Link></li>
              <li><Link href="/shop?cat=blanks" className="hover:text-[#CCFF00] transition-colors">HEAVYWEIGHT BLANKS</Link></li>
              <li><Link href="/admin" className="hover:text-[#CCFF00] transition-colors">ADMIN STUDIO</Link></li>
            </ul>
          </div>

          {/* Col 3: PayU Secure Assurance */}
          <div>
            <h5 className="text-xs uppercase font-mono font-bold tracking-widest text-white mb-4">PAYMENT & SECURITY</h5>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              All custom embroidery orders are reserved via prepaid PayU checkout to allocate machine heads and thread stock.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-[10px] rounded text-zinc-300 font-mono font-bold">
                PAYU GATEWAY
              </span>
              <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-[10px] rounded text-zinc-300 font-mono font-bold">
                UPI / GPAY / PHONEPE
              </span>
              <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-[10px] rounded text-zinc-300 font-mono font-bold">
                CREDIT & DEBIT CARDS
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Legal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
        <p>© {new Date().getFullYear()} GETTOO® HEAVYWEIGHT APPAREL CO. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-white transition-colors">SIZE & FIT GUIDE</Link>
          <Link href="#" className="hover:text-white transition-colors">DIGITIZING SPECS</Link>
          <Link href="#" className="hover:text-white transition-colors">PREPAID & RETURN POLICY</Link>
        </div>
      </div>
    </footer>
  );
}
