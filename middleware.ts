import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/session';
import NextAuth from 'next-auth';
import authConfig from './auth.config';

const protectedRoutes = ['/dashboard', '/settings'];
const unaccessibleWhenConnected = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { auth } = NextAuth(authConfig);
  const session = await getSession(auth);
  const isProtectedRoute = protectedRoutes.includes(pathname);

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (session && unaccessibleWhenConnected.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
