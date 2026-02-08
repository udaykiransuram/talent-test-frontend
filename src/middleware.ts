import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basic Auth middleware to protect /admin UI and /api/admin routes in production
export function middleware(req: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next();
  }

  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASS;

  // If creds are not configured, deny access in production
  if (!user || !pass) {
    return unauthorized();
  }

  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Basic ')) {
    return unauthorized();
  }

  const [, encoded] = auth.split(' ');
  try {
    // Middleware runs on the Edge runtime; use atob for base64 decoding
    const decoded = atob(encoded);
    const [u, p] = decoded.split(':');
    if (u === user && p === pass) {
      return NextResponse.next();
    }
    return unauthorized();
  } catch {
    return unauthorized();
  }
}

function unauthorized() {
  const res = new NextResponse('Unauthorized', { status: 401 });
  res.headers.set('WWW-Authenticate', 'Basic realm="Admin Area"');
  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
