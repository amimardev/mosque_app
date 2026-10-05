import type { ApiEnvelope, OperationRequest } from '../operationRegistry.js';

type ResponseHeaderSetter = (name: string, value: string) => void;

export type ApiFunctionInput = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  query?: Record<string, string>;
  body?: unknown;
};

export async function handleApiRequest(
  data: ApiFunctionInput,
  deps: {
    cookieHeader?: string;
    getSessionUserId: (cookieHeader?: string) => Promise<string | null>;
    dispatch: (request: OperationRequest) => Promise<ApiEnvelope>;
    setResponseHeader: ResponseHeaderSetter;
  },
): Promise<ApiEnvelope> {
  const sessionId = await deps.getSessionUserId(deps.cookieHeader);
  const isPublicRequest = data.path === '/api/prayer-times' || data.path === '/api/quran/surahs';

  if (!isPublicRequest && !sessionId) {
    return {
      __apiEnvelope: true,
      status: 401,
      body: { error: 'غير مصرح بالدخول، يرجى تسجيل الدخول أولاً' },
      headers: {},
    };
  }

  const result = await deps.dispatch({
    method: data.method,
    path: data.path,
    query: data.query,
    body: data.body,
    cookieHeader: deps.cookieHeader,
    sessionId,
  });

  for (const [name, value] of Object.entries(result.headers)) {
    deps.setResponseHeader(name, value);
  }
  return result;
}

export async function handleGetCurrentUser<UserProfile>(
  cookieHeader: string | undefined,
  deps: {
    readSessionToken: (cookieHeader?: string | null) => string | null;
    getSessionUserId: (cookieHeader?: string | null) => Promise<string | null>;
    getFullUserProfile: (userId: string) => Promise<UserProfile | null>;
    clearedSessionCookie: () => string;
    setResponseHeader: ResponseHeaderSetter;
  },
) {
  const token = deps.readSessionToken(cookieHeader);
  const userId = await deps.getSessionUserId(cookieHeader);
  if (!userId) {
    if (token) deps.setResponseHeader('Set-Cookie', deps.clearedSessionCookie());
    return { user: null };
  }

  const user = await deps.getFullUserProfile(userId);
  if (!user) {
    deps.setResponseHeader('Set-Cookie', deps.clearedSessionCookie());
    return { user: null };
  }
  return { user };
}

export async function handleLogin<UserProfile>(
  data: { email: string; password: string },
  deps: {
    authenticateUser: (email: string, password: string) => Promise<{ id: string } | null>;
    createAuthSession: (userId: string) => Promise<string>;
    sessionCookie: (token: string) => string;
    getFullUserProfile: (userId: string) => Promise<UserProfile | null>;
    setResponseHeader: ResponseHeaderSetter;
  },
) {
  const user = await deps.authenticateUser(data.email, data.password);
  if (!user) return { success: false, user: null };

  const token = await deps.createAuthSession(user.id);
  deps.setResponseHeader('Set-Cookie', deps.sessionCookie(token));
  return { success: true, user: await deps.getFullUserProfile(user.id) };
}

export async function handleLogout(
  cookieHeader: string | undefined,
  deps: {
    readSessionToken: (cookieHeader?: string | null) => string | null;
    destroyAuthSession: (token: string | null) => Promise<void>;
    clearedSessionCookie: () => string;
    setResponseHeader: ResponseHeaderSetter;
  },
) {
  await deps.destroyAuthSession(deps.readSessionToken(cookieHeader));
  deps.setResponseHeader('Set-Cookie', deps.clearedSessionCookie());
  return { success: true };
}
