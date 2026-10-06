import { OperationRegistry } from '../operationRegistry.js';
import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { ensureDatabaseInitialized } from '../../db/init.js';
import { getSurahByNumber } from '../../lib/quranData.js';
import { calculateAge } from '../../lib/ageUtils.js';
import { getSessionId } from '../session.js';

export const studentsRouter = new OperationRegistry();

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

// GET all students (with optional query filter and latest rating)
studentsRouter.get('/', async (c) => {
  await ensureDatabaseInitialized();
  const user = await getAuthenticatedUser(c);
  if (!user) {
    return c.json({ error: 'غير مصرح بالدخول، يرجى تسجيل الدخول أولاً' }, 401);
  }

  const q = c.req.query('q')?.trim() || '';
  const groupId = c.req.query('groupId')?.trim() || '';

  let allStudents = await db.select().from(schema.students);

  // Role-based visibility filtering:
  // 1. Parent: only sees their own children
  if (user.role === 'parent') {
    const parentId = user.parentProfile?.id;
    allStudents = parentId ? allStudents.filter(s => s.parentId === parentId) : [];
  } else if (user.role === 'teacher') {
    // 2. Non-admin teacher: only sees students in the groups they teach
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
  // 3. Admin: sees all students

  const allGroups = await db.select().from(schema.groups);
  const allGroupTypes = await db.select().from(schema.groupTypes);
  const allRatings = await db.select().from(schema.studentRatings).orderBy(desc(schema.studentRatings.createdAt));
  const allParents = await db.select().from(schema.parents);

  // Map groups, types, and parents by ID
  const groupMap = new Map(allGroups.map(g => [g.id, g]));
  const typeMap = new Map(allGroupTypes.map(gt => [gt.id, gt]));
  const parentMap = new Map(allParents.map(p => [p.id, p]));

  // Build combined view with standard object storage bucket URL format student-{id}
  let result = allStudents.map(student => {
    const assignedGroupIds = student.groupId ? student.groupId.split(',').map(id => id.trim()).filter(Boolean) : [];
    const assignedGroups = assignedGroupIds.map(gid => groupMap.get(gid)).filter(Boolean);
    const studentGroup = assignedGroups[0] || null;
    const matchedType = studentGroup ? typeMap.get(studentGroup.typeId) : null;
    const latestRating = allRatings.find(r => r.studentId === student.id) || null;
    const surahData = getSurahByNumber(student.currentSurahNumber);
    const parentObj = student.parentId ? parentMap.get(student.parentId) : null;

    // Avatar format: student.avatar or fallback to /api/storage/student-{id}
    const avatar = student.avatar || `/api/storage/student-${student.id}`;

    const birthDate = student.dateOfBirth || (typeof student.age === 'string' && student.age.includes('-') ? student.age : null);
    const computedAge = calculateAge(birthDate || student.age);

    return {
      ...student,
      age: computedAge,
      calculatedAge: computedAge,
      dateOfBirth: birthDate || student.dateOfBirth,
      avatar,
      parentName: parentObj?.name || null,
      parentPhone: parentObj?.phone || null,
      parent: parentObj || null,
      group: studentGroup ? {
        id: studentGroup.id,
        number: studentGroup.number,
        typeId: studentGroup.typeId,
        type: matchedType?.name || 'حلقة قرآنية',
        typeSlug: matchedType?.slug || 'general',
        studyTime: studentGroup.studyTime,
        room: studentGroup.room,
        level: studentGroup.level
      } : null,
      latestRating: latestRating ? {
        id: latestRating.id,
        month: latestRating.month,
        overallScore: latestRating.overallScore,
        grade: latestRating.grade,
        hifzScore: latestRating.hifzScore,
        tajweedScore: latestRating.tajweedScore,
        murajaahScore: latestRating.murajaahScore,
        attendanceScore: latestRating.attendanceScore,
        behaviorScore: latestRating.behaviorScore,
        surahEvaluated: latestRating.surahEvaluated,
        notes: latestRating.notes
      } : null,
      surahDetails: surahData || null
    };
  });

  // Filter by search query (full name, parent name, email, phone)
  if (q) {
    const lower = q.toLowerCase();
    result = result.filter(s => 
      s.name.toLowerCase().includes(lower) ||
      (s.parentName && s.parentName.toLowerCase().includes(lower)) ||
      (s.parentPhone && s.parentPhone.toLowerCase().includes(lower)) ||
      (s.currentSurahName && s.currentSurahName.toLowerCase().includes(lower))
    );
  }

  // Filter by group
  if (groupId && groupId !== 'all') {
    result = result.filter(s => s.groupId && s.groupId.split(',').map(id => id.trim()).includes(groupId));
  }

  // Sort by created or name
  result.sort((a, b) => a.name.localeCompare(b.name));

  return c.json({ students: result });
});

// GET single student details
studentsRouter.get('/:id', async (c) => {
  await ensureDatabaseInitialized();
  const user = await getAuthenticatedUser(c);
  if (!user) {
    return c.json({ error: 'غير مصرح بالدخول، يرجى تسجيل الدخول أولاً' }, 401);
  }

  const id = c.req.param('id');
  const student = await db.select().from(schema.students).where(eq(schema.students.id, id)).then(r => r[0]);

  if (!student) {
    return c.json({ error: 'Student not found' }, 404);
  }

  // Permission check:
  // Parent can only view their own children
  if (user.role === 'parent' && student.parentId !== user.parentProfile?.id) {
    return c.json({ error: 'غير مصرح لك بالاطلاع على بيانات هذا الطالب' }, 403);
  }
  // Teacher can only view students in their assigned groups
  if (user.role === 'teacher') {
    const teacherId = user.teacherProfile?.id;
    if (!teacherId) return c.json({ error: 'غير مصرح لك بالاطلاع على بيانات هذا الطالب' }, 403);
    const assignedGroupTeachers = await db.select().from(schema.groupTeachers).where(eq(schema.groupTeachers.teacherId, teacherId));
    const teacherGroupIds = new Set(assignedGroupTeachers.map(gt => gt.groupId));
    const studentGroupIds = student.groupId ? student.groupId.split(',').map(s => s.trim()).filter(Boolean) : [];
    const hasAccess = studentGroupIds.some(gid => teacherGroupIds.has(gid));
    if (!hasAccess) {
      return c.json({ error: 'غير مصرح لك بالاطلاع على بيانات هذا الطالب' }, 403);
    }
  }

  let group: any = null;
  let groupTeachersList: any[] = [];
  const assignedGroupIds = student.groupId ? student.groupId.split(',').map(item => item.trim()).filter(Boolean) : [];
  if (assignedGroupIds.length > 0) {
    const firstGroupId = assignedGroupIds[0];
    group = await db.select().from(schema.groups).where(eq(schema.groups.id, firstGroupId)).then(r => r[0]);
    if (group) {
      const gTeachers = await db.select().from(schema.groupTeachers).where(eq(schema.groupTeachers.groupId, group.id));
      const allTeachers = await db.select().from(schema.teachers);
      const allGroupTypes = await db.select().from(schema.groupTypes);
      const matchedType = allGroupTypes.find(gt => gt.id === group.typeId) || null;

      groupTeachersList = gTeachers.map(gt => {
        const t = allTeachers.find(item => item.id === gt.teacherId);
        return t ? { ...t, avatar: `/api/storage/teacher-${t.id}`, role: gt.role } : null;
      }).filter(Boolean);

      group = {
        ...group,
        type: matchedType?.name || 'حلقة قرآنية',
        typeSlug: matchedType?.slug || 'general',
        groupType: matchedType,
        teachers: groupTeachersList
      };
    }
  }

  const ratings = await db.select().from(schema.studentRatings).where(eq(schema.studentRatings.studentId, id)).orderBy(desc(schema.studentRatings.createdAt));
  
  // Query student's latest session records with progress and remarks
  const studentSessions = await db.select({
    id: schema.sessions.id,
    date: schema.sessions.date,
    sessionType: schema.sessions.sessionType,
    sessionTimeText: schema.sessions.sessionTimeText,
    attendanceStatus: schema.sessionStudentRecords.attendanceStatus,
    surahName: schema.sessionStudentRecords.surahName,
    ayahStart: schema.sessionStudentRecords.ayahStart,
    ayahEnd: schema.sessionStudentRecords.ayahEnd,
    teacherRemarque: schema.sessionStudentRecords.teacherRemarque,
    teacherName: schema.teachers.name
  })
  .from(schema.sessionStudentRecords)
  .innerJoin(schema.sessions, eq(schema.sessionStudentRecords.sessionId, schema.sessions.id))
  .leftJoin(schema.teachers, eq(schema.sessions.teacherId, schema.teachers.id))
  .where(eq(schema.sessionStudentRecords.studentId, id))
  .orderBy(desc(schema.sessions.date));

  const surahData = getSurahByNumber(student.currentSurahNumber);
  let parentObj = student.parentId ? await db.select().from(schema.parents).where(eq(schema.parents.id, student.parentId)).then(r => r[0]) : null;

  const avatar = student.avatar || `/api/storage/student-${student.id}`;

  const birthDate = student.dateOfBirth || (typeof student.age === 'string' && student.age.includes('-') ? student.age : null);
  const computedAge = calculateAge(birthDate || student.age);

  return c.json({
    student: {
      ...student,
      age: computedAge,
      calculatedAge: computedAge,
      dateOfBirth: birthDate || student.dateOfBirth,
      avatar,
      parentName: parentObj?.name || null,
      parentPhone: parentObj?.phone || null,
      parent: parentObj || null,
      group: group || null,
      ratings,
      sessions: studentSessions,
      surahDetails: surahData || null
    }
  });
});

// POST new student - Only Admin is allowed to add students
studentsRouter.post('/', async (c) => {
  await ensureDatabaseInitialized();
  const user = await getAuthenticatedUser(c);
  if (!user || user.role !== 'admin') {
    return c.json({ error: 'عذراً، إضافة الطلاب متاحة فقط لإدارة المدرسة' }, 403);
  }

  try {
    const body = await c.req.json();
    const id = body.id || `std_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const avatar = body.avatar || `/api/storage/student-${id}`;

    let surahNumber = parseInt(body.currentSurahNumber, 10) || 1;
    let surahName = body.currentSurahName || 'Al-Fatihah';
    const matchedSurah = getSurahByNumber(surahNumber);
    if (matchedSurah) {
      surahName = matchedSurah.nameEnglish;
    }

    const studentGender = body.gender || 'male';

    // Parent foreign key (optional)
    const parentId = body.parentId || null;

    // Validate gender matching across all assigned groups
    if (body.groupId) {
      const assignedGroupIds = body.groupId.split(',').map((id: string) => id.trim()).filter(Boolean);
      if (assignedGroupIds.length > 0) {
        const fetchedGroups = await db.select().from(schema.groups);
        for (const gid of assignedGroupIds) {
          const grp = fetchedGroups.find(g => g.id === gid);
          if (grp && grp.gender !== studentGender) {
            return c.json({ 
              error: `عذراً، لا يمكن تسجيل الطالب في حلقة غير متوافقة مع جنسه. الحلقة رقم ${grp.number} مخصصة لـ ${grp.gender === 'male' ? 'الذكور' : 'الإناث'}.` 
            }, 400);
          }
        }
      }
    }

    const birthDate = body.dateOfBirth || (typeof body.age === 'string' && body.age.includes('-') ? body.age : null);

    const newStudent = {
      id,
      name: body.name?.trim(),
      avatar,
      gender: body.gender || 'male',
      dateOfBirth: birthDate,
      age: birthDate || (body.age ? String(body.age) : null), // Stored as date in age column
      parentId,
      email: body.email?.trim() || null,
      groupId: body.groupId || null,
      currentSurahNumber: surahNumber,
      currentSurahName: surahName,
      currentAyah: parseInt(body.currentAyah, 10) || 1,
      targetJuz: parseInt(body.targetJuz, 10) || 30,
      memorizedJuzCount: parseInt(body.memorizedJuzCount, 10) || 1,
      status: body.status || 'active',
      enrollmentDate: body.enrollmentDate || new Date().toISOString().split('T')[0],
      notes: body.notes || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (!newStudent.name) {
      return c.json({ error: 'Student full name is required' }, 400);
    }

    await db.insert(schema.students).values(newStudent);
    const parentObj = newStudent.parentId ? await db.select().from(schema.parents).where(eq(schema.parents.id, newStudent.parentId)).then(r => r[0]) : null;
    const computedAge = calculateAge(newStudent.dateOfBirth || newStudent.age);
    return c.json({
      success: true,
      student: {
        ...newStudent,
        parentName: parentObj?.name || null,
        parentPhone: parentObj?.phone || null,
        parent: parentObj || null,
        age: computedAge,
        calculatedAge: computedAge
      }
    }, 201);
  } catch (err: any) {
    console.error('Error adding student:', err);
    return c.json({ error: err.message || 'Failed to create student' }, 500);
  }
});

// PUT edit student - Only Admin is allowed to modify students
studentsRouter.put('/:id', async (c) => {
  await ensureDatabaseInitialized();
  const user = await getAuthenticatedUser(c);
  if (!user || user.role !== 'admin') {
    return c.json({ error: 'عذراً، تعديل بيانات الطلاب متاح فقط لإدارة المدرسة' }, 403);
  }

  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const existing = await db.select().from(schema.students).where(eq(schema.students.id, id)).then(r => r[0]);

    if (!existing) {
      return c.json({ error: 'Student not found' }, 404);
    }

    let surahNumber = body.currentSurahNumber !== undefined ? parseInt(body.currentSurahNumber, 10) : existing.currentSurahNumber;
    let surahName = body.currentSurahName || existing.currentSurahName;
    if (body.currentSurahNumber !== undefined) {
      const matched = getSurahByNumber(surahNumber);
      if (matched) surahName = matched.nameEnglish;
    }

    const avatar = body.avatar || existing.avatar || `/api/storage/student-${id}`;

    const targetGender = body.gender ?? existing.gender;
    const targetGroupId = body.groupId !== undefined ? (body.groupId === '' ? null : body.groupId) : existing.groupId;

    // Validate gender matching across all assigned groups
    if (targetGroupId) {
      const assignedGroupIds = targetGroupId.split(',').map((id: string) => id.trim()).filter(Boolean);
      if (assignedGroupIds.length > 0) {
        const fetchedGroups = await db.select().from(schema.groups);
        for (const gid of assignedGroupIds) {
          const grp = fetchedGroups.find(g => g.id === gid);
          if (grp && grp.gender !== targetGender) {
            return c.json({ 
              error: `عذراً، لا يمكن تسجيل الطالب في حلقة غير متوافقة مع جنسه. الحلقة رقم ${grp.number} مخصصة لـ ${grp.gender === 'male' ? 'الذكور' : 'الإناث'}.` 
            }, 400);
          }
        }
      }
    }

    const targetParentId = body.parentId !== undefined ? (body.parentId || null) : existing.parentId;

    const birthDate = body.dateOfBirth !== undefined 
      ? body.dateOfBirth 
      : (typeof body.age === 'string' && body.age.includes('-') ? body.age : existing.dateOfBirth);

    const updatedData = {
      name: body.name?.trim() ?? existing.name,
      avatar,
      gender: targetGender,
      dateOfBirth: birthDate,
      age: birthDate ?? (body.age !== undefined ? String(body.age) : existing.age), // Stored as date in age column
      parentId: targetParentId,
      email: body.email !== undefined ? body.email?.trim() : existing.email,
      groupId: targetGroupId,
      currentSurahNumber: surahNumber,
      currentSurahName: surahName,
      currentAyah: body.currentAyah !== undefined ? parseInt(body.currentAyah, 10) : existing.currentAyah,
      targetJuz: body.targetJuz !== undefined ? parseInt(body.targetJuz, 10) : existing.targetJuz,
      memorizedJuzCount: body.memorizedJuzCount !== undefined ? parseInt(body.memorizedJuzCount, 10) : existing.memorizedJuzCount,
      status: body.status ?? existing.status,
      enrollmentDate: body.enrollmentDate ?? existing.enrollmentDate,
      notes: body.notes !== undefined ? body.notes : existing.notes,
      updatedAt: new Date()
    };

    await db.update(schema.students).set(updatedData).where(eq(schema.students.id, id));

    const parentObj = updatedData.parentId ? await db.select().from(schema.parents).where(eq(schema.parents.id, updatedData.parentId)).then(r => r[0]) : null;
    const computedAge = calculateAge(updatedData.dateOfBirth || updatedData.age);
    return c.json({
      success: true,
      student: {
        ...existing,
        ...updatedData,
        parentName: parentObj?.name || null,
        parentPhone: parentObj?.phone || null,
        parent: parentObj || null,
        age: computedAge,
        calculatedAge: computedAge
      }
    });
  } catch (err: any) {
    console.error('Error updating student:', err);
    return c.json({ error: err.message || 'Failed to update student' }, 500);
  }
});

// DELETE student - Only Admin is allowed to delete students
studentsRouter.delete('/:id', async (c) => {
  await ensureDatabaseInitialized();
  const user = await getAuthenticatedUser(c);
  if (!user || user.role !== 'admin') {
    return c.json({ error: 'عذراً، حذف الطلاب متاح فقط لإدارة المدرسة' }, 403);
  }

  const id = c.req.param('id');
  try {
    await db.delete(schema.students).where(eq(schema.students.id, id));
    return c.json({ success: true, message: 'Student deleted successfully' });
  } catch (err: any) {
    return c.json({ error: err.message || 'Failed to delete student' }, 500);
  }
});

// GET /api/students/:id/history - Fetch latest progress (latest present session verse + surah) and latest 5 sessions status
studentsRouter.get('/:id/history', async (c) => {
  await ensureDatabaseInitialized();
  const user = await getAuthenticatedUser(c);
  if (!user) {
    return c.json({ error: 'غير مصرح بالدخول، يرجى تسجيل الدخول أولاً' }, 401);
  }

  const studentId = c.req.param('id');

  try {
    const student = await db.select().from(schema.students).where(eq(schema.students.id, studentId)).then(r => r[0]);
    if (!student) {
      return c.json({ error: 'الطالب غير موجود' }, 404);
    }

    // Permission check:
    if (user.role === 'parent' && student.parentId !== user.parentProfile?.id) {
      return c.json({ error: 'غير مصرح لك بالاطلاع على سجل هذا الطالب' }, 403);
    }
    if (user.role === 'teacher') {
      const teacherId = user.teacherProfile?.id;
      if (!teacherId) return c.json({ error: 'غير مصرح لك بالاطلاع على سجل هذا الطالب' }, 403);
      const assignedGroupTeachers = await db.select().from(schema.groupTeachers).where(eq(schema.groupTeachers.teacherId, teacherId));
      const teacherGroupIds = new Set(assignedGroupTeachers.map(gt => gt.groupId));
      const studentGroupIds = student.groupId ? student.groupId.split(',').map(s => s.trim()).filter(Boolean) : [];
      if (!studentGroupIds.some(gid => teacherGroupIds.has(gid))) {
        return c.json({ error: 'غير مصرح لك بالاطلاع على سجل هذا الطالب' }, 403);
      }
    }

    // 1. Fetch session records for this student joined with sessions
    const sessionRecords = await db
      .select({
        id: schema.sessionStudentRecords.id,
        sessionId: schema.sessionStudentRecords.sessionId,
        attendanceStatus: schema.sessionStudentRecords.attendanceStatus,
        absenceReason: schema.sessionStudentRecords.absenceReason,
        surahNumber: schema.sessionStudentRecords.surahNumber,
        surahName: schema.sessionStudentRecords.surahName,
        ayahStart: schema.sessionStudentRecords.ayahStart,
        ayahEnd: schema.sessionStudentRecords.ayahEnd,
        teacherRemarque: schema.sessionStudentRecords.teacherRemarque,
        isAssessed: schema.sessionStudentRecords.isAssessed,
        date: schema.sessions.date,
        sessionTimeText: schema.sessions.sessionTimeText,
        sessionType: schema.sessions.sessionType,
      })
      .from(schema.sessionStudentRecords)
      .innerJoin(schema.sessions, eq(schema.sessionStudentRecords.sessionId, schema.sessions.id))
      .where(eq(schema.sessionStudentRecords.studentId, studentId))
      .orderBy(desc(schema.sessions.date));

    // Also fetch general attendances if any exist
    const attendanceRecords = await db
      .select()
      .from(schema.attendances)
      .where(eq(schema.attendances.studentId, studentId))
      .orderBy(desc(schema.attendances.date));

    // 2. Find the latest session where student was PRESENT (or late with assessment)
    const lastPresentSession = sessionRecords.find(r => (r.attendanceStatus === 'present' || r.attendanceStatus === 'late') && r.surahName);

    // Last progress: latest verse + surah student was on + comment from that session
    const lastProgress = lastPresentSession ? {
      surahName: lastPresentSession.surahName,
      surahNumber: lastPresentSession.surahNumber,
      latestVerse: lastPresentSession.ayahEnd || lastPresentSession.ayahStart || 1,
      ayahStart: lastPresentSession.ayahStart,
      ayahEnd: lastPresentSession.ayahEnd,
      date: lastPresentSession.date,
      teacherRemarque: lastPresentSession.teacherRemarque || null
    } : {
      surahName: student.currentSurahName || 'الفاتحة',
      surahNumber: student.currentSurahNumber || 1,
      latestVerse: student.currentAyah || 1,
      ayahStart: 1,
      ayahEnd: student.currentAyah || 1,
      date: null,
      teacherRemarque: student.notes || null
    };

    // 3. Collect combined unique latest 5 sessions
    const sessionsList: Array<{
      date: string;
      status: string;
      reason?: string | null;
      comment?: string | null;
      surahName?: string | null;
      ayahStart?: number | null;
      ayahEnd?: number | null;
    }> = [];

    const seenDates = new Set<string>();

    for (const rec of sessionRecords) {
      if (!seenDates.has(rec.date)) {
        seenDates.add(rec.date);
        sessionsList.push({
          date: rec.date,
          status: rec.attendanceStatus,
          reason: rec.absenceReason,
          comment: rec.teacherRemarque,
          surahName: rec.surahName,
          ayahStart: rec.ayahStart,
          ayahEnd: rec.ayahEnd,
        });
      }
      if (sessionsList.length >= 5) break;
    }

    if (sessionsList.length < 5) {
      for (const att of attendanceRecords) {
        if (!seenDates.has(att.date)) {
          seenDates.add(att.date);
          sessionsList.push({
            date: att.date,
            status: att.status,
            reason: att.reason,
            comment: null,
            surahName: null,
            ayahStart: null,
            ayahEnd: null
          });
        }
        if (sessionsList.length >= 5) break;
      }
    }

    sessionsList.sort((a, b) => b.date.localeCompare(a.date));

    return c.json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        avatar: student.avatar,
        currentSurahName: student.currentSurahName,
        currentAyah: student.currentAyah
      },
      lastProgress,
      latestSessions: sessionsList.slice(0, 5)
    });
  } catch (err: any) {
    console.error('Error fetching student history:', err);
    return c.json({ error: err.message || 'فشل في جلب سجل الطالب' }, 500);
  }
});
