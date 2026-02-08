import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import FAQ from '@/models/FAQ';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const page = request.nextUrl.searchParams.get('page');
    const filter: Record<string, unknown> = {};
    if (page) filter.page = page;
    const docs = await FAQ.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: docs });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const doc = await FAQ.create(body);
    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
