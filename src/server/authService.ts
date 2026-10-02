import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { ensureDatabaseInitialized } from '../db/init.js';
import type { UserRole } from '../types.js';

function isUserRole(role: string): role is UserRole {
  return role === 'admin' || role === 'teacher' || role === 'parent';
}

export async function getFullUserProfile(userId: string) {
  await ensureDatabaseInitialized();
  const user = await db.select().from(schema.users).where(eq(schema.users.id, userId)).then((rows) => rows[0]);
  if (!user) return null;
  if (!isUserRole(user.role)) return null;

  let teacherProfile: any = null;
  let parentProfile: any = null;
  let children: any[] = [];
  let role: UserRole = user.role;

  if (user.role === 'admin' || user.role === 'teacher') {
    teacherProfile = await db.select().from(schema.teachers).where(eq(schema.teachers.userId, user.id)).then((rows) => rows[0]);
    if (teacherProfile?.isAdmin) role = 'admin';
  }

  if (user.role === 'parent') {
    parentProfile = await db.select().from(schema.parents).where(eq(schema.parents.userId, user.id)).then((rows) => rows[0]);
    if (parentProfile) children = await db.select().from(schema.students).where(eq(schema.students.parentId, parentProfile.id));
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role,
    avatar: user.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(user.name)}`,
    teacherProfile,
    parentProfile,
    children,
  };
}

export async function authenticateUser(email: string, password: string) {
  await ensureDatabaseInitialized();
  const user = await db.select().from(schema.users)
    .where(eq(schema.users.email, email.trim().toLowerCase())).then((rows) => rows[0]);
  if (!user) return null;

  const isHash = !!user.password?.startsWith('$2');
  const valid = isHash ? await bcrypt.compare(password, user.password!) : password === user.password;
  if (valid && !isHash) {
    await db.update(schema.users).set({ password: await hashPassword(password) }).where(eq(schema.users.id, user.id));
  }
  return valid ? user : null;
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}
