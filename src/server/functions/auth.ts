import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(async () => {
  const { getRequestHeader, setResponseHeader } = await import('@tanstack/react-start/server');
  const { getSessionUserId, readSessionToken, clearedSessionCookie } = await import('../session.js');
  const cookieHeader = getRequestHeader('cookie');
  const token = readSessionToken(cookieHeader);
  const userId = await getSessionUserId(cookieHeader);
  if (!userId) {
    if (token) setResponseHeader('Set-Cookie', clearedSessionCookie());
    return { user: null };
  }

  const { getFullUserProfile } = await import('../authService.js');
  const user = await getFullUserProfile(userId);
  if (!user) {
    setResponseHeader('Set-Cookie', clearedSessionCookie());
    return { user: null };
  }
  return { user };
});

export const loginFn = createServerFn({ method: 'POST' })
  .validator(z.object({ email: z.string().trim().email(), password: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { setResponseHeader } = await import('@tanstack/react-start/server');
    const { authenticateUser, getFullUserProfile } = await import('../authService.js');
    const { createAuthSession, sessionCookie } = await import('../session.js');
    const user = await authenticateUser(data.email, data.password);
    if (!user) return { success: false, user: null };

    const token = await createAuthSession(user.id);
    setResponseHeader('Set-Cookie', sessionCookie(token));
    return { success: true, user: await getFullUserProfile(user.id) };
  });

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const { getRequestHeader, setResponseHeader } = await import('@tanstack/react-start/server');
  const { destroyAuthSession, readSessionToken, clearedSessionCookie } = await import('../session.js');
  await destroyAuthSession(readSessionToken(getRequestHeader('cookie')));
  setResponseHeader('Set-Cookie', clearedSessionCookie());
  return { success: true };
});
