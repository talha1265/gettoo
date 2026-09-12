import { NextResponse } from 'next/server';
import dataStore from '@/lib/data-store';
import { getPayUConfig, verifyPayUResponseHash } from '@/lib/payu';

export async function POST(req: Request) {
  try {
    let data: Record<string, string> = {};

    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await req.json();
    } else {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        data[key] = value.toString();
      });
    }

    const { txnid, status, mihpayid = '', mode = 'UPI' } = data;

    if (!txnid) {
      return NextResponse.json({ success: false, message: 'Missing transaction ID' }, { status: 400 });
    }

    const payuConfig = getPayUConfig();
    
    // Check hash if supplied
    let hashValid = true;
    if (data.hash) {
      hashValid = verifyPayUResponseHash(data, payuConfig.salt);
    }

    const isSuccess = status?.toLowerCase() === 'success';
    const paymentStatus = isSuccess ? 'PAID' : 'FAILED';

    const updatedOrder = dataStore.updatePayUTransaction(
      txnid,
      txnid,
      mihpayid,
      paymentStatus,
      mode
    );

    // If request was from standard browser form post, redirect to success page
    if (!contentType.includes('application/json')) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      if (isSuccess && updatedOrder) {
        return NextResponse.redirect(`${appUrl}/order-success/${updatedOrder.orderNumber}`, 303);
      } else {
        return NextResponse.redirect(`${appUrl}/order-failed?txnid=${txnid}`, 303);
      }
    }

    return NextResponse.json({
      success: isSuccess,
      hashValid,
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error('PayU callback handling error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error processing PayU response' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const txnid = searchParams.get('txnid') || '';
  const status = searchParams.get('status') || 'success';

  const order = dataStore.updatePayUTransaction(
    txnid,
    txnid,
    `MIH_${Date.now()}`,
    status === 'success' ? 'PAID' : 'FAILED',
    'UPI'
  );

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  if (order) {
    return NextResponse.redirect(`${appUrl}/order-success/${order.orderNumber}`);
  }
  return NextResponse.redirect(`${appUrl}/`);
}
