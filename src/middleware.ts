import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // If the request is for an auth route, redirect to dashboard
  if (isAuthRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

// Auth routes that should not be accessible
function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith('/auth/');
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 