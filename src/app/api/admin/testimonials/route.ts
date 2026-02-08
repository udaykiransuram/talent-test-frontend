import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Testimonial from '@/models/Testimonial';

// GET testimonials (optionally filter by section)
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    const filter: Record<string, string> = {};
    if (section) filter.section = section;

    const testimonials = await Testimonial.find(filter)
      .sort({ displayOrder: 1, createdAt: -1 });

    return NextResponse.json({ success: true, data: testimonials });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// POST new testimonial
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const testimonial = await Testimonial.create(body);
    return NextResponse.json({ success: true, data: testimonial }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
