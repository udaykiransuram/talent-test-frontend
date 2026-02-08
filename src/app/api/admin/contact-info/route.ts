import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ContactInfo from '@/models/ContactInfo';

// GET contact info (admin)
export async function GET() {
  try {
    await connectDB();
    const doc = await ContactInfo.findOne();
    return NextResponse.json({ success: true, data: doc || null });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// PUT update contact info (admin)
export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const allowedFields = ['email', 'phone', 'whatsappNumber', 'address', 'city', 'tagline', 'responseTime', 'responseDescription'] as const;

    // Trim and basic validation
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();
    const whatsappNumber = String(body.whatsappNumber || '').trim();
    const address = String(body.address || '').trim();
    const city = String(body.city || '').trim();
    const tagline = String(body.tagline || '').trim();
    const responseTime = String(body.responseTime || '').trim();
    const responseDescription = String(body.responseDescription || '').trim();

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const digits = (s: string) => s.replace(/\D+/g, '');
    const phoneDigits = digits(phone);
    const waDigits = digits(whatsappNumber);

    if (!emailRe.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 });
    }
    if (phoneDigits.length < 10) {
      return NextResponse.json({ success: false, error: 'Invalid phone number' }, { status: 400 });
    }
    if (whatsappNumber && waDigits.length < 10) {
      return NextResponse.json({ success: false, error: 'Invalid WhatsApp number' }, { status: 400 });
    }
    if (!address || !city || !tagline || !responseTime || !responseDescription) {
      return NextResponse.json({ success: false, error: 'All fields are required except WhatsApp number' }, { status: 400 });
    }

    const update = { email, phone, whatsappNumber, address, city, tagline, responseTime, responseDescription };

    const updated = await ContactInfo.findOneAndUpdate({}, { ...update, updatedAt: new Date() }, { upsert: true, new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
