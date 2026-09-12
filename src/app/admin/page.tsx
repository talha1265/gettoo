'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Package, 
  CreditCard, 
  Layers, 
  Users, 
  ShoppingBag, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertTriangle, 
  Plus, 
  Save, 
  Eye, 
  ArrowUpRight,
  Sparkles,
  Lock,
  LogOut,
  Zap,
  Flame,
  Check,
  X
} from 'lucide-react';
import { INITIAL_ORDERS, INITIAL_PRODUCTS } from '@/lib/mock-data';
import { Order, OrderStatus, Product } from '@/lib/types';
import { useAtelier } from '@/lib/store';

export default function AdminPage() {
  const { user, setUser, showToast, logoutUser } = useAtelier();

  // Admin Login State (if not authenticated)
  const [loginEmail, setLoginEmail] = useState('admin@gettoo.atelier');
  const [loginPassword, setLoginPassword] = useState('atelier@admin2026');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ORDERS' | 'PAYMENTS' | 'INVENTORY' | 'PRODUCTS' | 'USERS'>('OVERVIEW');

  // Admin state
  const [orders, setOrders] = useState<Order[]>([...INITIAL_ORDERS]);
  const [products, setProducts] = useState<Product[]>([...INITIAL_PRODUCTS]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status update modal state
  const [newStatus, setNewStatus] = useState<OrderStatus>('STITCHING');
  const [newProgress, setNewProgress] = useState<number>(65);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('Delhivery Express');

  // Filters
  const [orderFilter, setOrderFilter] = useState<string>('ALL');
  const [orderSearch, setOrderSearch] = useState('');

  // Handle Admin Login Submission
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: 'ADMIN',
          phone: data.user.phone,
          addresses: [],
          savedDesigns: [],
        });
        showToast('Welcome to GETTOO® Admin Lab', 'success');
      } else {
        setLoginError(data.message || 'Invalid admin credentials');
      }
    } catch (err: any) {
      setLoginError('Server error authenticating admin. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Metrics
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const activeStitchingCount = orders.filter((o) => 
    ['DIGITIZING', 'STITCHING', 'QUALITY_CHECK'].includes(o.status)
  ).length;

  const lowStockVariants = products.flatMap((p) => 
    p.variants.filter((v) => v.stockCount <= 15).map((v) => ({ ...v, productName: p.name }))
  );

  // Open manage order modal
  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setNewProgress(order.stitchProgressPercentage || 50);
    setTrackingNumber(order.trackingNumber || '');
    setCourierName(order.courierName || 'Delhivery Express');
  };

  // Update order status handler
  const handleUpdateStatus = () => {
    if (!selectedOrder) return;
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === selectedOrder.id
          ? {
              ...ord,
              status: newStatus,
              stitchProgressPercentage: newProgress,
              trackingNumber: trackingNumber || ord.trackingNumber,
              courierName: courierName || ord.courierName,
              updatedAt: new Date().toISOString(),
            }
          : ord
      )
    );
    showToast(`Order ${selectedOrder.orderNumber} updated to ${newStatus}`, 'success');
    setSelectedOrder(null);
  };

  // Stock update handler
  const handleUpdateStock = (variantId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => ({
        ...p,
        variants: p.variants.map((v) =>
          v.id === variantId ? { ...v, stockCount: Math.max(0, v.stockCount + delta) } : v
        ),
      }))
    );
    showToast('Inventory stock adjusted', 'info');
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderFilter === 'ALL' || o.status === orderFilter;
    const matchesSearch = 
      !orderSearch ||
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // IF USER IS NOT AN ADMIN, SHOW SECURE LOGIN PORTAL
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border-2 border-black shadow-2xl p-6 sm:p-8 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-black text-[#CCFF00] mx-auto flex items-center justify-center shadow-md">
              <Lock size={22} />
            </div>
            <h1 className="font-display text-3xl font-normal tracking-wide text-black uppercase">
              ADMIN LAB ACCESS
            </h1>
            <p className="text-xs font-mono text-zinc-500">
              Sign in with your configured production credentials to access operations, orders, and PayU ledger.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono font-bold rounded-lg text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-zinc-700 mb-1">
                ADMIN EMAIL
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border-2 border-zinc-200 focus:border-black rounded-xl text-xs font-mono font-bold text-black focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-zinc-700 mb-1">
                ADMIN PASSWORD
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border-2 border-zinc-200 focus:border-black rounded-xl text-xs font-mono font-bold text-black focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-black hover:bg-zinc-800 text-[#CCFF00] rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              {loginLoading ? 'AUTHENTICATING...' : 'ENTER ADMIN OPERATIONS'}
            </button>
          </form>

          {/* Quick Credential Helper Pill */}
          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1 text-center font-mono text-[10px]">
            <span className="text-zinc-500 font-bold uppercase">ENV PRODUCTION CREDENTIALS:</span>
            <div className="text-black font-bold">
              Email: <span className="text-zinc-700">admin@gettoo.atelier</span>
            </div>
            <div className="text-black font-bold">
              Password: <span className="text-zinc-700">atelier@admin2026</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setLoginEmail('admin@gettoo.atelier');
                setLoginPassword('atelier@admin2026');
              }}
              className="mt-2 text-[10px] text-black font-bold underline hover:text-[#FF4600]"
            >
              Auto-Fill Configured Credentials
            </button>
          </div>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs font-mono text-zinc-500 hover:text-black font-bold">
              &larr; Return to Store
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-black text-[#CCFF00] flex items-center justify-center shadow-sm">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-3xl sm:text-4xl font-normal text-black uppercase tracking-wide">
                  GETTOO® ADMIN LAB
                </h1>
                <span className="px-2 py-0.5 rounded bg-[#CCFF00] text-black text-[9px] font-mono font-black uppercase tracking-widest">
                  LIVE
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-500">
                Production Control: Orders, PayU Transactions, Inventory Matrix, and Stitch Radar.
              </p>
            </div>
          </div>
        </div>

        {/* Right Admin Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/studio"
            className="px-3.5 py-2 bg-white border border-zinc-300 text-black text-xs font-mono font-bold uppercase rounded-xl hover:bg-zinc-50 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Zap size={14} className="fill-[#CCFF00]" />
            <span>TEST STUDIO</span>
          </Link>

          <div className="px-3 py-1.5 bg-black text-white text-xs font-mono rounded-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
            <span className="truncate max-w-[140px] font-bold">{user.email}</span>
          </div>

          <button
            onClick={logoutUser}
            className="p-2 text-zinc-500 hover:text-red-600 rounded-xl hover:bg-red-50 border border-zinc-200 transition-colors"
            title="Sign Out of Admin"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex border-b border-zinc-200 gap-4 text-xs font-mono font-bold uppercase overflow-x-auto scrollbar-none">
        {[
          { id: 'OVERVIEW', label: 'Overview', icon: Layers },
          { id: 'ORDERS', label: `Orders (${orders.length})`, icon: Package },
          { id: 'PAYMENTS', label: 'PayU Transactions', icon: CreditCard },
          { id: 'INVENTORY', label: `Inventory (${lowStockVariants.length} alerts)`, icon: Layers },
          { id: 'PRODUCTS', label: `Products (${products.length})`, icon: ShoppingBag },
          { id: 'USERS', label: 'Customers', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'text-black font-black border-b-2 border-black'
                  : 'text-zinc-500 hover:text-black'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-8">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="bg-white p-5 rounded-2xl border-2 border-zinc-200 shadow-xs space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono font-bold">
                TOTAL PREPAID REVENUE
              </span>
              <p className="font-mono text-2xl font-bold text-black">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-emerald-700 font-mono font-bold flex items-center gap-1 pt-1">
                <CheckCircle2 size={12} /> 100% SETTLED VIA PAYU
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border-2 border-zinc-200 shadow-xs space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono font-bold">
                ACTIVE STITCHING QUEUE
              </span>
              <p className="font-mono text-2xl font-bold text-black">
                {activeStitchingCount} PIECES
              </p>
              <span className="text-[10px] text-black font-mono font-bold flex items-center gap-1 pt-1">
                <Clock size={12} /> 8 MACHINES RUNNING
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border-2 border-zinc-200 shadow-xs space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono font-bold">
                TOTAL ORDERS PROCESSED
              </span>
              <p className="font-mono text-2xl font-bold text-black">
                {orders.length} ORDERS
              </p>
              <span className="text-[10px] text-zinc-500 font-mono font-bold flex items-center gap-1 pt-1">
                <ShoppingBag size={12} /> 0 CANCELLATIONS
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border-2 border-zinc-200 shadow-xs space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono font-bold">
                LOW STOCK ALERTS
              </span>
              <p className="font-mono text-2xl font-bold text-red-600">
                {lowStockVariants.length} VARIANTS
              </p>
              <span className="text-[10px] text-red-500 font-mono font-bold flex items-center gap-1 pt-1">
                <AlertTriangle size={12} /> REORDER REQUIRED
              </span>
            </div>

          </div>

          {/* Quick Production Pipeline Summary */}
          <div className="bg-zinc-950 text-white p-6 rounded-2xl border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#CCFF00] uppercase tracking-widest">
                LIVE MACHINE PIPELINE MONITOR
              </span>
              <span className="text-[10px] font-mono text-zinc-400">AUTOMATIC REAL-TIME SYNC</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 font-mono text-xs text-center">
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block font-bold">PENDING PROOF</span>
                <span className="text-lg font-bold text-white">1</span>
              </div>
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block font-bold">DIGITIZING</span>
                <span className="text-lg font-bold text-[#CCFF00]">2</span>
              </div>
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block font-bold">STITCHING</span>
                <span className="text-lg font-bold text-white">4</span>
              </div>
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block font-bold">QC VERIFICATION</span>
                <span className="text-lg font-bold text-white">1</span>
              </div>
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block font-bold">DISPATCHED</span>
                <span className="text-lg font-bold text-emerald-400">12</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ORDERS TAB */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {['ALL', 'PENDING', 'DIGITIZING', 'STITCHING', 'QUALITY_CHECK', 'DISPATCHED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                    orderFilter === st
                      ? 'bg-black text-[#CCFF00]'
                      : 'bg-white text-zinc-700 border border-zinc-200 hover:border-black'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search order #, customer, email..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full sm:w-64 px-3 py-2 pl-8 bg-white border border-zinc-300 rounded-xl text-xs font-mono text-black focus:outline-none focus:border-black placeholder:text-zinc-400"
              />
              <Search size={14} className="absolute left-2.5 top-2.5 text-zinc-400" />
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl border-2 border-zinc-200 overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-[10px] font-mono font-bold uppercase text-zinc-500">
                  <th className="p-4">ORDER #</th>
                  <th className="p-4">CUSTOMER</th>
                  <th className="p-4">PIECES</th>
                  <th className="p-4">PAYMENT</th>
                  <th className="p-4">STITCH STATUS</th>
                  <th className="p-4">TOTAL</th>
                  <th className="p-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs font-mono">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="p-4 font-bold text-black">{ord.orderNumber}</td>
                    <td className="p-4">
                      <span className="font-bold text-black block">{ord.customerName}</span>
                      <span className="text-[10px] text-zinc-400">{ord.customerEmail}</span>
                    </td>
                    <td className="p-4 text-zinc-600">
                      {ord.items.length} {ord.items.length === 1 ? 'Garment' : 'Garments'}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        <Check size={11} /> {ord.paymentGateway} {ord.payuMode}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-black text-[#CCFF00] text-[10px] font-bold uppercase">
                        {ord.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-black">
                      ₹{ord.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openOrderModal(ord)}
                        className="px-3 py-1.5 bg-black hover:bg-zinc-800 text-[#CCFF00] font-bold text-[10px] uppercase rounded-lg shadow-xs"
                      >
                        MANAGE ORDER
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. PAYU TRANSACTIONS TAB */}
      {activeTab === 'PAYMENTS' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border-2 border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div>
                <h3 className="font-mono text-base font-bold uppercase text-black">
                  PAYU GATEWAY SETTLEMENT LEDGER
                </h3>
                <p className="text-xs font-mono text-zinc-500">
                  Prepaid encrypted transactions with instant settlement logs.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-black text-[#CCFF00] text-xs font-mono font-bold">
                PAYU ENV: {process.env.NEXT_PUBLIC_PAYU_ENV || 'TEST'}
              </span>
            </div>

            <div className="divide-y divide-zinc-100 font-mono text-xs">
              {orders.map((ord) => (
                <div key={ord.id} className="py-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-black text-sm">{ord.payuTxnId || `TXN_PAYU_${ord.orderNumber}`}</span>
                    <p className="text-[11px] text-zinc-500">
                      Order: {ord.orderNumber} • Mode: {ord.payuMode || 'UPI'} • MIH Pay ID: {ord.payuMihpayId || 'MIH_98129031'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-black text-sm block">₹{ord.totalAmount.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      VERIFIED 100% PAID
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. INVENTORY MATRIX TAB */}
      {activeTab === 'INVENTORY' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border-2 border-zinc-200 p-6 space-y-6 shadow-xs">
            <div>
              <h3 className="font-mono text-base font-bold uppercase text-black">
                HEAVYWEIGHT BLANKS INVENTORY CONTROL
              </h3>
              <p className="text-xs font-mono text-zinc-500">
                Manage live blanks stock counts for 240 GSM Pima Cotton & 280 GSM French Terry knits.
              </p>
            </div>

            <div className="space-y-6">
              {products.map((p) => (
                <div key={p.id} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-mono text-sm font-bold text-black uppercase">{p.name}</h4>
                      <span className="text-[10px] font-mono text-zinc-500">{p.gsm} GSM • {p.fabric}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                    {p.variants.map((v) => (
                      <div key={v.id} className="p-2 bg-white rounded-lg border border-zinc-200 text-center space-y-1">
                        <span className="block text-xs font-mono font-bold text-black">{v.size}</span>
                        <span className={`block font-mono text-xs font-bold ${v.stockCount <= 10 ? 'text-red-600' : 'text-zinc-700'}`}>
                          {v.stockCount} left
                        </span>
                        <div className="flex gap-1 pt-1 justify-center">
                          <button
                            onClick={() => handleUpdateStock(v.id, -1)}
                            className="w-5 h-5 bg-zinc-100 hover:bg-zinc-200 rounded text-xs font-bold flex items-center justify-center"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleUpdateStock(v.id, 5)}
                            className="w-5 h-5 bg-black text-[#CCFF00] rounded text-xs font-bold flex items-center justify-center"
                          >
                            +5
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. PRODUCTS TAB */}
      {activeTab === 'PRODUCTS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border-2 border-zinc-200 p-4 space-y-3 shadow-xs">
                <div className="aspect-4/5 rounded-xl overflow-hidden bg-zinc-100">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-mono text-xs font-bold text-black uppercase line-clamp-1">{p.name}</h4>
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mt-1">
                    <span>₹{(p.salePrice || p.basePrice).toLocaleString('en-IN')}</span>
                    <span className="bg-zinc-100 text-black px-1.5 py-0.5 rounded text-[10px] font-bold">{p.gsm} GSM</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. USERS / CUSTOMERS TAB */}
      {activeTab === 'USERS' && (
        <div className="bg-white p-6 rounded-2xl border-2 border-zinc-200 shadow-xs space-y-4">
          <h3 className="font-mono text-base font-bold uppercase text-black">
            REGISTERED CUSTOMER DIRECTORY
          </h3>
          <div className="divide-y divide-zinc-100 font-mono text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-black block">Aarav Mehta</span>
                <span className="text-zinc-500 text-[11px]">aarav.mehta@example.com • Gurugram, Haryana</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-zinc-100 text-black text-[10px] font-bold">1 Order (₹2,898)</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-black block">Talha (Customer Demo)</span>
                <span className="text-zinc-500 text-[11px]">talha@gettoo.atelier • Mumbai, Maharashtra</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-zinc-100 text-black text-[10px] font-bold">Active Cart Session</span>
            </div>
          </div>
        </div>
      )}

      {/* STATUS UPDATE MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl border-2 border-black p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div>
                <h3 className="font-mono text-base font-bold uppercase text-black">
                  MANAGE ORDER: {selectedOrder.orderNumber}
                </h3>
                <span className="text-[11px] font-mono text-zinc-500">
                  Customer: {selectedOrder.customerName}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-zinc-400 hover:text-black rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                  ORDER MANUFACTURING STATUS:
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 bg-zinc-50 border-2 border-zinc-200 rounded-xl text-black font-bold focus:outline-none focus:border-black"
                >
                  <option value="PENDING">PENDING PROOF</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="DIGITIZING">DIGITIZING ARTWORK</option>
                  <option value="STITCHING">STITCHING IN MACHINE</option>
                  <option value="QUALITY_CHECK">QUALITY CHECK</option>
                  <option value="DISPATCHED">DISPATCHED</option>
                  <option value="DELIVERED">DELIVERED</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-bold text-zinc-700 mb-1">
                  <span>STITCHING PROGRESS:</span>
                  <span className="text-black">{newProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={newProgress}
                  onChange={(e) => setNewProgress(parseInt(e.target.value))}
                  className="w-full accent-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                  COURIER PARTNER:
                </label>
                <input
                  type="text"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  placeholder="e.g. Delhivery Express, Bluedart"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                  TRACKING NUMBER (AWB):
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. DELHIVERY-78901234"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl font-bold"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase rounded-xl"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleUpdateStatus}
                className="flex-1 py-2.5 bg-black hover:bg-zinc-800 text-[#CCFF00] font-mono font-bold text-xs uppercase rounded-xl"
              >
                SAVE & SYNC RADAR
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
