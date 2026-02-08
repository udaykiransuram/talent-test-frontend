import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import CaseStudy from '@/models/CaseStudy';

// GET single case study
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const caseStudy = await CaseStudy.findById(id);

    if (!caseStudy) {
      return NextResponse.json(
        { success: false, error: 'Case study not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: caseStudy });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// UPDATE case study
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const caseStudy = await CaseStudy.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!caseStudy) {
      return NextResponse.json(
        { success: false, error: 'Case study not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: caseStudy });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// DELETE case study
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const caseStudy = await CaseStudy.findByIdAndDelete(id);

    if (!caseStudy) {
      return NextResponse.json(
        { success: false, error: 'Case study not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Case study deleted' });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
