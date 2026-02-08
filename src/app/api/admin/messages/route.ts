import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';

// GET /api/admin/messages?page=1&pageSize=20&read=true|false|all
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
    const pageSize = Math.min(Math.max(parseInt(searchParams.get('pageSize') || '20', 10), 1), 100);
    const readParam = searchParams.get('read');
    const filter: Record<string, unknown> = {};
    if (readParam === 'true') filter.read = true;
    if (readParam === 'false') filter.read = false;

    const [items, total] = await Promise.all([
      ContactMessage.find(filter).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean(),
      ContactMessage.countDocuments(filter),
    ]);
    return NextResponse.json({ success: true, data: items, page, pageSize, total });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// PATCH /api/admin/messages  { id, read }
export async function PATCH(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const id = String(body.id || '').trim();
    const read = Boolean(body.read);
    if (!id) return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    const updated = await ContactMessage.findByIdAndUpdate(id, { read }, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// DELETE /api/admin/messages?id=...
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    await ContactMessage.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
