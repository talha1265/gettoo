import { NextResponse } from 'next/server';
import dataStore from '@/lib/data-store';

export async function GET() {
  const orders = dataStore.getOrders();
  return NextResponse.json({ success: true, orders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const order = dataStore.createOrder(body);
    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
