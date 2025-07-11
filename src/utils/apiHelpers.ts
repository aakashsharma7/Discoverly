import { NextResponse } from 'next/server';

/**
 * Returns a standardized error response for API routes.
 */
export function apiError({
  error,
  details,
  status = 500,
  requestId,
}: {
  error: string;
  details?: string;
  status?: number;
  requestId?: string | null;
}) {
  return NextResponse.json(
    {
      success: false,
      error,
      details,
      timestamp: new Date().toISOString(),
      requestId: requestId || null,
    },
    { status }
  );
}

/**
 * Logs errors in a structured way for debugging.
 */
export function logApiError(context: string, error: unknown, extra?: Record<string, unknown>) {
  console.error(`[${context}]`, {
    error: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
    ...extra,
  });
} 