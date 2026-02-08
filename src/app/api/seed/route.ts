import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';

export async function GET(req: NextRequest) {
  try {
    // In production, require a secret to run seeding
    if (process.env.NODE_ENV === 'production') {
      const allowed = process.env.SEED_SECRET;
      if (!allowed) {
        return NextResponse.json({ success: false, error: 'Seeding disabled in production' }, { status: 403 });
      }
      const secret = req.nextUrl.searchParams.get('secret');
      if (secret !== allowed) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
      }
    }

    await seedDatabase();
    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully with realistic content!' 
    });
  } catch (error: unknown) {
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message 
    }, { status: 500 });
  }
}
