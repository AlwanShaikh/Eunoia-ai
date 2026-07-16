import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper function to get cookie value
function getCookieValue(cookies: string, name: string): string | undefined {
  const cookie = cookies.split(';').find(c => c.trim().startsWith(`${name}=`));
  return cookie?.split('=')[1];
}

export function proxy(request: NextRequest) {
  const token = getCookieValue(request.headers.get('cookie') || '', 'eunoia_token');
  
  // Define protected routes
  const protectedRoutes = ['/chat', '/mood', '/settings'];
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  // Define public routes
  const publicRoutes = ['/login', '/signup'];
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Redirect to chat if accessing public routes while logged in
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/chat', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/chat/:path*',
    '/mood/:path*',
    '/settings/:path*',
    '/login',
    '/signup',
  ],
};