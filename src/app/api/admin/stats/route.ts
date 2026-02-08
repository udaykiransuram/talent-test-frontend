import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import SiteStats from '@/models/SiteStats';

// GET all stats by section
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    if (section) {
      const stats = await SiteStats.findOne({ section });
      return NextResponse.json({ success: true, data: stats });
    }

    const allStats = await SiteStats.find();
    return NextResponse.json({ success: true, data: allStats });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// POST/UPDATE stats for a section
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { section, stats } = body;

    if (!section || !stats) {
      return NextResponse.json(
        { success: false, error: 'Section and stats are required' },
        { status: 400 }
      );
    }

    const updatedStats = await SiteStats.findOneAndUpdate(
      { section },
      { section, stats, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: updatedStats });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// DELETE stats for a section
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    if (!section) {
      return NextResponse.json(
        { success: false, error: 'Section is required' },
        { status: 400 }
      );
    }

    await SiteStats.findOneAndDelete({ section });
    return NextResponse.json({ success: true, message: 'Stats deleted' });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
