import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import PricingPlan from '@/models/PricingPlan';

// GET single pricing plan
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const plan = await PricingPlan.findById(id);

    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Pricing plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: plan });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// UPDATE pricing plan
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const plan = await PricingPlan.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Pricing plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: plan });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// DELETE pricing plan
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const plan = await PricingPlan.findByIdAndDelete(id);

    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Pricing plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Pricing plan deleted' });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
