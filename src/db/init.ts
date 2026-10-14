import { migrate } from 'drizzle-orm/neon-http/migrator';
import { db } from './index.js';

/**
 * Runtime no-op.
 * Database schema is managed via Drizzle migrations (npm run db:migrate / npm run db:push).
 * User requests will NEVER run DDL statements or schema checks at runtime.
 */
export async function ensureDatabaseInitialized(): Promise<void> {
  return;
}

export async function runMigrations(): Promise<void> {
  console.log('Running Drizzle migrations from ./drizzle ...');
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Drizzle migrations completed successfully.');
}

const isDirectRun = process.argv[1] && (process.argv[1].endsWith('init.ts') || process.argv[1].endsWith('init.js'));
if (isDirectRun) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
