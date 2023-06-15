import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const [AUTH_USER, AUTH_PASS] = (process.env.HTTP_BASIC_AUTH || ':').split(':');

// Step 1. HTTP Basic Auth Middleware for Challenge
export function middleware(req: NextRequest) {
  const auth = isAuthenticated(req);

  if (!auth) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic' },
    });
  }

  const response = NextResponse.next();
  response.headers.set('x-user', auth);
  return response;
}

// Step 2. Check HTTP Basic Auth header if present
function isAuthenticated(req: NextRequest) {
  const authheader =
    req.headers.get('authorization') || req.headers.get('Authorization');

  if (!authheader) {
    return false;
  }

  const encodedCredentials = authheader.split(' ')[1];
  const decodedCredentials = atob(encodedCredentials);
  const auth = decodedCredentials.split(':');

  const user = auth[0];
  const pass = auth[1];

  if (user == AUTH_USER && pass == AUTH_PASS) {
    return user;
  } else {
    return false;
  }
}

// Step 3. Configure "Matching Paths" below to protect routes with HTTP Basic Auth
export const config = {
  matcher: '/:path*',
};
