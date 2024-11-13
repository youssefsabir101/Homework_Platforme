/* import { NextResponse } from 'next/server';

export function middleware(request) {

};
 */

import { NextResponse } from 'next/server';

export function middleware(request) {
  const role = request.cookies.get('role')?.value;
  const path = request.nextUrl.pathname;

  // Protect teacher and student routes
  if (path.startsWith('/teacher') && role !== 'teacher') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (path.startsWith('/student') && role !== 'student') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/teacher/:path*', '/student/:path*'],
};
