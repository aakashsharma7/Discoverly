import { NextResponse } from 'next/server';
import type { SearchFilters, Place } from '@/types';
import { searchRestaurants } from '@/services/google-places';
import { z } from 'zod';
import { apiError, logApiError } from '@/utils/apiHelpers';

export async function POST(request: Request) {
  try {
    // Input validation using Zod
    const filtersSchema = z.object({
      location: z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180)
      }),
      radius: z.number().min(0).max(50000).optional(),
      category: z.string().optional(),
      cuisine: z.string().optional(),
      query: z.string().optional(),
      mood: z.string().optional(),
      budget: z.object({ min: z.number(), max: z.number() }).optional()
    });
    const body = await request.json();
    const parseResult = filtersSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError({
        error: 'Invalid search filters',
        details: parseResult.error.errors.map(e => e.message).join(', '),
        status: 400
      });
    }
    const filters: SearchFilters = parseResult.data;
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
    logApiError('SearchAPI', error);
    return apiError({
      error: 'Failed to search places',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 