import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import PricingPlan from '@/models/PricingPlan';

// GET all pricing plans
export async function GET() {
  try {
    await connectDB();
    const plans = await PricingPlan.find()
      .sort({ displayOrder: 1, createdAt: -1 });

    return NextResponse.json({ success: true, data: plans });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// POST new pricing plan
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const plan = await PricingPlan.create(body);
    return NextResponse.json({ success: true, data: plan }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
