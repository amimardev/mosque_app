import { and, count, desc, eq, isNull } from 'drizzle-orm';
import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { ensureDatabaseInitialized } from '../../db/init.js';
import { getSessionId } from '../session.js';
import { OperationRegistry } from '../operationRegistry.js';

export const notificationsRouter = new OperationRegistry();

async function getParentUserId(c: any) {
  const userId = getSessionId(c);
  if (!userId) return null;
  const user = await db.select({ id: schema.users.id, role: schema.users.role })
    .from(schema.users).where(eq(schema.users.id, userId)).then(rows => rows[0]);
  return user?.role === 'parent' ? user.id : null;
}

notificationsRouter.get('/', async (c) => {
  await ensureDatabaseInitialized();
  const userId = await getParentUserId(c);
  if (!userId) return c.json({ error: 'الإشعارات متاحة لحسابات أولياء الأمور فقط' }, 403);

  const items = await db.select().from(schema.notifications)
    .where(eq(schema.notifications.userId, userId))
    .orderBy(desc(schema.notifications.createdAt))
    .limit(30);
  const [{ unreadCount }] = await db.select({ unreadCount: count() }).from(schema.notifications).where(and(
    eq(schema.notifications.userId, userId),
    isNull(schema.notifications.readAt),
  ));

  return c.json({ notifications: items, unreadCount });
});

notificationsRouter.post('/read-all', async (c) => {
  await ensureDatabaseInitialized();
  const userId = await getParentUserId(c);
  if (!userId) return c.json({ error: 'الإشعارات متاحة لحسابات أولياء الأمور فقط' }, 403);

  await db.update(schema.notifications).set({ readAt: new Date() }).where(and(
    eq(schema.notifications.userId, userId),
    isNull(schema.notifications.readAt),
  ));
  return c.json({ success: true });
});

notificationsRouter.put('/:id/read', async (c) => {
  await ensureDatabaseInitialized();
  const userId = await getParentUserId(c);
  if (!userId) return c.json({ error: 'الإشعارات متاحة لحسابات أولياء الأمور فقط' }, 403);

  await db.update(schema.notifications).set({ readAt: new Date() }).where(and(
    eq(schema.notifications.id, c.req.param('id')),
    eq(schema.notifications.userId, userId),
    isNull(schema.notifications.readAt),
  ));
  return c.json({ success: true });
});
