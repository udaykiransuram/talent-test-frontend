import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ContactInfo from '@/models/ContactInfo';

// Public GET contact info
export async function GET() {
  try {
    await connectDB();
    const doc = await ContactInfo.findOne();
    return NextResponse.json({ success: true, data: doc || null });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
