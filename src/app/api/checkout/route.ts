import { NextResponse } from 'next/server';
import dataStore from '@/lib/data-store';
import { generatePayUHash, getPayUConfig, getPayUUrl } from '@/lib/payu';
import { CartItem, ShippingAddress, PaymentGateway } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      items,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      paymentGateway = 'UPI',
      paymentMode,
      discountCode,
      notes,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Your cart is empty. Please add items to proceed.' },
        { status: 400 }
      );
    }

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required shipping and contact details.' },
        { status: 400 }
      );
    }

    // Calculate subtotal from items
    const subtotal = items.reduce((sum: number, item: CartItem) => {
      const price = item.totalPrice || item.unitPrice * (item.quantity || 1);
      return sum + price;
    }, 0);

    // Calculate customization fee sum
    const customizationFee = items.reduce((sum: number, item: CartItem) => {
      return sum + (item.customEmbroidery?.customCharge || 0) * (item.quantity || 1);
    }, 0);

    // Free shipping threshold: ₹1999
    let shippingFee = subtotal >= 1999 ? 0 : 99;

    // Apply promo coupon
    let discount = 0;
    const normalizedCoupon = (discountCode || '').trim().toUpperCase();
    if (normalizedCoupon === 'DROP01' || normalizedCoupon === 'GETTOO10') {
      discount = Math.round(subtotal * 0.1); // 10% discount
    } else if (normalizedCoupon === 'STREET20') {
      discount = Math.round(subtotal * 0.2); // 20% discount
    } else if (normalizedCoupon === 'FREESHIP') {
      shippingFee = 0;
    }

    const totalAmount = Math.max(0, subtotal + shippingFee - discount);

    // Prepare transaction metadata
    const txnid = `TXN_GET_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const mihpayid = `MIH_${Math.floor(100000000 + Math.random() * 900000000)}`;

    let orderStatus: 'PENDING' | 'CONFIRMED' | 'DIGITIZING' = 'DIGITIZING';
    let paymentStatus: 'PENDING' | 'PAID' = 'PAID';

    if (paymentGateway === 'COD') {
      orderStatus = 'CONFIRMED';
      paymentStatus = 'PENDING';
    } else if (paymentGateway === 'PAYU') {
      orderStatus = 'PENDING';
      paymentStatus = 'PENDING';
    } else {
      // UPI, CARD, NETBANKING are prepaid authorized
      orderStatus = 'DIGITIZING';
      paymentStatus = 'PAID';
    }

    const newOrder = dataStore.createOrder({
      customerName,
      customerEmail,
      customerPhone,
      items,
      subtotal,
      customizationFee,
      shippingFee,
      discount,
      discountCode: normalizedCoupon || undefined,
      totalAmount,
      status: orderStatus,
      paymentStatus,
      paymentGateway: paymentGateway as PaymentGateway,
      paymentTransactionId: txnid,
      payuTxnId: txnid,
      payuMihpayId: paymentStatus === 'PAID' ? mihpayid : undefined,
      payuMode: paymentMode || paymentGateway,
      shippingAddress: shippingAddress as ShippingAddress,
      notes,
    });

    // Update stock counts
    items.forEach((item: CartItem) => {
      if (item.variant?.id && item.variant.stockCount) {
        const remaining = Math.max(0, item.variant.stockCount - item.quantity);
        dataStore.updateStock(item.variant.id, remaining);
      }
    });

    // PayU specific payload if user chooses PayU Hosted
    let payuPayload = null;
    if (paymentGateway === 'PAYU') {
      const payuConfig = getPayUConfig();
      const productinfo = 'Gettoo Atelier Heavyweight Apparel';
      const firstname = customerName.split(' ')[0] || 'Customer';

      const hash = generatePayUHash({
        key: payuConfig.key,
        txnid,
        amount: totalAmount,
        productinfo,
        firstname,
        email: customerEmail,
        salt: payuConfig.salt,
      });

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
      const surl = `${appUrl}/api/payu/callback`;
      const furl = `${appUrl}/api/payu/callback`;

      payuPayload = {
        key: payuConfig.key,
        txnid,
        amount: totalAmount.toFixed(2),
        productinfo,
        firstname,
        email: customerEmail,
        phone: customerPhone,
        surl,
        furl,
        hash,
        env: payuConfig.env,
        actionUrl: getPayUUrl(payuConfig.env),
      };
    }

    return NextResponse.json({
      success: true,
      order: newOrder,
      orderNumber: newOrder.orderNumber,
      payuPayload,
      redirectUrl: `/order-success/${newOrder.orderNumber}`,
    });
  } catch (error: any) {
    console.error('Checkout API processing error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error during checkout' },
      { status: 500 }
    );
  }
}
