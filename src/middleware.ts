import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Login sayfası ve auth API'ye her zaman izin ver
  if (pathname === '/login' || pathname === '/api/auth') {
    return next();
  }

  // Static dosyalara izin ver
  if (pathname.startsWith('/_') || pathname.includes('.')) {
    return next();
  }

  // Session cookie kontrolü
  const session = context.cookies.get('dgs_session');
  if (!session || session.value !== 'authenticated') {
    return context.redirect('/login');
  }

  return next();
});
