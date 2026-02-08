import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import PageContent from '@/models/PageContent';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const page = request.nextUrl.searchParams.get('page');
    if (page) {
      const doc = await PageContent.findOne({ page });
      return NextResponse.json({ success: true, data: doc });
    }
    const docs = await PageContent.find();
    return NextResponse.json({ success: true, data: docs });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { page, content } = body;
    if (!page) {
      return NextResponse.json({ success: false, error: 'page is required' }, { status: 400 });
    }
    const doc = await PageContent.findOneAndUpdate(
      { page },
      { content, updatedAt: new Date() },
      { upsert: true, new: true, runValidators: true }
    );
    return NextResponse.json({ success: true, data: doc });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
