import { Hono } from 'hono';
import { db } from '../../db';
import * as schema from '../../db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import { ensureDatabaseInitialized } from '../../db/init';
import { getSurahByNumber } from '../../lib/quranData';

export const groupsRouter = new Hono();

// GET all groups
groupsRouter.get('/', async (c) => {
  await ensureDatabaseInitialized();
  const q = c.req.query('q')?.trim() || '';

  const allGroups = await db.select().from(schema.groups).orderBy(schema.groups.number);
  const allGroupTeachers = await db.select().from(schema.groupTeachers);
  const allTeachers = await db.select().from(schema.teachers);
  const allStudents = await db.select().from(schema.students);
  const allGroupTypes = await db.select().from(schema.groupTypes);

  const teacherMap = new Map(allTeachers.map(t => [t.id, t]));
  const typeMap = new Map(allGroupTypes.map(gt => [gt.id, gt]));

  let result = allGroups.map(group => {
    const assignedGt = allGroupTeachers.filter(gt => gt.groupId === group.id);
    const teachersList = assignedGt.map(gt => {
      const t = teacherMap.get(gt.teacherId);
      return t ? { ...t, role: gt.role } : null;
    }).filter(Boolean);

    const groupStudents = allStudents.filter(s => s.groupId && s.groupId.split(',').map(item => item.trim()).includes(group.id));
    const matchedType = (group.typeId ? typeMap.get(group.typeId) : null) || allGroupTypes[0] || null;

    return {
      ...group,
      typeId: matchedType?.id || group.typeId,
      type: matchedType?.name || 'حلقة قرآنية',
      typeSlug: matchedType?.slug || 'general',
      groupType: matchedType,
      teachers: teachersList,
      studentsCount: groupStudents.length,
      studentsPreview: groupStudents.slice(0, 5).map(s => ({
        id: s.id,
        name: s.name,
        avatar: s.avatar,
        currentSurahName: s.currentSurahName,
        currentAyah: s.currentAyah
      }))
    };
  });

  if (q) {
    const lower = q.toLowerCase();
    result = result.filter(g => 
      String(g.number).includes(lower) ||
      g.type.toLowerCase().includes(lower) ||
      (g.studyTime && g.studyTime.toLowerCase().includes(lower)) ||
      (g.room && g.room.toLowerCase().includes(lower)) ||
      (g.level && g.level.toLowerCase().includes(lower))
    );
  }

  return c.json({ groups: result });
});

// GET single group by typeSlug and groupNumber
groupsRouter.get('/by-type-and-number/:typeSlug/:groupNumber', async (c) => {
  await ensureDatabaseInitialized();
  const typeSlug = decodeURIComponent(c.req.param('typeSlug'));
  const groupNumber = parseInt(c.req.param('groupNumber'), 10);

  const allGroupTypes = await db.select().from(schema.groupTypes);
  const matchedType = allGroupTypes.find(gt => gt.slug === typeSlug || gt.id === typeSlug || gt.name === typeSlug);

  const allGroups = await db.select().from(schema.groups);
  const foundGroup = allGroups.find(g => {
    const matchesNumber = g.number === groupNumber;
    const matchesType = matchedType ? g.typeId === matchedType.id : true;
    return matchesNumber && matchesType;
  });

  if (!foundGroup) {
    return c.json({ error: 'Group not found' }, 404);
  }

  // Get assigned teachers
  const gTeachers = await db.select().from(schema.groupTeachers).where(eq(schema.groupTeachers.groupId, foundGroup.id));
  const allTeachers = await db.select().from(schema.teachers);
  const teachersList = gTeachers.map(gt => {
    const t = allTeachers.find(item => item.id === gt.teacherId);
    return t ? { ...t, role: gt.role } : null;
  }).filter(Boolean);

  // Get assigned students
  const allStudents = await db.select().from(schema.students);
  const studentsList = allStudents.filter(s => s.groupId && s.groupId.split(',').map(item => item.trim()).includes(foundGroup.id));
  studentsList.sort((a, b) => a.name.localeCompare(b.name));
  const allRatings = await db.select().from(schema.studentRatings).where(eq(schema.studentRatings.groupId, foundGroup.id)).orderBy(desc(schema.studentRatings.createdAt));

  const enrichedStudents = studentsList.map(s => {
    const latestRating = allRatings.find(r => r.studentId === s.id) || null;
    const surahData = getSurahByNumber(s.currentSurahNumber);
    return {
      ...s,
      latestRating,
      surahDetails: surahData || null
    };
  });

  return c.json({
    group: {
      ...foundGroup,
      type: matchedType?.name || 'حلقة قرآنية',
      typeSlug: matchedType?.slug || typeSlug,
      groupType: matchedType || null,
      teachers: teachersList,
      students: enrichedStudents,
      studentsCount: enrichedStudents.length
    }
  });
});

// GET single group by ID (with detailed teachers and all students)
groupsRouter.get('/:id', async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param('id');
  const group = await db.select().from(schema.groups).where(eq(schema.groups.id, id)).then(r => r[0]);

  if (!group) {
    return c.json({ error: 'Group not found' }, 404);
  }

  const allGroupTypes = await db.select().from(schema.groupTypes);
  const matchedType = allGroupTypes.find(gt => gt.id === group.typeId) || null;

  // Get assigned teachers
  const gTeachers = await db.select().from(schema.groupTeachers).where(eq(schema.groupTeachers.groupId, id));
  const allTeachers = await db.select().from(schema.teachers);
  const teachersList = gTeachers.map(gt => {
    const t = allTeachers.find(item => item.id === gt.teacherId);
    return t ? { ...t, role: gt.role } : null;
  }).filter(Boolean);

  // Get assigned students
  const allStudents = await db.select().from(schema.students);
  const studentsList = allStudents.filter(s => s.groupId && s.groupId.split(',').map(item => item.trim()).includes(id));
  studentsList.sort((a, b) => a.name.localeCompare(b.name));
  const allRatings = await db.select().from(schema.studentRatings).where(eq(schema.studentRatings.groupId, id)).orderBy(desc(schema.studentRatings.createdAt));

  const enrichedStudents = studentsList.map(s => {
    const latestRating = allRatings.find(r => r.studentId === s.id) || null;
    const surahData = getSurahByNumber(s.currentSurahNumber);
    return {
      ...s,
      latestRating,
      surahDetails: surahData || null
    };
  });

  return c.json({
    group: {
      ...group,
      type: matchedType?.name || 'حلقة قرآنية',
      typeSlug: matchedType?.slug || 'general',
      groupType: matchedType,
      teachers: teachersList,
      students: enrichedStudents,
      studentsCount: enrichedStudents.length
    }
  });
});

// POST new group
groupsRouter.post('/', async (c) => {
  await ensureDatabaseInitialized();
  try {
    const body = await c.req.json();
    const id = `grp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    let typeId = body.typeId?.trim();
    if (!typeId && body.type) {
      const gt = await db.select().from(schema.groupTypes).where(eq(schema.groupTypes.name, body.type)).then(r => r[0]);
      if (gt) typeId = gt.id;
    }

    if (!typeId) {
      return c.json({ error: 'Group typeId is required' }, 400);
    }

    const newGroup = {
      id,
      number: parseInt(body.number, 10),
      typeId,
      gender: body.gender || 'male',
      sessionTime: body.sessionTime || null,
      studyTime: body.studyTime?.trim() || 'من 16:30 إلى 18:00',
      days: Array.isArray(body.days) ? body.days : ['Monday', 'Wednesday'],
      timeSlot: body.timeSlot?.trim() || '16:30 - 18:00',
      room: body.room?.trim() || 'قاعة المحراب الرئيسية',
      capacity: parseInt(body.capacity, 10) || 20,
      level: body.level || 'Intermediate',
      status: body.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (isNaN(newGroup.number)) {
      return c.json({ error: 'Group number is required' }, 400);
    }

    await db.insert(schema.groups).values(newGroup);

    // Assign teachers if array provided
    if (Array.isArray(body.teacherIds) && body.teacherIds.length > 0) {
      for (const [idx, tid] of body.teacherIds.entries()) {
        await db.insert(schema.groupTeachers).values({
          id: `gt_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
          groupId: id,
          teacherId: tid,
          role: idx === 0 ? 'lead' : 'assistant'
        });
      }
    }

    return c.json({ success: true, group: newGroup }, 201);
  } catch (err: any) {
    console.error('Error creating group:', err);
    return c.json({ error: err.message || 'Failed to create group' }, 500);
  }
});

// PUT edit group
groupsRouter.put('/:id', async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const existing = await db.select().from(schema.groups).where(eq(schema.groups.id, id)).then(r => r[0]);

    if (!existing) {
      return c.json({ error: 'Group not found' }, 404);
    }

    const typeId = body.typeId !== undefined ? (body.typeId?.trim() || existing.typeId) : existing.typeId;

    const updatedData = {
      number: body.number !== undefined ? parseInt(body.number, 10) : existing.number,
      typeId,
      gender: body.gender ?? existing.gender,
      sessionTime: body.sessionTime !== undefined ? body.sessionTime : existing.sessionTime,
      studyTime: body.studyTime?.trim() ?? existing.studyTime,
      days: Array.isArray(body.days) ? body.days : existing.days,
      timeSlot: body.timeSlot !== undefined ? body.timeSlot?.trim() : existing.timeSlot,
      room: body.room !== undefined ? body.room?.trim() : existing.room,
      capacity: body.capacity !== undefined ? parseInt(body.capacity, 10) : existing.capacity,
      level: body.level ?? existing.level,
      status: body.status ?? existing.status,
      updatedAt: new Date()
    };

    await db.update(schema.groups).set(updatedData).where(eq(schema.groups.id, id));

    // Update teacher assignments
    if (Array.isArray(body.teacherIds)) {
      await db.delete(schema.groupTeachers).where(eq(schema.groupTeachers.groupId, id));
      for (const [idx, tid] of body.teacherIds.entries()) {
        await db.insert(schema.groupTeachers).values({
          id: `gt_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
          groupId: id,
          teacherId: tid,
          role: idx === 0 ? 'lead' : 'assistant'
        });
      }
    }

    // Update student assignments if studentIds is provided as an array
    if (Array.isArray(body.studentIds)) {
      const allStudents = await db.select().from(schema.students);
      for (const student of allStudents) {
        const assignedGroupIds = student.groupId ? student.groupId.split(',').map(item => item.trim()).filter(Boolean) : [];
        const isAssignedToThisGroup = assignedGroupIds.includes(id);
        const shouldBeAssigned = body.studentIds.includes(student.id);

        if (shouldBeAssigned && !isAssignedToThisGroup) {
          const newGroupIds = [...assignedGroupIds, id].join(',');
          await db.update(schema.students).set({ groupId: newGroupIds }).where(eq(schema.students.id, student.id));
        } else if (!shouldBeAssigned && isAssignedToThisGroup) {
          const newGroupIds = assignedGroupIds.filter(gid => gid !== id).join(',') || null;
          await db.update(schema.students).set({ groupId: newGroupIds }).where(eq(schema.students.id, student.id));
        }
      }
    }

    return c.json({ success: true, group: { ...existing, ...updatedData } });
  } catch (err: any) {
    console.error('Error updating group:', err);
    return c.json({ error: err.message || 'Failed to update group' }, 500);
  }
});

// POST bulk update timing for multiple groups
groupsRouter.post('/bulk-update-time', async (c) => {
  await ensureDatabaseInitialized();
  try {
    const body = await c.req.json();
    const { groupIds, sessionTime, studyTime } = body;

    if (!Array.isArray(groupIds) || groupIds.length === 0) {
      return c.json({ error: 'لم يتم تحديد أي حلقات للتحديث' }, 400);
    }

    if (!sessionTime) {
      return c.json({ error: 'تفاصيل الوقت المطلوبة غير متوفرة' }, 400);
    }

    await db.update(schema.groups)
      .set({
        sessionTime,
        studyTime: studyTime || null,
        updatedAt: new Date()
      })
      .where(inArray(schema.groups.id, groupIds));

    return c.json({ 
      success: true, 
      message: `تم تحديث توقيت ${groupIds.length} حلقات بنجاح`,
      updatedCount: groupIds.length 
    });
  } catch (err: any) {
    console.error('Error bulk updating group timing:', err);
    return c.json({ error: err.message || 'فشل في تحديث توقيت الحلقات بالجملة' }, 500);
  }
});

// DELETE group
groupsRouter.delete('/:id', async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param('id');
  try {
    // Unassign students from this group
    await db.update(schema.students).set({ groupId: null }).where(eq(schema.students.groupId, id));
    await db.delete(schema.groupTeachers).where(eq(schema.groupTeachers.groupId, id));
    await db.delete(schema.groups).where(eq(schema.groups.id, id));
    return c.json({ success: true, message: 'Group deleted successfully' });
  } catch (err: any) {
    return c.json({ error: err.message || 'Failed to delete group' }, 500);
  }
});
