import { OperationRegistry } from '../operationRegistry.js';
import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { ensureDatabaseInitialized } from '../../db/init.js';
import { getSessionId } from '../session.js';
import { hashPassword } from '../authService.js';

export const teachersRouter = new OperationRegistry();

// Middleware helper to check if current user is admin
async function isAdminUser(c: any) {
  const sessionId = getSessionId(c);
  if (!sessionId) return false;

  const user = await db.select().from(schema.users).where(eq(schema.users.id, sessionId)).then(r => r[0]);
  if (!user) return false;

  if (user.role === 'admin') return true;

  // Check if associated teacher has isAdmin flag
  const teacher = await db.select().from(schema.teachers).where(eq(schema.teachers.userId, user.id)).then(r => r[0]);
  return !!(teacher && teacher.isAdmin);
}

// GET all teachers
teachersRouter.get('/', async (c) => {
  await ensureDatabaseInitialized();
  const q = c.req.query('q')?.trim() || '';

  const allTeachers = await db.select().from(schema.teachers).orderBy(schema.teachers.name);
  const allGroupTeachers = await db.select().from(schema.groupTeachers);
  const allGroups = await db.select().from(schema.groups);
  const allStudents = await db.select().from(schema.students);
  const allGroupTypes = await db.select().from(schema.groupTypes);

  const groupMap = new Map(allGroups.map(g => [g.id, g]));
  const typeMap = new Map(allGroupTypes.map(gt => [gt.id, gt]));

  let result = allTeachers.map(teacher => {
    const assignedGt = allGroupTeachers.filter(gt => gt.teacherId === teacher.id);
    const assignedGroups = assignedGt.map(gt => {
      const grp = groupMap.get(gt.groupId);
      if (!grp) return null;
      const matchedType = typeMap.get(grp.typeId);
      return { 
        id: grp.id, 
        number: grp.number, 
        type: matchedType?.name || 'حلقة عامة', 
        typeSlug: matchedType?.slug || 'general',
        studyTime: grp.studyTime, 
        role: gt.role 
      };
    }).filter(Boolean);

    // Count students taught across these groups
    const groupIds = assignedGroups.map((g: any) => g.id);
    const studentsTaughtCount = allStudents.filter(s => s.groupId && groupIds.includes(s.groupId)).length;

    // Avatar format: teacher.avatar or fallback to /api/storage/teacher-{id}
    const avatar = teacher.avatar || `/api/storage/teacher-${teacher.id}`;

    return {
      ...teacher,
      avatar,
      assignedGroups,
      studentsCount: studentsTaughtCount
    };
  });

  if (q) {
    const lower = q.toLowerCase();
    result = result.filter(t => 
      t.name.toLowerCase().includes(lower) ||
      (t.email && t.email.toLowerCase().includes(lower)) ||
      (t.phone && t.phone.toLowerCase().includes(lower)) ||
      (t.specialization && t.specialization.toLowerCase().includes(lower))
    );
  }

  return c.json({ teachers: result });
});

// GET single teacher
teachersRouter.get('/:id', async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param('id');
  const teacher = await db.select().from(schema.teachers).where(eq(schema.teachers.id, id)).then(r => r[0]);

  if (!teacher) {
    return c.json({ error: 'Teacher not found' }, 404);
  }

  const assignedGt = await db.select().from(schema.groupTeachers).where(eq(schema.groupTeachers.teacherId, id));
  const allGroups = await db.select().from(schema.groups);
  const allGroupTypes = await db.select().from(schema.groupTypes);
  const groupMap = new Map(allGroups.map(g => [g.id, g]));
  const typeMap = new Map(allGroupTypes.map(gt => [gt.id, gt]));

  const assignedGroups = assignedGt.map(gt => {
    const grp = groupMap.get(gt.groupId);
    if (!grp) return null;
    const matchedType = typeMap.get(grp.typeId);
    return {
      ...grp,
      type: matchedType?.name || 'حلقة عامة',
      typeSlug: matchedType?.slug || 'general',
      role: gt.role
    };
  }).filter(Boolean);

  const allStudents = await db.select().from(schema.students);
  const groupIds = assignedGroups.map((g: any) => g.id);
  const assignedStudents = allStudents.filter(s => s.groupId && groupIds.includes(s.groupId)).map(s => ({
    ...s,
    avatar: `/api/storage/student-${s.id}`
  }));

  const avatar = `/api/storage/teacher-${teacher.id}`;

  return c.json({
    teacher: {
      ...teacher,
      avatar,
      assignedGroups,
      students: assignedStudents
    }
  });
});

// POST new teacher
teachersRouter.post('/', async (c) => {
  await ensureDatabaseInitialized();
  try {
    const body = await c.req.json();
    const id = body.id || `tch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const avatar = body.avatar || `/api/storage/teacher-${id}`;

    // 1. Create user credential record if email is provided
    let userId: string | null = null;
    if (body.email && body.email.trim()) {
      const emailLower = body.email.trim().toLowerCase();
      const existingUser = await db.select().from(schema.users).where(eq(schema.users.email, emailLower)).then(r => r[0]);
      
      if (existingUser) {
        userId = existingUser.id;
      } else {
        userId = `usr_tch_${id}`;
        await db.insert(schema.users).values({
          id: userId,
          name: body.name?.trim() || 'معلم جديد',
          email: emailLower,
          password: await hashPassword(body.password || 'password123'),
          role: body.isAdmin ? 'admin' : 'teacher',
          avatar
        });
      }
    }

    const newTeacher = {
      id,
      name: body.name?.trim(),
      email: body.email?.trim() || null,
      phone: body.phone?.trim() || null,
      avatar,
      specialization: body.specialization?.trim() || 'Tajweed & Hifz',
      bio: body.bio?.trim() || null,
      status: body.status || 'active',
      userId,
      isAdmin: !!body.isAdmin,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (!newTeacher.name) {
      return c.json({ error: 'Teacher full name is required' }, 400);
    }

    await db.insert(schema.teachers).values(newTeacher);

    // If initial group IDs passed
    if (Array.isArray(body.groupIds) && body.groupIds.length > 0) {
      for (const gid of body.groupIds) {
        await db.insert(schema.groupTeachers).values({
          id: `gt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          groupId: gid,
          teacherId: id,
          role: 'lead'
        }).onConflictDoNothing();
      }
    }

    return c.json({ success: true, teacher: newTeacher }, 201);
  } catch (err: any) {
    console.error('Error creating teacher:', err);
    return c.json({ error: err.message || 'Failed to create teacher' }, 500);
  }
});

// PUT edit teacher
teachersRouter.put('/:id', async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const existing = await db.select().from(schema.teachers).where(eq(schema.teachers.id, id)).then(r => r[0]);

    if (!existing) {
      return c.json({ error: 'Teacher not found' }, 404);
    }

    // Backend Role Enforcement: Password changes can only be made by an Admin!
    if (body.password) {
      const isAuthorized = await isAdminUser(c);
      if (!isAuthorized) {
        return c.json({ error: 'غير مصرح لك بتعديل كلمة مرور المعلم. المشرفون فقط مخولون بذلك.' }, 403);
      }
    }

    const avatar = body.avatar || existing.avatar || `/api/storage/teacher-${id}`;

    // 2. Manage Associated User record
    let userId = existing.userId;
    if (body.email && body.email.trim()) {
      const emailLower = body.email.trim().toLowerCase();
      
      if (!userId) {
        // Create user
        userId = `usr_tch_${id}`;
        await db.insert(schema.users).values({
          id: userId,
          name: body.name?.trim() || existing.name,
          email: emailLower,
          password: await hashPassword(body.password || 'password123'),
          role: body.isAdmin ? 'admin' : 'teacher',
          avatar
        }).onConflictDoNothing();
      } else {
        // Update user
        const userUpdatePayload: any = {
          name: body.name?.trim() || existing.name,
          email: emailLower,
          avatar
        };
        if (body.password) {
          userUpdatePayload.password = await hashPassword(body.password);
        }
        if (body.isAdmin !== undefined) {
          userUpdatePayload.role = body.isAdmin ? 'admin' : 'teacher';
        }
        await db.update(schema.users).set(userUpdatePayload).where(eq(schema.users.id, userId));
      }
    }

    const updatedData: any = {
      name: body.name?.trim() ?? existing.name,
      email: body.email !== undefined ? body.email?.trim() : existing.email,
      phone: body.phone !== undefined ? body.phone?.trim() : existing.phone,
      avatar,
      specialization: body.specialization?.trim() ?? existing.specialization,
      bio: body.bio !== undefined ? body.bio : existing.bio,
      status: body.status ?? existing.status,
      userId,
      updatedAt: new Date()
    };

    if (body.isAdmin !== undefined) {
      updatedData.isAdmin = !!body.isAdmin;
    }

    await db.update(schema.teachers).set(updatedData).where(eq(schema.teachers.id, id));

    // Update group assignments if provided
    if (Array.isArray(body.groupIds)) {
      await db.delete(schema.groupTeachers).where(eq(schema.groupTeachers.teacherId, id));
      for (const gid of body.groupIds) {
        await db.insert(schema.groupTeachers).values({
          id: `gt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          groupId: gid,
          teacherId: id,
          role: 'lead'
        });
      }
    }

    return c.json({ success: true, teacher: { ...existing, ...updatedData } });
  } catch (err: any) {
    console.error('Error updating teacher:', err);
    return c.json({ error: err.message || 'Failed to update teacher' }, 500);
  }
});

// DELETE teacher
teachersRouter.delete('/:id', async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param('id');
  try {
    await db.delete(schema.groupTeachers).where(eq(schema.groupTeachers.teacherId, id));
    await db.delete(schema.teachers).where(eq(schema.teachers.id, id));
    return c.json({ success: true, message: 'Teacher deleted successfully' });
  } catch (err: any) {
    return c.json({ error: err.message || 'Failed to delete teacher' }, 500);
  }
});
