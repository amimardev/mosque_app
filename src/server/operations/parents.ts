import { OperationRegistry } from '../operationRegistry.js';
import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { eq, desc, like, or } from 'drizzle-orm';
import { ensureDatabaseInitialized } from '../../db/init.js';
import { getSessionId } from '../session.js';
import { hashPassword } from '../authService.js';
import { calculateAge } from '../../lib/ageUtils.js';

export const parentsRouter = new OperationRegistry();

// Helper to check if current user is admin
async function isAdminUser(c: any) {
  const sessionId = getSessionId(c);
  if (!sessionId) return false;

  const user = await db.select().from(schema.users).where(eq(schema.users.id, sessionId)).then(r => r[0]);
  if (!user) return false;

  if (user.role === 'admin') return true;

  const teacher = await db.select().from(schema.teachers).where(eq(schema.teachers.userId, user.id)).then(r => r[0]);
  return !!(teacher && teacher.isAdmin);
}

// GET all parents with linked students
parentsRouter.get('/', async (c) => {
  await ensureDatabaseInitialized();
  const search = c.req.query('search')?.trim().toLowerCase();

  const allParents = await db.select().from(schema.parents).orderBy(desc(schema.parents.createdAt));
  const allStudents = await db.select().from(schema.students);

  const studentsByParent = new Map<string, typeof allStudents>();
  for (const st of allStudents) {
    if (st.parentId) {
      const list = studentsByParent.get(st.parentId) || [];
      list.push(st);
      studentsByParent.set(st.parentId, list);
    }
  }

  let enriched = allParents.map(parent => {
    const parentStudents = studentsByParent.get(parent.id) || [];
    return {
      ...parent,
      studentsCount: parentStudents.length,
      students: parentStudents.map(st => ({
        id: st.id,
        name: st.name,
        avatar: st.avatar,
        gender: st.gender,
        age: calculateAge(st.dateOfBirth || st.age),
        dateOfBirth: st.dateOfBirth || st.age,
        groupId: st.groupId,
        memorizedJuzCount: st.memorizedJuzCount,
        currentSurahName: st.currentSurahName
      }))
    };
  });

  if (search) {
    enriched = enriched.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.phone.includes(search) ||
      (p.email && p.email.toLowerCase().includes(search)) ||
      p.students.some(st => st.name.toLowerCase().includes(search))
    );
  }

  return c.json({ parents: enriched });
});

// GET single parent by ID
parentsRouter.get('/:id', async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param('id');
  const parent = await db.select().from(schema.parents).where(eq(schema.parents.id, id)).then(r => r[0]);

  if (!parent) {
    return c.json({ error: 'ولي الأمر غير موجود' }, 404);
  }

  const linkedStudents = await db.select().from(schema.students).where(eq(schema.students.parentId, id));

  return c.json({
    parent: {
      ...parent,
      studentsCount: linkedStudents.length,
      students: linkedStudents
    }
  });
});

// POST create new parent
parentsRouter.post('/', async (c) => {
  await ensureDatabaseInitialized();
  try {
    const body = await c.req.json();
    const { name, phone, email, address, notes, password } = body;

    if (!name || !name.trim()) {
      return c.json({ error: 'اسم ولي الأمر مطلوب' }, 400);
    }
    if (!phone || !phone.trim()) {
      return c.json({ error: 'رقم هاتف ولي الأمر مطلوب' }, 400);
    }

    const id = `prn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Create user login if email is specified
    let userId: string | null = null;
    if (email && email.trim()) {
      const emailLower = email.trim().toLowerCase();
      const existingUser = await db.select().from(schema.users).where(eq(schema.users.email, emailLower)).then(r => r[0]);

      if (existingUser) {
        userId = existingUser.id;
      } else {
        userId = `usr_prn_${id}`;
        await db.insert(schema.users).values({
          id: userId,
          name: name.trim(),
          email: emailLower,
          password: await hashPassword(password || 'password123'),
          role: 'parent',
          avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(name.trim())}`
        });
      }
    }

    const newParent = {
      id,
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || null,
      address: address?.trim() || null,
      notes: notes?.trim() || null,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.insert(schema.parents).values(newParent);
    return c.json({ success: true, parent: newParent }, 201);
  } catch (err: any) {
    console.error('Error creating parent:', err);
    return c.json({ error: err.message || 'فشل في إضافة ولي الأمر' }, 500);
  }
});

// PUT update parent
parentsRouter.put('/:id', async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const existing = await db.select().from(schema.parents).where(eq(schema.parents.id, id)).then(r => r[0]);

    if (!existing) {
      return c.json({ error: 'ولي الأمر غير موجود' }, 404);
    }

    // Role Enforcement: Password modification restricted to Admin users
    if (body.password) {
      const isAuthorized = await isAdminUser(c);
      if (!isAuthorized) {
        return c.json({ error: 'غير مصرح لك بتعديل كلمة مرور ولي الأمر. المشرفون فقط مخولون بذلك.' }, 403);
      }
    }

    let userId = existing.userId;
    const parentEmail = body.email !== undefined ? body.email?.trim() : existing.email;

    // Manage user credential linking
    if (parentEmail) {
      const emailLower = parentEmail.toLowerCase();
      if (!userId) {
        userId = `usr_prn_${id}`;
        await db.insert(schema.users).values({
          id: userId,
          name: body.name?.trim() || existing.name,
          email: emailLower,
          password: await hashPassword(body.password || 'password123'),
          role: 'parent',
          avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent((body.name || existing.name).trim())}`
        }).onConflictDoNothing();
      } else {
        const userUpdatePayload: any = {
          name: (body.name || existing.name).trim(),
          email: emailLower
        };
        if (body.password) {
          userUpdatePayload.password = await hashPassword(body.password);
        }
        await db.update(schema.users).set(userUpdatePayload).where(eq(schema.users.id, userId));
      }
    }

    const updated = {
      name: body.name !== undefined ? body.name.trim() : existing.name,
      phone: body.phone !== undefined ? body.phone.trim() : existing.phone,
      email: parentEmail || null,
      address: body.address !== undefined ? (body.address?.trim() || null) : existing.address,
      notes: body.notes !== undefined ? (body.notes?.trim() || null) : existing.notes,
      userId,
      updatedAt: new Date()
    };

    await db.update(schema.parents).set(updated).where(eq(schema.parents.id, id));

    return c.json({ success: true, parent: { ...existing, ...updated } });
  } catch (err: any) {
    console.error('Error updating parent:', err);
    return c.json({ error: err.message || 'فشل في تعديل بيانات ولي الأمر' }, 500);
  }
});

// DELETE parent
parentsRouter.delete('/:id', async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param('id');
  try {
    // Safely unlink any students attached to this parent first
    await db.update(schema.students).set({ parentId: null }).where(eq(schema.students.parentId, id));
    
    // Delete parent record
    await db.delete(schema.parents).where(eq(schema.parents.id, id));
    return c.json({ success: true, message: 'تم حذف ولي الأمر بنجاح' });
  } catch (err: any) {
    console.error('Error deleting parent:', err);
    return c.json({ error: err.message || 'فشل في حذف ولي الأمر' }, 500);
  }
});
