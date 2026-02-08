import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import CaseStudy from '@/models/CaseStudy';

// GET all case studies
export async function GET() {
  try {
    await connectDB();
    const caseStudies = await CaseStudy.find()
      .sort({ displayOrder: 1, createdAt: -1 });

    return NextResponse.json({ success: true, data: caseStudies });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// POST new case study
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const caseStudy = await CaseStudy.create(body);
    return NextResponse.json({ success: true, data: caseStudy }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
