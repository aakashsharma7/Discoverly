import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const RATE_LIMIT = 60; // requests per minute
const ipCache = new Map<string, { count: number; last: number }>();

export function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const entry = ipCache.get(ip) || { count: 0, last: now };
  if (now - entry.last > 60_000) {
    entry.count = 1;
    entry.last = now;
  } else {
    entry.count++;
  }
  ipCache.set(ip, entry);
  if (entry.count > RATE_LIMIT) {
    return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
}; 