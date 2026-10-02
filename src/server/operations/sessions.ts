import { OperationRegistry } from '../operationRegistry.js';
import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { eq, and, gte, lte, sql as sqlDrizzle } from 'drizzle-orm';
import { getSessionId } from '../session.js';
import { calculateAge } from '../../lib/ageUtils.js';
import { computeAlgeriaSessionTimes } from './prayerTimes.js';

export const sessionsRouter = new OperationRegistry();

// Middleware helper to check current logged in user and role
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

// 1. GET /api/sessions - Get/list sessions with auto-generation, date filtering & pagination
sessionsRouter.get('/', async (c) => {
  try {
    const user = await getAuthenticatedUser(c);
    if (!user) {
      return c.json({ error: 'غير مصرح بالدخول، يرجى تسجيل الدخول أولاً' }, 401);
    }

    const startDate = c.req.query('startDate');
    const endDate = c.req.query('endDate');
    const groupIdFilter = c.req.query('groupId');
    const page = c.req.query('page');
    const limit = c.req.query('limit');
    const search = c.req.query('search')?.trim().toLowerCase();
    const statusFilter = c.req.query('status');

    // Auto-generate scheduled sessions for the requested period (or past 7 to next 7 days)
    const allGroups = await db.select().from(schema.groups);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();

    let genStart = new Date();
    let genEnd = new Date();

    if (startDate && endDate) {
      genStart = new Date(startDate);
      genEnd = new Date(endDate);
    } else if (startDate) {
      genStart = new Date(startDate);
      genEnd = new Date(startDate);
      genEnd.setDate(genEnd.getDate() + 14);
    } else {
      genStart.setDate(today.getDate() - 7);
      genEnd.setDate(today.getDate() + 7);
    }

    // Limit generation range to max 60 days to prevent excessive loops
    const diffDays = Math.min(60, Math.max(1, Math.round((genEnd.getTime() - genStart.getTime()) / (1000 * 3600 * 24))));

    for (const group of allGroups) {
      const days = group.days || [];
      if (days.length === 0) continue;

      const groupTeacher = await db.select().from(schema.groupTeachers)
        .where(eq(schema.groupTeachers.groupId, group.id))
        .then(r => r[0]);

      const defaultTeacherId = groupTeacher ? groupTeacher.teacherId : null;

      for (let i = 0; i <= diffDays; i++) {
        const checkDate = new Date(genStart);
        checkDate.setDate(genStart.getDate() + i);
        const dayName = dayNames[checkDate.getDay()];

        if (days.includes(dayName)) {
          const dateStr = checkDate.toISOString().split('T')[0];

          // Check if session already exists for this group on this date
          const existing = await db.select().from(schema.sessions).where(
            and(
              eq(schema.sessions.groupId, group.id),
              eq(schema.sessions.date, dateStr)
            )
          ).then(r => r[0]);

          if (!existing) {
            const sessionId = `ses_${group.id}_${dateStr}`;
            const computedTimes = await computeAlgeriaSessionTimes(group, dateStr);

            await db.insert(schema.sessions).values({
              id: sessionId,
              groupId: group.id,
              teacherId: defaultTeacherId,
              sessionType: 'main',
              date: dateStr,
              startTime: computedTimes.startTime,
              endTime: computedTimes.endTime,
              sessionTimeText: computedTimes.sessionTimeText,
              status: checkDate < today ? 'completed' : 'scheduled',
              notes: 'حصة أساسية مجدولة تلقائياً'
            }).onConflictDoNothing();

            const groupStudents = await db.select().from(schema.students).where(eq(schema.students.groupId, group.id));
            for (const student of groupStudents) {
              await db.insert(schema.sessionStudentRecords).values({
                id: `rec_${sessionId}_${student.id}`,
                sessionId: sessionId,
                studentId: student.id,
                attendanceStatus: 'present',
                surahNumber: student.currentSurahNumber,
                surahName: student.currentSurahName,
                ayahStart: student.currentAyah,
                ayahEnd: student.currentAyah ? student.currentAyah + 10 : 10,
                teacherRemarque: '',
                isAssessed: false
              }).onConflictDoNothing();
            }
          }
        }
      }
    }

    // Query sessions with join
    let query = db.select({
      id: schema.sessions.id,
      groupId: schema.sessions.groupId,
      teacherId: schema.sessions.teacherId,
      sessionType: schema.sessions.sessionType,
      date: schema.sessions.date,
      startTime: schema.sessions.startTime,
      endTime: schema.sessions.endTime,
      sessionTimeText: schema.sessions.sessionTimeText,
      status: schema.sessions.status,
      notes: schema.sessions.notes,
      groupStudyTime: schema.groups.studyTime,
      groupSessionTime: schema.groups.sessionTime,
      level: schema.groups.level,
      room: schema.groups.room,
      groupNumber: schema.groups.number,
      teacherName: schema.teachers.name,
      teacherAvatar: schema.teachers.avatar
    })
    .from(schema.sessions)
    .innerJoin(schema.groups, eq(schema.sessions.groupId, schema.groups.id))
    .leftJoin(schema.teachers, eq(schema.sessions.teacherId, schema.teachers.id));

    let results = await query;

    // Filter by group ID if provided
    if (groupIdFilter) {
      results = results.filter(r => r.groupId === groupIdFilter);
    }

    // Filter by date range if provided
    if (startDate) {
      results = results.filter(r => r.date >= startDate);
    }
    if (endDate) {
      results = results.filter(r => r.date <= endDate);
    }
    if (statusFilter && statusFilter !== 'all') {
      results = results.filter(r => r.status === statusFilter);
    }

    // Role-based filtering
    if (user.role === 'teacher' && user.teacherProfile) {
      const teacherGroups = await db.select({ groupId: schema.groupTeachers.groupId })
        .from(schema.groupTeachers)
        .where(eq(schema.groupTeachers.teacherId, user.teacherProfile.id));
      const groupIds = teacherGroups.map(tg => tg.groupId);
      results = results.filter(r => groupIds.includes(r.groupId));
    } else if (user.role === 'parent' && user.parentProfile) {
      const parentChildren = await db.select({ groupId: schema.students.groupId })
        .from(schema.students)
        .where(eq(schema.students.parentId, user.parentProfile.id));
      const groupIds = parentChildren.map(c => c.groupId).filter(Boolean) as string[];
      results = results.filter(r => groupIds.includes(r.groupId));
    }

    // Text search filter if provided
    if (search) {
      results = results.filter(r => 
        (r.teacherName && r.teacherName.toLowerCase().includes(search)) ||
        (r.level && r.level.toLowerCase().includes(search)) ||
        (r.groupNumber && String(r.groupNumber).includes(search)) ||
        (r.sessionTimeText && r.sessionTimeText.toLowerCase().includes(search)) ||
        (r.date && r.date.includes(search))
      );
    }

    // Sort by date desc, then start time desc
    results.sort((a, b) => b.date.localeCompare(a.date) || (b.startTime || '').localeCompare(a.startTime || ''));

    const total = results.length;

    // Handle pagination if page is passed
    if (page !== undefined) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit || '10', 10) || 10);
      const totalPages = Math.ceil(total / limitNum) || 1;
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedResults = results.slice(startIndex, startIndex + limitNum);

      return c.json({
        success: true,
        sessions: paginatedResults,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages
        }
      });
    }

    return c.json({ success: true, sessions: results, pagination: null });
  } catch (err: any) {
    console.error('Error fetching sessions:', err);
    return c.json({ error: err.message || 'فشل في تحميل الحصص' }, 500);
  }
});

// 2. POST /api/sessions/exception - Create a manual exception session
// "to create a exception session a teacher can see in the groups/type/ page his assigned groups, inside view group page he has button to create exception session. this should be the only way to create a session."
sessionsRouter.post('/exception', async (c) => {
  try {
    const user = await getAuthenticatedUser(c);
    if (!user) {
      return c.json({ error: 'غير مصرح بالدخول' }, 401);
    }

    const { groupId, date, notes } = await c.req.json();
    if (!groupId || !date) {
      return c.json({ error: 'معرف الحلقة والتاريخ مطلوبان' }, 400);
    }

    const group = await db.select().from(schema.groups).where(eq(schema.groups.id, groupId)).then(r => r[0]);
    if (!group) {
      return c.json({ error: 'الحلقة غير موجودة' }, 404);
    }

    // Ensure current teacher is assigned to this group, or is admin
    const groupTeacher = await db.select().from(schema.groupTeachers)
      .where(eq(schema.groupTeachers.groupId, groupId))
      .then(r => r[0]);

    if (user.role !== 'admin') {
      const isAssigned = await db.select().from(schema.groupTeachers).where(
        and(
          eq(schema.groupTeachers.groupId, groupId),
          eq(schema.groupTeachers.teacherId, user.teacherProfile?.id || '')
        )
      ).then(r => r.length > 0);

      if (!isAssigned) {
        return c.json({ error: 'غير مصرح لك بإنشاء حصة في حلقة غير مسندة إليك' }, 403);
      }
    }

    const sessionId = `ses_exc_${groupId}_${Date.now()}`;
    const computedTimes = await computeAlgeriaSessionTimes(group, date);

    const newSession = {
      id: sessionId,
      groupId,
      teacherId: user.teacherProfile?.id || groupTeacher?.teacherId || null,
      sessionType: 'exception',
      date,
      startTime: computedTimes.startTime,
      endTime: computedTimes.endTime,
      sessionTimeText: `حصة استثنائية - ${computedTimes.sessionTimeText}`,
      status: 'scheduled' as const,
      notes: notes || 'حصة استثنائية تمت إضافتها من صفحة الحلقة'
    };

    await db.insert(schema.sessions).values(newSession);

    // Populate default student records
    const groupStudents = await db.select().from(schema.students).where(eq(schema.students.groupId, groupId));
    for (const student of groupStudents) {
      await db.insert(schema.sessionStudentRecords).values({
        id: `rec_${sessionId}_${student.id}`,
        sessionId: sessionId,
        studentId: student.id,
        attendanceStatus: 'present', // Default to present
        surahNumber: student.currentSurahNumber,
        surahName: student.currentSurahName,
        ayahStart: student.currentAyah,
        ayahEnd: student.currentAyah + 10,
        teacherRemarque: '',
        isAssessed: false
      });
    }

    return c.json({ success: true, session: newSession });
  } catch (err: any) {
    console.error('Error creating exception session:', err);
    return c.json({ error: err.message || 'فشل في إنشاء الحصة الاستثنائية' }, 500);
  }
});

// 3. GET /api/sessions/:id - Get session info and its student records
sessionsRouter.get('/:id', async (c) => {
  try {
    const sessionId = c.req.param('id');
    const user = await getAuthenticatedUser(c);
    if (!user) {
      return c.json({ error: 'غير مصرح بالدخول' }, 401);
    }

    const session = await db.select({
      id: schema.sessions.id,
      groupId: schema.sessions.groupId,
      teacherId: schema.sessions.teacherId,
      sessionType: schema.sessions.sessionType,
      date: schema.sessions.date,
      startTime: schema.sessions.startTime,
      endTime: schema.sessions.endTime,
      sessionTimeText: schema.sessions.sessionTimeText,
      status: schema.sessions.status,
      notes: schema.sessions.notes,
      groupStudyTime: schema.groups.studyTime,
      room: schema.groups.room,
      groupNumber: schema.groups.number,
      level: schema.groups.level,
      teacherName: schema.teachers.name,
      teacherAvatar: schema.teachers.avatar
    })
    .from(schema.sessions)
    .innerJoin(schema.groups, eq(schema.sessions.groupId, schema.groups.id))
    .leftJoin(schema.teachers, eq(schema.sessions.teacherId, schema.teachers.id))
    .where(eq(schema.sessions.id, sessionId))
    .then(r => r[0]);

    if (!session) {
      return c.json({ error: 'الحصة غير موجودة' }, 404);
    }

    // Load records for this session
    let records = await db.select({
      id: schema.sessionStudentRecords.id,
      sessionId: schema.sessionStudentRecords.sessionId,
      studentId: schema.sessionStudentRecords.studentId,
      attendanceStatus: schema.sessionStudentRecords.attendanceStatus,
      absenceReason: schema.sessionStudentRecords.absenceReason,
      surahNumber: schema.sessionStudentRecords.surahNumber,
      surahName: schema.sessionStudentRecords.surahName,
      ayahStart: schema.sessionStudentRecords.ayahStart,
      ayahEnd: schema.sessionStudentRecords.ayahEnd,
      teacherRemarque: schema.sessionStudentRecords.teacherRemarque,
      isAssessed: schema.sessionStudentRecords.isAssessed,
      studentName: schema.students.name,
      studentAvatar: schema.students.avatar,
      studentAge: schema.students.age,
      studentDateOfBirth: schema.students.dateOfBirth,
      studentParentId: schema.students.parentId
    })
    .from(schema.sessionStudentRecords)
    .innerJoin(schema.students, eq(schema.sessionStudentRecords.studentId, schema.students.id))
    .where(eq(schema.sessionStudentRecords.sessionId, sessionId));

    // If parent is logged in, restrict records to only their children
    if (user.role === 'parent' && user.parentProfile) {
      records = records.filter(r => r.studentParentId === user.parentProfile?.id);
    }

    const formattedRecords = records.map(r => ({
      ...r,
      studentAge: calculateAge(r.studentDateOfBirth || r.studentAge)
    }));

    return c.json({ success: true, session, records: formattedRecords });
  } catch (err: any) {
    console.error('Error fetching session details:', err);
    return c.json({ error: err.message || 'فشل في تحميل تفاصيل الحصة' }, 500);
  }
});

// 4. POST /api/sessions/:id/records - Save/update all student records for a session
sessionsRouter.post('/:id/records', async (c) => {
  try {
    const sessionId = c.req.param('id');
    const user = await getAuthenticatedUser(c);
    if (!user) {
      return c.json({ error: 'غير مصرح بالدخول' }, 401);
    }

    if (user.role === 'parent') {
      return c.json({ error: 'غير مصرح لأولياء الأمور بتعديل سجلات الطلاب' }, 403);
    }

    const { records, notes, status } = await c.req.json();
    if (!Array.isArray(records)) {
      return c.json({ error: 'تنسيق السجلات غير صالح' }, 400);
    }

    // Save student records inside session
    for (const rec of records) {
      // Upsert record
      await db.insert(schema.sessionStudentRecords).values({
        id: rec.id || `rec_${sessionId}_${rec.studentId}`,
        sessionId,
        studentId: rec.studentId,
        attendanceStatus: rec.attendanceStatus || 'present',
        absenceReason: rec.absenceReason || '',
        surahNumber: rec.surahNumber || null,
        surahName: rec.surahName || '',
        ayahStart: rec.ayahStart || null,
        ayahEnd: rec.ayahEnd || null,
        teacherRemarque: rec.teacherRemarque || '',
        isAssessed: rec.isAssessed !== undefined ? Boolean(rec.isAssessed) : false
      }).onConflictDoUpdate({
        target: schema.sessionStudentRecords.id,
        set: {
          attendanceStatus: rec.attendanceStatus || 'present',
          absenceReason: rec.absenceReason || '',
          surahNumber: rec.surahNumber || null,
          surahName: rec.surahName || '',
          ayahStart: rec.ayahStart || null,
          ayahEnd: rec.ayahEnd || null,
          teacherRemarque: rec.teacherRemarque || '',
          isAssessed: rec.isAssessed !== undefined ? Boolean(rec.isAssessed) : false
        }
      });

      // Synchronize latest Quran surah and ayah progress to student table directly!
      if (rec.attendanceStatus === 'present' && rec.surahName) {
        await db.update(schema.students).set({
          currentSurahName: rec.surahName,
          currentSurahNumber: rec.surahNumber || 1,
          currentAyah: rec.ayahEnd || rec.ayahStart || 1,
          updatedAt: new Date()
        }).where(eq(schema.students.id, rec.studentId));
      }
    }

    // Update general session state if specified
    await db.update(schema.sessions).set({
      status: status || 'completed',
      notes: notes !== undefined ? notes : null,
      updatedAt: new Date()
    }).where(eq(schema.sessions.id, sessionId));

    return c.json({ success: true, message: 'تم حفظ ورصد الحضور والأداء بنجاح' });
  } catch (err: any) {
    console.error('Error saving session records:', err);
    return c.json({ error: err.message || 'فشل في حفظ وتحديث بيانات الحصة' }, 500);
  }
});

// 5. POST /api/sessions/:id/records/:recordId - Save/update an individual student's assessment with isAssessed flag set to true
sessionsRouter.post('/:id/records/:recordId', async (c) => {
  try {
    const sessionId = c.req.param('id');
    const recordId = c.req.param('recordId');
    const user = await getAuthenticatedUser(c);
    if (!user) {
      return c.json({ error: 'غير مصرح بالدخول' }, 401);
    }

    if (user.role === 'parent') {
      return c.json({ error: 'غير مصرح لأولياء الأمور بتعديل سجلات الطلاب' }, 403);
    }

    const rec = await c.req.json();
    const isAssessed = rec.isAssessed !== undefined ? Boolean(rec.isAssessed) : true;

    await db.insert(schema.sessionStudentRecords).values({
      id: recordId,
      sessionId,
      studentId: rec.studentId,
      attendanceStatus: rec.attendanceStatus || 'present',
      absenceReason: rec.absenceReason || '',
      surahNumber: rec.surahNumber || null,
      surahName: rec.surahName || '',
      ayahStart: rec.ayahStart || null,
      ayahEnd: rec.ayahEnd || null,
      teacherRemarque: rec.teacherRemarque || '',
      isAssessed: isAssessed
    }).onConflictDoUpdate({
      target: schema.sessionStudentRecords.id,
      set: {
        attendanceStatus: rec.attendanceStatus || 'present',
        absenceReason: rec.absenceReason || '',
        surahNumber: rec.surahNumber || null,
        surahName: rec.surahName || '',
        ayahStart: rec.ayahStart || null,
        ayahEnd: rec.ayahEnd || null,
        teacherRemarque: rec.teacherRemarque || '',
        isAssessed: isAssessed
      }
    });

    // Synchronize latest Quran surah and ayah progress to student table directly if present
    if (rec.attendanceStatus === 'present' && rec.surahName && rec.studentId) {
      await db.update(schema.students).set({
        currentSurahName: rec.surahName,
        currentSurahNumber: rec.surahNumber || 1,
        currentAyah: rec.ayahEnd || rec.ayahStart || 1,
        updatedAt: new Date()
      }).where(eq(schema.students.id, rec.studentId));
    }

    return c.json({ success: true, message: 'تم حفظ تقييم الطالب بنجاح', isAssessed });
  } catch (err: any) {
    console.error('Error saving single student record:', err);
    return c.json({ error: err.message || 'فشل في حفظ تقييم الطالب' }, 500);
  }
});
