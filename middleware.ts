import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Redirect .well-known/farcaster.json to API route
  if (request.nextUrl.pathname === '/.well-known/farcaster.json') {
    return NextResponse.rewrite(new URL('/api/farcaster-manifest', request.url));
  }
}

export const config = {
  matcher: '/.well-known/farcaster.json',
};
