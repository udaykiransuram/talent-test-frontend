import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import TalentTestConfig from '@/models/TalentTestConfig';

// GET talent test configuration
export async function GET() {
  try {
    await connectDB();
    let config = await TalentTestConfig.findOne();
    
    // Create default config if none exists
    if (!config) {
      config = await TalentTestConfig.create({});
    }

    return NextResponse.json({ success: true, data: config });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// PUT update talent test configuration
export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    let config = await TalentTestConfig.findOne();
    
    if (!config) {
      config = await TalentTestConfig.create(body);
    } else {
      config = await TalentTestConfig.findOneAndUpdate(
        {},
        body,
        { new: true, runValidators: true }
      );
    }

    return NextResponse.json({ success: true, data: config });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
