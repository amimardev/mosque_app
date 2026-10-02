import { Hono } from 'hono';
import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { ensureDatabaseInitialized } from '../../db/init.js';
import { QURAN_SURAHS } from '../../lib/quranData.js';

export const statsRouter = new Hono();

statsRouter.get('/counts', async (c) => {
  await ensureDatabaseInitialized();
  try {
    const allStudents = await db.select({ id: schema.students.id }).from(schema.students);
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

export const quranRouter = new Hono();

quranRouter.get('/surahs', (c) => {
  return c.json({ surahs: QURAN_SURAHS });
});
