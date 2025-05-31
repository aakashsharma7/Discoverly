import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Your existing logic here
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&fields=name,formatted_address,formatted_phone_number,website,rating,reviews,opening_hours,photos,price_level&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();

    if (!data.result) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data.result);
  } catch (error) {
    console.error('Error fetching restaurant details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurant details' },
      { status: 500 }
    );
  }
} 