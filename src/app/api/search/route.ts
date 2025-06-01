import { NextResponse } from 'next/server';
import type { SearchFilters, Place } from '@/types';
import { searchRestaurants } from '@/services/google-places';

export async function POST(request: Request) {
  try {
    const filters: SearchFilters = await request.json();
    console.log('Search filters:', filters);

    // Validate required fields
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

    // Validate coordinate ranges
    if (filters.location.lat < -90 || filters.location.lat > 90) {
      return NextResponse.json(
        { success: false, error: 'Invalid latitude value' },
        { status: 400 }
      );
    }

    if (filters.location.lng < -180 || filters.location.lng > 180) {
      return NextResponse.json(
        { success: false, error: 'Invalid longitude value' },
        { status: 400 }
      );
    }

    // Validate radius
    if (filters.radius && (filters.radius < 0 || filters.radius > 50000)) {
      return NextResponse.json(
        { success: false, error: 'Radius must be between 0 and 50000 meters' },
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

    return NextResponse.json({ 
      success: true, 
      data: placesWithWeather,
      meta: {
        count: placesWithWeather.length,
        radius: filters.radius || 5000,
        location: filters.location,
      }
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to search places',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 