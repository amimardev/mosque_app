import { sql, db } from './index';
import * as schema from './schema';
import { eq } from 'drizzle-orm';

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

      // Seed default group types first so foreign key constraints always succeed
      await sql`
        INSERT INTO group_types (id, name, slug, description, created_at, updated_at)
        VALUES 
          ('gt_1', 'الحفظ المتقدم والتميز', 'advanced-hifz', 'مسار مخصص للطلاب المتميزين في سرعة الحفظ وإتقان الأداء والمتون العلمية.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
          ('gt_2', 'مسار رواية ورش عن نافع', 'warsh-recitation', 'مسار الإتقان برواية الإمام ورش عن نافع المدني من طريق الأزرق والتطبيق الصوتي.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
          ('gt_3', 'حلقة أشبال جزء عم', 'juz-amma-kids', 'برنامج تأسيسي للصغار والناشئة لتعلم مخارج الحروف وقصار السور والمفصل.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
          ('gt_4', 'حلقة الفجر للتثبيت المكثف', 'fajr-intensive', 'حلقات مباركة بعد صلاة الفجر للمراجعة اليومية وتثبيت محفوظات القرآن الكريم.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO NOTHING;
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

      // 2. Check if initial data exists; if not, seed realistic data
      const existingTeachers = await db.select().from(schema.teachers);
      if (existingTeachers.length === 0) {
        console.log('Seeding initial Quran Madrasa data...');

        // Teachers
        const sampleTeachers = [
          {
            id: 'tch_1',
            name: 'الشيخ عبد الله المنصور',
            email: 'abdullah.mansoor@madrasa.org',
            phone: '+213 550 12 34 56',
            avatar: '/api/storage/teacher-tch_1',
            specialization: 'القراءات العشر والتجويد المتقدم',
            bio: 'مجاز في القراءات العشر المتواترة من الأزهر الشريف مع خبرة تزيد عن 15 عاماً في قيادة حلقات تحفيظ القرآن الكريم وتخريج الحفاظ.',
            status: 'active'
          },
          {
            id: 'tch_2',
            name: 'الأستاذ بلال طارق',
            email: 'bilal.tariq@madrasa.org',
            phone: '+213 551 23 45 67',
            avatar: '/api/storage/teacher-tch_2',
            specialization: 'رواية حفص عن عاصم والمراجعة والتثبيت',
            bio: 'ماجستير في العلوم القرآنية، متخصص في التأسيس الصحيح ومخارج الحروف وتوجيه النشء والشباب في حفظ المتون والقرآن الكريم.',
            status: 'active'
          },
          {
            id: 'tch_3',
            name: 'الشيخ عمر القاسمي',
            email: 'omar.qasimi@madrasa.org',
            phone: '+213 552 34 56 78',
            avatar: '/api/storage/teacher-tch_3',
            specialization: 'رواية ورش عن نافع وأحكام التجويد',
            bio: 'حاصل على الإجازة القرآنية برواية ورش عن نافع من طريق الأزرق، يتميز بالدقة المتناهية في تثبيت ومراجعة متشابهات القرآن الكريم.',
            status: 'active'
          },
          {
            id: 'tch_4',
            name: 'الأستاذ حمزة الخطيب',
            email: 'hamza.khatib@madrasa.org',
            phone: '+213 553 45 67 89',
            avatar: '/api/storage/teacher-tch_4',
            specialization: 'تحفيظ الصغار وشرح تحفة الأطفال',
            bio: 'متخصص في الأساليب التربوية الحديثة لتعليم القرآن للأطفال وتدريس متون التجويد والبرامج التحفيزية والأنشطة الترفيهية الهادفة.',
            status: 'active'
          }
        ];

        for (const t of sampleTeachers) {
          await db.insert(schema.teachers).values(t).onConflictDoNothing();
        }

        // Group Types (Separate Table)
        const sampleGroupTypes = [
          {
            id: 'gt_1',
            name: 'الحفظ المتقدم والتميز',
            slug: 'advanced-hifz',
            description: 'مسار مخصص للطلاب المتميزين في سرعة الحفظ وإتقان الأداء والمتون العلمية.'
          },
          {
            id: 'gt_2',
            name: 'مسار رواية ورش عن نافع',
            slug: 'warsh-recitation',
            description: 'مسار الإتقان برواية الإمام ورش عن نافع المدني من طريق الأزرق والتطبيق الصوتي.'
          },
          {
            id: 'gt_3',
            name: 'حلقة أشبال جزء عم',
            slug: 'juz-amma-kids',
            description: 'برنامج تأسيسي للصغار والناشئة لتعلم مخارج الحروف وقصار السور والمفصل.'
          },
          {
            id: 'gt_4',
            name: 'حلقة الفجر للتثبيت المكثف',
            slug: 'fajr-intensive',
            description: 'حلقات مباركة بعد صلاة الفجر للمراجعة اليومية وتثبيت محفوظات القرآن الكريم.'
          }
        ];

        for (const gt of sampleGroupTypes) {
          await db.insert(schema.groupTypes).values(gt).onConflictDoNothing();
        }

        // Groups (Halaqat)
        const sampleGroups = [
          {
            id: 'grp_1',
            number: 1,
            typeId: 'gt_1',
            gender: 'male',
            sessionTime: {
              startType: 'prayer',
              startPrayer: 'asr',
              endType: 'prayer',
              endPrayer: 'maghrib',
              endOffsetHours: 0
            },
            studyTime: 'من بعد صلاة العصر إلى صلاة المغرب',
            days: ['Monday', 'Wednesday', 'Saturday'],
            timeSlot: '16:30 - 18:00',
            room: 'قاعة المحراب الرئيسية بجامع المسجد',
            capacity: 15,
            level: 'Advanced Hifz',
            status: 'active'
          },
          {
            id: 'grp_2',
            number: 2,
            typeId: 'gt_2',
            gender: 'female',
            sessionTime: {
              startType: 'prayer',
              startPrayer: 'maghrib',
              endType: 'prayer',
              endPrayer: 'isha',
              endOffsetHours: 0
            },
            studyTime: 'من بعد صلاة المغرب إلى صلاة العشاء',
            days: ['Sunday', 'Tuesday', 'Thursday'],
            timeSlot: '17:00 - 18:30',
            room: 'جناح المكتبة - حلقة أ',
            capacity: 18,
            level: 'Intermediate',
            status: 'active'
          },
          {
            id: 'grp_3',
            number: 3,
            typeId: 'gt_3',
            gender: 'male',
            sessionTime: {
              startType: 'time',
              startTime: '16:00',
              endType: 'time',
              endTime: '17:15',
              endOffsetHours: 0
            },
            studyTime: 'من 16:00 إلى 17:15',
            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            timeSlot: '16:00 - 17:15',
            room: 'المدرسة القرآنية - قاعة 1',
            capacity: 20,
            level: 'Beginner',
            status: 'active'
          },
          {
            id: 'grp_4',
            number: 4,
            typeId: 'gt_4',
            gender: 'male',
            sessionTime: {
              startType: 'prayer',
              startPrayer: 'fajr',
              endType: 'prayer',
              endPrayer: 'fajr',
              endOffsetHours: 1
            },
            studyTime: 'من بعد صلاة الفجر إلى صلاة الفجر + ساعة',
            days: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            timeSlot: '05:45 - 07:00',
            room: 'المصلى العلوي - فضاء التميز',
            capacity: 16,
            level: 'Advanced Hifz',
            status: 'active'
          }
        ];

        for (const g of sampleGroups) {
          await db.insert(schema.groups).values(g as any).onConflictDoNothing();
        }

        // Group Teachers linking
        const sampleGroupTeachers = [
          { id: 'gt_1', groupId: 'grp_1', teacherId: 'tch_1', role: 'lead' },
          { id: 'gt_2', groupId: 'grp_1', teacherId: 'tch_2', role: 'assistant' },
          { id: 'gt_3', groupId: 'grp_2', teacherId: 'tch_3', role: 'lead' },
          { id: 'gt_4', groupId: 'grp_3', teacherId: 'tch_4', role: 'lead' },
          { id: 'gt_5', groupId: 'grp_3', teacherId: 'tch_2', role: 'assistant' },
          { id: 'gt_6', groupId: 'grp_4', teacherId: 'tch_1', role: 'lead' },
          { id: 'gt_7', groupId: 'grp_4', teacherId: 'tch_3', role: 'assistant' },
        ];

        for (const gt of sampleGroupTeachers) {
          await db.insert(schema.groupTeachers).values(gt).onConflictDoNothing();
        }

        // Parents
        const sampleParents = [
          { id: 'prn_1', name: 'كريم بن علي', phone: '+213 661 11 22 33', email: 'karim.benali@example.com' },
          { id: 'prn_2', name: 'حسن الحسن', phone: '+213 662 22 33 44', email: 'hassan.family@example.com' },
          { id: 'prn_3', name: 'أحمد مزيان', phone: '+213 663 33 44 55', email: 'ahmed.meziane@example.com' },
          { id: 'prn_4', name: 'فريد بلقاسم', phone: '+213 664 44 55 66', email: 'belkacem.f@example.com' },
          { id: 'prn_5', name: 'سمير وليد', phone: '+213 665 55 66 77', email: 'samir.oualid@example.com' },
          { id: 'prn_6', name: 'نادر عمراني', phone: '+213 666 66 77 88', email: 'amrani.family@example.com' },
          { id: 'prn_7', name: 'مراد زروقي', phone: '+213 667 77 88 99', email: 'zerrouki.m@example.com' },
          { id: 'prn_8', name: 'مصطفى شايب', phone: '+213 668 88 99 00', email: 'mustapha.chaib@example.com' }
        ];

        for (const p of sampleParents) {
          await db.insert(schema.parents).values(p).onConflictDoNothing();
        }

        // Students
        const sampleStudents = [
          {
            id: 'std_1',
            name: 'يوسف بن علي',
            avatar: '/api/storage/student-std_1',
            gender: 'male',
            dateOfBirth: '2012-05-14',
            age: '2012-05-14',
            parentId: 'prn_1',
            email: 'karim.benali@example.com',
            groupId: 'grp_1',
            currentSurahNumber: 2,
            currentSurahName: 'البقرة',
            currentAyah: 185,
            targetJuz: 30,
            memorizedJuzCount: 22,
            status: 'active',
            enrollmentDate: '2023-09-01',
            notes: 'حفظ متين، مخارج حروف ممتازة وتجويد متقن ومثالي.'
          },
          {
            id: 'std_2',
            name: 'زياد الحسن',
            avatar: '/api/storage/student-std_2',
            gender: 'male',
            dateOfBirth: '2013-08-20',
            age: '2013-08-20',
            parentId: 'prn_2',
            email: 'hassan.family@example.com',
            groupId: 'grp_1',
            currentSurahNumber: 3,
            currentSurahName: 'آل عمران',
            currentAyah: 92,
            targetJuz: 30,
            memorizedJuzCount: 18,
            status: 'active',
            enrollmentDate: '2023-10-15',
            notes: 'حضور منتظم جداً، يحتاج إلى التركيز على مدد الغنن والأزمنة.'
          },
          {
            id: 'std_3',
            name: 'مريم مزيان',
            avatar: '/api/storage/student-std_3',
            gender: 'female',
            dateOfBirth: '2014-03-10',
            age: '2014-03-10',
            parentId: 'prn_3',
            email: 'ahmed.meziane@example.com',
            groupId: 'grp_2',
            currentSurahNumber: 18,
            currentSurahName: 'الكهف',
            currentAyah: 46,
            targetJuz: 30,
            memorizedJuzCount: 15,
            status: 'active',
            enrollmentDate: '2024-01-10',
            notes: 'تلاوتها برواية ورش عطرة، رخيمة ومتقنة للأصول والمدود.'
          },
          {
            id: 'std_4',
            name: 'أنس بلقاسم',
            avatar: '/api/storage/student-std_4',
            gender: 'male',
            dateOfBirth: '2015-11-25',
            age: '2015-11-25',
            parentId: 'prn_4',
            email: 'belkacem.f@example.com',
            groupId: 'grp_1',
            currentSurahNumber: 36,
            currentSurahName: 'يس',
            currentAyah: 40,
            targetJuz: 30,
            memorizedJuzCount: 8,
            status: 'active',
            enrollmentDate: '2024-02-01',
            notes: 'منتبه ومثابر، يستعد حالياً لاجتياز اختبار التقييم الفصلي القادم.'
          },
          {
            id: 'std_5',
            name: 'إبراهيم وليد',
            avatar: '/api/storage/student-std_5',
            gender: 'male',
            dateOfBirth: '2017-06-18',
            age: '2017-06-18',
            parentId: 'prn_5',
            email: 'samir.oualid@example.com',
            groupId: 'grp_3',
            currentSurahNumber: 78,
            currentSurahName: 'النبأ',
            currentAyah: 20,
            targetJuz: 5,
            memorizedJuzCount: 2,
            status: 'active',
            enrollmentDate: '2025-01-15',
            notes: 'أتم حفظ جزء عم كاملاً ويقوم حالياً بتثبيت ودراسة جزء تبارك.'
          },
          {
            id: 'std_6',
            name: 'خديجة عمراني',
            avatar: '/api/storage/student-std_6',
            gender: 'female',
            dateOfBirth: '2016-09-05',
            age: '2016-09-05',
            parentId: 'prn_6',
            email: 'amrani.family@example.com',
            groupId: 'grp_2',
            currentSurahNumber: 67,
            currentSurahName: 'الملك',
            currentAyah: 15,
            targetJuz: 10,
            memorizedJuzCount: 3,
            status: 'active',
            enrollmentDate: '2024-09-01',
            notes: 'تفاعل ممتاز ومشاركة رائعة، مع تميز في مخارج الحروف الشجرية والراء.'
          },
          {
            id: 'std_7',
            name: 'أيوب زروقي',
            avatar: '/api/storage/student-std_7',
            gender: 'male',
            dateOfBirth: '2011-04-12',
            age: '2011-04-12',
            parentId: 'prn_7',
            email: 'zerrouki.m@example.com',
            groupId: 'grp_4',
            currentSurahNumber: 12,
            currentSurahName: 'يوسف',
            currentAyah: 64,
            targetJuz: 30,
            memorizedJuzCount: 26,
            status: 'active',
            enrollmentDate: '2022-11-01',
            notes: 'نسبة حضور حلقة الفجر 100%. يطمح لختم القرآن الكريم كاملاً هذا العام بإذن الله.'
          },
          {
            id: 'std_8',
            name: 'فاطمة الزهراء شايب',
            avatar: '/api/storage/student-std_8',
            gender: 'female',
            dateOfBirth: '2013-12-30',
            age: '2013-12-30',
            parentId: 'prn_8',
            email: 'mustapha.chaib@example.com',
            groupId: 'grp_2',
            currentSurahNumber: 19,
            currentSurahName: 'مريم',
            currentAyah: 30,
            targetJuz: 30,
            memorizedJuzCount: 19,
            status: 'active',
            enrollmentDate: '2023-03-01',
            notes: 'تطبيق متميز لأحكام التجويد النظرية والعملية مع صوت خاشع رائع.'
          }
        ];

        for (const s of sampleStudents) {
          await db.insert(schema.students).values(s).onConflictDoNothing();
        }

        // Ratings & Progress evaluations
        const sampleRatings = [
          {
            id: 'rat_1',
            studentId: 'std_1',
            teacherId: 'tch_1',
            groupId: 'grp_1',
            month: '2026-09',
            hifzScore: 98,
            tajweedScore: 95,
            murajaahScore: 96,
            attendanceScore: 100,
            behaviorScore: 100,
            overallScore: 98,
            grade: 'ممتاز (تميز استثنائي)',
            surahEvaluated: 'البقرة',
            ayahStart: 142,
            ayahEnd: 185,
            notes: 'تلاوة متميزة وانتقال سلس بين الآيات. حضور مثالي كامل التميز.'
          },
          {
            id: 'rat_2',
            studentId: 'std_1',
            teacherId: 'tch_1',
            groupId: 'grp_1',
            month: '2026-08',
            hifzScore: 94,
            tajweedScore: 92,
            murajaahScore: 95,
            attendanceScore: 95,
            behaviorScore: 98,
            overallScore: 95,
            grade: 'ممتاز (متقن جداً)',
            surahEvaluated: 'البقرة',
            ayahStart: 100,
            ayahEnd: 141,
            notes: 'تقدم ملموس وجيد جداً في حفظ ومراجعة الجزء الثاني.'
          },
          {
            id: 'rat_3',
            studentId: 'std_2',
            teacherId: 'tch_1',
            groupId: 'grp_1',
            month: '2026-09',
            hifzScore: 90,
            tajweedScore: 88,
            murajaahScore: 86,
            attendanceScore: 95,
            behaviorScore: 95,
            overallScore: 91,
            grade: 'جيد جداً',
            surahEvaluated: 'آل عمران',
            ayahStart: 50,
            ayahEnd: 92,
            notes: 'يحتاج إلى مزيد من التدريب والانتباه لأحكام الوقف والابتداء بالآيات.'
          },
          {
            id: 'rat_4',
            studentId: 'std_3',
            teacherId: 'tch_3',
            groupId: 'grp_2',
            month: '2026-09',
            hifzScore: 96,
            tajweedScore: 94,
            murajaahScore: 92,
            attendanceScore: 100,
            behaviorScore: 100,
            overallScore: 96,
            grade: 'ممتاز (تميز استثنائي)',
            surahEvaluated: 'الكهف',
            ayahStart: 1,
            ayahEnd: 46,
            notes: 'إتقان منقطع النظير لأصول رواية ورش مع تحكم ممتاز وجميل في نبرة الصوت.'
          },
          {
            id: 'rat_5',
            studentId: 'std_4',
            teacherId: 'tch_3',
            groupId: 'grp_2',
            month: '2026-09',
            hifzScore: 88,
            tajweedScore: 85,
            murajaahScore: 87,
            attendanceScore: 90,
            behaviorScore: 95,
            overallScore: 89,
            grade: 'جيد جداً',
            surahEvaluated: 'يس',
            ayahStart: 1,
            ayahEnd: 40,
            notes: 'أداء وتسميع جيد، ننصح بالمتابعة والمراجعة اليومية المنزلية لتثبيت الحفظ.'
          },
          {
            id: 'rat_6',
            studentId: 'std_5',
            teacherId: 'tch_4',
            groupId: 'grp_3',
            month: '2026-09',
            hifzScore: 92,
            tajweedScore: 89,
            murajaahScore: 90,
            attendanceScore: 100,
            behaviorScore: 98,
            overallScore: 94,
            grade: 'ممتاز (متقن جداً)',
            surahEvaluated: 'النبأ',
            ayahStart: 1,
            ayahEnd: 20,
            notes: 'طالب ذكي ونابغ جداً! شديد الانضباط والحرص ومحب لحلقته.'
          },
          {
            id: 'rat_7',
            studentId: 'std_7',
            teacherId: 'tch_1',
            groupId: 'grp_4',
            month: '2026-09',
            hifzScore: 99,
            tajweedScore: 98,
            murajaahScore: 97,
            attendanceScore: 100,
            behaviorScore: 100,
            overallScore: 99,
            grade: 'ممتاز (تميز استثنائي)',
            surahEvaluated: 'يوسف',
            ayahStart: 1,
            ayahEnd: 64,
            notes: 'من خيرة طلاب حلقة الفجر المباركة. التزام وجدية يحتذى بهما.'
          },
          {
            id: 'rat_8',
            studentId: 'std_8',
            teacherId: 'tch_1',
            groupId: 'grp_4',
            month: '2026-09',
            hifzScore: 97,
            tajweedScore: 96,
            murajaahScore: 95,
            attendanceScore: 98,
            behaviorScore: 100,
            overallScore: 97,
            grade: 'ممتاز (تميز استثنائي)',
            surahEvaluated: 'مريم',
            ayahStart: 1,
            ayahEnd: 30,
            notes: 'تلاوة خاشعة خالية من الأخطاء مع حضور روحي عالٍ بارك الله فيها.'
          }
        ];

        for (const r of sampleRatings) {
          await db.insert(schema.studentRatings).values(r).onConflictDoNothing();
        }

        // Seed admin user
        await db.insert(schema.users).values({
          id: 'usr_admin',
          name: 'المشرف العام للمدرسة',
          email: 'director@madrasa.org',
          password: 'admin',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
        }).onConflictDoNothing();

        console.log('Database seeded successfully.');
      }

      // Ensure the three main test users always exist in the 'users' table
      // 1. Admin: admin@madrasa.iqra / password123
      await sql`
        INSERT INTO users (id, name, email, password, role, avatar)
        VALUES ('usr_admin_new', 'المشرف العام (مدير)', 'admin@madrasa.iqra', 'password123', 'admin', 'https://api.dicebear.com/7.x/micah/svg?seed=admin')
        ON CONFLICT (email) DO UPDATE SET password = 'password123', role = 'admin';
      `;

      // 2. Teacher: teacher@madrasa.iqra / password123
      await sql`
        INSERT INTO users (id, name, email, password, role, avatar)
        VALUES ('usr_teacher_new', 'الأستاذ بلال طارق', 'teacher@madrasa.iqra', 'password123', 'teacher', 'https://api.dicebear.com/7.x/micah/svg?seed=teacher')
        ON CONFLICT (email) DO UPDATE SET password = 'password123', role = 'teacher';
      `;

      // 3. Parent: parent@madrasa.iqra / password123
      await sql`
        INSERT INTO users (id, name, email, password, role, avatar)
        VALUES ('usr_parent_new', 'كريم بن علي', 'parent@madrasa.iqra', 'password123', 'parent', 'https://api.dicebear.com/7.x/micah/svg?seed=parent')
        ON CONFLICT (email) DO UPDATE SET password = 'password123', role = 'parent';
      `;

      // Get user ids for mapping
      const usersList = await sql`SELECT id, email FROM users WHERE email IN ('admin@madrasa.iqra', 'teacher@madrasa.iqra', 'parent@madrasa.iqra');`;
      const adminUserId = (usersList as any[]).find(u => u.email === 'admin@madrasa.iqra')?.id;
      const teacherUserId = (usersList as any[]).find(u => u.email === 'teacher@madrasa.iqra')?.id;
      const parentUserId = (usersList as any[]).find(u => u.email === 'parent@madrasa.iqra')?.id;

      // Link Admin user to tch_1 (الشيخ عبد الله المنصور) and set is_admin to true
      if (adminUserId) {
        await sql`UPDATE teachers SET user_id = ${adminUserId}, is_admin = true WHERE id = 'tch_1' OR email = 'abdullah.mansoor@madrasa.org';`;
      }

      // Link Teacher user to tch_2 (الأستاذ بلال طارق)
      if (teacherUserId) {
        await sql`UPDATE teachers SET user_id = ${teacherUserId}, is_admin = false WHERE id = 'tch_2' OR email = 'bilal.tariq@madrasa.org';`;
      }

      // Ensure parent 'prn_1' exists and is linked to Parent user
      if (parentUserId) {
        await sql`
          INSERT INTO parents (id, name, phone, email, user_id)
          VALUES ('prn_1', 'كريم بن علي', '+213 661 11 22 33', 'parent@madrasa.iqra', ${parentUserId})
          ON CONFLICT (id) DO UPDATE SET user_id = ${parentUserId}, name = 'كريم بن علي', phone = '+213 661 11 22 33';
        `;
        // Ensure student 'std_1' is linked to parent 'prn_1'
        await sql`UPDATE students SET parent_id = 'prn_1' WHERE id = 'std_1';`;
      }

      initialized = true;
    } catch (err) {
      console.error('Failed to initialize Madrasa database:', err);
    } finally {
      initializingPromise = null;
    }
  })();

  return initializingPromise;
}
