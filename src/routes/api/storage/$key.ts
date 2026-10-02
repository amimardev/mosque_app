import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/storage/$key')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const { getSessionUserId } = await import('../../../server/session.js');
        const userId = await getSessionUserId(request.headers.get('cookie'));
        if (!userId) {
          return new Response('Unauthorized', {
            status: 401,
            headers: { 'Cache-Control': 'no-store' },
          });
        }

        const { getStorageImageResponse } = await import('../../../server/operations/storage.js');
        return getStorageImageResponse(params.key);
      },
    },
  },
});
