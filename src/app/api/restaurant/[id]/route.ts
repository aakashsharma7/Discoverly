import { NextResponse } from 'next/server';
import { getRestaurantDetails } from '@/services/google-places';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const restaurant = await getRestaurantDetails(params.id);
    return NextResponse.json({ success: true, data: restaurant });
  } catch (error) {
    console.error('Restaurant details API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch restaurant details' },
      { status: 500 }
    );
  }
} 