import { NextResponse } from 'next/server';
import dataStore from '@/lib/data-store';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const query = searchParams.get('q')?.toLowerCase();

  let products = dataStore.getProducts();

  if (category) {
    products = products.filter((p) => 
      p.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  if (query) {
    products = products.filter((p) => 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({ success: true, products });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newProduct = dataStore.addProduct({
      ...body,
      id: `prod-${Date.now()}`,
    });
    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
