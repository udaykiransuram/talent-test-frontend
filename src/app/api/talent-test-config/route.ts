import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import TalentTestConfig from '@/models/TalentTestConfig';

// GET public talent test configuration
export async function GET() {
  try {
    await connectDB();
    let config = await TalentTestConfig.findOne({ isActive: true });
    
    if (!config) {
      // Return default config if none exists
      config = {
        name: 'Precision Baseline Assessment',
        description: 'Comprehensive diagnostic test to identify student strengths and areas for improvement',
        price: 100,
        currency: 'INR',
        duration: '45 minutes',
        subjects: ['Mathematics', 'Science', 'English'],
        features: [
          'Detailed diagnostic report',
          'Personalized learning recommendations',
          'Subject-wise performance analysis',
          'Instant results delivery via email',
        ],
        isActive: true,
      };
    }

    return NextResponse.json({ success: true, data: config });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
