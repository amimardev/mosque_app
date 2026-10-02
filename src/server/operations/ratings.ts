import { OperationRegistry } from '../operationRegistry.js';
import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { ensureDatabaseInitialized } from '../../db/init.js';
import { calculateAge } from '../../lib/ageUtils.js';

export const ratingsRouter = new OperationRegistry();

function calculateGrade(score: number): string {
  if (score >= 95) return 'Mumtaz (Outstanding)';
  if (score >= 88) return 'Mumtaz (Excellent)';
  if (score >= 80) return 'Jayyid Jiddan (Very Good)';
  if (score >= 70) return 'Jayyid (Good)';
  if (score >= 60) return 'Maqbool (Acceptable)';
  return 'Da\'eef (Needs Improvement)';
}

// GET all ratings with student, teacher, and group details
ratingsRouter.get('/', async (c) => {
  await ensureDatabaseInitialized();
  const studentId = c.req.query('studentId')?.trim();
  const groupId = c.req.query('groupId')?.trim();
  const month = c.req.query('month')?.trim();

  let allRatings = await db.select().from(schema.studentRatings).orderBy(desc(schema.studentRatings.createdAt));
  const allStudents = await db.select().from(schema.students);
  const allTeachers = await db.select().from(schema.teachers);
  const allGroups = await db.select().from(schema.groups);
  const allGroupTypes = await db.select().from(schema.groupTypes);

  const studentMap = new Map(allStudents.map(s => [s.id, s]));
  const teacherMap = new Map(allTeachers.map(t => [t.id, t]));
  const groupMap = new Map(allGroups.map(g => [g.id, g]));
  const typeMap = new Map(allGroupTypes.map(gt => [gt.id, gt]));

  if (studentId) {
    allRatings = allRatings.filter(r => r.studentId === studentId);
  }
  if (groupId && groupId !== 'all') {
    allRatings = allRatings.filter(r => r.groupId === groupId);
  }
  if (month && month !== 'all') {
    allRatings = allRatings.filter(r => r.month === month);
  }

  const result = allRatings.map(r => {
    const student = studentMap.get(r.studentId);
    const teacher = r.teacherId ? teacherMap.get(r.teacherId) : null;
    const group = r.groupId ? groupMap.get(r.groupId) : null;
    const matchedType = group ? typeMap.get(group.typeId) : null;

    return {
      ...r,
      student: student ? {
        id: student.id,
        name: student.name,
        avatar: student.avatar,
        currentSurahName: student.currentSurahName,
        currentAyah: student.currentAyah,
        age: calculateAge(student.dateOfBirth || student.age)
      } : null,
      teacher: teacher ? {
        id: teacher.id,
        name: teacher.name,
        avatar: teacher.avatar
      } : null,
      group: group ? {
        id: group.id,
        number: group.number,
        type: matchedType?.name || 'حلقة عامة',
        studyTime: group.studyTime
      } : null
    };
  });

  return c.json({ ratings: result });
});

// POST new rating
ratingsRouter.post('/', async (c) => {
  await ensureDatabaseInitialized();
  try {
    const body = await c.req.json();
    const id = `rat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const hifz = parseInt(body.hifzScore, 10) ?? 90;
    const tajweed = parseInt(body.tajweedScore, 10) ?? 85;
    const murajaah = parseInt(body.murajaahScore, 10) ?? 88;
    const attendance = parseInt(body.attendanceScore, 10) ?? 95;
    const behavior = parseInt(body.behaviorScore, 10) ?? 100;

    // Weighted overall score: Hifz 35%, Tajweed 25%, Murajaah 20%, Attendance 10%, Behavior 10%
    const computedOverall = Math.round(
      (hifz * 0.35) + (tajweed * 0.25) + (murajaah * 0.20) + (attendance * 0.10) + (behavior * 0.10)
    );
    const overallScore = body.overallScore !== undefined ? parseInt(body.overallScore, 10) : computedOverall;
    const grade = body.grade || calculateGrade(overallScore);

    const newRating = {
      id,
      studentId: body.studentId,
      teacherId: body.teacherId || null,
      groupId: body.groupId || null,
      month: body.month || new Date().toISOString().substring(0, 7), // "YYYY-MM"
      hifzScore: hifz,
      tajweedScore: tajweed,
      murajaahScore: murajaah,
      attendanceScore: attendance,
      behaviorScore: behavior,
      overallScore,
      grade,
      surahEvaluated: body.surahEvaluated || null,
      ayahStart: body.ayahStart ? parseInt(body.ayahStart, 10) : null,
      ayahEnd: body.ayahEnd ? parseInt(body.ayahEnd, 10) : null,
      notes: body.notes || null,
      createdAt: new Date()
    };

    if (!newRating.studentId) {
      return c.json({ error: 'Student ID is required for rating' }, 400);
    }

    await db.insert(schema.studentRatings).values(newRating);

    // If update student current surah / ayah was requested
    if (body.updateStudentSurah && body.surahEvaluated) {
      const student = await db.select().from(schema.students).where(eq(schema.students.id, newRating.studentId)).then(r => r[0]);
      if (student) {
        await db.update(schema.students).set({
          currentSurahName: body.surahEvaluated,
          currentAyah: body.ayahEnd || student.currentAyah,
          updatedAt: new Date()
        }).where(eq(schema.students.id, student.id));
      }
    }

    return c.json({ success: true, rating: newRating }, 201);
  } catch (err: any) {
    console.error('Error adding rating:', err);
    return c.json({ error: err.message || 'Failed to submit rating' }, 500);
  }
});

// PUT edit rating
ratingsRouter.put('/:id', async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const existing = await db.select().from(schema.studentRatings).where(eq(schema.studentRatings.id, id)).then(r => r[0]);

    if (!existing) {
      return c.json({ error: 'Rating record not found' }, 404);
    }

    const hifz = body.hifzScore !== undefined ? parseInt(body.hifzScore, 10) : existing.hifzScore;
    const tajweed = body.tajweedScore !== undefined ? parseInt(body.tajweedScore, 10) : existing.tajweedScore;
    const murajaah = body.murajaahScore !== undefined ? parseInt(body.murajaahScore, 10) : existing.murajaahScore;
    const attendance = body.attendanceScore !== undefined ? parseInt(body.attendanceScore, 10) : existing.attendanceScore;
    const behavior = body.behaviorScore !== undefined ? parseInt(body.behaviorScore, 10) : existing.behaviorScore;

    const computedOverall = Math.round(
      (hifz * 0.35) + (tajweed * 0.25) + (murajaah * 0.20) + (attendance * 0.10) + (behavior * 0.10)
    );
    const overallScore = body.overallScore !== undefined ? parseInt(body.overallScore, 10) : computedOverall;

    const updatedData = {
      month: body.month ?? existing.month,
      teacherId: body.teacherId !== undefined ? body.teacherId : existing.teacherId,
      groupId: body.groupId !== undefined ? body.groupId : existing.groupId,
      hifzScore: hifz,
      tajweedScore: tajweed,
      murajaahScore: murajaah,
      attendanceScore: attendance,
      behaviorScore: behavior,
      overallScore,
      grade: body.grade || calculateGrade(overallScore),
      surahEvaluated: body.surahEvaluated !== undefined ? body.surahEvaluated : existing.surahEvaluated,
      ayahStart: body.ayahStart !== undefined ? parseInt(body.ayahStart, 10) : existing.ayahStart,
      ayahEnd: body.ayahEnd !== undefined ? parseInt(body.ayahEnd, 10) : existing.ayahEnd,
      notes: body.notes !== undefined ? body.notes : existing.notes
    };

    await db.update(schema.studentRatings).set(updatedData).where(eq(schema.studentRatings.id, id));

    return c.json({ success: true, rating: { ...existing, ...updatedData } });
  } catch (err: any) {
    return c.json({ error: err.message || 'Failed to update rating' }, 500);
  }
});

// DELETE rating
ratingsRouter.delete('/:id', async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param('id');
  try {
    await db.delete(schema.studentRatings).where(eq(schema.studentRatings.id, id));
    return c.json({ success: true, message: 'Rating deleted' });
  } catch (err: any) {
    return c.json({ error: err.message || 'Failed to delete rating' }, 500);
  }
});
