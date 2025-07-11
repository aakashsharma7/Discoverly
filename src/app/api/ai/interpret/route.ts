import { NextResponse } from 'next/server';
import { SearchFilters } from '@/types';
import { z } from 'zod';
import { apiError, logApiError } from '@/utils/apiHelpers';

// Simple parser for natural language queries
const parseQuery = (query: string): SearchFilters => {
  const lowerQuery = query.toLowerCase();
  
  // Default filters
  const filters: SearchFilters = {
    query: query,
    radius: 5000,
    budget: { min: 0, max: 4 },
    category: 'restaurant',
    mood: 'any'
  };

  // Parse budget
  if (lowerQuery.includes('cheap') || lowerQuery.includes('budget')) {
    filters.budget = { min: 0, max: 2 };
  } else if (lowerQuery.includes('expensive') || lowerQuery.includes('luxury')) {
    filters.budget = { min: 3, max: 4 };
  }

  // Parse cuisine
  const cuisines = ['italian', 'chinese', 'japanese', 'indian', 'mexican', 'thai', 'vietnamese'];
  for (const cuisine of cuisines) {
    if (lowerQuery.includes(cuisine)) {
      filters.cuisine = cuisine;
      break;
    }
  }

  // Parse radius
  if (lowerQuery.includes('nearby') || lowerQuery.includes('close')) {
    filters.radius = 2000;
  } else if (lowerQuery.includes('far')) {
    filters.radius = 10000;
  }

  return filters;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Input validation using Zod
    const querySchema = z.object({ query: z.string().min(1, 'Query is required') });
    const parseResult = querySchema.safeParse(body);
    if (!parseResult.success) {
      return apiError({
        error: 'Invalid query',
        details: parseResult.error.errors.map(e => e.message).join(', '),
        status: 400
      });
    }
    const { query } = parseResult.data;

    // Use the simple parser
    const filters = parseQuery(query);
    return NextResponse.json({ success: true, filters });
  } catch (error) {
    logApiError('QueryInterpretation', error);
    return apiError({ error: 'Failed to interpret query' });
  }
} 