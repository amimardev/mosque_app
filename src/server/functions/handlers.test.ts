import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { test } from 'node:test';
import { eq } from 'drizzle-orm';
import 'dotenv/config';
import { apiRequestSchema } from './api.js';
import { loginSchema } from './auth.js';
import {
  handleApiRequest,
  handleGetCurrentUser,
  handleLogin,
  handleLogout,
} from './handlers.js';

const testDatabaseUrl = process.env.DATABASE_URL_TEST;
if (!testDatabaseUrl) {
  throw new Error('DATABASE_URL_TEST must be set before running the server-function tests.');
}
if (process.env.DATABASE_URL && process.env.DATABASE_URL === testDatabaseUrl) {
  throw new Error('DATABASE_URL_TEST must point to a separate test database.');
}
// Ensure all lazily imported database modules can only connect to the test DB.
process.env.DATABASE_URL = testDatabaseUrl;

test('apiRequestFn validates its request shape', () => {
  assert.equal(apiRequestSchema.safeParse({ method: 'GET', path: '/api/students' }).success, true);
  assert.equal(apiRequestSchema.safeParse({ method: 'PATCH', path: '/api/students' }).success, false);
  assert.equal(apiRequestSchema.safeParse({ method: 'GET', path: '/students' }).success, false);
});

test('apiRequestFn allows its public endpoints without a session', async () => {
  const dispatched: unknown[] = [];
  const headers: Array<[string, string]> = [];
  const result = await handleApiRequest({ method: 'GET', path: '/api/quran/surahs' }, {
    cookieHeader: undefined,
    getSessionUserId: async () => null,
    dispatch: async (request) => {
      dispatched.push(request);
      return { __apiEnvelope: true, status: 200, body: { surahs: [] }, headers: {} };
    },
    setResponseHeader: (name, value) => headers.push([name, value]),
  });

  assert.equal(result.status, 200);
  assert.deepEqual(result.body, { surahs: [] });
  assert.equal(dispatched.length, 1);
  assert.deepEqual(headers, []);
});

test('apiRequestFn rejects private requests without a session and skips dispatch', async () => {
  let dispatchCalled = false;
  const result = await handleApiRequest({ method: 'GET', path: '/api/students' }, {
    cookieHeader: 'madrasa_session=expired-token',
    getSessionUserId: async (cookie) => {
      assert.equal(cookie, 'madrasa_session=expired-token');
      return null;
    },
    dispatch: async () => {
      dispatchCalled = true;
      throw new Error('must not dispatch');
    },
    setResponseHeader: () => assert.fail('unauthorized response must not set headers'),
  });

  assert.equal(result.status, 401);
  assert.match(result.body.error, /غير مصرح/);
  assert.equal(dispatchCalled, false);
});

test('apiRequestFn forwards the authenticated request and response headers', async () => {
  let dispatched: Record<string, unknown> | undefined;
  const responseHeaders: Array<[string, string]> = [];
  const expected = { __apiEnvelope: true as const, status: 201, body: { saved: true }, headers: { 'X-Request-Id': 'req-1' } };
  const result = await handleApiRequest({
    method: 'POST',
    path: '/api/students',
    query: { search: 'amina' },
    body: { name: 'Amina' },
  }, {
    cookieHeader: 'madrasa_session=valid-token',
    getSessionUserId: async () => 'user-parent-1',
    dispatch: async (request) => {
      dispatched = request;
      return expected;
    },
    setResponseHeader: (name, value) => responseHeaders.push([name, value]),
  });

  assert.deepEqual(dispatched, {
    method: 'POST',
    path: '/api/students',
    query: { search: 'amina' },
    body: { name: 'Amina' },
    cookieHeader: 'madrasa_session=valid-token',
    sessionId: 'user-parent-1',
  });
  assert.equal(result, expected);
  assert.deepEqual(responseHeaders, [['X-Request-Id', 'req-1']]);
});

test('getCurrentUserFn returns null without clearing a missing cookie', async () => {
  const setCookies: string[] = [];
  const result = await handleGetCurrentUser(undefined, {
    readSessionToken: () => null,
    getSessionUserId: async () => null,
    getFullUserProfile: async () => assert.fail('profile lookup must not run'),
    clearedSessionCookie: () => 'madrasa_session=; Max-Age=0',
    setResponseHeader: (name, value) => {
      assert.equal(name, 'Set-Cookie');
      setCookies.push(value);
    },
  });

  assert.deepEqual(result, { user: null });
  assert.deepEqual(setCookies, []);
});

test('getCurrentUserFn clears an invalid session cookie', async () => {
  const setCookies: string[] = [];
  const result = await handleGetCurrentUser('madrasa_session=expired', {
    readSessionToken: () => 'expired',
    getSessionUserId: async () => null,
    getFullUserProfile: async () => assert.fail('profile lookup must not run'),
    clearedSessionCookie: () => 'madrasa_session=; HttpOnly; Max-Age=0',
    setResponseHeader: (_name, value) => setCookies.push(value),
  });

  assert.deepEqual(result, { user: null });
  assert.deepEqual(setCookies, ['madrasa_session=; HttpOnly; Max-Age=0']);
});

test('getCurrentUserFn returns the profile for a valid session', async () => {
  const profile = { id: 'user-parent-1', role: 'parent' };
  const setCookies: string[] = [];
  const result = await handleGetCurrentUser('madrasa_session=valid', {
    readSessionToken: () => 'valid',
    getSessionUserId: async () => 'user-parent-1',
    getFullUserProfile: async (userId) => {
      assert.equal(userId, 'user-parent-1');
      return profile;
    },
    clearedSessionCookie: () => 'cleared',
    setResponseHeader: (_name, value) => setCookies.push(value),
  });

  assert.deepEqual(result, { user: profile });
  assert.deepEqual(setCookies, []);
});

test('loginFn validates credentials before its handler runs', () => {
  assert.equal(loginSchema.safeParse({ email: ' parent@example.com ', password: 'secret' }).success, true);
  assert.equal(loginSchema.safeParse({ email: 'not-an-email', password: 'secret' }).success, false);
  assert.equal(loginSchema.safeParse({ email: 'parent@example.com', password: '' }).success, false);
});

test('loginFn returns failure and does not create a session for invalid credentials', async () => {
  let sessionCreated = false;
  const result = await handleLogin({ email: 'parent@example.com', password: 'wrong' }, {
    authenticateUser: async () => null,
    createAuthSession: async () => {
      sessionCreated = true;
      return 'should-not-exist';
    },
    sessionCookie: () => 'should-not-be-set',
    getFullUserProfile: async () => assert.fail('profile lookup must not run'),
    setResponseHeader: () => assert.fail('failed login must not set a cookie'),
  });

  assert.deepEqual(result, { success: false, user: null });
  assert.equal(sessionCreated, false);
});

test('loginFn creates a session, sets its cookie, and returns the profile', async () => {
  const profile = { id: 'user-parent-1', role: 'parent' };
  const calls: string[] = [];
  const result = await handleLogin({ email: 'parent@example.com', password: 'correct' }, {
    authenticateUser: async (email, password) => {
      assert.equal(email, 'parent@example.com');
      assert.equal(password, 'correct');
      calls.push('authenticated');
      return { id: 'user-parent-1' };
    },
    createAuthSession: async (userId) => {
      assert.equal(userId, 'user-parent-1');
      calls.push('session-created');
      return 'session-token';
    },
    sessionCookie: (token) => `madrasa_session=${token}; HttpOnly; SameSite=Lax`,
    getFullUserProfile: async (userId) => {
      assert.equal(userId, 'user-parent-1');
      calls.push('profile-loaded');
      return profile;
    },
    setResponseHeader: (name, value) => {
      assert.equal(name, 'Set-Cookie');
      calls.push(value);
    },
  });

  assert.deepEqual(result, { success: true, user: profile });
  assert.deepEqual(calls, [
    'authenticated',
    'session-created',
    'madrasa_session=session-token; HttpOnly; SameSite=Lax',
    'profile-loaded',
  ]);
});

test('logoutFn destroys the current session and clears the HttpOnly cookie', async () => {
  const destroyedTokens: Array<string | null> = [];
  const setCookies: string[] = [];
  const result = await handleLogout('madrasa_session=valid-token', {
    readSessionToken: () => 'valid-token',
    destroyAuthSession: async (token) => { destroyedTokens.push(token); },
    clearedSessionCookie: () => 'madrasa_session=; Path=/; HttpOnly; Max-Age=0',
    setResponseHeader: (name, value) => {
      assert.equal(name, 'Set-Cookie');
      setCookies.push(value);
    },
  });

  assert.deepEqual(result, { success: true });
  assert.deepEqual(destroyedTokens, ['valid-token']);
  assert.deepEqual(setCookies, ['madrasa_session=; Path=/; HttpOnly; Max-Age=0']);
});

test('server functions complete a real parent login, API request, current-user read, and logout against DATABASE_URL_TEST', async () => {
  const [database, schema, init, authService, session, operations] = await Promise.all([
    import('../../db/index.js'),
    import('../../db/schema.js'),
    import('../../db/init.js'),
    import('../authService.js'),
    import('../session.js'),
    import('../operations.js'),
  ]);
  await init.ensureDatabaseInitialized();

  const id = randomUUID();
  const userId = `test_user_${id}`;
  const parentId = `test_parent_${id}`;
  const email = `server-function-test-${id}@example.test`;
  const insertedNotificationId = `test_notification_${id}`;
  let userInserted = false;

  try {
    await database.db.insert(schema.users).values({
      id: userId,
      name: 'Test Parent',
      email,
      password: await authService.hashPassword('test-password-123'),
      role: 'parent',
    });
    userInserted = true;
    await database.db.insert(schema.parents).values({
      id: parentId,
      name: 'Test Parent',
      phone: '+10000000000',
      userId,
    });
    await database.db.insert(schema.notifications).values({
      id: insertedNotificationId,
      userId,
      type: 'attendance_absent',
      title: 'اختبار الغياب',
      message: 'اختبار إشعار ولي الأمر',
      href: '/dashboard/sessions',
    });

    const loginHeaders: Array<[string, string]> = [];
    const login = await handleLogin({ email, password: 'test-password-123' }, {
      authenticateUser: authService.authenticateUser,
      createAuthSession: session.createAuthSession,
      sessionCookie: session.sessionCookie,
      getFullUserProfile: authService.getFullUserProfile,
      setResponseHeader: (name, value) => loginHeaders.push([name, value]),
    });
    assert.equal(login.success, true);
    assert.equal(login.user?.id, userId);
    assert.equal(login.user?.role, 'parent');
    const setCookie = loginHeaders.find(([name]) => name === 'Set-Cookie')?.[1];
    assert.ok(setCookie);
    assert.match(setCookie, /HttpOnly/);
    assert.match(setCookie, /SameSite=Lax/);
    const cookieHeader = setCookie.split(';', 1)[0];

    const currentUserHeaders: Array<[string, string]> = [];
    const currentUser = await handleGetCurrentUser(cookieHeader, {
      readSessionToken: session.readSessionToken,
      getSessionUserId: session.getSessionUserId,
      getFullUserProfile: authService.getFullUserProfile,
      clearedSessionCookie: session.clearedSessionCookie,
      setResponseHeader: (name, value) => currentUserHeaders.push([name, value]),
    });
    assert.equal(currentUser.user?.id, userId);
    assert.equal(currentUserHeaders.length, 0);

    const apiHeaders: Array<[string, string]> = [];
    const apiResult = await handleApiRequest({ method: 'GET', path: '/api/notifications' }, {
      cookieHeader,
      getSessionUserId: session.getSessionUserId,
      dispatch: (request) => operations.apiRouter.dispatch(request),
      setResponseHeader: (name, value) => apiHeaders.push([name, value]),
    });
    assert.equal(apiResult.status, 200);
    assert.equal(apiResult.body.unreadCount, 1);
    assert.equal(apiResult.body.notifications[0].id, insertedNotificationId);

    const logoutHeaders: Array<[string, string]> = [];
    const logout = await handleLogout(cookieHeader, {
      readSessionToken: session.readSessionToken,
      destroyAuthSession: session.destroyAuthSession,
      clearedSessionCookie: session.clearedSessionCookie,
      setResponseHeader: (name, value) => logoutHeaders.push([name, value]),
    });
    assert.deepEqual(logout, { success: true });
    assert.match(logoutHeaders[0]?.[1] || '', /HttpOnly/);
    assert.match(logoutHeaders[0]?.[1] || '', /Max-Age=0/);
    assert.equal(await session.getSessionUserId(cookieHeader), null);
  } finally {
    if (userInserted) {
      await database.db.delete(schema.notifications).where(eq(schema.notifications.userId, userId));
      await database.db.delete(schema.parents).where(eq(schema.parents.id, parentId));
      await database.db.delete(schema.users).where(eq(schema.users.id, userId));
    }
  }
});

test('apiRequestFn records absent attendance, creates the in-app notification, and targets that parent in OneSignal', async () => {
  const [database, schema, init, session, operations] = await Promise.all([
    import('../../db/index.js'),
    import('../../db/schema.js'),
    import('../../db/init.js'),
    import('../session.js'),
    import('../operations.js'),
  ]);
  await init.ensureDatabaseInitialized();

  const id = randomUUID();
  const adminId = `test_admin_${id}`;
  const parentUserId = `test_parent_user_${id}`;
  const parentId = `test_parent_profile_${id}`;
  const groupTypeId = `test_group_type_${id}`;
  const groupId = `test_group_${id}`;
  const studentId = `test_student_${id}`;
  const sessionId = `test_session_${id}`;
  let sessionCookieHeader = '';
  const originalFetch = globalThis.fetch;
  const originalEnv = {
    appId: process.env.ONESIGNAL_APP_ID,
    apiKey: process.env.ONESIGNAL_REST_API_KEY,
    appUrl: process.env.APP_URL,
  };
  let fetchCalls = 0;
  let adminCreated = false;

  try {
    await database.db.insert(schema.users).values({
      id: adminId,
      name: 'Test Admin',
      email: `server-function-admin-${id}@example.test`,
      password: null,
      role: 'admin',
    });
    adminCreated = true;
    await database.db.insert(schema.users).values({
      id: parentUserId,
      name: 'Test Push Parent',
      email: `server-function-parent-${id}@example.test`,
      password: null,
      role: 'parent',
    });
    await database.db.insert(schema.parents).values({
      id: parentId,
      name: 'Test Push Parent',
      phone: '+10000000001',
      userId: parentUserId,
    });
    await database.db.insert(schema.groupTypes).values({
      id: groupTypeId,
      name: `Test Type ${id}`,
      slug: `test-type-${id}`,
    });
    await database.db.insert(schema.groups).values({
      id: groupId,
      number: 987654,
      typeId: groupTypeId,
      studyTime: 'Test time',
    });
    await database.db.insert(schema.students).values({
      id: studentId,
      name: 'Test Student',
      avatar: '/logo.png',
      parentId,
      groupId,
    });
    await database.db.insert(schema.sessions).values({
      id: sessionId,
      groupId,
      date: '2026-10-05',
    });

    const token = await session.createAuthSession(adminId);
    sessionCookieHeader = `madrasa_session=${encodeURIComponent(token)}`;
    process.env.ONESIGNAL_APP_ID = 'onesignal-test-app';
    process.env.ONESIGNAL_REST_API_KEY = 'onesignal-test-secret';
    process.env.APP_URL = 'https://mosque-test.example';
    globalThis.fetch = async (input, init) => {
      if (String(input) !== 'https://api.onesignal.com/notifications') {
        return originalFetch(input, init);
      }
      fetchCalls += 1;
      assert.equal(String(input), 'https://api.onesignal.com/notifications');
      assert.equal(new Headers(init?.headers).get('authorization'), 'Key onesignal-test-secret');
      const payload = JSON.parse(String(init?.body));
      assert.equal(payload.app_id, 'onesignal-test-app');
      assert.equal(payload.target_channel, 'push');
      assert.deepEqual(payload.include_aliases, { external_id: [parentUserId] });
      assert.equal(payload.headings.ar, 'غياب الطالب عن الحصة');
      assert.match(payload.contents.ar, /Test Student/);
      assert.equal(payload.url, `https://mosque-test.example/dashboard/sessions/${sessionId}`);
      return new Response(JSON.stringify({ id: 'test-push-id' }), { status: 200 });
    };

    const result = await handleApiRequest({
      method: 'POST',
      path: `/api/sessions/${sessionId}/records`,
      body: { records: [{ studentId, attendanceStatus: 'absent' }] },
    }, {
      cookieHeader: sessionCookieHeader,
      getSessionUserId: session.getSessionUserId,
      dispatch: (request) => operations.apiRouter.dispatch(request),
      setResponseHeader: () => assert.fail('attendance request should not set response headers'),
    });

    assert.equal(result.status, 200);
    assert.equal(result.body.success, true);
    assert.equal(fetchCalls, 1);

    const notices = await database.db.select().from(schema.notifications).where(eq(schema.notifications.userId, parentUserId));
    assert.equal(notices.length, 1);
    assert.equal(notices[0].studentId, studentId);
    assert.equal(notices[0].sessionId, sessionId);
    assert.equal(notices[0].type, 'attendance_absent');

    const records = await database.db.select().from(schema.sessionStudentRecords).where(eq(schema.sessionStudentRecords.sessionId, sessionId));
    assert.equal(records.length, 1);
    assert.equal(records[0].attendanceStatus, 'absent');

    const duplicateMark = await handleApiRequest({
      method: 'POST',
      path: `/api/sessions/${sessionId}/records`,
      body: { records: [{ studentId, attendanceStatus: 'absent' }] },
    }, {
      cookieHeader: sessionCookieHeader,
      getSessionUserId: session.getSessionUserId,
      dispatch: (request) => operations.apiRouter.dispatch(request),
      setResponseHeader: () => assert.fail('attendance request should not set response headers'),
    });
    assert.equal(duplicateMark.status, 200);
    assert.equal(fetchCalls, 1, 're-saving the same absent state should not send another push');
    const noticesAfterDuplicate = await database.db.select().from(schema.notifications).where(eq(schema.notifications.userId, parentUserId));
    assert.equal(noticesAfterDuplicate.length, 1, 're-saving the same absent state should not duplicate the in-app notice');
  } finally {
    globalThis.fetch = originalFetch;
    if (originalEnv.appId === undefined) delete process.env.ONESIGNAL_APP_ID;
    else process.env.ONESIGNAL_APP_ID = originalEnv.appId;
    if (originalEnv.apiKey === undefined) delete process.env.ONESIGNAL_REST_API_KEY;
    else process.env.ONESIGNAL_REST_API_KEY = originalEnv.apiKey;
    if (originalEnv.appUrl === undefined) delete process.env.APP_URL;
    else process.env.APP_URL = originalEnv.appUrl;

    if (adminCreated) {
      await session.destroyAuthSession(session.readSessionToken(sessionCookieHeader));
      await database.db.delete(schema.notifications).where(eq(schema.notifications.userId, parentUserId));
      await database.db.delete(schema.sessionStudentRecords).where(eq(schema.sessionStudentRecords.sessionId, sessionId));
      await database.db.delete(schema.sessions).where(eq(schema.sessions.id, sessionId));
      await database.db.delete(schema.students).where(eq(schema.students.id, studentId));
      await database.db.delete(schema.groups).where(eq(schema.groups.id, groupId));
      await database.db.delete(schema.groupTypes).where(eq(schema.groupTypes.id, groupTypeId));
      await database.db.delete(schema.parents).where(eq(schema.parents.id, parentId));
      await database.db.delete(schema.users).where(eq(schema.users.id, parentUserId));
      await database.db.delete(schema.users).where(eq(schema.users.id, adminId));
    }
  }
});
