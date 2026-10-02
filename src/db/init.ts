import { sql } from './index.js';

let initialized = false;
let initializingPromise: Promise<void> | null = null;

export async function ensureDatabaseInitialized(): Promise<void> {
  if (initialized) return;
  if (initializingPromise) return initializingPromise;

  initializingPromise = (async () => {
    try {
      // Automatic migration check
      await sql`
        DO $$
        BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='groups' AND column_name='name') OR
             (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='groups') AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='groups' AND column_name='gender')) THEN
            DROP TABLE IF EXISTS student_ratings CASCADE;
            DROP TABLE IF EXISTS group_teachers CASCADE;
            DROP TABLE IF EXISTS students CASCADE;
            DROP TABLE IF EXISTS groups CASCADE;
            DROP TABLE IF EXISTS teachers CASCADE;
            DROP TABLE IF EXISTS users CASCADE;
          END IF;
        END $$;
      `;

      // 1. Create tables
      await sql`
        CREATE TABLE IF NOT EXISTS teachers (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          avatar TEXT NOT NULL,
          specialization TEXT NOT NULL DEFAULT 'Tajweed & Hifz',
          bio TEXT,
          status TEXT NOT NULL DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS group_types (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS groups (
          id TEXT PRIMARY KEY,
          number INTEGER NOT NULL,
          type_id TEXT NOT NULL REFERENCES group_types(id) ON DELETE CASCADE,
          gender TEXT DEFAULT 'male' NOT NULL,
          session_time JSONB,
          study_time TEXT NOT NULL,
          days JSONB DEFAULT '[]'::jsonb NOT NULL,
          time_slot TEXT,
          room TEXT DEFAULT 'Main Halaqa Hall',
          capacity INTEGER DEFAULT 20 NOT NULL,
          level TEXT DEFAULT 'Intermediate' NOT NULL,
          status TEXT DEFAULT 'active' NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `;

      // Schema maintenance: Ensure type_id and session_time columns exist
      await sql`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='groups' AND column_name='type_id') THEN
            ALTER TABLE groups ADD COLUMN type_id TEXT REFERENCES group_types(id) ON DELETE CASCADE;
          END IF;

          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='groups' AND column_name='session_time') THEN
            ALTER TABLE groups ADD COLUMN session_time JSONB;
          END IF;

          -- Clean any orphan groups with NULL type_id by assigning to 'gt_1'
          UPDATE groups SET type_id = 'gt_1' WHERE type_id IS NULL OR type_id = '';

          -- Enforce NOT NULL constraint
          ALTER TABLE groups ALTER COLUMN type_id SET NOT NULL;
        END $$;
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS group_teachers (
          id TEXT PRIMARY KEY,
          group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
          teacher_id TEXT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
          role TEXT DEFAULT 'lead' NOT NULL,
          assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS parents (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT,
          address TEXT,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS students (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          avatar TEXT NOT NULL,
          gender TEXT DEFAULT 'male' NOT NULL,
          date_of_birth TEXT,
          age TEXT,
          parent_id TEXT REFERENCES parents(id) ON DELETE SET NULL,
          email TEXT,
          group_id TEXT REFERENCES groups(id) ON DELETE SET NULL,
          current_surah_number INTEGER DEFAULT 1 NOT NULL,
          current_surah_name TEXT DEFAULT 'Al-Fatihah' NOT NULL,
          current_ayah INTEGER DEFAULT 1 NOT NULL,
          target_juz INTEGER DEFAULT 30,
          memorized_juz_count INTEGER DEFAULT 1 NOT NULL,
          status TEXT DEFAULT 'active' NOT NULL,
          enrollment_date TEXT,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `;

      await sql`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='parent_id') THEN
            ALTER TABLE students ADD COLUMN parent_id TEXT REFERENCES parents(id) ON DELETE SET NULL;
          END IF;
          -- Migrate age column from INTEGER to TEXT to store birth date string
          IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='age' AND data_type='integer') THEN
            ALTER TABLE students ALTER COLUMN age TYPE TEXT USING age::TEXT;
          END IF;
        END $$;
      `;

      // Update existing student records: ensure age column stores the birth date
      try {
        await sql`
          UPDATE students 
          SET age = date_of_birth 
          WHERE date_of_birth IS NOT NULL AND (age IS NULL OR age !~ '-');
        `;
      } catch (e) {
        console.warn('Age migration warning:', e);
      }

      // Migration: Ensure any students with parent_name are linked to parents table, then drop parent_name & parent_phone columns
      try {
        const hasParentNameCol = await sql`
          SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='parent_name';
        `;
        if (Array.isArray(hasParentNameCol) && hasParentNameCol.length > 0) {
          const unlinked = await sql`
            SELECT id, parent_name, parent_phone FROM students WHERE parent_id IS NULL AND parent_name IS NOT NULL AND parent_name != '';
          `;
          if (Array.isArray(unlinked) && unlinked.length > 0) {
            for (const st of unlinked as any[]) {
              const pName = st.parent_name?.trim();
              const pPhone = st.parent_phone?.trim() || 'غير محدد';
              if (!pName) continue;

              const existing = await sql`SELECT id FROM parents WHERE name = ${pName} LIMIT 1;`;
              let pId = '';
              if (Array.isArray(existing) && existing.length > 0) {
                pId = (existing[0] as any).id;
              } else {
                pId = `prn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
                await sql`
                  INSERT INTO parents (id, name, phone, created_at, updated_at)
                  VALUES (${pId}, ${pName}, ${pPhone}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
                `;
              }
              await sql`UPDATE students SET parent_id = ${pId} WHERE id = ${st.id};`;
            }
          }

          // Safely drop parent_name and parent_phone columns from students table
          await sql`
            ALTER TABLE students DROP COLUMN IF EXISTS parent_name;
            ALTER TABLE students DROP COLUMN IF EXISTS parent_phone;
          `;
        }
      } catch (err) {
        console.warn('Parent migration and column drop warning:', err);
      }

      await sql`
        CREATE TABLE IF NOT EXISTS student_ratings (
          id TEXT PRIMARY KEY,
          student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
          teacher_id TEXT REFERENCES teachers(id) ON DELETE SET NULL,
          group_id TEXT REFERENCES groups(id) ON DELETE SET NULL,
          month TEXT NOT NULL,
          hifz_score INTEGER DEFAULT 90 NOT NULL,
          tajweed_score INTEGER DEFAULT 85 NOT NULL,
          murajaah_score INTEGER DEFAULT 88 NOT NULL,
          attendance_score INTEGER DEFAULT 95 NOT NULL,
          behavior_score INTEGER DEFAULT 100 NOT NULL,
          overall_score INTEGER DEFAULT 90 NOT NULL,
          grade TEXT DEFAULT 'Mumtaz (Excellent)' NOT NULL,
          surah_evaluated TEXT,
          ayah_start INTEGER,
          ayah_end INTEGER,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT,
          role TEXT DEFAULT 'admin' NOT NULL,
          avatar TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS auth_sessions (
          token_hash TEXT PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS attendances (
          id TEXT PRIMARY KEY,
          student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
          group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
          group_type_name TEXT,
          group_number INTEGER,
          date TEXT NOT NULL,
          session_time_text TEXT,
          status TEXT DEFAULT 'absent' NOT NULL,
          reason TEXT,
          recorded_by_teacher_id TEXT REFERENCES teachers(id) ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY,
          group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
          teacher_id TEXT REFERENCES teachers(id) ON DELETE SET NULL,
          session_type TEXT NOT NULL DEFAULT 'main',
          date TEXT NOT NULL,
          start_time TEXT,
          end_time TEXT,
          session_time_text TEXT,
          status TEXT NOT NULL DEFAULT 'scheduled',
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS session_student_records (
          id TEXT PRIMARY KEY,
          session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
          student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
          attendance_status TEXT NOT NULL DEFAULT 'absent',
          absence_reason TEXT,
          surah_number INTEGER,
          surah_name TEXT,
          ayah_start INTEGER,
          ayah_end INTEGER,
          teacher_remarque TEXT,
          is_assessed BOOLEAN NOT NULL DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `;

      // Column alterations for users association and sessions
      await sql`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='session_student_records' AND column_name='is_assessed') THEN
            ALTER TABLE session_student_records ADD COLUMN is_assessed BOOLEAN NOT NULL DEFAULT false;
          END IF;

          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teachers' AND column_name='user_id') THEN
            ALTER TABLE teachers ADD COLUMN user_id TEXT REFERENCES users(id) ON DELETE SET NULL;
          END IF;

          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teachers' AND column_name='is_admin') THEN
            ALTER TABLE teachers ADD COLUMN is_admin BOOLEAN DEFAULT FALSE NOT NULL;
          END IF;

          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='parents' AND column_name='user_id') THEN
            ALTER TABLE parents ADD COLUMN user_id TEXT REFERENCES users(id) ON DELETE SET NULL;
          END IF;
        END $$;
      `;

      initialized = true;
    } catch (err) {
      console.error('Failed to initialize Madrasa database:', err);
    } finally {
      initializingPromise = null;
    }
  })();

  return initializingPromise;
}
