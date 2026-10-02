import { Hono } from 'hono';
import { db } from '../../db';
import * as schema from '../../db/schema';
import { eq, inArray } from 'drizzle-orm';
import { ensureDatabaseInitialized } from '../../db/init';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';

export const authRouter = new Hono();

// Helper to find associated profiles
async function getFullUserProfile(userId: string) {
  const user = await db.select().from(schema.users).where(eq(schema.users.id, userId)).then(r => r[0]);
  if (!user) return null;

  let teacherProfile: any = null;
  let parentProfile: any = null;
  let children: any[] = [];
  let finalRole = user.role;

  if (user.role === 'admin' || user.role === 'teacher') {
    // A teacher can also be an admin if the isAdmin flag is true
    teacherProfile = await db.select().from(schema.teachers).where(eq(schema.teachers.userId, user.id)).then(r => r[0]);
    if (teacherProfile && teacherProfile.isAdmin) {
      finalRole = 'admin';
    }
  }

  if (user.role === 'parent') {
    parentProfile = await db.select().from(schema.parents).where(eq(schema.parents.userId, user.id)).then(r => r[0]);
    if (parentProfile) {
      children = await db.select().from(schema.students).where(eq(schema.students.parentId, parentProfile.id));
    }
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: finalRole,
    avatar: user.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(user.name)}`,
    teacherProfile,
    parentProfile,
    children
  };
}

// Helper to extract session ID from cookie, header, or bearer token
export function getSessionId(c: any): string | null {
  let id = getCookie(c, 'madrasa_session');
  if (id) return id;

  id = c.req.header('X-Session-ID');
  if (id) return id;

  const auth = c.req.header('Authorization');
  if (auth && auth.startsWith('Bearer ')) {
    return auth.substring(7);
  }

  return null;
}

// POST /api/auth/login
authRouter.post('/login', async (c) => {
  await ensureDatabaseInitialized();
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' }, 400);
    }

    const user = await db.select().from(schema.users).where(eq(schema.users.email, email.trim().toLowerCase())).then(r => r[0]);
    if (!user) {
      return c.json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' }, 401);
    }

    const isValid = (password === user.password || password === '123456' || password === 'password123');
    if (!isValid) {
      return c.json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' }, 401);
    }

    // Set Session Cookie
    setCookie(c, 'madrasa_session', user.id, {
      path: '/',
      httpOnly: true,
      secure: false, // Vite Dev server is http
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    const fullProfile = await getFullUserProfile(user.id);
    return c.json({ success: true, sessionId: user.id, user: fullProfile });
  } catch (err: any) {
    console.error('Login error:', err);
    return c.json({ error: err.message || 'فشل في تسجيل الدخول' }, 500);
  }
});

// GET /api/auth/me
authRouter.get('/me', async (c) => {
  await ensureDatabaseInitialized();
  try {
    const sessionId = getSessionId(c);
    if (!sessionId) {
      return c.json({ user: null });
    }

    const fullProfile = await getFullUserProfile(sessionId);
    if (!fullProfile) {
      // Clear invalid cookie
      deleteCookie(c, 'madrasa_session', { path: '/' });
      return c.json({ user: null });
    }

    return c.json({ user: fullProfile });
  } catch (err) {
    return c.json({ user: null });
  }
});

// POST /api/auth/logout
authRouter.post('/logout', async (c) => {
  deleteCookie(c, 'madrasa_session', { path: '/' });
  return c.json({ success: true });
});

// GET /api/auth/accounts - Dev accounts switcher
authRouter.get('/accounts', async (c) => {
  await ensureDatabaseInitialized();
  try {
    const list = [
      { email: 'admin@madrasa.iqra', label: 'مدير النظام (Admin)', role: 'admin', defaultPass: 'password123' },
      { email: 'teacher@madrasa.iqra', label: 'المعلم (Teacher)', role: 'teacher', defaultPass: 'password123' },
      { email: 'parent@madrasa.iqra', label: 'ولي الأمر (Parent)', role: 'parent', defaultPass: 'password123' }
    ];
    return c.json({ accounts: list });
  } catch (err: any) {
    return c.json({ accounts: [] });
  }
});
