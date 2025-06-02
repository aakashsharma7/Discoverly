import { NextRequest, NextResponse } from 'next/server';
import { getRestaurantDetails } from '@/services/google-places';

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'API configuration error' },
        { status: 500 }
      );
    }

    const restaurant = await getRestaurantDetails(context.params.id);
    return NextResponse.json({ success: true, data: restaurant });
  } catch (error) {
    console.error('Restaurant details API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch restaurant details',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 