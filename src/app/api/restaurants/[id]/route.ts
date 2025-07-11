import { NextRequest, NextResponse } from 'next/server';
import { getRestaurantDetails } from '@/services/google-places';
import { z } from 'zod';
import { apiError, logApiError } from '@/utils/apiHelpers';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Input validation using Zod
  const idSchema = z.string().min(1, 'Restaurant ID is required');
  const parseResult = idSchema.safeParse(params.id);
  if (!parseResult.success) {
    return apiError({
      error: 'Invalid restaurant ID',
      details: parseResult.error.errors.map(e => e.message).join(', '),
      status: 400,
      requestId: request.headers.get('x-request-id') || null
    });
  }
  try {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      logApiError('ConfigError', new Error('Missing GOOGLE_MAPS_API_KEY'));
      return apiError({ error: 'API configuration error' });
    }

    const restaurant = await getRestaurantDetails(params.id);
    return NextResponse.json({ success: true, data: restaurant });
  } catch (error) {
    logApiError('RestaurantDetailsAPI', error, { params });
    return apiError({
      error: 'Failed to fetch restaurant details',
      details: error instanceof Error ? error.message : 'Unknown error',
      requestId: request.headers.get('x-request-id') || null
    });
  }
}
