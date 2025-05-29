import { NextResponse } from 'next/server';
import { SearchFilters, Place } from '@/types';
import { searchRestaurants } from '@/services/google-places';

export async function POST(request: Request) {
  try {
    const filters: SearchFilters = await request.json();
    console.log('Search filters:', filters);

    if (!filters) {
      return NextResponse.json(
        { success: false, error: 'Search filters are required' },
        { status: 400 }
      );
    }

    if (!filters.location?.lat || !filters.location?.lng) {
      return NextResponse.json(
        { success: false, error: 'Location coordinates are required' },
        { status: 400 }
      );
    }

    const restaurants = await searchRestaurants(
      filters.location.lat,
      filters.location.lng,
      filters.radius || 5000,
      filters.category === 'restaurant' ? filters.cuisine : undefined
    );
    console.log('Restaurants found:', restaurants);

    // Add weather data to each restaurant
    const placesWithWeather = restaurants.map(place => ({
      ...place,
      weather: {
        condition: 'Sunny', // This would come from a weather API in a real app
        temperature: 25,
        humidity: 65,
      },
    }));
    console.log('Places with weather:', placesWithWeather);

    return NextResponse.json({ success: true, data: placesWithWeather });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search places' },
      { status: 500 }
    );
  }
} 