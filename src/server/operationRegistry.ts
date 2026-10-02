export type OperationRequest = {
  method: string;
  path: string;
  query?: Record<string, string>;
  body?: unknown;
  cookieHeader?: string;
  sessionId?: string | null;
};

type RouteHandler = (context: any) => unknown | Promise<unknown>;

export type ApiEnvelope = {
  __apiEnvelope: true;
  status: number;
  body: any;
  headers: Record<string, string>;
  bodyEncoding?: 'base64';
};

type RouteDefinition = { method: string; path: string; handler: RouteHandler };

export class OperationRegistry {
  private routes: RouteDefinition[] = [];

  get(path: string, handler: RouteHandler) { this.register('GET', path, handler); }
  post(path: string, handler: RouteHandler) { this.register('POST', path, handler); }
  put(path: string, handler: RouteHandler) { this.register('PUT', path, handler); }
  delete(path: string, handler: RouteHandler) { this.register('DELETE', path, handler); }

  route(prefix: string, router: OperationRegistry) {
    for (const route of router.routes) {
      this.routes.push({ ...route, path: joinPath(prefix, route.path) });
    }
  }

  private register(method: string, path: string, handler: RouteHandler) {
    this.routes.push({ method, path: normalizePath(path), handler });
  }

  async dispatch(input: OperationRequest): Promise<ApiEnvelope> {
    const path = normalizePath(input.path);
    for (const route of this.routes) {
      if (route.method !== input.method.toUpperCase()) continue;
      const params = matchPath(route.path, path);
      if (!params) continue;

      const responseHeaders: Record<string, string> = {};
      const request = {
        raw: new Request(`http://start.local${path}`),
        param: (name: string) => params[name],
        query: (name: string) => input.query?.[name],
        header: (name: string) => name.toLowerCase() === 'cookie' ? input.cookieHeader : undefined,
        json: async () => input.body ?? {},
        parseBody: async () => input.body ?? {},
      };
      const context = {
        req: request,
        sessionId: input.sessionId ?? null,
        header: (name: string, value: string) => { responseHeaders[name] = value; },
        json: (body: unknown, status = 200) => envelope(status, body, responseHeaders),
        body: (body: unknown, status = 200) => envelope(
          status,
          Buffer.isBuffer(body) ? Buffer.from(body).toString('base64') : body,
          responseHeaders,
          Buffer.isBuffer(body) ? 'base64' : undefined,
        ),
      };

      try {
        const result = await route.handler(context);
        if (isEnvelope(result)) return { ...result, headers: { ...responseHeaders, ...result.headers } };
        return envelope(200, result, responseHeaders);
      } catch (error) {
        console.error('[SERVER FUNCTION OPERATION ERROR]', error);
        return envelope(500, {
          error: error instanceof Error ? error.message : 'Internal Server Error',
        }, responseHeaders);
      }
    }
    return envelope(404, { error: 'Not found' }, {});
  }
}

export function envelope(status: number, body: any, headers: Record<string, string>, bodyEncoding?: 'base64'): ApiEnvelope {
  return { __apiEnvelope: true, status, body, headers: { ...headers }, ...(bodyEncoding ? { bodyEncoding } : {}) };
}

function isEnvelope(value: unknown): value is ApiEnvelope {
  return !!value && typeof value === 'object' && (value as ApiEnvelope).__apiEnvelope === true;
}

function normalizePath(path: string) {
  const trimmed = `/${path}`.replace(/\/+/g, '/').replace(/\/$/, '');
  return trimmed || '/';
}

function joinPath(prefix: string, path: string) {
  const child = path === '/' ? '' : path;
  return normalizePath(`${prefix}/${child}`);
}

function matchPath(pattern: string, actual: string): Record<string, string> | null {
  const expected = normalizePath(pattern).split('/').filter(Boolean);
  const received = normalizePath(actual).split('/').filter(Boolean);
  if (expected.length !== received.length) return null;
  const params: Record<string, string> = {};
  for (let index = 0; index < expected.length; index++) {
    const part = expected[index];
    if (part.startsWith(':')) {
      try { params[part.slice(1)] = decodeURIComponent(received[index]); }
      catch { return null; }
    } else if (part !== received[index]) {
      return null;
    }
  }
  return params;
}
