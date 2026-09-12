import { NextResponse } from 'next/server';
import dataStore from '@/lib/data-store';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { variantId, stockCount } = body;

    if (!variantId || typeof stockCount !== 'number') {
      return NextResponse.json({ success: false, message: 'Invalid variant ID or stock count' }, { status: 400 });
    }

    const success = dataStore.updateStock(variantId, stockCount);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
