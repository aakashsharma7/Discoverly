import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, location, radius = 5000, category = 'restaurant' } = body;

    if (!query || !location) {
      return new Response(
        JSON.stringify({ error: 'Query and location are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&location=${location.lat},${location.lng}&radius=${radius}&type=${category}&key=${
        process.env.GOOGLE_MAPS_API_KEY
      }`
    );

    const data = await response.json();

    if (data.status !== 'OK') {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch results' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(data.results),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Search error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process search request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 