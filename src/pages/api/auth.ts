import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies }) => {
  const { pin, remember } = (await request.json()) as { pin: string; remember?: boolean };

  // PIN kodu Cloudflare env'den gelir. Dev ortamında fallback olarak "1234" kullanılır.
  let correctPin = '1234';
  try {
    const { env } = await import('cloudflare:workers');
    const cfEnv = env as unknown as Record<string, string>;
    if (cfEnv.APP_PIN) correctPin = cfEnv.APP_PIN;
  } catch {
    // Dev ortamı — fallback PIN kullanılır.
  }

  if (pin !== correctPin) {
    return new Response(JSON.stringify({ error: 'Yanlış PIN' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // "Beni Hatırla" seçiliyse 30 gün, değilse 24 saat
  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

  cookies.set('dgs_session', 'authenticated', {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge,
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
