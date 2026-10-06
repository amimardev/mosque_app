import 'dotenv/config';

export default async function globalSetup() {
  const testDatabaseUrl = process.env.DATABASE_URL_TEST;
  if (!testDatabaseUrl) {
    throw new Error('DATABASE_URL_TEST must be set before running Playwright tests.');
  }
  if (process.env.DATABASE_URL && process.env.DATABASE_URL === testDatabaseUrl) {
    throw new Error('DATABASE_URL_TEST must be separate from DATABASE_URL.');
  }

  // Seed the dedicated test database with the sole administrator account.
  const originalDatabaseUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = testDatabaseUrl;

  const [{ db }, schema, { ensureDatabaseInitialized }, { hashPassword }, { eq, sql }] = await Promise.all([
    import('../../src/db/index.js'),
    import('../../src/db/schema.js'),
    import('../../src/db/init.js'),
    import('../../src/server/authService.js'),
    import('drizzle-orm'),
  ]);

  await ensureDatabaseInitialized();
  await db.execute(sql`
    TRUNCATE TABLE
      users,
      teachers,
      students,
      parents,
      groups,
      group_types,
      sessions,
      group_teachers,
      attendances,
      student_ratings,
      notifications,
      auth_sessions
    RESTART IDENTITY CASCADE
  `);

  const password = await hashPassword('admin123');
  await db.insert(schema.users).values({
    id: 'usr_admin_rabeh',
    name: 'رابح',
    email: 'admin@local.invalid',
    phone: '0553588565',
    password,
    role: 'teacher',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=rabeh',
  }).onConflictDoUpdate({
    target: schema.users.phone,
    set: { name: 'رابح', password, role: 'teacher' },
  });

  const [user] = await db.select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.phone, '0553588565'))
    .limit(1);

  await db.insert(schema.teachers).values({
    id: 'tch_admin_rabeh',
    name: 'رابح',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=rabeh',
    userId: user.id,
    isAdmin: true,
  }).onConflictDoUpdate({
    target: schema.teachers.id,
    set: { name: 'رابح', userId: user.id, isAdmin: true },
  });

  // Avoid leaking the test URL into Playwright's worker processes. The app
  // server gets DATABASE_URL_TEST separately through webServer.env.
  if (originalDatabaseUrl === undefined) delete process.env.DATABASE_URL;
  else process.env.DATABASE_URL = originalDatabaseUrl;
}
