import { NextResponse } from 'next/server';
import dataStore from '@/lib/data-store';

export async function GET() {
  const analytics = dataStore.getAnalytics();
  return NextResponse.json({ success: true, analytics });
}
