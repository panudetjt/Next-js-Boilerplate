import type { NextFetchEvent, NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './libs/i18n-routing';

const handleI18nRouting = createMiddleware(routing);

// const isProtectedRoute = (request: NextRequest) => [
//   '/dashboard(.*)',
//   '/:locale/dashboard(.*)',
// ];

// const isAuthPage = (request: NextRequest) => [
//   '/sign-in(.*)',
//   '/:locale/sign-in(.*)',
//   '/sign-up(.*)',
//   '/:locale/sign-up(.*)',
// ];

export default async function middleware(
  request: NextRequest,
  _event: NextFetchEvent,
) {
  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
};
