import { OperationRegistry } from '../operationRegistry.js';
import { randomUUID } from 'node:crypto';
import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { eq, and, desc, like } from 'drizzle-orm';
import { ensureDatabaseInitialized } from '../../db/init.js';
import { sendAttendancePush } from '../onesignal.js';

export const attendancesRouter = new OperationRegistry();

async function notifyParentOfAttendanceChange(studentId: string, groupId: string, date: string, status: string, previousStatus?: string | null) {
  if ((status !== 'absent' && status !== 'late') || status === previousStatus) return;

  const student = await db.select({ name: schema.students.name, parentUserId: schema.parents.userId })
    .from(schema.students)
    .leftJoin(schema.parents, eq(schema.students.parentId, schema.parents.id))
    .where(eq(schema.students.id, studentId))
    .then(rows => rows[0]);
  if (!student?.parentUserId) return;

  const group = await db.select({ number: schema.groups.number })
    .from(schema.groups).where(eq(schema.groups.id, groupId)).then(rows => rows[0]);
  if (!group) return;

  const late = status === 'late';
  await db.insert(schema.notifications).values({
    id: `ntf_${randomUUID()}`,
    userId: student.parentUserId,
    studentId,
    type: late ? 'attendance_late' : 'attendance_absent',
    title: late ? 'تأخر الطالب عن الحصة' : 'غياب الطالب عن الحصة',
    message: `${student.name} — الحلقة رقم ${group.number}، ${date}`,
    href: '/dashboard/attendance',
  });
  await sendAttendancePush({
    externalId: student.parentUserId,
    title: late ? 'تأخر الطالب عن الحصة' : 'غياب الطالب عن الحصة',
    message: `${student.name} — الحلقة رقم ${group.number}، ${date}`,
    href: '/dashboard/sessions',
  });
}

// GET all attendance records with rich filters
attendancesRouter.get('/', async (c) => {
  await ensureDatabaseInitialized();
  const groupId = c.req.query('groupId')?.trim();
  const studentId = c.req.query('studentId')?.trim();
  const date = c.req.query('date')?.trim();
  const statusFilter = c.req.query('status')?.trim();
  const search = c.req.query('search')?.trim().toLowerCase();

  const allAttendances = await db.select().from(schema.attendances).orderBy(desc(schema.attendances.createdAt));
  const allStudents = await db.select().from(schema.students);
  const allTeachers = await db.select().from(schema.teachers);
  const allGroups = await db.select().from(schema.groups);
  const allGroupTypes = await db.select().from(schema.groupTypes);

  const studentMap = new Map(allStudents.map(s => [s.id, s]));
  const teacherMap = new Map(allTeachers.map(t => [t.id, t]));
  const groupMap = new Map(allGroups.map(g => [g.id, g]));
  const groupTypeMap = new Map(allGroupTypes.map(gt => [gt.id, gt]));

  let enriched = allAttendances.map(att => {
    const student = studentMap.get(att.studentId);
    const teacher = att.recordedByTeacherId ? teacherMap.get(att.recordedByTeacherId) : null;
    const group = groupMap.get(att.groupId);
    const groupType = group ? groupTypeMap.get(group.typeId) : null;

    return {
      ...att,
      groupTypeName: att.groupTypeName || groupType?.name || 'حلقة قرآنية',
      groupNumber: att.groupNumber ?? group?.number,
      student: student ? {
        id: student.id,
        name: student.name,
        avatar: student.avatar,
        gender: student.gender
      } : null,
      teacher: teacher ? {
        id: teacher.id,
        name: teacher.name,
        avatar: teacher.avatar
      } : null,
      group: group ? {
        id: group.id,
        number: group.number,
        type: groupType?.name || 'حلقة قرآنية',
        studyTime: group.studyTime
      } : null
    };
  });

  // Apply filters
  if (groupId) {
    enriched = enriched.filter(a => a.groupId === groupId);
  }
  if (studentId) {
    enriched = enriched.filter(a => a.studentId === studentId);
  }
  if (date) {
    enriched = enriched.filter(a => a.date === date);
  }
  if (statusFilter) {
    enriched = enriched.filter(a => a.status === statusFilter);
  }
  if (search) {
    enriched = enriched.filter(a => 
      a.student?.name.toLowerCase().includes(search) ||
      (a.reason && a.reason.toLowerCase().includes(search)) ||
      (a.sessionTimeText && a.sessionTimeText.toLowerCase().includes(search)) ||
      (a.groupTypeName && a.groupTypeName.toLowerCase().includes(search))
    );
  }

  return c.json({ attendances: enriched });
});

// POST bulk record attendance for a group session
attendancesRouter.post('/bulk', async (c) => {
  await ensureDatabaseInitialized();
  try {
    const body = await c.req.json();
    const { groupId, date, sessionTimeText, recordedByTeacherId, records } = body;

    if (!groupId) {
      return c.json({ error: 'معرف الحلقة مطلوب' }, 400);
    }
    if (!date) {
      return c.json({ error: 'تاريخ الحصة مطلوب' }, 400);
    }
    if (!Array.isArray(records) || records.length === 0) {
      return c.json({ error: 'سجل الحضور والغياب للطلاب فارغ' }, 400);
    }

    // Get group & groupType details
    const group = await db.select().from(schema.groups).where(eq(schema.groups.id, groupId)).then(r => r[0]);
    let groupTypeName = 'حلقة قرآنية';
    if (group?.typeId) {
      const gt = await db.select().from(schema.groupTypes).where(eq(schema.groupTypes.id, group.typeId)).then(r => r[0]);
      if (gt) groupTypeName = gt.name;
    }

    const effectiveSessionTime = sessionTimeText?.trim() || group?.studyTime || 'غير محدد';
    const existingGroupAttendances = await db.select().from(schema.attendances)
      .where(and(eq(schema.attendances.groupId, groupId), eq(schema.attendances.date, date)));

    const existingMap = new Map(existingGroupAttendances.map(item => [item.studentId, item]));

    for (const rec of records) {
      const { studentId, status, reason } = rec;
      if (!studentId || !status) continue;

      const existingRecord = existingMap.get(studentId);

      if (existingRecord) {
        await db.update(schema.attendances)
          .set({
            status,
            reason: reason?.trim() || null,
            sessionTimeText: effectiveSessionTime,
            recordedByTeacherId: recordedByTeacherId || existingRecord.recordedByTeacherId,
            updatedAt: new Date()
          })
          .where(eq(schema.attendances.id, existingRecord.id));
        await notifyParentOfAttendanceChange(studentId, groupId, date, status, existingRecord.status);
      } else {
        const id = `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        await db.insert(schema.attendances).values({
          id,
          studentId,
          groupId,
          groupTypeName,
          groupNumber: group?.number || 1,
          date,
          sessionTimeText: effectiveSessionTime,
          status,
          reason: reason?.trim() || null,
          recordedByTeacherId: recordedByTeacherId || null,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        await notifyParentOfAttendanceChange(studentId, groupId, date, status);
      }
    }

    return c.json({
      success: true,
      message: `تم حفظ سجل الغياب والحضور لعدد ${records.length} طلاب بنجاح`,
      savedCount: records.length
    });
  } catch (err: any) {
    console.error('Error recording group attendance:', err);
    return c.json({ error: err.message || 'فشل في حفظ سجل الحضور والغياب' }, 500);
  }
});

// PUT update single attendance record
attendancesRouter.put('/:id', async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const existing = await db.select().from(schema.attendances).where(eq(schema.attendances.id, id)).then(r => r[0]);

    if (!existing) {
      return c.json({ error: 'سجل الغياب غير موجود' }, 404);
    }

    const updated = {
      status: body.status || existing.status,
      reason: body.reason !== undefined ? (body.reason?.trim() || null) : existing.reason,
      sessionTimeText: body.sessionTimeText?.trim() || existing.sessionTimeText,
      updatedAt: new Date()
    };

    await db.update(schema.attendances).set(updated).where(eq(schema.attendances.id, id));
    await notifyParentOfAttendanceChange(existing.studentId, existing.groupId, existing.date, updated.status, existing.status);
    return c.json({ success: true, attendance: { ...existing, ...updated } });
  } catch (err: any) {
    return c.json({ error: err.message || 'فشل في تعديل سجل الغياب' }, 500);
  }
});

// DELETE attendance record
attendancesRouter.delete('/:id', async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param('id');
  try {
    await db.delete(schema.attendances).where(eq(schema.attendances.id, id));
    return c.json({ success: true, message: 'تم حذف سجل الغياب بنجاح' });
  } catch (err: any) {
    return c.json({ error: err.message || 'فشل في حذف سجل الغياب' }, 500);
  }
});
