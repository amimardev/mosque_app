import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { envelope, type ApiEnvelope } from '../operationRegistry.js';

const requestSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
  path: z.string().startsWith('/api/'),
  query: z.record(z.string(), z.string()).optional(),
  body: z.any().optional(),
});

function isPublicRequest(path: string) {
  return path === '/api/prayer-times' || path === '/api/quran/surahs';
}

export const apiRequestFn = createServerFn({ method: 'POST' })
  .validator(requestSchema)
  .handler(async ({ data }): Promise<ApiEnvelope> => {
    const { getRequestHeader, setResponseHeader } = await import('@tanstack/react-start/server');
    const { getSessionUserId } = await import('../session.js');
    const cookieHeader = getRequestHeader('cookie');
    const sessionId = await getSessionUserId(cookieHeader);

    if (!isPublicRequest(data.path) && !sessionId) {
      return envelope(401, { error: 'غير مصرح بالدخول، يرجى تسجيل الدخول أولاً' }, {});
    }

    const { apiRouter } = await import('../operations.js');
    const result = await apiRouter.dispatch({
      method: data.method,
      path: data.path,
      query: data.query,
      body: data.body,
      cookieHeader,
      sessionId,
    });

    for (const [name, value] of Object.entries(result.headers)) {
      setResponseHeader(name, value);
    }
    return result;
  });
