export const NEON_AUTH_URL = process.env.NEON_AUTH_URL || 'https://ep-wandering-feather-b23gcf3j.neonauth.c-6.eu-central-1.aws.neon.tech/neondb/auth';

export const auth = {
  async handler(req: Request): Promise<Response> {
    try {
      const url = new URL(req.url);
      const path = url.pathname.replace(/^\/api\/auth/, '');
      const targetUrl = `${NEON_AUTH_URL}${path}${url.search}`;

      const headers = new Headers(req.headers);
      headers.delete('host');
      headers.delete('content-length');
      headers.delete('connection');
      headers.delete('transfer-encoding');
      headers.delete('content-encoding');
      headers.delete('accept-encoding');

      const body = ['GET', 'HEAD'].includes(req.method) ? undefined : await req.arrayBuffer();

      const res = await fetch(targetUrl, {
        method: req.method,
        headers,
        body,
        redirect: 'manual',
      });

      const resHeaders = new Headers(res.headers);
      return new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers: resHeaders,
      });
    } catch (err) {
      console.error('Neon Auth Proxy Error:', err);
      return new Response(
        JSON.stringify({ error: 'Auth service unavailable', message: err instanceof Error ? err.message : String(err) }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
};

export async function handleAuthProxy(c: any): Promise<Response> {
  return auth.handler(c.req.raw);
}

