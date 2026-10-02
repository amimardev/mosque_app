import { Hono } from 'hono';
import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { eq, or } from 'drizzle-orm';
import { ensureDatabaseInitialized } from '../../db/init.js';

export const groupTypesRouter = new Hono();

function generateSlug(text: string): string {
  const cleaned = text
    .trim()
    .toLowerCase()
    .replace(/[\s\t\n]+/g, '-')
    .replace(/[^\w\u0621-\u064A\-]/g, '')
    .replace(/-+/g, '-');
  return cleaned || `type-${Date.now()}`;
}

// GET all group types with their groups and students counts
groupTypesRouter.get('/', async (c) => {
  await ensureDatabaseInitialized();
  const allTypes = await db.select().from(schema.groupTypes).orderBy(schema.groupTypes.createdAt);
  const allGroups = await db.select().from(schema.groups);
  const allStudents = await db.select().from(schema.students);

  const result = allTypes.map(gt => {
    // Match groups by foreign key typeId
    const matchedGroups = allGroups.filter(g => g.typeId === gt.id);

    let totalStudents = 0;
    matchedGroups.forEach(g => {
      const gStudents = allStudents.filter(s => 
        s.groupId && s.groupId.split(',').map(item => item.trim()).includes(g.id)
      );
      totalStudents += gStudents.length;
    });

    return {
      ...gt,
      groupsCount: matchedGroups.length,
      totalStudents
    };
  });

  return c.json({ groupTypes: result });
});

// GET single group type by id or slug
groupTypesRouter.get('/:identifier', async (c) => {
  await ensureDatabaseInitialized();
  const identifier = decodeURIComponent(c.req.param('identifier'));

  const allTypes = await db.select().from(schema.groupTypes);
  const groupType = allTypes.find(gt => gt.id === identifier || gt.slug === identifier || gt.name === identifier);

  if (!groupType) {
    return c.json({ error: 'Group type not found' }, 404);
  }

  const allGroups = await db.select().from(schema.groups);
  const allStudents = await db.select().from(schema.students);
  const allGroupTeachers = await db.select().from(schema.groupTeachers);
  const allTeachers = await db.select().from(schema.teachers);
  const teacherMap = new Map(allTeachers.map(t => [t.id, t]));

  const matchedGroups = allGroups
    .filter(g => g.typeId === groupType.id)
    .sort((a, b) => a.number - b.number)
    .map(group => {
      const assignedGt = allGroupTeachers.filter(gt => gt.groupId === group.id);
      const teachersList = assignedGt.map(gt => {
        const t = teacherMap.get(gt.teacherId);
        return t ? { ...t, role: gt.role } : null;
      }).filter(Boolean);

      const groupStudents = allStudents.filter(s => 
        s.groupId && s.groupId.split(',').map(item => item.trim()).includes(group.id)
      );

      return {
        ...group,
        type: groupType.name,
        typeSlug: groupType.slug,
        groupType,
        teachers: teachersList,
        studentsCount: groupStudents.length
      };
    });

  let totalStudents = 0;
  matchedGroups.forEach(g => {
    totalStudents += g.studentsCount;
  });

  return c.json({
    groupType: {
      ...groupType,
      groupsCount: matchedGroups.length,
      totalStudents,
      groups: matchedGroups
    }
  });
});

// POST create group type
groupTypesRouter.post('/', async (c) => {
  await ensureDatabaseInitialized();
  try {
    const body = await c.req.json();
    const name = body.name?.trim();

    if (!name) {
      return c.json({ error: 'Group type name is required' }, 400);
    }

    const slug = (body.slug?.trim() ? generateSlug(body.slug) : generateSlug(name));
    const id = `gt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Check if name or slug already exists
    const existing = await db.select().from(schema.groupTypes)
      .where(or(eq(schema.groupTypes.name, name), eq(schema.groupTypes.slug, slug)))
      .then(r => r[0]);

    if (existing) {
      return c.json({ error: 'A group type with this name or slug already exists' }, 400);
    }

    const newType = {
      id,
      name,
      slug,
      description: body.description?.trim() || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.insert(schema.groupTypes).values(newType);

    return c.json({ success: true, groupType: newType }, 201);
  } catch (err: any) {
    console.error('Error creating group type:', err);
    return c.json({ error: err.message || 'Failed to create group type' }, 500);
  }
});

// PUT update group type
groupTypesRouter.put('/:id', async (c) => {
  await ensureDatabaseInitialized();
  const id = decodeURIComponent(c.req.param('id'));

  try {
    const body = await c.req.json();
    const allTypes = await db.select().from(schema.groupTypes);
    const existing = allTypes.find(gt => gt.id === id || gt.slug === id);

    if (!existing) {
      return c.json({ error: 'Group type not found' }, 404);
    }

    const newName = body.name?.trim() || existing.name;
    const newSlug = body.slug?.trim() ? generateSlug(body.slug) : (body.name ? generateSlug(body.name) : existing.slug);
    const newDescription = body.description !== undefined ? (body.description?.trim() || null) : existing.description;

    const updated = {
      name: newName,
      slug: newSlug,
      description: newDescription,
      updatedAt: new Date()
    };

    await db.update(schema.groupTypes).set(updated).where(eq(schema.groupTypes.id, existing.id));

    return c.json({ success: true, groupType: { ...existing, ...updated } });
  } catch (err: any) {
    console.error('Error updating group type:', err);
    return c.json({ error: err.message || 'Failed to update group type' }, 500);
  }
});

// DELETE group type
groupTypesRouter.delete('/:id', async (c) => {
  await ensureDatabaseInitialized();
  const id = decodeURIComponent(c.req.param('id'));

  try {
    const allTypes = await db.select().from(schema.groupTypes);
    const existing = allTypes.find(gt => gt.id === id || gt.slug === id);

    if (!existing) {
      return c.json({ error: 'Group type not found' }, 404);
    }

    // Unlink or delete groups belonging to this type
    await db.delete(schema.groupTypes).where(eq(schema.groupTypes.id, existing.id));

    return c.json({ success: true, message: 'Group type deleted' });
  } catch (err: any) {
    console.error('Error deleting group type:', err);
    return c.json({ error: err.message || 'Failed to delete group type' }, 500);
  }
});
