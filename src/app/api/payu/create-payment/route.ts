import { NextResponse } from 'next/server';
import { generatePayUHash, getPayUConfig, getPayUUrl } from '@/lib/payu';
import dataStore from '@/lib/data-store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, customerName, customerEmail, customerPhone, shippingAddress, items } = body;

    if (!amount || !customerEmail || !customerName) {
      return NextResponse.json(
        { success: false, message: 'Missing required checkout information' },
        { status: 400 }
      );
    }

    const payuConfig = getPayUConfig();
    const txnid = `TXN_GET_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const productinfo = 'Gettoo Atelier Bespoke Embroidered Apparel';
    const firstname = customerName.split(' ')[0] || 'Customer';

    const hash = generatePayUHash({
      key: payuConfig.key,
      txnid,
      amount,
      productinfo,
      firstname,
      email: customerEmail,
      salt: payuConfig.salt,
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const surl = `${appUrl}/api/payu/callback`;
    const furl = `${appUrl}/api/payu/callback`;

    // Create the order in PENDING status in our data store
    const createdOrder = dataStore.createOrder({
      customerName,
      customerEmail,
      customerPhone,
      items: items || [],
      subtotal: amount,
      customizationFee: 0,
      shippingFee: 0,
      discount: 0,
      totalAmount: amount,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      paymentGateway: 'PAYU',
      payuTxnId: txnid,
      shippingAddress,
    });

    return NextResponse.json({
      success: true,
      order: createdOrder,
      payload: {
        key: payuConfig.key,
        txnid,
        amount: Number(amount).toFixed(2),
        productinfo,
        firstname,
        email: customerEmail,
        phone: customerPhone || '9876543210',
        surl,
        furl,
        hash,
        env: payuConfig.env,
        actionUrl: getPayUUrl(payuConfig.env),
      },
    });
  } catch (error: any) {
    console.error('Error initiating PayU payment:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
