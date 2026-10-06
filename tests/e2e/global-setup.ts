import 'dotenv/config';

export default async function globalSetup() {
  const testDatabaseUrl = process.env.DATABASE_URL_TEST;
  if (!testDatabaseUrl) {
    throw new Error('DATABASE_URL_TEST must be set before running Playwright tests.');
  }
  if (process.env.DATABASE_URL && process.env.DATABASE_URL === testDatabaseUrl) {
    throw new Error('DATABASE_URL_TEST must be separate from DATABASE_URL.');
  }

  // Seed the dedicated test database so the existing parent quick-login button
  // can be exercised without inserting demo users into a normal app database.
  const originalDatabaseUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = testDatabaseUrl;

  const [{ db }, schema, { ensureDatabaseInitialized }, { hashPassword }, { eq }] = await Promise.all([
    import('../../src/db/index.js'),
    import('../../src/db/schema.js'),
    import('../../src/db/init.js'),
    import('../../src/server/authService.js'),
    import('drizzle-orm'),
  ]);

  await ensureDatabaseInitialized();

  const password = await hashPassword('password123');
  const seedUser = async (id: string, name: string, email: string, phone: string, role: string) => {
    const [user] = await db.insert(schema.users).values({ id, name, email, phone, password, role })
      .onConflictDoUpdate({
        target: schema.users.email,
        set: { name, phone, password, role },
      })
      .returning({ id: schema.users.id });
    return user;
  };

  const parentUser = await seedUser('playwright_demo_parent', 'ولي الأمر التجريبي', 'parent@madrasa.iq', '+9647700000003', 'parent');
  const teacherUser = await seedUser('playwright_demo_teacher', 'المعلم التجريبي', 'teacher@madrasa.iq', '+9647700000002', 'teacher');
  await seedUser('playwright_demo_admin', 'مدير تجريبي', 'admin@madrasa.iq', '+9647700000001', 'admin');

  const [parent] = await db.select({ id: schema.parents.id })
    .from(schema.parents)
    .where(eq(schema.parents.userId, parentUser.id))
    .limit(1);

  if (parent) {
    await db.update(schema.parents)
      .set({ name: 'ولي الأمر التجريبي' })
      .where(eq(schema.parents.id, parent.id));
  } else {
    await db.insert(schema.parents).values({
      id: 'playwright_demo_parent_profile',
      name: 'ولي الأمر التجريبي',
      userId: parentUser.id,
    });
  }

  const [teacher] = await db.select({ id: schema.teachers.id })
    .from(schema.teachers)
    .where(eq(schema.teachers.userId, teacherUser.id))
    .limit(1);
  if (teacher) {
    await db.update(schema.teachers)
      .set({
        name: 'المعلم التجريبي',
        avatar: '/images/teachers_faceless_1790530831937.jpg',
        isAdmin: false,
      })
      .where(eq(schema.teachers.id, teacher.id));
  } else {
    await db.insert(schema.teachers).values({
      id: 'playwright_demo_teacher_profile',
      name: 'المعلم التجريبي',
      avatar: '/images/teachers_faceless_1790530831937.jpg',
      userId: teacherUser.id,
      isAdmin: false,
    });
  }

  // Avoid leaking the test URL into Playwright's worker processes. The app
  // server gets DATABASE_URL_TEST separately through webServer.env.
  if (originalDatabaseUrl === undefined) delete process.env.DATABASE_URL;
  else process.env.DATABASE_URL = originalDatabaseUrl;
}
