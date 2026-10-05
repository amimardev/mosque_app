import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { handleApiRequest } from './handlers.js';

export const apiRequestSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
  path: z.string().startsWith('/api/'),
  query: z.record(z.string(), z.string()).optional(),
  body: z.any().optional(),
});

export const apiRequestFn = createServerFn({ method: 'POST' })
  .validator(apiRequestSchema)
  .handler(async ({ data }) => {
    const { getRequestHeader, setResponseHeader } = await import('@tanstack/react-start/server');
    const { getSessionUserId } = await import('../session.js');
    const cookieHeader = getRequestHeader('cookie');
    return handleApiRequest(data, {
      cookieHeader,
      getSessionUserId,
      dispatch: async (request) => {
        const { apiRouter } = await import('../operations.js');
        return apiRouter.dispatch(request);
      },
      setResponseHeader,
    });
  });
