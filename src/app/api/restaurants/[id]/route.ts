import { NextRequest } from 'next/server';

type RouteParams = {
  params: {
    id: string;
  };
};

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const id = context.params.id;
    
    // Your existing logic here
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&fields=name,formatted_address,formatted_phone_number,website,rating,reviews,opening_hours,photos,price_level&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();

    if (!data.result) {
      return new Response(
        JSON.stringify({ error: 'Restaurant not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(data.result),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching restaurant details:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch restaurant details' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 