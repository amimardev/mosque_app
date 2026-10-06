import { OperationRegistry } from '../operationRegistry.js';
import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { ensureDatabaseInitialized } from '../../db/init.js';
import { QURAN_SURAHS } from '../../lib/quranData.js';

import { getSessionId } from '../session.js';
import { eq } from 'drizzle-orm';

export const statsRouter = new OperationRegistry();

// Helper to authenticate user and resolve effective role
async function getAuthenticatedUser(c: any) {
  const sessionId = getSessionId(c);
  if (!sessionId) return null;

  const user = await db.select().from(schema.users).where(eq(schema.users.id, sessionId)).then(r => r[0]);
  if (!user) return null;

  let teacherProfile: any = null;
  let parentProfile: any = null;
  let role = user.role;

  if (user.role === 'admin' || user.role === 'teacher') {
    teacherProfile = await db.select().from(schema.teachers).where(eq(schema.teachers.userId, user.id)).then(r => r[0]);
    if (teacherProfile && teacherProfile.isAdmin) {
      role = 'admin';
    }
  }

  if (user.role === 'parent') {
    parentProfile = await db.select().from(schema.parents).where(eq(schema.parents.userId, user.id)).then(r => r[0]);
  }

  return { ...user, role, teacherProfile, parentProfile };
}

statsRouter.get('/counts', async (c) => {
  await ensureDatabaseInitialized();
  try {
    const user = await getAuthenticatedUser(c);
    let allStudents = await db.select().from(schema.students);

    if (user?.role === 'parent') {
      const parentId = user.parentProfile?.id;
      allStudents = parentId ? allStudents.filter(s => s.parentId === parentId) : [];
    } else if (user?.role === 'teacher') {
      const teacherId = user.teacherProfile?.id;
      if (teacherId) {
        const assignedGroupTeachers = await db.select().from(schema.groupTeachers).where(eq(schema.groupTeachers.teacherId, teacherId));
        const teacherGroupIds = new Set(assignedGroupTeachers.map(gt => gt.groupId));
        allStudents = allStudents.filter(s => {
          if (!s.groupId) return false;
          const studentGroupIds = s.groupId.split(',').map(id => id.trim()).filter(Boolean);
          return studentGroupIds.some(gid => teacherGroupIds.has(gid));
        });
      } else {
        allStudents = [];
      }
    }

    const allParents = await db.select({ id: schema.parents.id }).from(schema.parents);
    const allTeachers = await db.select({ id: schema.teachers.id }).from(schema.teachers);
    const allGroups = await db.select({ id: schema.groups.id }).from(schema.groups);
    const allRatings = await db.select({ id: schema.studentRatings.id }).from(schema.studentRatings);

    return c.json({
      counts: {
        students: allStudents.length,
        parents: allParents.length,
        teachers: allTeachers.length,
        groups: allGroups.length,
        ratings: allRatings.length
      }
    });
  } catch (err: any) {
    return c.json({ counts: { students: 0, parents: 0, teachers: 0, groups: 0, ratings: 0 } });
  }
});

statsRouter.get('/', async (c) => {
  await ensureDatabaseInitialized();
  const allStudents = await db.select().from(schema.students);
  const allTeachers = await db.select().from(schema.teachers);
  const allGroups = await db.select().from(schema.groups);
  const allRatings = await db.select().from(schema.studentRatings);

  const totalStudents = allStudents.length;
  const totalTeachers = allTeachers.length;
  const totalGroups = allGroups.length;

  const averageRating = allRatings.length > 0
    ? Math.round(allRatings.reduce((acc, r) => acc + r.overallScore, 0) / allRatings.length)
    : 92;

  // Total Juz memorized combined
  const totalJuzMemorized = allStudents.reduce((acc, s) => acc + (s.memorizedJuzCount || 0), 0);

  // Top performers
  const topStudents = [...allStudents]
    .sort((a, b) => (b.memorizedJuzCount || 0) - (a.memorizedJuzCount || 0))
    .slice(0, 5);

  return c.json({
    stats: {
      totalStudents,
      totalTeachers,
      totalGroups,
      averageRating,
      totalJuzMemorized,
      topStudents
    }
  });
});

export const quranRouter = new OperationRegistry();

quranRouter.get('/surahs', (c) => {
  return c.json({ surahs: QURAN_SURAHS });
});
