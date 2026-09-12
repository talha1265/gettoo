import { NextResponse } from 'next/server';
import dataStore from '@/lib/data-store';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, trackingNumber, courierName } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'Order ID and status are required' }, { status: 400 });
    }

    const updated = dataStore.updateOrderStatus(id, status, trackingNumber, courierName);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
