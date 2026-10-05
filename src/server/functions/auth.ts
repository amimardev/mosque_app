import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { handleGetCurrentUser, handleLogin, handleLogout } from './handlers.js';

export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(async () => {
  const { getRequestHeader, setResponseHeader } = await import('@tanstack/react-start/server');
  const { getSessionUserId, readSessionToken, clearedSessionCookie } = await import('../session.js');
  const cookieHeader = getRequestHeader('cookie');
  return handleGetCurrentUser(cookieHeader, {
    getSessionUserId,
    readSessionToken,
    getFullUserProfile: async (userId) => {
      const { getFullUserProfile } = await import('../authService.js');
      return getFullUserProfile(userId);
    },
    clearedSessionCookie,
    setResponseHeader,
  });
});

export const loginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1) });

export const loginFn = createServerFn({ method: 'POST' })
  .validator(loginSchema)
  .handler(async ({ data }) => {
    const { setResponseHeader } = await import('@tanstack/react-start/server');
    const { createAuthSession, sessionCookie } = await import('../session.js');
    const { authenticateUser, getFullUserProfile } = await import('../authService.js');
    return handleLogin(data, {
      authenticateUser,
      createAuthSession,
      sessionCookie,
      getFullUserProfile,
      setResponseHeader,
    });
  });

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const { getRequestHeader, setResponseHeader } = await import('@tanstack/react-start/server');
  const { destroyAuthSession, readSessionToken, clearedSessionCookie } = await import('../session.js');
  return handleLogout(getRequestHeader('cookie'), {
    destroyAuthSession,
    readSessionToken,
    clearedSessionCookie,
    setResponseHeader,
  });
});
