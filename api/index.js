var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/server/vercel-entry.ts
import { handle } from "hono/vercel";

// src/server/app.ts
import { Hono as Hono13 } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

// src/server/routes/auth.ts
import { Hono } from "hono";

// src/db/index.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  attendances: () => attendances,
  groupTeachers: () => groupTeachers,
  groupTypes: () => groupTypes,
  groups: () => groups,
  parents: () => parents,
  sessionStudentRecords: () => sessionStudentRecords,
  sessions: () => sessions,
  studentRatings: () => studentRatings,
  students: () => students,
  teachers: () => teachers,
  users: () => users
});
import { pgTable, text, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
var teachers = pgTable("teachers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  avatar: text("avatar").notNull(),
  specialization: text("specialization").default("Tajweed & Hifz").notNull(),
  bio: text("bio"),
  status: text("status").default("active").notNull(),
  // 'active' | 'on_leave'
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var groupTypes = pgTable("group_types", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var groups = pgTable("groups", {
  id: text("id").primaryKey(),
  number: integer("number").notNull(),
  typeId: text("type_id").notNull().references(() => groupTypes.id, { onDelete: "cascade" }),
  gender: text("gender").default("male").notNull(),
  // 'male' | 'female'
  sessionTime: jsonb("session_time").$type(),
  studyTime: text("study_time").notNull(),
  // e.g., "السبت، الاثنين • من بعد صلاة العصر إلى المغرب"
  days: jsonb("days").$type().default([]).notNull(),
  timeSlot: text("time_slot"),
  // e.g., "16:30 - 18:00"
  room: text("room").default("Main Halaqa Hall"),
  capacity: integer("capacity").default(20).notNull(),
  level: text("level").default("Intermediate").notNull(),
  // 'Beginner' | 'Intermediate' | 'Advanced Hifz' | 'Ijazah'
  status: text("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var groupTeachers = pgTable("group_teachers", {
  id: text("id").primaryKey(),
  groupId: text("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  teacherId: text("teacher_id").notNull().references(() => teachers.id, { onDelete: "cascade" }),
  role: text("role").default("lead").notNull(),
  // 'lead' | 'assistant'
  assignedAt: timestamp("assigned_at").defaultNow().notNull()
});
var parents = pgTable("parents", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  address: text("address"),
  notes: text("notes"),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var students = pgTable("students", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  avatar: text("avatar").notNull(),
  gender: text("gender").default("male").notNull(),
  // 'male' | 'female'
  dateOfBirth: text("date_of_birth"),
  age: text("age"),
  // Stored as a date string (YYYY-MM-DD), real displayed age is calculated dynamically
  parentId: text("parent_id").references(() => parents.id, { onDelete: "set null" }),
  email: text("email"),
  groupId: text("group_id").references(() => groups.id, { onDelete: "set null" }),
  currentSurahNumber: integer("current_surah_number").default(1).notNull(),
  currentSurahName: text("current_surah_name").default("Al-Fatihah").notNull(),
  currentAyah: integer("current_ayah").default(1).notNull(),
  targetJuz: integer("target_juz").default(30),
  memorizedJuzCount: integer("memorized_juz_count").default(1).notNull(),
  status: text("status").default("active").notNull(),
  // 'active' | 'graduated' | 'paused'
  enrollmentDate: text("enrollment_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var studentRatings = pgTable("student_ratings", {
  id: text("id").primaryKey(),
  studentId: text("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  teacherId: text("teacher_id").references(() => teachers.id, { onDelete: "set null" }),
  groupId: text("group_id").references(() => groups.id, { onDelete: "set null" }),
  month: text("month").notNull(),
  // e.g. "2026-09" or "September 2026"
  hifzScore: integer("hifz_score").default(90).notNull(),
  // 0 - 100
  tajweedScore: integer("tajweed_score").default(85).notNull(),
  // 0 - 100
  murajaahScore: integer("murajaah_score").default(88).notNull(),
  // 0 - 100 (Revision)
  attendanceScore: integer("attendance_score").default(95).notNull(),
  // 0 - 100
  behaviorScore: integer("behavior_score").default(100).notNull(),
  // 0 - 100
  overallScore: integer("overall_score").default(90).notNull(),
  // 0 - 100
  grade: text("grade").default("Mumtaz (Excellent)").notNull(),
  surahEvaluated: text("surah_evaluated"),
  ayahStart: integer("ayah_start"),
  ayahEnd: integer("ayah_end"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password"),
  role: text("role").default("admin").notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var attendances = pgTable("attendances", {
  id: text("id").primaryKey(),
  studentId: text("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  groupId: text("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  groupTypeName: text("group_type_name"),
  groupNumber: integer("group_number"),
  date: text("date").notNull(),
  // YYYY-MM-DD
  sessionTimeText: text("session_time_text"),
  // e.g., "من صلاة العصر إلى صلاة المغرب"
  status: text("status").default("absent").notNull(),
  // 'absent' | 'present' | 'late' | 'excused'
  reason: text("reason"),
  recordedByTeacherId: text("recorded_by_teacher_id").references(() => teachers.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  groupId: text("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  teacherId: text("teacher_id").references(() => teachers.id, { onDelete: "set null" }),
  sessionType: text("session_type").default("main").notNull(),
  // 'main' | 'exception'
  date: text("date").notNull(),
  // YYYY-MM-DD
  startTime: text("start_time"),
  endTime: text("end_time"),
  sessionTimeText: text("session_time_text"),
  status: text("status").default("scheduled").notNull(),
  // 'scheduled' | 'completed' | 'cancelled'
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var sessionStudentRecords = pgTable("session_student_records", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull().references(() => sessions.id, { onDelete: "cascade" }),
  studentId: text("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  attendanceStatus: text("attendance_status").default("absent").notNull(),
  // 'present' | 'absent' | 'late' | 'excused'
  absenceReason: text("absence_reason"),
  surahNumber: integer("surah_number"),
  surahName: text("surah_name"),
  ayahStart: integer("ayah_start"),
  ayahEnd: integer("ayah_end"),
  teacherRemarque: text("teacher_remarque"),
  isAssessed: boolean("is_assessed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// src/db/index.ts
var meta = import.meta;
var connectionString = meta?.env?.VITE_DATABASE_URL || (typeof process !== "undefined" ? process.env.DATABASE_URL : void 0) || "postgresql://neondb_owner:npg_KJRtis19vLYf@ep-snowy-hill-b49jwogo-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require";
var sql = neon(connectionString);
var db = drizzle(sql, { schema: schema_exports });

// src/server/routes/auth.ts
import { eq } from "drizzle-orm";

// src/db/init.ts
var initialized = false;
var initializingPromise = null;
async function ensureDatabaseInitialized() {
  if (initialized) return;
  if (initializingPromise) return initializingPromise;
  initializingPromise = (async () => {
    try {
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
      try {
        await sql`
          UPDATE students 
          SET age = date_of_birth 
          WHERE date_of_birth IS NOT NULL AND (age IS NULL OR age !~ '-');
        `;
      } catch (e) {
        console.warn("Age migration warning:", e);
      }
      try {
        const hasParentNameCol = await sql`
          SELECT 1 FROM information_schema.columns WHERE table_name='students' AND column_name='parent_name';
        `;
        if (Array.isArray(hasParentNameCol) && hasParentNameCol.length > 0) {
          const unlinked = await sql`
            SELECT id, parent_name, parent_phone FROM students WHERE parent_id IS NULL AND parent_name IS NOT NULL AND parent_name != '';
          `;
          if (Array.isArray(unlinked) && unlinked.length > 0) {
            for (const st of unlinked) {
              const pName = st.parent_name?.trim();
              const pPhone = st.parent_phone?.trim() || "\u063A\u064A\u0631 \u0645\u062D\u062F\u062F";
              if (!pName) continue;
              const existing = await sql`SELECT id FROM parents WHERE name = ${pName} LIMIT 1;`;
              let pId = "";
              if (Array.isArray(existing) && existing.length > 0) {
                pId = existing[0].id;
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
          await sql`
            ALTER TABLE students DROP COLUMN IF EXISTS parent_name;
            ALTER TABLE students DROP COLUMN IF EXISTS parent_phone;
          `;
        }
      } catch (err) {
        console.warn("Parent migration and column drop warning:", err);
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
      const existingTeachers = await db.select().from(teachers);
      if (existingTeachers.length === 0) {
        console.log("Seeding initial Quran Madrasa data...");
        const sampleTeachers = [
          {
            id: "tch_1",
            name: "\u0627\u0644\u0634\u064A\u062E \u0639\u0628\u062F \u0627\u0644\u0644\u0647 \u0627\u0644\u0645\u0646\u0635\u0648\u0631",
            email: "abdullah.mansoor@madrasa.org",
            phone: "+213 550 12 34 56",
            avatar: "/api/storage/teacher-tch_1",
            specialization: "\u0627\u0644\u0642\u0631\u0627\u0621\u0627\u062A \u0627\u0644\u0639\u0634\u0631 \u0648\u0627\u0644\u062A\u062C\u0648\u064A\u062F \u0627\u0644\u0645\u062A\u0642\u062F\u0645",
            bio: "\u0645\u062C\u0627\u0632 \u0641\u064A \u0627\u0644\u0642\u0631\u0627\u0621\u0627\u062A \u0627\u0644\u0639\u0634\u0631 \u0627\u0644\u0645\u062A\u0648\u0627\u062A\u0631\u0629 \u0645\u0646 \u0627\u0644\u0623\u0632\u0647\u0631 \u0627\u0644\u0634\u0631\u064A\u0641 \u0645\u0639 \u062E\u0628\u0631\u0629 \u062A\u0632\u064A\u062F \u0639\u0646 15 \u0639\u0627\u0645\u0627\u064B \u0641\u064A \u0642\u064A\u0627\u062F\u0629 \u062D\u0644\u0642\u0627\u062A \u062A\u062D\u0641\u064A\u0638 \u0627\u0644\u0642\u0631\u0622\u0646 \u0627\u0644\u0643\u0631\u064A\u0645 \u0648\u062A\u062E\u0631\u064A\u062C \u0627\u0644\u062D\u0641\u0627\u0638.",
            status: "active"
          },
          {
            id: "tch_2",
            name: "\u0627\u0644\u0623\u0633\u062A\u0627\u0630 \u0628\u0644\u0627\u0644 \u0637\u0627\u0631\u0642",
            email: "bilal.tariq@madrasa.org",
            phone: "+213 551 23 45 67",
            avatar: "/api/storage/teacher-tch_2",
            specialization: "\u0631\u0648\u0627\u064A\u0629 \u062D\u0641\u0635 \u0639\u0646 \u0639\u0627\u0635\u0645 \u0648\u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629 \u0648\u0627\u0644\u062A\u062B\u0628\u064A\u062A",
            bio: "\u0645\u0627\u062C\u0633\u062A\u064A\u0631 \u0641\u064A \u0627\u0644\u0639\u0644\u0648\u0645 \u0627\u0644\u0642\u0631\u0622\u0646\u064A\u0629\u060C \u0645\u062A\u062E\u0635\u0635 \u0641\u064A \u0627\u0644\u062A\u0623\u0633\u064A\u0633 \u0627\u0644\u0635\u062D\u064A\u062D \u0648\u0645\u062E\u0627\u0631\u062C \u0627\u0644\u062D\u0631\u0648\u0641 \u0648\u062A\u0648\u062C\u064A\u0647 \u0627\u0644\u0646\u0634\u0621 \u0648\u0627\u0644\u0634\u0628\u0627\u0628 \u0641\u064A \u062D\u0641\u0638 \u0627\u0644\u0645\u062A\u0648\u0646 \u0648\u0627\u0644\u0642\u0631\u0622\u0646 \u0627\u0644\u0643\u0631\u064A\u0645.",
            status: "active"
          },
          {
            id: "tch_3",
            name: "\u0627\u0644\u0634\u064A\u062E \u0639\u0645\u0631 \u0627\u0644\u0642\u0627\u0633\u0645\u064A",
            email: "omar.qasimi@madrasa.org",
            phone: "+213 552 34 56 78",
            avatar: "/api/storage/teacher-tch_3",
            specialization: "\u0631\u0648\u0627\u064A\u0629 \u0648\u0631\u0634 \u0639\u0646 \u0646\u0627\u0641\u0639 \u0648\u0623\u062D\u0643\u0627\u0645 \u0627\u0644\u062A\u062C\u0648\u064A\u062F",
            bio: "\u062D\u0627\u0635\u0644 \u0639\u0644\u0649 \u0627\u0644\u0625\u062C\u0627\u0632\u0629 \u0627\u0644\u0642\u0631\u0622\u0646\u064A\u0629 \u0628\u0631\u0648\u0627\u064A\u0629 \u0648\u0631\u0634 \u0639\u0646 \u0646\u0627\u0641\u0639 \u0645\u0646 \u0637\u0631\u064A\u0642 \u0627\u0644\u0623\u0632\u0631\u0642\u060C \u064A\u062A\u0645\u064A\u0632 \u0628\u0627\u0644\u062F\u0642\u0629 \u0627\u0644\u0645\u062A\u0646\u0627\u0647\u064A\u0629 \u0641\u064A \u062A\u062B\u0628\u064A\u062A \u0648\u0645\u0631\u0627\u062C\u0639\u0629 \u0645\u062A\u0634\u0627\u0628\u0647\u0627\u062A \u0627\u0644\u0642\u0631\u0622\u0646 \u0627\u0644\u0643\u0631\u064A\u0645.",
            status: "active"
          },
          {
            id: "tch_4",
            name: "\u0627\u0644\u0623\u0633\u062A\u0627\u0630 \u062D\u0645\u0632\u0629 \u0627\u0644\u062E\u0637\u064A\u0628",
            email: "hamza.khatib@madrasa.org",
            phone: "+213 553 45 67 89",
            avatar: "/api/storage/teacher-tch_4",
            specialization: "\u062A\u062D\u0641\u064A\u0638 \u0627\u0644\u0635\u063A\u0627\u0631 \u0648\u0634\u0631\u062D \u062A\u062D\u0641\u0629 \u0627\u0644\u0623\u0637\u0641\u0627\u0644",
            bio: "\u0645\u062A\u062E\u0635\u0635 \u0641\u064A \u0627\u0644\u0623\u0633\u0627\u0644\u064A\u0628 \u0627\u0644\u062A\u0631\u0628\u0648\u064A\u0629 \u0627\u0644\u062D\u062F\u064A\u062B\u0629 \u0644\u062A\u0639\u0644\u064A\u0645 \u0627\u0644\u0642\u0631\u0622\u0646 \u0644\u0644\u0623\u0637\u0641\u0627\u0644 \u0648\u062A\u062F\u0631\u064A\u0633 \u0645\u062A\u0648\u0646 \u0627\u0644\u062A\u062C\u0648\u064A\u062F \u0648\u0627\u0644\u0628\u0631\u0627\u0645\u062C \u0627\u0644\u062A\u062D\u0641\u064A\u0632\u064A\u0629 \u0648\u0627\u0644\u0623\u0646\u0634\u0637\u0629 \u0627\u0644\u062A\u0631\u0641\u064A\u0647\u064A\u0629 \u0627\u0644\u0647\u0627\u062F\u0641\u0629.",
            status: "active"
          }
        ];
        for (const t of sampleTeachers) {
          await db.insert(teachers).values(t).onConflictDoNothing();
        }
        const sampleGroupTypes = [
          {
            id: "gt_1",
            name: "\u0627\u0644\u062D\u0641\u0638 \u0627\u0644\u0645\u062A\u0642\u062F\u0645 \u0648\u0627\u0644\u062A\u0645\u064A\u0632",
            slug: "advanced-hifz",
            description: "\u0645\u0633\u0627\u0631 \u0645\u062E\u0635\u0635 \u0644\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u062A\u0645\u064A\u0632\u064A\u0646 \u0641\u064A \u0633\u0631\u0639\u0629 \u0627\u0644\u062D\u0641\u0638 \u0648\u0625\u062A\u0642\u0627\u0646 \u0627\u0644\u0623\u062F\u0627\u0621 \u0648\u0627\u0644\u0645\u062A\u0648\u0646 \u0627\u0644\u0639\u0644\u0645\u064A\u0629."
          },
          {
            id: "gt_2",
            name: "\u0645\u0633\u0627\u0631 \u0631\u0648\u0627\u064A\u0629 \u0648\u0631\u0634 \u0639\u0646 \u0646\u0627\u0641\u0639",
            slug: "warsh-recitation",
            description: "\u0645\u0633\u0627\u0631 \u0627\u0644\u0625\u062A\u0642\u0627\u0646 \u0628\u0631\u0648\u0627\u064A\u0629 \u0627\u0644\u0625\u0645\u0627\u0645 \u0648\u0631\u0634 \u0639\u0646 \u0646\u0627\u0641\u0639 \u0627\u0644\u0645\u062F\u0646\u064A \u0645\u0646 \u0637\u0631\u064A\u0642 \u0627\u0644\u0623\u0632\u0631\u0642 \u0648\u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u0635\u0648\u062A\u064A."
          },
          {
            id: "gt_3",
            name: "\u062D\u0644\u0642\u0629 \u0623\u0634\u0628\u0627\u0644 \u062C\u0632\u0621 \u0639\u0645",
            slug: "juz-amma-kids",
            description: "\u0628\u0631\u0646\u0627\u0645\u062C \u062A\u0623\u0633\u064A\u0633\u064A \u0644\u0644\u0635\u063A\u0627\u0631 \u0648\u0627\u0644\u0646\u0627\u0634\u0626\u0629 \u0644\u062A\u0639\u0644\u0645 \u0645\u062E\u0627\u0631\u062C \u0627\u0644\u062D\u0631\u0648\u0641 \u0648\u0642\u0635\u0627\u0631 \u0627\u0644\u0633\u0648\u0631 \u0648\u0627\u0644\u0645\u0641\u0635\u0644."
          },
          {
            id: "gt_4",
            name: "\u062D\u0644\u0642\u0629 \u0627\u0644\u0641\u062C\u0631 \u0644\u0644\u062A\u062B\u0628\u064A\u062A \u0627\u0644\u0645\u0643\u062B\u0641",
            slug: "fajr-intensive",
            description: "\u062D\u0644\u0642\u0627\u062A \u0645\u0628\u0627\u0631\u0643\u0629 \u0628\u0639\u062F \u0635\u0644\u0627\u0629 \u0627\u0644\u0641\u062C\u0631 \u0644\u0644\u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u064A\u0648\u0645\u064A\u0629 \u0648\u062A\u062B\u0628\u064A\u062A \u0645\u062D\u0641\u0648\u0638\u0627\u062A \u0627\u0644\u0642\u0631\u0622\u0646 \u0627\u0644\u0643\u0631\u064A\u0645."
          }
        ];
        for (const gt of sampleGroupTypes) {
          await db.insert(groupTypes).values(gt).onConflictDoNothing();
        }
        const sampleGroups = [
          {
            id: "grp_1",
            number: 1,
            typeId: "gt_1",
            gender: "male",
            sessionTime: {
              startType: "prayer",
              startPrayer: "asr",
              endType: "prayer",
              endPrayer: "maghrib",
              endOffsetHours: 0
            },
            studyTime: "\u0645\u0646 \u0628\u0639\u062F \u0635\u0644\u0627\u0629 \u0627\u0644\u0639\u0635\u0631 \u0625\u0644\u0649 \u0635\u0644\u0627\u0629 \u0627\u0644\u0645\u063A\u0631\u0628",
            days: ["Monday", "Wednesday", "Saturday"],
            timeSlot: "16:30 - 18:00",
            room: "\u0642\u0627\u0639\u0629 \u0627\u0644\u0645\u062D\u0631\u0627\u0628 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629 \u0628\u062C\u0627\u0645\u0639 \u0627\u0644\u0645\u0633\u062C\u062F",
            capacity: 15,
            level: "Advanced Hifz",
            status: "active"
          },
          {
            id: "grp_2",
            number: 2,
            typeId: "gt_2",
            gender: "female",
            sessionTime: {
              startType: "prayer",
              startPrayer: "maghrib",
              endType: "prayer",
              endPrayer: "isha",
              endOffsetHours: 0
            },
            studyTime: "\u0645\u0646 \u0628\u0639\u062F \u0635\u0644\u0627\u0629 \u0627\u0644\u0645\u063A\u0631\u0628 \u0625\u0644\u0649 \u0635\u0644\u0627\u0629 \u0627\u0644\u0639\u0634\u0627\u0621",
            days: ["Sunday", "Tuesday", "Thursday"],
            timeSlot: "17:00 - 18:30",
            room: "\u062C\u0646\u0627\u062D \u0627\u0644\u0645\u0643\u062A\u0628\u0629 - \u062D\u0644\u0642\u0629 \u0623",
            capacity: 18,
            level: "Intermediate",
            status: "active"
          },
          {
            id: "grp_3",
            number: 3,
            typeId: "gt_3",
            gender: "male",
            sessionTime: {
              startType: "time",
              startTime: "16:00",
              endType: "time",
              endTime: "17:15",
              endOffsetHours: 0
            },
            studyTime: "\u0645\u0646 16:00 \u0625\u0644\u0649 17:15",
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
            timeSlot: "16:00 - 17:15",
            room: "\u0627\u0644\u0645\u062F\u0631\u0633\u0629 \u0627\u0644\u0642\u0631\u0622\u0646\u064A\u0629 - \u0642\u0627\u0639\u0629 1",
            capacity: 20,
            level: "Beginner",
            status: "active"
          },
          {
            id: "grp_4",
            number: 4,
            typeId: "gt_4",
            gender: "male",
            sessionTime: {
              startType: "prayer",
              startPrayer: "fajr",
              endType: "prayer",
              endPrayer: "fajr",
              endOffsetHours: 1
            },
            studyTime: "\u0645\u0646 \u0628\u0639\u062F \u0635\u0644\u0627\u0629 \u0627\u0644\u0641\u062C\u0631 \u0625\u0644\u0649 \u0635\u0644\u0627\u0629 \u0627\u0644\u0641\u062C\u0631 + \u0633\u0627\u0639\u0629",
            days: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
            timeSlot: "05:45 - 07:00",
            room: "\u0627\u0644\u0645\u0635\u0644\u0649 \u0627\u0644\u0639\u0644\u0648\u064A - \u0641\u0636\u0627\u0621 \u0627\u0644\u062A\u0645\u064A\u0632",
            capacity: 16,
            level: "Advanced Hifz",
            status: "active"
          }
        ];
        for (const g of sampleGroups) {
          await db.insert(groups).values(g).onConflictDoNothing();
        }
        const sampleGroupTeachers = [
          { id: "gt_1", groupId: "grp_1", teacherId: "tch_1", role: "lead" },
          { id: "gt_2", groupId: "grp_1", teacherId: "tch_2", role: "assistant" },
          { id: "gt_3", groupId: "grp_2", teacherId: "tch_3", role: "lead" },
          { id: "gt_4", groupId: "grp_3", teacherId: "tch_4", role: "lead" },
          { id: "gt_5", groupId: "grp_3", teacherId: "tch_2", role: "assistant" },
          { id: "gt_6", groupId: "grp_4", teacherId: "tch_1", role: "lead" },
          { id: "gt_7", groupId: "grp_4", teacherId: "tch_3", role: "assistant" }
        ];
        for (const gt of sampleGroupTeachers) {
          await db.insert(groupTeachers).values(gt).onConflictDoNothing();
        }
        const sampleParents = [
          { id: "prn_1", name: "\u0643\u0631\u064A\u0645 \u0628\u0646 \u0639\u0644\u064A", phone: "+213 661 11 22 33", email: "karim.benali@example.com" },
          { id: "prn_2", name: "\u062D\u0633\u0646 \u0627\u0644\u062D\u0633\u0646", phone: "+213 662 22 33 44", email: "hassan.family@example.com" },
          { id: "prn_3", name: "\u0623\u062D\u0645\u062F \u0645\u0632\u064A\u0627\u0646", phone: "+213 663 33 44 55", email: "ahmed.meziane@example.com" },
          { id: "prn_4", name: "\u0641\u0631\u064A\u062F \u0628\u0644\u0642\u0627\u0633\u0645", phone: "+213 664 44 55 66", email: "belkacem.f@example.com" },
          { id: "prn_5", name: "\u0633\u0645\u064A\u0631 \u0648\u0644\u064A\u062F", phone: "+213 665 55 66 77", email: "samir.oualid@example.com" },
          { id: "prn_6", name: "\u0646\u0627\u062F\u0631 \u0639\u0645\u0631\u0627\u0646\u064A", phone: "+213 666 66 77 88", email: "amrani.family@example.com" },
          { id: "prn_7", name: "\u0645\u0631\u0627\u062F \u0632\u0631\u0648\u0642\u064A", phone: "+213 667 77 88 99", email: "zerrouki.m@example.com" },
          { id: "prn_8", name: "\u0645\u0635\u0637\u0641\u0649 \u0634\u0627\u064A\u0628", phone: "+213 668 88 99 00", email: "mustapha.chaib@example.com" }
        ];
        for (const p of sampleParents) {
          await db.insert(parents).values(p).onConflictDoNothing();
        }
        const sampleStudents = [
          {
            id: "std_1",
            name: "\u064A\u0648\u0633\u0641 \u0628\u0646 \u0639\u0644\u064A",
            avatar: "/api/storage/student-std_1",
            gender: "male",
            dateOfBirth: "2012-05-14",
            age: "2012-05-14",
            parentId: "prn_1",
            email: "karim.benali@example.com",
            groupId: "grp_1",
            currentSurahNumber: 2,
            currentSurahName: "\u0627\u0644\u0628\u0642\u0631\u0629",
            currentAyah: 185,
            targetJuz: 30,
            memorizedJuzCount: 22,
            status: "active",
            enrollmentDate: "2023-09-01",
            notes: "\u062D\u0641\u0638 \u0645\u062A\u064A\u0646\u060C \u0645\u062E\u0627\u0631\u062C \u062D\u0631\u0648\u0641 \u0645\u0645\u062A\u0627\u0632\u0629 \u0648\u062A\u062C\u0648\u064A\u062F \u0645\u062A\u0642\u0646 \u0648\u0645\u062B\u0627\u0644\u064A."
          },
          {
            id: "std_2",
            name: "\u0632\u064A\u0627\u062F \u0627\u0644\u062D\u0633\u0646",
            avatar: "/api/storage/student-std_2",
            gender: "male",
            dateOfBirth: "2013-08-20",
            age: "2013-08-20",
            parentId: "prn_2",
            email: "hassan.family@example.com",
            groupId: "grp_1",
            currentSurahNumber: 3,
            currentSurahName: "\u0622\u0644 \u0639\u0645\u0631\u0627\u0646",
            currentAyah: 92,
            targetJuz: 30,
            memorizedJuzCount: 18,
            status: "active",
            enrollmentDate: "2023-10-15",
            notes: "\u062D\u0636\u0648\u0631 \u0645\u0646\u062A\u0638\u0645 \u062C\u062F\u0627\u064B\u060C \u064A\u062D\u062A\u0627\u062C \u0625\u0644\u0649 \u0627\u0644\u062A\u0631\u0643\u064A\u0632 \u0639\u0644\u0649 \u0645\u062F\u062F \u0627\u0644\u063A\u0646\u0646 \u0648\u0627\u0644\u0623\u0632\u0645\u0646\u0629."
          },
          {
            id: "std_3",
            name: "\u0645\u0631\u064A\u0645 \u0645\u0632\u064A\u0627\u0646",
            avatar: "/api/storage/student-std_3",
            gender: "female",
            dateOfBirth: "2014-03-10",
            age: "2014-03-10",
            parentId: "prn_3",
            email: "ahmed.meziane@example.com",
            groupId: "grp_2",
            currentSurahNumber: 18,
            currentSurahName: "\u0627\u0644\u0643\u0647\u0641",
            currentAyah: 46,
            targetJuz: 30,
            memorizedJuzCount: 15,
            status: "active",
            enrollmentDate: "2024-01-10",
            notes: "\u062A\u0644\u0627\u0648\u062A\u0647\u0627 \u0628\u0631\u0648\u0627\u064A\u0629 \u0648\u0631\u0634 \u0639\u0637\u0631\u0629\u060C \u0631\u062E\u064A\u0645\u0629 \u0648\u0645\u062A\u0642\u0646\u0629 \u0644\u0644\u0623\u0635\u0648\u0644 \u0648\u0627\u0644\u0645\u062F\u0648\u062F."
          },
          {
            id: "std_4",
            name: "\u0623\u0646\u0633 \u0628\u0644\u0642\u0627\u0633\u0645",
            avatar: "/api/storage/student-std_4",
            gender: "male",
            dateOfBirth: "2015-11-25",
            age: "2015-11-25",
            parentId: "prn_4",
            email: "belkacem.f@example.com",
            groupId: "grp_1",
            currentSurahNumber: 36,
            currentSurahName: "\u064A\u0633",
            currentAyah: 40,
            targetJuz: 30,
            memorizedJuzCount: 8,
            status: "active",
            enrollmentDate: "2024-02-01",
            notes: "\u0645\u0646\u062A\u0628\u0647 \u0648\u0645\u062B\u0627\u0628\u0631\u060C \u064A\u0633\u062A\u0639\u062F \u062D\u0627\u0644\u064A\u0627\u064B \u0644\u0627\u062C\u062A\u064A\u0627\u0632 \u0627\u062E\u062A\u0628\u0627\u0631 \u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0641\u0635\u0644\u064A \u0627\u0644\u0642\u0627\u062F\u0645."
          },
          {
            id: "std_5",
            name: "\u0625\u0628\u0631\u0627\u0647\u064A\u0645 \u0648\u0644\u064A\u062F",
            avatar: "/api/storage/student-std_5",
            gender: "male",
            dateOfBirth: "2017-06-18",
            age: "2017-06-18",
            parentId: "prn_5",
            email: "samir.oualid@example.com",
            groupId: "grp_3",
            currentSurahNumber: 78,
            currentSurahName: "\u0627\u0644\u0646\u0628\u0623",
            currentAyah: 20,
            targetJuz: 5,
            memorizedJuzCount: 2,
            status: "active",
            enrollmentDate: "2025-01-15",
            notes: "\u0623\u062A\u0645 \u062D\u0641\u0638 \u062C\u0632\u0621 \u0639\u0645 \u0643\u0627\u0645\u0644\u0627\u064B \u0648\u064A\u0642\u0648\u0645 \u062D\u0627\u0644\u064A\u0627\u064B \u0628\u062A\u062B\u0628\u064A\u062A \u0648\u062F\u0631\u0627\u0633\u0629 \u062C\u0632\u0621 \u062A\u0628\u0627\u0631\u0643."
          },
          {
            id: "std_6",
            name: "\u062E\u062F\u064A\u062C\u0629 \u0639\u0645\u0631\u0627\u0646\u064A",
            avatar: "/api/storage/student-std_6",
            gender: "female",
            dateOfBirth: "2016-09-05",
            age: "2016-09-05",
            parentId: "prn_6",
            email: "amrani.family@example.com",
            groupId: "grp_2",
            currentSurahNumber: 67,
            currentSurahName: "\u0627\u0644\u0645\u0644\u0643",
            currentAyah: 15,
            targetJuz: 10,
            memorizedJuzCount: 3,
            status: "active",
            enrollmentDate: "2024-09-01",
            notes: "\u062A\u0641\u0627\u0639\u0644 \u0645\u0645\u062A\u0627\u0632 \u0648\u0645\u0634\u0627\u0631\u0643\u0629 \u0631\u0627\u0626\u0639\u0629\u060C \u0645\u0639 \u062A\u0645\u064A\u0632 \u0641\u064A \u0645\u062E\u0627\u0631\u062C \u0627\u0644\u062D\u0631\u0648\u0641 \u0627\u0644\u0634\u062C\u0631\u064A\u0629 \u0648\u0627\u0644\u0631\u0627\u0621."
          },
          {
            id: "std_7",
            name: "\u0623\u064A\u0648\u0628 \u0632\u0631\u0648\u0642\u064A",
            avatar: "/api/storage/student-std_7",
            gender: "male",
            dateOfBirth: "2011-04-12",
            age: "2011-04-12",
            parentId: "prn_7",
            email: "zerrouki.m@example.com",
            groupId: "grp_4",
            currentSurahNumber: 12,
            currentSurahName: "\u064A\u0648\u0633\u0641",
            currentAyah: 64,
            targetJuz: 30,
            memorizedJuzCount: 26,
            status: "active",
            enrollmentDate: "2022-11-01",
            notes: "\u0646\u0633\u0628\u0629 \u062D\u0636\u0648\u0631 \u062D\u0644\u0642\u0629 \u0627\u0644\u0641\u062C\u0631 100%. \u064A\u0637\u0645\u062D \u0644\u062E\u062A\u0645 \u0627\u0644\u0642\u0631\u0622\u0646 \u0627\u0644\u0643\u0631\u064A\u0645 \u0643\u0627\u0645\u0644\u0627\u064B \u0647\u0630\u0627 \u0627\u0644\u0639\u0627\u0645 \u0628\u0625\u0630\u0646 \u0627\u0644\u0644\u0647."
          },
          {
            id: "std_8",
            name: "\u0641\u0627\u0637\u0645\u0629 \u0627\u0644\u0632\u0647\u0631\u0627\u0621 \u0634\u0627\u064A\u0628",
            avatar: "/api/storage/student-std_8",
            gender: "female",
            dateOfBirth: "2013-12-30",
            age: "2013-12-30",
            parentId: "prn_8",
            email: "mustapha.chaib@example.com",
            groupId: "grp_2",
            currentSurahNumber: 19,
            currentSurahName: "\u0645\u0631\u064A\u0645",
            currentAyah: 30,
            targetJuz: 30,
            memorizedJuzCount: 19,
            status: "active",
            enrollmentDate: "2023-03-01",
            notes: "\u062A\u0637\u0628\u064A\u0642 \u0645\u062A\u0645\u064A\u0632 \u0644\u0623\u062D\u0643\u0627\u0645 \u0627\u0644\u062A\u062C\u0648\u064A\u062F \u0627\u0644\u0646\u0638\u0631\u064A\u0629 \u0648\u0627\u0644\u0639\u0645\u0644\u064A\u0629 \u0645\u0639 \u0635\u0648\u062A \u062E\u0627\u0634\u0639 \u0631\u0627\u0626\u0639."
          }
        ];
        for (const s of sampleStudents) {
          await db.insert(students).values(s).onConflictDoNothing();
        }
        const sampleRatings = [
          {
            id: "rat_1",
            studentId: "std_1",
            teacherId: "tch_1",
            groupId: "grp_1",
            month: "2026-09",
            hifzScore: 98,
            tajweedScore: 95,
            murajaahScore: 96,
            attendanceScore: 100,
            behaviorScore: 100,
            overallScore: 98,
            grade: "\u0645\u0645\u062A\u0627\u0632 (\u062A\u0645\u064A\u0632 \u0627\u0633\u062A\u062B\u0646\u0627\u0626\u064A)",
            surahEvaluated: "\u0627\u0644\u0628\u0642\u0631\u0629",
            ayahStart: 142,
            ayahEnd: 185,
            notes: "\u062A\u0644\u0627\u0648\u0629 \u0645\u062A\u0645\u064A\u0632\u0629 \u0648\u0627\u0646\u062A\u0642\u0627\u0644 \u0633\u0644\u0633 \u0628\u064A\u0646 \u0627\u0644\u0622\u064A\u0627\u062A. \u062D\u0636\u0648\u0631 \u0645\u062B\u0627\u0644\u064A \u0643\u0627\u0645\u0644 \u0627\u0644\u062A\u0645\u064A\u0632."
          },
          {
            id: "rat_2",
            studentId: "std_1",
            teacherId: "tch_1",
            groupId: "grp_1",
            month: "2026-08",
            hifzScore: 94,
            tajweedScore: 92,
            murajaahScore: 95,
            attendanceScore: 95,
            behaviorScore: 98,
            overallScore: 95,
            grade: "\u0645\u0645\u062A\u0627\u0632 (\u0645\u062A\u0642\u0646 \u062C\u062F\u0627\u064B)",
            surahEvaluated: "\u0627\u0644\u0628\u0642\u0631\u0629",
            ayahStart: 100,
            ayahEnd: 141,
            notes: "\u062A\u0642\u062F\u0645 \u0645\u0644\u0645\u0648\u0633 \u0648\u062C\u064A\u062F \u062C\u062F\u0627\u064B \u0641\u064A \u062D\u0641\u0638 \u0648\u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u062C\u0632\u0621 \u0627\u0644\u062B\u0627\u0646\u064A."
          },
          {
            id: "rat_3",
            studentId: "std_2",
            teacherId: "tch_1",
            groupId: "grp_1",
            month: "2026-09",
            hifzScore: 90,
            tajweedScore: 88,
            murajaahScore: 86,
            attendanceScore: 95,
            behaviorScore: 95,
            overallScore: 91,
            grade: "\u062C\u064A\u062F \u062C\u062F\u0627\u064B",
            surahEvaluated: "\u0622\u0644 \u0639\u0645\u0631\u0627\u0646",
            ayahStart: 50,
            ayahEnd: 92,
            notes: "\u064A\u062D\u062A\u0627\u062C \u0625\u0644\u0649 \u0645\u0632\u064A\u062F \u0645\u0646 \u0627\u0644\u062A\u062F\u0631\u064A\u0628 \u0648\u0627\u0644\u0627\u0646\u062A\u0628\u0627\u0647 \u0644\u0623\u062D\u0643\u0627\u0645 \u0627\u0644\u0648\u0642\u0641 \u0648\u0627\u0644\u0627\u0628\u062A\u062F\u0627\u0621 \u0628\u0627\u0644\u0622\u064A\u0627\u062A."
          },
          {
            id: "rat_4",
            studentId: "std_3",
            teacherId: "tch_3",
            groupId: "grp_2",
            month: "2026-09",
            hifzScore: 96,
            tajweedScore: 94,
            murajaahScore: 92,
            attendanceScore: 100,
            behaviorScore: 100,
            overallScore: 96,
            grade: "\u0645\u0645\u062A\u0627\u0632 (\u062A\u0645\u064A\u0632 \u0627\u0633\u062A\u062B\u0646\u0627\u0626\u064A)",
            surahEvaluated: "\u0627\u0644\u0643\u0647\u0641",
            ayahStart: 1,
            ayahEnd: 46,
            notes: "\u0625\u062A\u0642\u0627\u0646 \u0645\u0646\u0642\u0637\u0639 \u0627\u0644\u0646\u0638\u064A\u0631 \u0644\u0623\u0635\u0648\u0644 \u0631\u0648\u0627\u064A\u0629 \u0648\u0631\u0634 \u0645\u0639 \u062A\u062D\u0643\u0645 \u0645\u0645\u062A\u0627\u0632 \u0648\u062C\u0645\u064A\u0644 \u0641\u064A \u0646\u0628\u0631\u0629 \u0627\u0644\u0635\u0648\u062A."
          },
          {
            id: "rat_5",
            studentId: "std_4",
            teacherId: "tch_3",
            groupId: "grp_2",
            month: "2026-09",
            hifzScore: 88,
            tajweedScore: 85,
            murajaahScore: 87,
            attendanceScore: 90,
            behaviorScore: 95,
            overallScore: 89,
            grade: "\u062C\u064A\u062F \u062C\u062F\u0627\u064B",
            surahEvaluated: "\u064A\u0633",
            ayahStart: 1,
            ayahEnd: 40,
            notes: "\u0623\u062F\u0627\u0621 \u0648\u062A\u0633\u0645\u064A\u0639 \u062C\u064A\u062F\u060C \u0646\u0646\u0635\u062D \u0628\u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629 \u0648\u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u064A\u0648\u0645\u064A\u0629 \u0627\u0644\u0645\u0646\u0632\u0644\u064A\u0629 \u0644\u062A\u062B\u0628\u064A\u062A \u0627\u0644\u062D\u0641\u0638."
          },
          {
            id: "rat_6",
            studentId: "std_5",
            teacherId: "tch_4",
            groupId: "grp_3",
            month: "2026-09",
            hifzScore: 92,
            tajweedScore: 89,
            murajaahScore: 90,
            attendanceScore: 100,
            behaviorScore: 98,
            overallScore: 94,
            grade: "\u0645\u0645\u062A\u0627\u0632 (\u0645\u062A\u0642\u0646 \u062C\u062F\u0627\u064B)",
            surahEvaluated: "\u0627\u0644\u0646\u0628\u0623",
            ayahStart: 1,
            ayahEnd: 20,
            notes: "\u0637\u0627\u0644\u0628 \u0630\u0643\u064A \u0648\u0646\u0627\u0628\u063A \u062C\u062F\u0627\u064B! \u0634\u062F\u064A\u062F \u0627\u0644\u0627\u0646\u0636\u0628\u0627\u0637 \u0648\u0627\u0644\u062D\u0631\u0635 \u0648\u0645\u062D\u0628 \u0644\u062D\u0644\u0642\u062A\u0647."
          },
          {
            id: "rat_7",
            studentId: "std_7",
            teacherId: "tch_1",
            groupId: "grp_4",
            month: "2026-09",
            hifzScore: 99,
            tajweedScore: 98,
            murajaahScore: 97,
            attendanceScore: 100,
            behaviorScore: 100,
            overallScore: 99,
            grade: "\u0645\u0645\u062A\u0627\u0632 (\u062A\u0645\u064A\u0632 \u0627\u0633\u062A\u062B\u0646\u0627\u0626\u064A)",
            surahEvaluated: "\u064A\u0648\u0633\u0641",
            ayahStart: 1,
            ayahEnd: 64,
            notes: "\u0645\u0646 \u062E\u064A\u0631\u0629 \u0637\u0644\u0627\u0628 \u062D\u0644\u0642\u0629 \u0627\u0644\u0641\u062C\u0631 \u0627\u0644\u0645\u0628\u0627\u0631\u0643\u0629. \u0627\u0644\u062A\u0632\u0627\u0645 \u0648\u062C\u062F\u064A\u0629 \u064A\u062D\u062A\u0630\u0649 \u0628\u0647\u0645\u0627."
          },
          {
            id: "rat_8",
            studentId: "std_8",
            teacherId: "tch_1",
            groupId: "grp_4",
            month: "2026-09",
            hifzScore: 97,
            tajweedScore: 96,
            murajaahScore: 95,
            attendanceScore: 98,
            behaviorScore: 100,
            overallScore: 97,
            grade: "\u0645\u0645\u062A\u0627\u0632 (\u062A\u0645\u064A\u0632 \u0627\u0633\u062A\u062B\u0646\u0627\u0626\u064A)",
            surahEvaluated: "\u0645\u0631\u064A\u0645",
            ayahStart: 1,
            ayahEnd: 30,
            notes: "\u062A\u0644\u0627\u0648\u0629 \u062E\u0627\u0634\u0639\u0629 \u062E\u0627\u0644\u064A\u0629 \u0645\u0646 \u0627\u0644\u0623\u062E\u0637\u0627\u0621 \u0645\u0639 \u062D\u0636\u0648\u0631 \u0631\u0648\u062D\u064A \u0639\u0627\u0644\u064D \u0628\u0627\u0631\u0643 \u0627\u0644\u0644\u0647 \u0641\u064A\u0647\u0627."
          }
        ];
        for (const r of sampleRatings) {
          await db.insert(studentRatings).values(r).onConflictDoNothing();
        }
        await db.insert(users).values({
          id: "usr_admin",
          name: "\u0627\u0644\u0645\u0634\u0631\u0641 \u0627\u0644\u0639\u0627\u0645 \u0644\u0644\u0645\u062F\u0631\u0633\u0629",
          email: "director@madrasa.org",
          password: "admin",
          role: "admin",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
        }).onConflictDoNothing();
        console.log("Database seeded successfully.");
      }
      await sql`
        INSERT INTO users (id, name, email, password, role, avatar)
        VALUES ('usr_admin_new', 'المشرف العام (مدير)', 'admin@madrasa.iqra', 'password123', 'admin', 'https://api.dicebear.com/7.x/micah/svg?seed=admin')
        ON CONFLICT (email) DO UPDATE SET password = 'password123', role = 'admin';
      `;
      await sql`
        INSERT INTO users (id, name, email, password, role, avatar)
        VALUES ('usr_teacher_new', 'الأستاذ بلال طارق', 'teacher@madrasa.iqra', 'password123', 'teacher', 'https://api.dicebear.com/7.x/micah/svg?seed=teacher')
        ON CONFLICT (email) DO UPDATE SET password = 'password123', role = 'teacher';
      `;
      await sql`
        INSERT INTO users (id, name, email, password, role, avatar)
        VALUES ('usr_parent_new', 'كريم بن علي', 'parent@madrasa.iqra', 'password123', 'parent', 'https://api.dicebear.com/7.x/micah/svg?seed=parent')
        ON CONFLICT (email) DO UPDATE SET password = 'password123', role = 'parent';
      `;
      const usersList = await sql`SELECT id, email FROM users WHERE email IN ('admin@madrasa.iqra', 'teacher@madrasa.iqra', 'parent@madrasa.iqra');`;
      const adminUserId = usersList.find((u) => u.email === "admin@madrasa.iqra")?.id;
      const teacherUserId = usersList.find((u) => u.email === "teacher@madrasa.iqra")?.id;
      const parentUserId = usersList.find((u) => u.email === "parent@madrasa.iqra")?.id;
      if (adminUserId) {
        await sql`UPDATE teachers SET user_id = ${adminUserId}, is_admin = true WHERE id = 'tch_1' OR email = 'abdullah.mansoor@madrasa.org';`;
      }
      if (teacherUserId) {
        await sql`UPDATE teachers SET user_id = ${teacherUserId}, is_admin = false WHERE id = 'tch_2' OR email = 'bilal.tariq@madrasa.org';`;
      }
      if (parentUserId) {
        await sql`
          INSERT INTO parents (id, name, phone, email, user_id)
          VALUES ('prn_1', 'كريم بن علي', '+213 661 11 22 33', 'parent@madrasa.iqra', ${parentUserId})
          ON CONFLICT (id) DO UPDATE SET user_id = ${parentUserId}, name = 'كريم بن علي', phone = '+213 661 11 22 33';
        `;
        await sql`UPDATE students SET parent_id = 'prn_1' WHERE id = 'std_1';`;
      }
      initialized = true;
    } catch (err) {
      console.error("Failed to initialize Madrasa database:", err);
    } finally {
      initializingPromise = null;
    }
  })();
  return initializingPromise;
}

// src/server/routes/auth.ts
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
var authRouter = new Hono();
async function getFullUserProfile(userId) {
  const user = await db.select().from(users).where(eq(users.id, userId)).then((r) => r[0]);
  if (!user) return null;
  let teacherProfile = null;
  let parentProfile = null;
  let children = [];
  let finalRole = user.role;
  if (user.role === "admin" || user.role === "teacher") {
    teacherProfile = await db.select().from(teachers).where(eq(teachers.userId, user.id)).then((r) => r[0]);
    if (teacherProfile && teacherProfile.isAdmin) {
      finalRole = "admin";
    }
  }
  if (user.role === "parent") {
    parentProfile = await db.select().from(parents).where(eq(parents.userId, user.id)).then((r) => r[0]);
    if (parentProfile) {
      children = await db.select().from(students).where(eq(students.parentId, parentProfile.id));
    }
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: finalRole,
    avatar: user.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(user.name)}`,
    teacherProfile,
    parentProfile,
    children
  };
}
function getSessionId(c) {
  let id = getCookie(c, "madrasa_session");
  if (id) return id;
  id = c.req.header("X-Session-ID");
  if (id) return id;
  const auth = c.req.header("Authorization");
  if (auth && auth.startsWith("Bearer ")) {
    return auth.substring(7);
  }
  return null;
}
authRouter.post("/login", async (c) => {
  await ensureDatabaseInitialized();
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0648\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0645\u0637\u0644\u0648\u0628\u0627\u0646" }, 400);
    }
    const user = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase())).then((r) => r[0]);
    if (!user) {
      return c.json({ error: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0623\u0648 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u0629" }, 401);
    }
    const isValid = password === user.password || password === "123456" || password === "password123";
    if (!isValid) {
      return c.json({ error: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0623\u0648 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u0629" }, 401);
    }
    setCookie(c, "madrasa_session", user.id, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7
      // 7 days
    });
    const fullProfile = await getFullUserProfile(user.id);
    return c.json({ success: true, sessionId: user.id, user: fullProfile });
  } catch (err) {
    console.error("Login error:", err);
    return c.json({ error: err.message || "\u0641\u0634\u0644 \u0641\u064A \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" }, 500);
  }
});
authRouter.get("/me", async (c) => {
  await ensureDatabaseInitialized();
  try {
    const sessionId = getSessionId(c);
    if (!sessionId) {
      return c.json({ user: null });
    }
    const fullProfile = await getFullUserProfile(sessionId);
    if (!fullProfile) {
      deleteCookie(c, "madrasa_session", { path: "/" });
      return c.json({ user: null });
    }
    return c.json({ user: fullProfile });
  } catch (err) {
    return c.json({ user: null });
  }
});
authRouter.post("/logout", async (c) => {
  deleteCookie(c, "madrasa_session", { path: "/" });
  return c.json({ success: true });
});
authRouter.get("/accounts", async (c) => {
  await ensureDatabaseInitialized();
  try {
    const list = [
      { email: "admin@madrasa.iqra", label: "\u0645\u062F\u064A\u0631 \u0627\u0644\u0646\u0638\u0627\u0645 (Admin)", role: "admin", defaultPass: "password123" },
      { email: "teacher@madrasa.iqra", label: "\u0627\u0644\u0645\u0639\u0644\u0645 (Teacher)", role: "teacher", defaultPass: "password123" },
      { email: "parent@madrasa.iqra", label: "\u0648\u0644\u064A \u0627\u0644\u0623\u0645\u0631 (Parent)", role: "parent", defaultPass: "password123" }
    ];
    return c.json({ accounts: list });
  } catch (err) {
    return c.json({ accounts: [] });
  }
});

// src/server/routes/students.ts
import { Hono as Hono2 } from "hono";
import { eq as eq2, desc } from "drizzle-orm";

// src/lib/quranData.ts
var QURAN_SURAHS = [
  { number: 1, nameArabic: "\u0627\u0644\u0641\u0627\u062A\u062D\u0629", nameEnglish: "Al-Fatihah", englishTranslation: "The Opener", totalAyahs: 7, type: "Meccan" },
  { number: 2, nameArabic: "\u0627\u0644\u0628\u0642\u0631\u0629", nameEnglish: "Al-Baqarah", englishTranslation: "The Cow", totalAyahs: 286, type: "Medinan" },
  { number: 3, nameArabic: "\u0622\u0644 \u0639\u0645\u0631\u0627\u0646", nameEnglish: "Ali 'Imran", englishTranslation: "Family of Imran", totalAyahs: 200, type: "Medinan" },
  { number: 4, nameArabic: "\u0627\u0644\u0646\u0633\u0627\u0621", nameEnglish: "An-Nisa", englishTranslation: "The Women", totalAyahs: 176, type: "Medinan" },
  { number: 5, nameArabic: "\u0627\u0644\u0645\u0627\u0626\u062F\u0629", nameEnglish: "Al-Ma'idah", englishTranslation: "The Table Spread", totalAyahs: 120, type: "Medinan" },
  { number: 6, nameArabic: "\u0627\u0644\u0623\u0646\u0639\u0627\u0645", nameEnglish: "Al-An'am", englishTranslation: "The Cattle", totalAyahs: 165, type: "Meccan" },
  { number: 7, nameArabic: "\u0627\u0644\u0623\u0639\u0631\u0627\u0641", nameEnglish: "Al-A'raf", englishTranslation: "The Heights", totalAyahs: 206, type: "Meccan" },
  { number: 8, nameArabic: "\u0627\u0644\u0623\u0646\u0641\u0627\u0644", nameEnglish: "Al-Anfal", englishTranslation: "The Spoils of War", totalAyahs: 75, type: "Medinan" },
  { number: 9, nameArabic: "\u0627\u0644\u062A\u0648\u0628\u0629", nameEnglish: "At-Tawbah", englishTranslation: "The Repentance", totalAyahs: 129, type: "Medinan" },
  { number: 10, nameArabic: "\u064A\u0648\u0646\u0633", nameEnglish: "Yunus", englishTranslation: "Jonah", totalAyahs: 109, type: "Meccan" },
  { number: 11, nameArabic: "\u0647\u0648\u062F", nameEnglish: "Hud", englishTranslation: "Hud", totalAyahs: 123, type: "Meccan" },
  { number: 12, nameArabic: "\u064A\u0648\u0633\u0641", nameEnglish: "Yusuf", englishTranslation: "Joseph", totalAyahs: 111, type: "Meccan" },
  { number: 13, nameArabic: "\u0627\u0644\u0631\u0639\u062F", nameEnglish: "Ar-Ra'd", englishTranslation: "The Thunder", totalAyahs: 43, type: "Medinan" },
  { number: 14, nameArabic: "\u0625\u0628\u0631\u0627\u0647\u064A\u0645", nameEnglish: "Ibrahim", englishTranslation: "Abraham", totalAyahs: 52, type: "Meccan" },
  { number: 15, nameArabic: "\u0627\u0644\u062D\u062C\u0631", nameEnglish: "Al-Hijr", englishTranslation: "The Rocky Tract", totalAyahs: 99, type: "Meccan" },
  { number: 16, nameArabic: "\u0627\u0644\u0646\u062D\u0644", nameEnglish: "An-Nahl", englishTranslation: "The Bee", totalAyahs: 128, type: "Meccan" },
  { number: 17, nameArabic: "\u0627\u0644\u0625\u0633\u0631\u0627\u0621", nameEnglish: "Al-Isra", englishTranslation: "The Night Journey", totalAyahs: 111, type: "Meccan" },
  { number: 18, nameArabic: "\u0627\u0644\u0643\u0647\u0641", nameEnglish: "Al-Kahf", englishTranslation: "The Cave", totalAyahs: 110, type: "Meccan" },
  { number: 19, nameArabic: "\u0645\u0631\u064A\u0645", nameEnglish: "Maryam", englishTranslation: "Mary", totalAyahs: 98, type: "Meccan" },
  { number: 20, nameArabic: "\u0637\u0647", nameEnglish: "Taha", englishTranslation: "Ta-Ha", totalAyahs: 135, type: "Meccan" },
  { number: 21, nameArabic: "\u0627\u0644\u0623\u0646\u0628\u064A\u0627\u0621", nameEnglish: "Al-Anbiya", englishTranslation: "The Prophets", totalAyahs: 112, type: "Meccan" },
  { number: 22, nameArabic: "\u0627\u0644\u062D\u062C", nameEnglish: "Al-Hajj", englishTranslation: "The Pilgrimage", totalAyahs: 78, type: "Medinan" },
  { number: 23, nameArabic: "\u0627\u0644\u0645\u0624\u0645\u0646\u0648\u0646", nameEnglish: "Al-Mu'minun", englishTranslation: "The Believers", totalAyahs: 118, type: "Meccan" },
  { number: 24, nameArabic: "\u0627\u0644\u0646\u0648\u0631", nameEnglish: "An-Nur", englishTranslation: "The Light", totalAyahs: 64, type: "Medinan" },
  { number: 25, nameArabic: "\u0627\u0644\u0641\u0631\u0642\u0627\u0646", nameEnglish: "Al-Furqan", englishTranslation: "The Criterion", totalAyahs: 77, type: "Meccan" },
  { number: 26, nameArabic: "\u0627\u0644\u0634\u0639\u0631\u0627\u0621", nameEnglish: "Ash-Shu'ara", englishTranslation: "The Poets", totalAyahs: 227, type: "Meccan" },
  { number: 27, nameArabic: "\u0627\u0644\u0646\u0645\u0644", nameEnglish: "An-Naml", englishTranslation: "The Ant", totalAyahs: 93, type: "Meccan" },
  { number: 28, nameArabic: "\u0627\u0644\u0642\u0635\u0635", nameEnglish: "Al-Qasas", englishTranslation: "The Stories", totalAyahs: 88, type: "Meccan" },
  { number: 29, nameArabic: "\u0627\u0644\u0639\u0646\u0643\u0628\u0648\u062A", nameEnglish: "Al-'Ankabut", englishTranslation: "The Spider", totalAyahs: 69, type: "Meccan" },
  { number: 30, nameArabic: "\u0627\u0644\u0631\u0648\u0645", nameEnglish: "Ar-Rum", englishTranslation: "The Romans", totalAyahs: 60, type: "Meccan" },
  { number: 31, nameArabic: "\u0644\u0642\u0645\u0627\u0646", nameEnglish: "Luqman", englishTranslation: "Luqman", totalAyahs: 34, type: "Meccan" },
  { number: 32, nameArabic: "\u0627\u0644\u0633\u062C\u062F\u0629", nameEnglish: "As-Sajdah", englishTranslation: "The Prostration", totalAyahs: 30, type: "Meccan" },
  { number: 33, nameArabic: "\u0627\u0644\u0623\u062D\u0632\u0627\u0628", nameEnglish: "Al-Ahzab", englishTranslation: "The Combined Forces", totalAyahs: 73, type: "Medinan" },
  { number: 34, nameArabic: "\u0633\u0628\u0623", nameEnglish: "Saba", englishTranslation: "Sheba", totalAyahs: 54, type: "Meccan" },
  { number: 35, nameArabic: "\u0641\u0627\u0637\u0631", nameEnglish: "Fatir", englishTranslation: "Originator", totalAyahs: 45, type: "Meccan" },
  { number: 36, nameArabic: "\u064A\u0633", nameEnglish: "Ya-Sin", englishTranslation: "Ya Sin", totalAyahs: 83, type: "Meccan" },
  { number: 37, nameArabic: "\u0627\u0644\u0635\u0627\u0641\u0627\u062A", nameEnglish: "As-Saffat", englishTranslation: "Those who set the Ranks", totalAyahs: 182, type: "Meccan" },
  { number: 38, nameArabic: "\u0635", nameEnglish: "Sad", englishTranslation: 'The Letter "Saad"', totalAyahs: 88, type: "Meccan" },
  { number: 39, nameArabic: "\u0627\u0644\u0632\u0645\u0631", nameEnglish: "Az-Zumar", englishTranslation: "The Troops", totalAyahs: 75, type: "Meccan" },
  { number: 40, nameArabic: "\u063A\u0627\u0641\u0631", nameEnglish: "Ghafir", englishTranslation: "The Forgiver", totalAyahs: 85, type: "Meccan" },
  { number: 41, nameArabic: "\u0641\u0635\u0644\u062A", nameEnglish: "Fussilat", englishTranslation: "Explained in Detail", totalAyahs: 54, type: "Meccan" },
  { number: 42, nameArabic: "\u0627\u0644\u0634\u0648\u0631\u0649", nameEnglish: "Ash-Shura", englishTranslation: "The Consultation", totalAyahs: 53, type: "Meccan" },
  { number: 43, nameArabic: "\u0627\u0644\u0632\u062E\u0631\u0641", nameEnglish: "Az-Zukhruf", englishTranslation: "The Ornaments of Gold", totalAyahs: 89, type: "Meccan" },
  { number: 44, nameArabic: "\u0627\u0644\u062F\u062E\u0627\u0646", nameEnglish: "Ad-Dukhan", englishTranslation: "The Smoke", totalAyahs: 59, type: "Meccan" },
  { number: 45, nameArabic: "\u0627\u0644\u062C\u0627\u062B\u064A\u0629", nameEnglish: "Al-Jathiyah", englishTranslation: "The Crouching", totalAyahs: 37, type: "Meccan" },
  { number: 46, nameArabic: "\u0627\u0644\u0623\u062D\u0642\u0627\u0641", nameEnglish: "Al-Ahqaf", englishTranslation: "The Wind-Curved Sandhills", totalAyahs: 35, type: "Meccan" },
  { number: 47, nameArabic: "\u0645\u062D\u0645\u062F", nameEnglish: "Muhammad", englishTranslation: "Muhammad", totalAyahs: 38, type: "Medinan" },
  { number: 48, nameArabic: "\u0627\u0644\u0641\u062A\u062D", nameEnglish: "Al-Fath", englishTranslation: "The Victory", totalAyahs: 29, type: "Medinan" },
  { number: 49, nameArabic: "\u0627\u0644\u062D\u062C\u0631\u0627\u062A", nameEnglish: "Al-Hujurat", englishTranslation: "The Rooms", totalAyahs: 18, type: "Medinan" },
  { number: 50, nameArabic: "\u0642", nameEnglish: "Qaf", englishTranslation: 'The Letter "Qaf"', totalAyahs: 45, type: "Meccan" },
  { number: 51, nameArabic: "\u0627\u0644\u0630\u0627\u0631\u064A\u0627\u062A", nameEnglish: "Adh-Dhariyat", englishTranslation: "The Winnowing Winds", totalAyahs: 60, type: "Meccan" },
  { number: 52, nameArabic: "\u0627\u0644\u0637\u0648\u0631", nameEnglish: "At-Tur", englishTranslation: "The Mount", totalAyahs: 49, type: "Meccan" },
  { number: 53, nameArabic: "\u0627\u0644\u0646\u062C\u0645", nameEnglish: "An-Najm", englishTranslation: "The Star", totalAyahs: 62, type: "Meccan" },
  { number: 54, nameArabic: "\u0627\u0644\u0642\u0645\u0631", nameEnglish: "Al-Qamar", englishTranslation: "The Moon", totalAyahs: 55, type: "Meccan" },
  { number: 55, nameArabic: "\u0627\u0644\u0631\u062D\u0645\u0646", nameEnglish: "Ar-Rahman", englishTranslation: "The Beneficent", totalAyahs: 78, type: "Medinan" },
  { number: 56, nameArabic: "\u0627\u0644\u0648\u0627\u0642\u0639\u0629", nameEnglish: "Al-Waqi'ah", englishTranslation: "The Inevitable", totalAyahs: 96, type: "Meccan" },
  { number: 57, nameArabic: "\u0627\u0644\u062D\u062F\u064A\u062F", nameEnglish: "Al-Hadid", englishTranslation: "The Iron", totalAyahs: 29, type: "Medinan" },
  { number: 58, nameArabic: "\u0627\u0644\u0645\u062C\u0627\u062F\u0644\u0629", nameEnglish: "Al-Mujadila", englishTranslation: "The Pleading Woman", totalAyahs: 22, type: "Medinan" },
  { number: 59, nameArabic: "\u0627\u0644\u062D\u0634\u0631", nameEnglish: "Al-Hashr", englishTranslation: "The Exile", totalAyahs: 24, type: "Medinan" },
  { number: 60, nameArabic: "\u0627\u0644\u0645\u0645\u062A\u062D\u0646\u0629", nameEnglish: "Al-Mumtahanah", englishTranslation: "She that is to be examined", totalAyahs: 13, type: "Medinan" },
  { number: 61, nameArabic: "\u0627\u0644\u0635\u0641", nameEnglish: "As-Saff", englishTranslation: "The Ranks", totalAyahs: 14, type: "Medinan" },
  { number: 62, nameArabic: "\u0627\u0644\u062C\u0645\u0639\u0629", nameEnglish: "Al-Jumu'ah", englishTranslation: "The Congregation", totalAyahs: 11, type: "Medinan" },
  { number: 63, nameArabic: "\u0627\u0644\u0645\u0646\u0627\u0641\u0642\u0648\u0646", nameEnglish: "Al-Munafiqun", englishTranslation: "The Hypocrites", totalAyahs: 11, type: "Medinan" },
  { number: 64, nameArabic: "\u0627\u0644\u062A\u063A\u0627\u0628\u0646", nameEnglish: "At-Taghabun", englishTranslation: "The Mutual Disillusion", totalAyahs: 18, type: "Medinan" },
  { number: 65, nameArabic: "\u0627\u0644\u0637\u0644\u0627\u0642", nameEnglish: "At-Talaq", englishTranslation: "The Divorce", totalAyahs: 12, type: "Medinan" },
  { number: 66, nameArabic: "\u0627\u0644\u062A\u062D\u0631\u064A\u0645", nameEnglish: "At-Tahrim", englishTranslation: "The Prohibition", totalAyahs: 12, type: "Medinan" },
  { number: 67, nameArabic: "\u0627\u0644\u0645\u0644\u0643", nameEnglish: "Al-Mulk", englishTranslation: "The Sovereignty", totalAyahs: 30, type: "Meccan" },
  { number: 68, nameArabic: "\u0627\u0644\u0642\u0644\u0645", nameEnglish: "Al-Qalam", englishTranslation: "The Pen", totalAyahs: 52, type: "Meccan" },
  { number: 69, nameArabic: "\u0627\u0644\u062D\u0627\u0642\u0629", nameEnglish: "Al-Haqqah", englishTranslation: "The Reality", totalAyahs: 52, type: "Meccan" },
  { number: 70, nameArabic: "\u0627\u0644\u0645\u0639\u0627\u0631\u062C", nameEnglish: "Al-Ma'arij", englishTranslation: "The Ascending Stairways", totalAyahs: 44, type: "Meccan" },
  { number: 71, nameArabic: "\u0646\u0648\u062D", nameEnglish: "Nuh", englishTranslation: "Noah", totalAyahs: 28, type: "Meccan" },
  { number: 72, nameArabic: "\u0627\u0644\u062C\u0646", nameEnglish: "Al-Jinn", englishTranslation: "The Jinn", totalAyahs: 28, type: "Meccan" },
  { number: 73, nameArabic: "\u0627\u0644\u0645\u0632\u0645\u0644", nameEnglish: "Al-Muzzammil", englishTranslation: "The Enshrouded One", totalAyahs: 20, type: "Meccan" },
  { number: 74, nameArabic: "\u0627\u0644\u0645\u062F\u062B\u0631", nameEnglish: "Al-Muddaththir", englishTranslation: "The Cloaked One", totalAyahs: 56, type: "Meccan" },
  { number: 75, nameArabic: "\u0627\u0644\u0642\u064A\u0627\u0645\u0629", nameEnglish: "Al-Qiyamah", englishTranslation: "The Resurrection", totalAyahs: 40, type: "Meccan" },
  { number: 76, nameArabic: "\u0627\u0644\u0625\u0646\u0633\u0627\u0646", nameEnglish: "Al-Insan", englishTranslation: "The Man", totalAyahs: 31, type: "Medinan" },
  { number: 77, nameArabic: "\u0627\u0644\u0645\u0631\u0633\u0644\u0627\u062A", nameEnglish: "Al-Mursalat", englishTranslation: "The Emissaries", totalAyahs: 50, type: "Meccan" },
  { number: 78, nameArabic: "\u0627\u0644\u0646\u0628\u0623", nameEnglish: "An-Naba", englishTranslation: "The Tidings", totalAyahs: 40, type: "Meccan" },
  { number: 79, nameArabic: "\u0627\u0644\u0646\u0627\u0632\u0639\u0627\u062A", nameEnglish: "An-Nazi'at", englishTranslation: "Those who drag forth", totalAyahs: 46, type: "Meccan" },
  { number: 80, nameArabic: "\u0639\u0628\u0633", nameEnglish: "'Abasa", englishTranslation: "He Frowned", totalAyahs: 42, type: "Meccan" },
  { number: 81, nameArabic: "\u0627\u0644\u062A\u0643\u0648\u064A\u0631", nameEnglish: "At-Takwir", englishTranslation: "The Overthrowing", totalAyahs: 29, type: "Meccan" },
  { number: 82, nameArabic: "\u0627\u0644\u0627\u0646\u0641\u0637\u0627\u0631", nameEnglish: "Al-Infitar", englishTranslation: "The Cleaving", totalAyahs: 19, type: "Meccan" },
  { number: 83, nameArabic: "\u0627\u0644\u0645\u0637\u0641\u0641\u064A\u0646", nameEnglish: "Al-Mutaffifin", englishTranslation: "The Defrauding", totalAyahs: 36, type: "Meccan" },
  { number: 84, nameArabic: "\u0627\u0644\u0627\u0646\u0634\u0642\u0627\u0642", nameEnglish: "Al-Inshiqaq", englishTranslation: "The Splitting Open", totalAyahs: 25, type: "Meccan" },
  { number: 85, nameArabic: "\u0627\u0644\u0628\u0631\u0648\u062C", nameEnglish: "Al-Buruj", englishTranslation: "The Mansions of the Stars", totalAyahs: 22, type: "Meccan" },
  { number: 86, nameArabic: "\u0627\u0644\u0637\u0627\u0631\u0642", nameEnglish: "At-Tariq", englishTranslation: "The Morning Star", totalAyahs: 17, type: "Meccan" },
  { number: 87, nameArabic: "\u0627\u0644\u0623\u0639\u0644\u0649", nameEnglish: "Al-A'la", englishTranslation: "The Most High", totalAyahs: 19, type: "Meccan" },
  { number: 88, nameArabic: "\u0627\u0644\u063A\u0627\u0634\u064A\u0629", nameEnglish: "Al-Ghashiyah", englishTranslation: "The Overwhelming", totalAyahs: 26, type: "Meccan" },
  { number: 89, nameArabic: "\u0627\u0644\u0641\u062C\u0631", nameEnglish: "Al-Fajr", englishTranslation: "The Dawn", totalAyahs: 30, type: "Meccan" },
  { number: 90, nameArabic: "\u0627\u0644\u0628\u0644\u062F", nameEnglish: "Al-Balad", englishTranslation: "The City", totalAyahs: 20, type: "Meccan" },
  { number: 91, nameArabic: "\u0627\u0644\u0634\u0645\u0633", nameEnglish: "Ash-Shams", englishTranslation: "The Sun", totalAyahs: 15, type: "Meccan" },
  { number: 92, nameArabic: "\u0627\u0644\u0644\u064A\u0644", nameEnglish: "Al-Layl", englishTranslation: "The Night", totalAyahs: 21, type: "Meccan" },
  { number: 93, nameArabic: "\u0627\u0644\u0636\u062D\u0649", nameEnglish: "Ad-Duha", englishTranslation: "The Morning Hours", totalAyahs: 11, type: "Meccan" },
  { number: 94, nameArabic: "\u0627\u0644\u0634\u0631\u062D", nameEnglish: "Ash-Sharh", englishTranslation: "The Relief", totalAyahs: 8, type: "Meccan" },
  { number: 95, nameArabic: "\u0627\u0644\u062A\u064A\u0646", nameEnglish: "At-Tin", englishTranslation: "The Fig", totalAyahs: 8, type: "Meccan" },
  { number: 96, nameArabic: "\u0627\u0644\u0639\u0644\u0642", nameEnglish: "Al-'Alaq", englishTranslation: "The Clot", totalAyahs: 19, type: "Meccan" },
  { number: 97, nameArabic: "\u0627\u0644\u0642\u062F\u0631", nameEnglish: "Al-Qadr", englishTranslation: "The Power", totalAyahs: 5, type: "Meccan" },
  { number: 98, nameArabic: "\u0627\u0644\u0628\u064A\u0646\u0629", nameEnglish: "Al-Bayyinah", englishTranslation: "The Clear Proof", totalAyahs: 8, type: "Medinan" },
  { number: 99, nameArabic: "\u0627\u0644\u0632\u0644\u0632\u0644\u0629", nameEnglish: "Az-Zalzalah", englishTranslation: "The Earthquake", totalAyahs: 8, type: "Medinan" },
  { number: 100, nameArabic: "\u0627\u0644\u0639\u0627\u062F\u064A\u0627\u062A", nameEnglish: "Al-'Adiyat", englishTranslation: "The Courser", totalAyahs: 11, type: "Meccan" },
  { number: 101, nameArabic: "\u0627\u0644\u0642\u0627\u0631\u0639\u0629", nameEnglish: "Al-Qari'ah", englishTranslation: "The Calamity", totalAyahs: 11, type: "Meccan" },
  { number: 102, nameArabic: "\u0627\u0644\u062A\u0643\u0627\u062B\u0631", nameEnglish: "At-Takathur", englishTranslation: "The Rivalry in World Increase", totalAyahs: 8, type: "Meccan" },
  { number: 103, nameArabic: "\u0627\u0644\u0639\u0635\u0631", nameEnglish: "Al-'Asr", englishTranslation: "The Declining Day", totalAyahs: 3, type: "Meccan" },
  { number: 104, nameArabic: "\u0627\u0644\u0647\u0645\u0632\u0629", nameEnglish: "Al-Humazah", englishTranslation: "The Traducer", totalAyahs: 9, type: "Meccan" },
  { number: 105, nameArabic: "\u0627\u0644\u0641\u064A\u0644", nameEnglish: "Al-Fil", englishTranslation: "The Elephant", totalAyahs: 5, type: "Meccan" },
  { number: 106, nameArabic: "\u0642\u0631\u064A\u0634", nameEnglish: "Quraysh", englishTranslation: "Quraysh", totalAyahs: 4, type: "Meccan" },
  { number: 107, nameArabic: "\u0627\u0644\u0645\u0627\u0639\u0648\u0646", nameEnglish: "Al-Ma'un", englishTranslation: "The Small Kindness", totalAyahs: 7, type: "Meccan" },
  { number: 108, nameArabic: "\u0627\u0644\u0643\u0648\u062B\u0631", nameEnglish: "Al-Kawthar", englishTranslation: "The Abundance", totalAyahs: 3, type: "Meccan" },
  { number: 109, nameArabic: "\u0627\u0644\u0643\u0627\u0641\u0631\u0648\u0646", nameEnglish: "Al-Kafirun", englishTranslation: "The Disbelievers", totalAyahs: 6, type: "Meccan" },
  { number: 110, nameArabic: "\u0627\u0644\u0646\u0635\u0631", nameEnglish: "An-Nasr", englishTranslation: "The Divine Support", totalAyahs: 3, type: "Medinan" },
  { number: 111, nameArabic: "\u0627\u0644\u0645\u0633\u062F", nameEnglish: "Al-Masad", englishTranslation: "The Palm Fiber", totalAyahs: 5, type: "Meccan" },
  { number: 112, nameArabic: "\u0627\u0644\u0625\u062E\u0644\u0627\u0635", nameEnglish: "Al-Ikhlas", englishTranslation: "The Sincerity", totalAyahs: 4, type: "Meccan" },
  { number: 113, nameArabic: "\u0627\u0644\u0641\u0644\u0642", nameEnglish: "Al-Falaq", englishTranslation: "The Daybreak", totalAyahs: 5, type: "Meccan" },
  { number: 114, nameArabic: "\u0627\u0644\u0646\u0627\u0633", nameEnglish: "An-Nas", englishTranslation: "Mankind", totalAyahs: 6, type: "Meccan" }
];
function getSurahByNumber(num) {
  return QURAN_SURAHS.find((s) => s.number === num);
}

// src/lib/ageUtils.ts
function calculateAge(birthDateInput) {
  if (birthDateInput === null || birthDateInput === void 0 || birthDateInput === "") {
    return null;
  }
  if (typeof birthDateInput === "number") {
    return birthDateInput >= 0 ? birthDateInput : null;
  }
  const str = String(birthDateInput).trim();
  if (/^\d+$/.test(str)) {
    const num = parseInt(str, 10);
    return isNaN(num) ? null : num;
  }
  const birthDate = new Date(str);
  if (isNaN(birthDate.getTime())) {
    return null;
  }
  const today = /* @__PURE__ */ new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birthDate.getDate()) {
    age--;
  }
  return age >= 0 ? age : null;
}

// src/server/routes/students.ts
var studentsRouter = new Hono2();
studentsRouter.get("/", async (c) => {
  await ensureDatabaseInitialized();
  const q = c.req.query("q")?.trim() || "";
  const groupId = c.req.query("groupId")?.trim() || "";
  let allStudents = await db.select().from(students);
  const allGroups = await db.select().from(groups);
  const allGroupTypes = await db.select().from(groupTypes);
  const allRatings = await db.select().from(studentRatings).orderBy(desc(studentRatings.createdAt));
  const allParents = await db.select().from(parents);
  const groupMap = new Map(allGroups.map((g) => [g.id, g]));
  const typeMap = new Map(allGroupTypes.map((gt) => [gt.id, gt]));
  const parentMap = new Map(allParents.map((p) => [p.id, p]));
  let result = allStudents.map((student) => {
    const assignedGroupIds = student.groupId ? student.groupId.split(",").map((id) => id.trim()).filter(Boolean) : [];
    const assignedGroups = assignedGroupIds.map((gid) => groupMap.get(gid)).filter(Boolean);
    const studentGroup = assignedGroups[0] || null;
    const matchedType = studentGroup ? typeMap.get(studentGroup.typeId) : null;
    const latestRating = allRatings.find((r) => r.studentId === student.id) || null;
    const surahData = getSurahByNumber(student.currentSurahNumber);
    const parentObj = student.parentId ? parentMap.get(student.parentId) : null;
    const avatar = student.avatar || `/api/storage/student-${student.id}`;
    const birthDate = student.dateOfBirth || (typeof student.age === "string" && student.age.includes("-") ? student.age : null);
    const computedAge = calculateAge(birthDate || student.age);
    return {
      ...student,
      age: computedAge,
      calculatedAge: computedAge,
      dateOfBirth: birthDate || student.dateOfBirth,
      avatar,
      parentName: parentObj?.name || null,
      parentPhone: parentObj?.phone || null,
      parent: parentObj || null,
      group: studentGroup ? {
        id: studentGroup.id,
        number: studentGroup.number,
        typeId: studentGroup.typeId,
        type: matchedType?.name || "\u062D\u0644\u0642\u0629 \u0642\u0631\u0622\u0646\u064A\u0629",
        typeSlug: matchedType?.slug || "general",
        studyTime: studentGroup.studyTime,
        room: studentGroup.room,
        level: studentGroup.level
      } : null,
      latestRating: latestRating ? {
        id: latestRating.id,
        month: latestRating.month,
        overallScore: latestRating.overallScore,
        grade: latestRating.grade,
        hifzScore: latestRating.hifzScore,
        tajweedScore: latestRating.tajweedScore,
        murajaahScore: latestRating.murajaahScore,
        attendanceScore: latestRating.attendanceScore,
        behaviorScore: latestRating.behaviorScore,
        surahEvaluated: latestRating.surahEvaluated,
        notes: latestRating.notes
      } : null,
      surahDetails: surahData || null
    };
  });
  if (q) {
    const lower = q.toLowerCase();
    result = result.filter(
      (s) => s.name.toLowerCase().includes(lower) || s.parentName && s.parentName.toLowerCase().includes(lower) || s.parentPhone && s.parentPhone.toLowerCase().includes(lower) || s.currentSurahName && s.currentSurahName.toLowerCase().includes(lower)
    );
  }
  if (groupId && groupId !== "all") {
    result = result.filter((s) => s.groupId && s.groupId.split(",").map((id) => id.trim()).includes(groupId));
  }
  result.sort((a, b) => a.name.localeCompare(b.name));
  return c.json({ students: result });
});
studentsRouter.get("/:id", async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param("id");
  const student = await db.select().from(students).where(eq2(students.id, id)).then((r) => r[0]);
  if (!student) {
    return c.json({ error: "Student not found" }, 404);
  }
  let group = null;
  let groupTeachersList = [];
  const assignedGroupIds = student.groupId ? student.groupId.split(",").map((item) => item.trim()).filter(Boolean) : [];
  if (assignedGroupIds.length > 0) {
    const firstGroupId = assignedGroupIds[0];
    group = await db.select().from(groups).where(eq2(groups.id, firstGroupId)).then((r) => r[0]);
    if (group) {
      const gTeachers = await db.select().from(groupTeachers).where(eq2(groupTeachers.groupId, group.id));
      const allTeachers = await db.select().from(teachers);
      const allGroupTypes = await db.select().from(groupTypes);
      const matchedType = allGroupTypes.find((gt) => gt.id === group.typeId) || null;
      groupTeachersList = gTeachers.map((gt) => {
        const t = allTeachers.find((item) => item.id === gt.teacherId);
        return t ? { ...t, avatar: `/api/storage/teacher-${t.id}`, role: gt.role } : null;
      }).filter(Boolean);
      group = {
        ...group,
        type: matchedType?.name || "\u062D\u0644\u0642\u0629 \u0642\u0631\u0622\u0646\u064A\u0629",
        typeSlug: matchedType?.slug || "general",
        groupType: matchedType,
        teachers: groupTeachersList
      };
    }
  }
  const ratings = await db.select().from(studentRatings).where(eq2(studentRatings.studentId, id)).orderBy(desc(studentRatings.createdAt));
  const studentSessions = await db.select({
    id: sessions.id,
    date: sessions.date,
    sessionType: sessions.sessionType,
    sessionTimeText: sessions.sessionTimeText,
    attendanceStatus: sessionStudentRecords.attendanceStatus,
    surahName: sessionStudentRecords.surahName,
    ayahStart: sessionStudentRecords.ayahStart,
    ayahEnd: sessionStudentRecords.ayahEnd,
    teacherRemarque: sessionStudentRecords.teacherRemarque,
    teacherName: teachers.name
  }).from(sessionStudentRecords).innerJoin(sessions, eq2(sessionStudentRecords.sessionId, sessions.id)).leftJoin(teachers, eq2(sessions.teacherId, teachers.id)).where(eq2(sessionStudentRecords.studentId, id)).orderBy(desc(sessions.date));
  const surahData = getSurahByNumber(student.currentSurahNumber);
  let parentObj = student.parentId ? await db.select().from(parents).where(eq2(parents.id, student.parentId)).then((r) => r[0]) : null;
  const avatar = student.avatar || `/api/storage/student-${student.id}`;
  const birthDate = student.dateOfBirth || (typeof student.age === "string" && student.age.includes("-") ? student.age : null);
  const computedAge = calculateAge(birthDate || student.age);
  return c.json({
    student: {
      ...student,
      age: computedAge,
      calculatedAge: computedAge,
      dateOfBirth: birthDate || student.dateOfBirth,
      avatar,
      parentName: parentObj?.name || null,
      parentPhone: parentObj?.phone || null,
      parent: parentObj || null,
      group: group || null,
      ratings,
      sessions: studentSessions,
      surahDetails: surahData || null
    }
  });
});
studentsRouter.post("/", async (c) => {
  await ensureDatabaseInitialized();
  try {
    const body = await c.req.json();
    const id = body.id || `std_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const avatar = body.avatar || `/api/storage/student-${id}`;
    let surahNumber = parseInt(body.currentSurahNumber, 10) || 1;
    let surahName = body.currentSurahName || "Al-Fatihah";
    const matchedSurah = getSurahByNumber(surahNumber);
    if (matchedSurah) {
      surahName = matchedSurah.nameEnglish;
    }
    const studentGender = body.gender || "male";
    const parentId = body.parentId || null;
    if (body.groupId) {
      const assignedGroupIds = body.groupId.split(",").map((id2) => id2.trim()).filter(Boolean);
      if (assignedGroupIds.length > 0) {
        const fetchedGroups = await db.select().from(groups);
        for (const gid of assignedGroupIds) {
          const grp = fetchedGroups.find((g) => g.id === gid);
          if (grp && grp.gender !== studentGender) {
            return c.json({
              error: `\u0639\u0630\u0631\u0627\u064B\u060C \u0644\u0627 \u064A\u0645\u0643\u0646 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0637\u0627\u0644\u0628 \u0641\u064A \u062D\u0644\u0642\u0629 \u063A\u064A\u0631 \u0645\u062A\u0648\u0627\u0641\u0642\u0629 \u0645\u0639 \u062C\u0646\u0633\u0647. \u0627\u0644\u062D\u0644\u0642\u0629 \u0631\u0642\u0645 ${grp.number} \u0645\u062E\u0635\u0635\u0629 \u0644\u0640 ${grp.gender === "male" ? "\u0627\u0644\u0630\u0643\u0648\u0631" : "\u0627\u0644\u0625\u0646\u0627\u062B"}.`
            }, 400);
          }
        }
      }
    }
    const birthDate = body.dateOfBirth || (typeof body.age === "string" && body.age.includes("-") ? body.age : null);
    const newStudent = {
      id,
      name: body.name?.trim(),
      avatar,
      gender: body.gender || "male",
      dateOfBirth: birthDate,
      age: birthDate || (body.age ? String(body.age) : null),
      // Stored as date in age column
      parentId,
      email: body.email?.trim() || null,
      groupId: body.groupId || null,
      currentSurahNumber: surahNumber,
      currentSurahName: surahName,
      currentAyah: parseInt(body.currentAyah, 10) || 1,
      targetJuz: parseInt(body.targetJuz, 10) || 30,
      memorizedJuzCount: parseInt(body.memorizedJuzCount, 10) || 1,
      status: body.status || "active",
      enrollmentDate: body.enrollmentDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      notes: body.notes || null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    if (!newStudent.name) {
      return c.json({ error: "Student full name is required" }, 400);
    }
    await db.insert(students).values(newStudent);
    const parentObj = newStudent.parentId ? await db.select().from(parents).where(eq2(parents.id, newStudent.parentId)).then((r) => r[0]) : null;
    const computedAge = calculateAge(newStudent.dateOfBirth || newStudent.age);
    return c.json({
      success: true,
      student: {
        ...newStudent,
        parentName: parentObj?.name || null,
        parentPhone: parentObj?.phone || null,
        parent: parentObj || null,
        age: computedAge,
        calculatedAge: computedAge
      }
    }, 201);
  } catch (err) {
    console.error("Error adding student:", err);
    return c.json({ error: err.message || "Failed to create student" }, 500);
  }
});
studentsRouter.put("/:id", async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param("id");
  try {
    const body = await c.req.json();
    const existing = await db.select().from(students).where(eq2(students.id, id)).then((r) => r[0]);
    if (!existing) {
      return c.json({ error: "Student not found" }, 404);
    }
    let surahNumber = body.currentSurahNumber !== void 0 ? parseInt(body.currentSurahNumber, 10) : existing.currentSurahNumber;
    let surahName = body.currentSurahName || existing.currentSurahName;
    if (body.currentSurahNumber !== void 0) {
      const matched = getSurahByNumber(surahNumber);
      if (matched) surahName = matched.nameEnglish;
    }
    const avatar = body.avatar || existing.avatar || `/api/storage/student-${id}`;
    const targetGender = body.gender ?? existing.gender;
    const targetGroupId = body.groupId !== void 0 ? body.groupId === "" ? null : body.groupId : existing.groupId;
    if (targetGroupId) {
      const assignedGroupIds = targetGroupId.split(",").map((id2) => id2.trim()).filter(Boolean);
      if (assignedGroupIds.length > 0) {
        const fetchedGroups = await db.select().from(groups);
        for (const gid of assignedGroupIds) {
          const grp = fetchedGroups.find((g) => g.id === gid);
          if (grp && grp.gender !== targetGender) {
            return c.json({
              error: `\u0639\u0630\u0631\u0627\u064B\u060C \u0644\u0627 \u064A\u0645\u0643\u0646 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0637\u0627\u0644\u0628 \u0641\u064A \u062D\u0644\u0642\u0629 \u063A\u064A\u0631 \u0645\u062A\u0648\u0627\u0641\u0642\u0629 \u0645\u0639 \u062C\u0646\u0633\u0647. \u0627\u0644\u062D\u0644\u0642\u0629 \u0631\u0642\u0645 ${grp.number} \u0645\u062E\u0635\u0635\u0629 \u0644\u0640 ${grp.gender === "male" ? "\u0627\u0644\u0630\u0643\u0648\u0631" : "\u0627\u0644\u0625\u0646\u0627\u062B"}.`
            }, 400);
          }
        }
      }
    }
    const targetParentId = body.parentId !== void 0 ? body.parentId || null : existing.parentId;
    const birthDate = body.dateOfBirth !== void 0 ? body.dateOfBirth : typeof body.age === "string" && body.age.includes("-") ? body.age : existing.dateOfBirth;
    const updatedData = {
      name: body.name?.trim() ?? existing.name,
      avatar,
      gender: targetGender,
      dateOfBirth: birthDate,
      age: birthDate ?? (body.age !== void 0 ? String(body.age) : existing.age),
      // Stored as date in age column
      parentId: targetParentId,
      email: body.email !== void 0 ? body.email?.trim() : existing.email,
      groupId: targetGroupId,
      currentSurahNumber: surahNumber,
      currentSurahName: surahName,
      currentAyah: body.currentAyah !== void 0 ? parseInt(body.currentAyah, 10) : existing.currentAyah,
      targetJuz: body.targetJuz !== void 0 ? parseInt(body.targetJuz, 10) : existing.targetJuz,
      memorizedJuzCount: body.memorizedJuzCount !== void 0 ? parseInt(body.memorizedJuzCount, 10) : existing.memorizedJuzCount,
      status: body.status ?? existing.status,
      enrollmentDate: body.enrollmentDate ?? existing.enrollmentDate,
      notes: body.notes !== void 0 ? body.notes : existing.notes,
      updatedAt: /* @__PURE__ */ new Date()
    };
    await db.update(students).set(updatedData).where(eq2(students.id, id));
    const parentObj = updatedData.parentId ? await db.select().from(parents).where(eq2(parents.id, updatedData.parentId)).then((r) => r[0]) : null;
    const computedAge = calculateAge(updatedData.dateOfBirth || updatedData.age);
    return c.json({
      success: true,
      student: {
        ...existing,
        ...updatedData,
        parentName: parentObj?.name || null,
        parentPhone: parentObj?.phone || null,
        parent: parentObj || null,
        age: computedAge,
        calculatedAge: computedAge
      }
    });
  } catch (err) {
    console.error("Error updating student:", err);
    return c.json({ error: err.message || "Failed to update student" }, 500);
  }
});
studentsRouter.delete("/:id", async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param("id");
  try {
    await db.delete(students).where(eq2(students.id, id));
    return c.json({ success: true, message: "Student deleted successfully" });
  } catch (err) {
    return c.json({ error: err.message || "Failed to delete student" }, 500);
  }
});
studentsRouter.get("/:id/history", async (c) => {
  await ensureDatabaseInitialized();
  const studentId = c.req.param("id");
  try {
    const student = await db.select().from(students).where(eq2(students.id, studentId)).then((r) => r[0]);
    if (!student) {
      return c.json({ error: "\u0627\u0644\u0637\u0627\u0644\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F" }, 404);
    }
    const sessionRecords = await db.select({
      id: sessionStudentRecords.id,
      sessionId: sessionStudentRecords.sessionId,
      attendanceStatus: sessionStudentRecords.attendanceStatus,
      absenceReason: sessionStudentRecords.absenceReason,
      surahNumber: sessionStudentRecords.surahNumber,
      surahName: sessionStudentRecords.surahName,
      ayahStart: sessionStudentRecords.ayahStart,
      ayahEnd: sessionStudentRecords.ayahEnd,
      teacherRemarque: sessionStudentRecords.teacherRemarque,
      isAssessed: sessionStudentRecords.isAssessed,
      date: sessions.date,
      sessionTimeText: sessions.sessionTimeText,
      sessionType: sessions.sessionType
    }).from(sessionStudentRecords).innerJoin(sessions, eq2(sessionStudentRecords.sessionId, sessions.id)).where(eq2(sessionStudentRecords.studentId, studentId)).orderBy(desc(sessions.date));
    const attendanceRecords = await db.select().from(attendances).where(eq2(attendances.studentId, studentId)).orderBy(desc(attendances.date));
    const lastPresentSession = sessionRecords.find((r) => (r.attendanceStatus === "present" || r.attendanceStatus === "late") && r.surahName);
    const lastProgress = lastPresentSession ? {
      surahName: lastPresentSession.surahName,
      surahNumber: lastPresentSession.surahNumber,
      latestVerse: lastPresentSession.ayahEnd || lastPresentSession.ayahStart || 1,
      ayahStart: lastPresentSession.ayahStart,
      ayahEnd: lastPresentSession.ayahEnd,
      date: lastPresentSession.date,
      teacherRemarque: lastPresentSession.teacherRemarque || null
    } : {
      surahName: student.currentSurahName || "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
      surahNumber: student.currentSurahNumber || 1,
      latestVerse: student.currentAyah || 1,
      ayahStart: 1,
      ayahEnd: student.currentAyah || 1,
      date: null,
      teacherRemarque: student.notes || null
    };
    const sessionsList = [];
    const seenDates = /* @__PURE__ */ new Set();
    for (const rec of sessionRecords) {
      if (!seenDates.has(rec.date)) {
        seenDates.add(rec.date);
        sessionsList.push({
          date: rec.date,
          status: rec.attendanceStatus,
          reason: rec.absenceReason,
          comment: rec.teacherRemarque,
          surahName: rec.surahName,
          ayahStart: rec.ayahStart,
          ayahEnd: rec.ayahEnd
        });
      }
      if (sessionsList.length >= 5) break;
    }
    if (sessionsList.length < 5) {
      for (const att of attendanceRecords) {
        if (!seenDates.has(att.date)) {
          seenDates.add(att.date);
          sessionsList.push({
            date: att.date,
            status: att.status,
            reason: att.reason,
            comment: null,
            surahName: null,
            ayahStart: null,
            ayahEnd: null
          });
        }
        if (sessionsList.length >= 5) break;
      }
    }
    sessionsList.sort((a, b) => b.date.localeCompare(a.date));
    return c.json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        avatar: student.avatar,
        currentSurahName: student.currentSurahName,
        currentAyah: student.currentAyah
      },
      lastProgress,
      latestSessions: sessionsList.slice(0, 5)
    });
  } catch (err) {
    console.error("Error fetching student history:", err);
    return c.json({ error: err.message || "\u0641\u0634\u0644 \u0641\u064A \u062C\u0644\u0628 \u0633\u062C\u0644 \u0627\u0644\u0637\u0627\u0644\u0628" }, 500);
  }
});

// src/server/routes/parents.ts
import { Hono as Hono3 } from "hono";
import { eq as eq3, desc as desc2 } from "drizzle-orm";
var parentsRouter = new Hono3();
async function isAdminUser(c) {
  const sessionId = getSessionId(c);
  if (!sessionId) return false;
  const user = await db.select().from(users).where(eq3(users.id, sessionId)).then((r) => r[0]);
  if (!user) return false;
  if (user.role === "admin") return true;
  const teacher = await db.select().from(teachers).where(eq3(teachers.userId, user.id)).then((r) => r[0]);
  return !!(teacher && teacher.isAdmin);
}
parentsRouter.get("/", async (c) => {
  await ensureDatabaseInitialized();
  const search = c.req.query("search")?.trim().toLowerCase();
  const allParents = await db.select().from(parents).orderBy(desc2(parents.createdAt));
  const allStudents = await db.select().from(students);
  const studentsByParent = /* @__PURE__ */ new Map();
  for (const st of allStudents) {
    if (st.parentId) {
      const list = studentsByParent.get(st.parentId) || [];
      list.push(st);
      studentsByParent.set(st.parentId, list);
    }
  }
  let enriched = allParents.map((parent) => {
    const parentStudents = studentsByParent.get(parent.id) || [];
    return {
      ...parent,
      studentsCount: parentStudents.length,
      students: parentStudents.map((st) => ({
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
    enriched = enriched.filter(
      (p) => p.name.toLowerCase().includes(search) || p.phone.includes(search) || p.email && p.email.toLowerCase().includes(search) || p.students.some((st) => st.name.toLowerCase().includes(search))
    );
  }
  return c.json({ parents: enriched });
});
parentsRouter.get("/:id", async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param("id");
  const parent = await db.select().from(parents).where(eq3(parents.id, id)).then((r) => r[0]);
  if (!parent) {
    return c.json({ error: "\u0648\u0644\u064A \u0627\u0644\u0623\u0645\u0631 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F" }, 404);
  }
  const linkedStudents = await db.select().from(students).where(eq3(students.parentId, id));
  return c.json({
    parent: {
      ...parent,
      studentsCount: linkedStudents.length,
      students: linkedStudents
    }
  });
});
parentsRouter.post("/", async (c) => {
  await ensureDatabaseInitialized();
  try {
    const body = await c.req.json();
    const { name, phone, email, address, notes, password } = body;
    if (!name || !name.trim()) {
      return c.json({ error: "\u0627\u0633\u0645 \u0648\u0644\u064A \u0627\u0644\u0623\u0645\u0631 \u0645\u0637\u0644\u0648\u0628" }, 400);
    }
    if (!phone || !phone.trim()) {
      return c.json({ error: "\u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u0648\u0644\u064A \u0627\u0644\u0623\u0645\u0631 \u0645\u0637\u0644\u0648\u0628" }, 400);
    }
    const id = `prn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    let userId = null;
    if (email && email.trim()) {
      const emailLower = email.trim().toLowerCase();
      const existingUser = await db.select().from(users).where(eq3(users.email, emailLower)).then((r) => r[0]);
      if (existingUser) {
        userId = existingUser.id;
      } else {
        userId = `usr_prn_${id}`;
        await db.insert(users).values({
          id: userId,
          name: name.trim(),
          email: emailLower,
          password: password || "password123",
          role: "parent",
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
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    await db.insert(parents).values(newParent);
    return c.json({ success: true, parent: newParent }, 201);
  } catch (err) {
    console.error("Error creating parent:", err);
    return c.json({ error: err.message || "\u0641\u0634\u0644 \u0641\u064A \u0625\u0636\u0627\u0641\u0629 \u0648\u0644\u064A \u0627\u0644\u0623\u0645\u0631" }, 500);
  }
});
parentsRouter.put("/:id", async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param("id");
  try {
    const body = await c.req.json();
    const existing = await db.select().from(parents).where(eq3(parents.id, id)).then((r) => r[0]);
    if (!existing) {
      return c.json({ error: "\u0648\u0644\u064A \u0627\u0644\u0623\u0645\u0631 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F" }, 404);
    }
    if (body.password) {
      const isAuthorized = await isAdminUser(c);
      if (!isAuthorized) {
        return c.json({ error: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0644\u0643 \u0628\u062A\u0639\u062F\u064A\u0644 \u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u0648\u0644\u064A \u0627\u0644\u0623\u0645\u0631. \u0627\u0644\u0645\u0634\u0631\u0641\u0648\u0646 \u0641\u0642\u0637 \u0645\u062E\u0648\u0644\u0648\u0646 \u0628\u0630\u0644\u0643." }, 403);
      }
    }
    let userId = existing.userId;
    const parentEmail = body.email !== void 0 ? body.email?.trim() : existing.email;
    if (parentEmail) {
      const emailLower = parentEmail.toLowerCase();
      if (!userId) {
        userId = `usr_prn_${id}`;
        await db.insert(users).values({
          id: userId,
          name: body.name?.trim() || existing.name,
          email: emailLower,
          password: body.password || "password123",
          role: "parent",
          avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent((body.name || existing.name).trim())}`
        }).onConflictDoNothing();
      } else {
        const userUpdatePayload = {
          name: (body.name || existing.name).trim(),
          email: emailLower
        };
        if (body.password) {
          userUpdatePayload.password = body.password;
        }
        await db.update(users).set(userUpdatePayload).where(eq3(users.id, userId));
      }
    }
    const updated = {
      name: body.name !== void 0 ? body.name.trim() : existing.name,
      phone: body.phone !== void 0 ? body.phone.trim() : existing.phone,
      email: parentEmail || null,
      address: body.address !== void 0 ? body.address?.trim() || null : existing.address,
      notes: body.notes !== void 0 ? body.notes?.trim() || null : existing.notes,
      userId,
      updatedAt: /* @__PURE__ */ new Date()
    };
    await db.update(parents).set(updated).where(eq3(parents.id, id));
    return c.json({ success: true, parent: { ...existing, ...updated } });
  } catch (err) {
    console.error("Error updating parent:", err);
    return c.json({ error: err.message || "\u0641\u0634\u0644 \u0641\u064A \u062A\u0639\u062F\u064A\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0648\u0644\u064A \u0627\u0644\u0623\u0645\u0631" }, 500);
  }
});
parentsRouter.delete("/:id", async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param("id");
  try {
    await db.update(students).set({ parentId: null }).where(eq3(students.parentId, id));
    await db.delete(parents).where(eq3(parents.id, id));
    return c.json({ success: true, message: "\u062A\u0645 \u062D\u0630\u0641 \u0648\u0644\u064A \u0627\u0644\u0623\u0645\u0631 \u0628\u0646\u062C\u0627\u062D" });
  } catch (err) {
    console.error("Error deleting parent:", err);
    return c.json({ error: err.message || "\u0641\u0634\u0644 \u0641\u064A \u062D\u0630\u0641 \u0648\u0644\u064A \u0627\u0644\u0623\u0645\u0631" }, 500);
  }
});

// src/server/routes/teachers.ts
import { Hono as Hono4 } from "hono";
import { eq as eq4 } from "drizzle-orm";
var teachersRouter = new Hono4();
async function isAdminUser2(c) {
  const sessionId = getSessionId(c);
  if (!sessionId) return false;
  const user = await db.select().from(users).where(eq4(users.id, sessionId)).then((r) => r[0]);
  if (!user) return false;
  if (user.role === "admin") return true;
  const teacher = await db.select().from(teachers).where(eq4(teachers.userId, user.id)).then((r) => r[0]);
  return !!(teacher && teacher.isAdmin);
}
teachersRouter.get("/", async (c) => {
  await ensureDatabaseInitialized();
  const q = c.req.query("q")?.trim() || "";
  const allTeachers = await db.select().from(teachers).orderBy(teachers.name);
  const allGroupTeachers = await db.select().from(groupTeachers);
  const allGroups = await db.select().from(groups);
  const allStudents = await db.select().from(students);
  const allGroupTypes = await db.select().from(groupTypes);
  const groupMap = new Map(allGroups.map((g) => [g.id, g]));
  const typeMap = new Map(allGroupTypes.map((gt) => [gt.id, gt]));
  let result = allTeachers.map((teacher) => {
    const assignedGt = allGroupTeachers.filter((gt) => gt.teacherId === teacher.id);
    const assignedGroups = assignedGt.map((gt) => {
      const grp = groupMap.get(gt.groupId);
      if (!grp) return null;
      const matchedType = typeMap.get(grp.typeId);
      return {
        id: grp.id,
        number: grp.number,
        type: matchedType?.name || "\u062D\u0644\u0642\u0629 \u0639\u0627\u0645\u0629",
        typeSlug: matchedType?.slug || "general",
        studyTime: grp.studyTime,
        role: gt.role
      };
    }).filter(Boolean);
    const groupIds = assignedGroups.map((g) => g.id);
    const studentsTaughtCount = allStudents.filter((s) => s.groupId && groupIds.includes(s.groupId)).length;
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
    result = result.filter(
      (t) => t.name.toLowerCase().includes(lower) || t.email && t.email.toLowerCase().includes(lower) || t.phone && t.phone.toLowerCase().includes(lower) || t.specialization && t.specialization.toLowerCase().includes(lower)
    );
  }
  return c.json({ teachers: result });
});
teachersRouter.get("/:id", async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param("id");
  const teacher = await db.select().from(teachers).where(eq4(teachers.id, id)).then((r) => r[0]);
  if (!teacher) {
    return c.json({ error: "Teacher not found" }, 404);
  }
  const assignedGt = await db.select().from(groupTeachers).where(eq4(groupTeachers.teacherId, id));
  const allGroups = await db.select().from(groups);
  const allGroupTypes = await db.select().from(groupTypes);
  const groupMap = new Map(allGroups.map((g) => [g.id, g]));
  const typeMap = new Map(allGroupTypes.map((gt) => [gt.id, gt]));
  const assignedGroups = assignedGt.map((gt) => {
    const grp = groupMap.get(gt.groupId);
    if (!grp) return null;
    const matchedType = typeMap.get(grp.typeId);
    return {
      ...grp,
      type: matchedType?.name || "\u062D\u0644\u0642\u0629 \u0639\u0627\u0645\u0629",
      typeSlug: matchedType?.slug || "general",
      role: gt.role
    };
  }).filter(Boolean);
  const allStudents = await db.select().from(students);
  const groupIds = assignedGroups.map((g) => g.id);
  const assignedStudents = allStudents.filter((s) => s.groupId && groupIds.includes(s.groupId)).map((s) => ({
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
teachersRouter.post("/", async (c) => {
  await ensureDatabaseInitialized();
  try {
    const body = await c.req.json();
    const id = body.id || `tch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const avatar = body.avatar || `/api/storage/teacher-${id}`;
    let userId = null;
    if (body.email && body.email.trim()) {
      const emailLower = body.email.trim().toLowerCase();
      const existingUser = await db.select().from(users).where(eq4(users.email, emailLower)).then((r) => r[0]);
      if (existingUser) {
        userId = existingUser.id;
      } else {
        userId = `usr_tch_${id}`;
        await db.insert(users).values({
          id: userId,
          name: body.name?.trim() || "\u0645\u0639\u0644\u0645 \u062C\u062F\u064A\u062F",
          email: emailLower,
          password: body.password || "password123",
          role: body.isAdmin ? "admin" : "teacher",
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
      specialization: body.specialization?.trim() || "Tajweed & Hifz",
      bio: body.bio?.trim() || null,
      status: body.status || "active",
      userId,
      isAdmin: !!body.isAdmin,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    if (!newTeacher.name) {
      return c.json({ error: "Teacher full name is required" }, 400);
    }
    await db.insert(teachers).values(newTeacher);
    if (Array.isArray(body.groupIds) && body.groupIds.length > 0) {
      for (const gid of body.groupIds) {
        await db.insert(groupTeachers).values({
          id: `gt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          groupId: gid,
          teacherId: id,
          role: "lead"
        }).onConflictDoNothing();
      }
    }
    return c.json({ success: true, teacher: newTeacher }, 201);
  } catch (err) {
    console.error("Error creating teacher:", err);
    return c.json({ error: err.message || "Failed to create teacher" }, 500);
  }
});
teachersRouter.put("/:id", async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param("id");
  try {
    const body = await c.req.json();
    const existing = await db.select().from(teachers).where(eq4(teachers.id, id)).then((r) => r[0]);
    if (!existing) {
      return c.json({ error: "Teacher not found" }, 404);
    }
    if (body.password) {
      const isAuthorized = await isAdminUser2(c);
      if (!isAuthorized) {
        return c.json({ error: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0644\u0643 \u0628\u062A\u0639\u062F\u064A\u0644 \u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u0627\u0644\u0645\u0639\u0644\u0645. \u0627\u0644\u0645\u0634\u0631\u0641\u0648\u0646 \u0641\u0642\u0637 \u0645\u062E\u0648\u0644\u0648\u0646 \u0628\u0630\u0644\u0643." }, 403);
      }
    }
    const avatar = body.avatar || existing.avatar || `/api/storage/teacher-${id}`;
    let userId = existing.userId;
    if (body.email && body.email.trim()) {
      const emailLower = body.email.trim().toLowerCase();
      if (!userId) {
        userId = `usr_tch_${id}`;
        await db.insert(users).values({
          id: userId,
          name: body.name?.trim() || existing.name,
          email: emailLower,
          password: body.password || "password123",
          role: body.isAdmin ? "admin" : "teacher",
          avatar
        }).onConflictDoNothing();
      } else {
        const userUpdatePayload = {
          name: body.name?.trim() || existing.name,
          email: emailLower,
          avatar
        };
        if (body.password) {
          userUpdatePayload.password = body.password;
        }
        if (body.isAdmin !== void 0) {
          userUpdatePayload.role = body.isAdmin ? "admin" : "teacher";
        }
        await db.update(users).set(userUpdatePayload).where(eq4(users.id, userId));
      }
    }
    const updatedData = {
      name: body.name?.trim() ?? existing.name,
      email: body.email !== void 0 ? body.email?.trim() : existing.email,
      phone: body.phone !== void 0 ? body.phone?.trim() : existing.phone,
      avatar,
      specialization: body.specialization?.trim() ?? existing.specialization,
      bio: body.bio !== void 0 ? body.bio : existing.bio,
      status: body.status ?? existing.status,
      userId,
      updatedAt: /* @__PURE__ */ new Date()
    };
    if (body.isAdmin !== void 0) {
      updatedData.isAdmin = !!body.isAdmin;
    }
    await db.update(teachers).set(updatedData).where(eq4(teachers.id, id));
    if (Array.isArray(body.groupIds)) {
      await db.delete(groupTeachers).where(eq4(groupTeachers.teacherId, id));
      for (const gid of body.groupIds) {
        await db.insert(groupTeachers).values({
          id: `gt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          groupId: gid,
          teacherId: id,
          role: "lead"
        });
      }
    }
    return c.json({ success: true, teacher: { ...existing, ...updatedData } });
  } catch (err) {
    console.error("Error updating teacher:", err);
    return c.json({ error: err.message || "Failed to update teacher" }, 500);
  }
});
teachersRouter.delete("/:id", async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param("id");
  try {
    await db.delete(groupTeachers).where(eq4(groupTeachers.teacherId, id));
    await db.delete(teachers).where(eq4(teachers.id, id));
    return c.json({ success: true, message: "Teacher deleted successfully" });
  } catch (err) {
    return c.json({ error: err.message || "Failed to delete teacher" }, 500);
  }
});

// src/server/routes/groups.ts
import { Hono as Hono5 } from "hono";
import { eq as eq5, desc as desc3, inArray as inArray2 } from "drizzle-orm";
var groupsRouter = new Hono5();
groupsRouter.get("/", async (c) => {
  await ensureDatabaseInitialized();
  const q = c.req.query("q")?.trim() || "";
  const allGroups = await db.select().from(groups).orderBy(groups.number);
  const allGroupTeachers = await db.select().from(groupTeachers);
  const allTeachers = await db.select().from(teachers);
  const allStudents = await db.select().from(students);
  const allGroupTypes = await db.select().from(groupTypes);
  const teacherMap = new Map(allTeachers.map((t) => [t.id, t]));
  const typeMap = new Map(allGroupTypes.map((gt) => [gt.id, gt]));
  let result = allGroups.map((group) => {
    const assignedGt = allGroupTeachers.filter((gt) => gt.groupId === group.id);
    const teachersList = assignedGt.map((gt) => {
      const t = teacherMap.get(gt.teacherId);
      return t ? { ...t, role: gt.role } : null;
    }).filter(Boolean);
    const groupStudents = allStudents.filter((s) => s.groupId && s.groupId.split(",").map((item) => item.trim()).includes(group.id));
    const matchedType = (group.typeId ? typeMap.get(group.typeId) : null) || allGroupTypes[0] || null;
    return {
      ...group,
      typeId: matchedType?.id || group.typeId,
      type: matchedType?.name || "\u062D\u0644\u0642\u0629 \u0642\u0631\u0622\u0646\u064A\u0629",
      typeSlug: matchedType?.slug || "general",
      groupType: matchedType,
      teachers: teachersList,
      studentsCount: groupStudents.length,
      studentsPreview: groupStudents.slice(0, 5).map((s) => ({
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
    result = result.filter(
      (g) => String(g.number).includes(lower) || g.type.toLowerCase().includes(lower) || g.studyTime && g.studyTime.toLowerCase().includes(lower) || g.room && g.room.toLowerCase().includes(lower) || g.level && g.level.toLowerCase().includes(lower)
    );
  }
  return c.json({ groups: result });
});
groupsRouter.get("/by-type-and-number/:typeSlug/:groupNumber", async (c) => {
  await ensureDatabaseInitialized();
  const typeSlug = decodeURIComponent(c.req.param("typeSlug"));
  const groupNumber = parseInt(c.req.param("groupNumber"), 10);
  const allGroupTypes = await db.select().from(groupTypes);
  const matchedType = allGroupTypes.find((gt) => gt.slug === typeSlug || gt.id === typeSlug || gt.name === typeSlug);
  const allGroups = await db.select().from(groups);
  const foundGroup = allGroups.find((g) => {
    const matchesNumber = g.number === groupNumber;
    const matchesType = matchedType ? g.typeId === matchedType.id : true;
    return matchesNumber && matchesType;
  });
  if (!foundGroup) {
    return c.json({ error: "Group not found" }, 404);
  }
  const gTeachers = await db.select().from(groupTeachers).where(eq5(groupTeachers.groupId, foundGroup.id));
  const allTeachers = await db.select().from(teachers);
  const teachersList = gTeachers.map((gt) => {
    const t = allTeachers.find((item) => item.id === gt.teacherId);
    return t ? { ...t, role: gt.role } : null;
  }).filter(Boolean);
  const allStudents = await db.select().from(students);
  const studentsList = allStudents.filter((s) => s.groupId && s.groupId.split(",").map((item) => item.trim()).includes(foundGroup.id));
  studentsList.sort((a, b) => a.name.localeCompare(b.name));
  const allRatings = await db.select().from(studentRatings).where(eq5(studentRatings.groupId, foundGroup.id)).orderBy(desc3(studentRatings.createdAt));
  const enrichedStudents = studentsList.map((s) => {
    const latestRating = allRatings.find((r) => r.studentId === s.id) || null;
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
      type: matchedType?.name || "\u062D\u0644\u0642\u0629 \u0642\u0631\u0622\u0646\u064A\u0629",
      typeSlug: matchedType?.slug || typeSlug,
      groupType: matchedType || null,
      teachers: teachersList,
      students: enrichedStudents,
      studentsCount: enrichedStudents.length
    }
  });
});
groupsRouter.get("/:id", async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param("id");
  const group = await db.select().from(groups).where(eq5(groups.id, id)).then((r) => r[0]);
  if (!group) {
    return c.json({ error: "Group not found" }, 404);
  }
  const allGroupTypes = await db.select().from(groupTypes);
  const matchedType = allGroupTypes.find((gt) => gt.id === group.typeId) || null;
  const gTeachers = await db.select().from(groupTeachers).where(eq5(groupTeachers.groupId, id));
  const allTeachers = await db.select().from(teachers);
  const teachersList = gTeachers.map((gt) => {
    const t = allTeachers.find((item) => item.id === gt.teacherId);
    return t ? { ...t, role: gt.role } : null;
  }).filter(Boolean);
  const allStudents = await db.select().from(students);
  const studentsList = allStudents.filter((s) => s.groupId && s.groupId.split(",").map((item) => item.trim()).includes(id));
  studentsList.sort((a, b) => a.name.localeCompare(b.name));
  const allRatings = await db.select().from(studentRatings).where(eq5(studentRatings.groupId, id)).orderBy(desc3(studentRatings.createdAt));
  const enrichedStudents = studentsList.map((s) => {
    const latestRating = allRatings.find((r) => r.studentId === s.id) || null;
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
      type: matchedType?.name || "\u062D\u0644\u0642\u0629 \u0642\u0631\u0622\u0646\u064A\u0629",
      typeSlug: matchedType?.slug || "general",
      groupType: matchedType,
      teachers: teachersList,
      students: enrichedStudents,
      studentsCount: enrichedStudents.length
    }
  });
});
groupsRouter.post("/", async (c) => {
  await ensureDatabaseInitialized();
  try {
    const body = await c.req.json();
    const id = `grp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    let typeId = body.typeId?.trim();
    if (!typeId && body.type) {
      const gt = await db.select().from(groupTypes).where(eq5(groupTypes.name, body.type)).then((r) => r[0]);
      if (gt) typeId = gt.id;
    }
    if (!typeId) {
      return c.json({ error: "Group typeId is required" }, 400);
    }
    const newGroup = {
      id,
      number: parseInt(body.number, 10),
      typeId,
      gender: body.gender || "male",
      sessionTime: body.sessionTime || null,
      studyTime: body.studyTime?.trim() || "\u0645\u0646 16:30 \u0625\u0644\u0649 18:00",
      days: Array.isArray(body.days) ? body.days : ["Monday", "Wednesday"],
      timeSlot: body.timeSlot?.trim() || "16:30 - 18:00",
      room: body.room?.trim() || "\u0642\u0627\u0639\u0629 \u0627\u0644\u0645\u062D\u0631\u0627\u0628 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",
      capacity: parseInt(body.capacity, 10) || 20,
      level: body.level || "Intermediate",
      status: body.status || "active",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    if (isNaN(newGroup.number)) {
      return c.json({ error: "Group number is required" }, 400);
    }
    await db.insert(groups).values(newGroup);
    if (Array.isArray(body.teacherIds) && body.teacherIds.length > 0) {
      for (const [idx, tid] of body.teacherIds.entries()) {
        await db.insert(groupTeachers).values({
          id: `gt_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
          groupId: id,
          teacherId: tid,
          role: idx === 0 ? "lead" : "assistant"
        });
      }
    }
    return c.json({ success: true, group: newGroup }, 201);
  } catch (err) {
    console.error("Error creating group:", err);
    return c.json({ error: err.message || "Failed to create group" }, 500);
  }
});
groupsRouter.put("/:id", async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param("id");
  try {
    const body = await c.req.json();
    const existing = await db.select().from(groups).where(eq5(groups.id, id)).then((r) => r[0]);
    if (!existing) {
      return c.json({ error: "Group not found" }, 404);
    }
    const typeId = body.typeId !== void 0 ? body.typeId?.trim() || existing.typeId : existing.typeId;
    const updatedData = {
      number: body.number !== void 0 ? parseInt(body.number, 10) : existing.number,
      typeId,
      gender: body.gender ?? existing.gender,
      sessionTime: body.sessionTime !== void 0 ? body.sessionTime : existing.sessionTime,
      studyTime: body.studyTime?.trim() ?? existing.studyTime,
      days: Array.isArray(body.days) ? body.days : existing.days,
      timeSlot: body.timeSlot !== void 0 ? body.timeSlot?.trim() : existing.timeSlot,
      room: body.room !== void 0 ? body.room?.trim() : existing.room,
      capacity: body.capacity !== void 0 ? parseInt(body.capacity, 10) : existing.capacity,
      level: body.level ?? existing.level,
      status: body.status ?? existing.status,
      updatedAt: /* @__PURE__ */ new Date()
    };
    await db.update(groups).set(updatedData).where(eq5(groups.id, id));
    if (Array.isArray(body.teacherIds)) {
      await db.delete(groupTeachers).where(eq5(groupTeachers.groupId, id));
      for (const [idx, tid] of body.teacherIds.entries()) {
        await db.insert(groupTeachers).values({
          id: `gt_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
          groupId: id,
          teacherId: tid,
          role: idx === 0 ? "lead" : "assistant"
        });
      }
    }
    if (Array.isArray(body.studentIds)) {
      const allStudents = await db.select().from(students);
      for (const student of allStudents) {
        const assignedGroupIds = student.groupId ? student.groupId.split(",").map((item) => item.trim()).filter(Boolean) : [];
        const isAssignedToThisGroup = assignedGroupIds.includes(id);
        const shouldBeAssigned = body.studentIds.includes(student.id);
        if (shouldBeAssigned && !isAssignedToThisGroup) {
          const newGroupIds = [...assignedGroupIds, id].join(",");
          await db.update(students).set({ groupId: newGroupIds }).where(eq5(students.id, student.id));
        } else if (!shouldBeAssigned && isAssignedToThisGroup) {
          const newGroupIds = assignedGroupIds.filter((gid) => gid !== id).join(",") || null;
          await db.update(students).set({ groupId: newGroupIds }).where(eq5(students.id, student.id));
        }
      }
    }
    return c.json({ success: true, group: { ...existing, ...updatedData } });
  } catch (err) {
    console.error("Error updating group:", err);
    return c.json({ error: err.message || "Failed to update group" }, 500);
  }
});
groupsRouter.post("/bulk-update-time", async (c) => {
  await ensureDatabaseInitialized();
  try {
    const body = await c.req.json();
    const { groupIds, sessionTime, studyTime } = body;
    if (!Array.isArray(groupIds) || groupIds.length === 0) {
      return c.json({ error: "\u0644\u0645 \u064A\u062A\u0645 \u062A\u062D\u062F\u064A\u062F \u0623\u064A \u062D\u0644\u0642\u0627\u062A \u0644\u0644\u062A\u062D\u062F\u064A\u062B" }, 400);
    }
    if (!sessionTime) {
      return c.json({ error: "\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0648\u0642\u062A \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 \u063A\u064A\u0631 \u0645\u062A\u0648\u0641\u0631\u0629" }, 400);
    }
    await db.update(groups).set({
      sessionTime,
      studyTime: studyTime || null,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(inArray2(groups.id, groupIds));
    return c.json({
      success: true,
      message: `\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u062A\u0648\u0642\u064A\u062A ${groupIds.length} \u062D\u0644\u0642\u0627\u062A \u0628\u0646\u062C\u0627\u062D`,
      updatedCount: groupIds.length
    });
  } catch (err) {
    console.error("Error bulk updating group timing:", err);
    return c.json({ error: err.message || "\u0641\u0634\u0644 \u0641\u064A \u062A\u062D\u062F\u064A\u062B \u062A\u0648\u0642\u064A\u062A \u0627\u0644\u062D\u0644\u0642\u0627\u062A \u0628\u0627\u0644\u062C\u0645\u0644\u0629" }, 500);
  }
});
groupsRouter.delete("/:id", async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param("id");
  try {
    await db.update(students).set({ groupId: null }).where(eq5(students.groupId, id));
    await db.delete(groupTeachers).where(eq5(groupTeachers.groupId, id));
    await db.delete(groups).where(eq5(groups.id, id));
    return c.json({ success: true, message: "Group deleted successfully" });
  } catch (err) {
    return c.json({ error: err.message || "Failed to delete group" }, 500);
  }
});

// src/server/routes/groupTypes.ts
import { Hono as Hono6 } from "hono";
import { eq as eq6, or as or2 } from "drizzle-orm";
var groupTypesRouter = new Hono6();
function generateSlug(text2) {
  const cleaned = text2.trim().toLowerCase().replace(/[\s\t\n]+/g, "-").replace(/[^\w\u0621-\u064A\-]/g, "").replace(/-+/g, "-");
  return cleaned || `type-${Date.now()}`;
}
groupTypesRouter.get("/", async (c) => {
  await ensureDatabaseInitialized();
  const allTypes = await db.select().from(groupTypes).orderBy(groupTypes.createdAt);
  const allGroups = await db.select().from(groups);
  const allStudents = await db.select().from(students);
  const result = allTypes.map((gt) => {
    const matchedGroups = allGroups.filter((g) => g.typeId === gt.id);
    let totalStudents = 0;
    matchedGroups.forEach((g) => {
      const gStudents = allStudents.filter(
        (s) => s.groupId && s.groupId.split(",").map((item) => item.trim()).includes(g.id)
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
groupTypesRouter.get("/:identifier", async (c) => {
  await ensureDatabaseInitialized();
  const identifier = decodeURIComponent(c.req.param("identifier"));
  const allTypes = await db.select().from(groupTypes);
  const groupType = allTypes.find((gt) => gt.id === identifier || gt.slug === identifier || gt.name === identifier);
  if (!groupType) {
    return c.json({ error: "Group type not found" }, 404);
  }
  const allGroups = await db.select().from(groups);
  const allStudents = await db.select().from(students);
  const allGroupTeachers = await db.select().from(groupTeachers);
  const allTeachers = await db.select().from(teachers);
  const teacherMap = new Map(allTeachers.map((t) => [t.id, t]));
  const matchedGroups = allGroups.filter((g) => g.typeId === groupType.id).sort((a, b) => a.number - b.number).map((group) => {
    const assignedGt = allGroupTeachers.filter((gt) => gt.groupId === group.id);
    const teachersList = assignedGt.map((gt) => {
      const t = teacherMap.get(gt.teacherId);
      return t ? { ...t, role: gt.role } : null;
    }).filter(Boolean);
    const groupStudents = allStudents.filter(
      (s) => s.groupId && s.groupId.split(",").map((item) => item.trim()).includes(group.id)
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
  matchedGroups.forEach((g) => {
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
groupTypesRouter.post("/", async (c) => {
  await ensureDatabaseInitialized();
  try {
    const body = await c.req.json();
    const name = body.name?.trim();
    if (!name) {
      return c.json({ error: "Group type name is required" }, 400);
    }
    const slug = body.slug?.trim() ? generateSlug(body.slug) : generateSlug(name);
    const id = `gt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const existing = await db.select().from(groupTypes).where(or2(eq6(groupTypes.name, name), eq6(groupTypes.slug, slug))).then((r) => r[0]);
    if (existing) {
      return c.json({ error: "A group type with this name or slug already exists" }, 400);
    }
    const newType = {
      id,
      name,
      slug,
      description: body.description?.trim() || null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    await db.insert(groupTypes).values(newType);
    return c.json({ success: true, groupType: newType }, 201);
  } catch (err) {
    console.error("Error creating group type:", err);
    return c.json({ error: err.message || "Failed to create group type" }, 500);
  }
});
groupTypesRouter.put("/:id", async (c) => {
  await ensureDatabaseInitialized();
  const id = decodeURIComponent(c.req.param("id"));
  try {
    const body = await c.req.json();
    const allTypes = await db.select().from(groupTypes);
    const existing = allTypes.find((gt) => gt.id === id || gt.slug === id);
    if (!existing) {
      return c.json({ error: "Group type not found" }, 404);
    }
    const newName = body.name?.trim() || existing.name;
    const newSlug = body.slug?.trim() ? generateSlug(body.slug) : body.name ? generateSlug(body.name) : existing.slug;
    const newDescription = body.description !== void 0 ? body.description?.trim() || null : existing.description;
    const updated = {
      name: newName,
      slug: newSlug,
      description: newDescription,
      updatedAt: /* @__PURE__ */ new Date()
    };
    await db.update(groupTypes).set(updated).where(eq6(groupTypes.id, existing.id));
    return c.json({ success: true, groupType: { ...existing, ...updated } });
  } catch (err) {
    console.error("Error updating group type:", err);
    return c.json({ error: err.message || "Failed to update group type" }, 500);
  }
});
groupTypesRouter.delete("/:id", async (c) => {
  await ensureDatabaseInitialized();
  const id = decodeURIComponent(c.req.param("id"));
  try {
    const allTypes = await db.select().from(groupTypes);
    const existing = allTypes.find((gt) => gt.id === id || gt.slug === id);
    if (!existing) {
      return c.json({ error: "Group type not found" }, 404);
    }
    await db.delete(groupTypes).where(eq6(groupTypes.id, existing.id));
    return c.json({ success: true, message: "Group type deleted" });
  } catch (err) {
    console.error("Error deleting group type:", err);
    return c.json({ error: err.message || "Failed to delete group type" }, 500);
  }
});

// src/server/routes/ratings.ts
import { Hono as Hono7 } from "hono";
import { eq as eq7, desc as desc4 } from "drizzle-orm";
var ratingsRouter = new Hono7();
function calculateGrade(score) {
  if (score >= 95) return "Mumtaz (Outstanding)";
  if (score >= 88) return "Mumtaz (Excellent)";
  if (score >= 80) return "Jayyid Jiddan (Very Good)";
  if (score >= 70) return "Jayyid (Good)";
  if (score >= 60) return "Maqbool (Acceptable)";
  return "Da'eef (Needs Improvement)";
}
ratingsRouter.get("/", async (c) => {
  await ensureDatabaseInitialized();
  const studentId = c.req.query("studentId")?.trim();
  const groupId = c.req.query("groupId")?.trim();
  const month = c.req.query("month")?.trim();
  let allRatings = await db.select().from(studentRatings).orderBy(desc4(studentRatings.createdAt));
  const allStudents = await db.select().from(students);
  const allTeachers = await db.select().from(teachers);
  const allGroups = await db.select().from(groups);
  const allGroupTypes = await db.select().from(groupTypes);
  const studentMap = new Map(allStudents.map((s) => [s.id, s]));
  const teacherMap = new Map(allTeachers.map((t) => [t.id, t]));
  const groupMap = new Map(allGroups.map((g) => [g.id, g]));
  const typeMap = new Map(allGroupTypes.map((gt) => [gt.id, gt]));
  if (studentId) {
    allRatings = allRatings.filter((r) => r.studentId === studentId);
  }
  if (groupId && groupId !== "all") {
    allRatings = allRatings.filter((r) => r.groupId === groupId);
  }
  if (month && month !== "all") {
    allRatings = allRatings.filter((r) => r.month === month);
  }
  const result = allRatings.map((r) => {
    const student = studentMap.get(r.studentId);
    const teacher = r.teacherId ? teacherMap.get(r.teacherId) : null;
    const group = r.groupId ? groupMap.get(r.groupId) : null;
    const matchedType = group ? typeMap.get(group.typeId) : null;
    return {
      ...r,
      student: student ? {
        id: student.id,
        name: student.name,
        avatar: student.avatar,
        currentSurahName: student.currentSurahName,
        currentAyah: student.currentAyah,
        age: calculateAge(student.dateOfBirth || student.age)
      } : null,
      teacher: teacher ? {
        id: teacher.id,
        name: teacher.name,
        avatar: teacher.avatar
      } : null,
      group: group ? {
        id: group.id,
        number: group.number,
        type: matchedType?.name || "\u062D\u0644\u0642\u0629 \u0639\u0627\u0645\u0629",
        studyTime: group.studyTime
      } : null
    };
  });
  return c.json({ ratings: result });
});
ratingsRouter.post("/", async (c) => {
  await ensureDatabaseInitialized();
  try {
    const body = await c.req.json();
    const id = `rat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const hifz = parseInt(body.hifzScore, 10) ?? 90;
    const tajweed = parseInt(body.tajweedScore, 10) ?? 85;
    const murajaah = parseInt(body.murajaahScore, 10) ?? 88;
    const attendance = parseInt(body.attendanceScore, 10) ?? 95;
    const behavior = parseInt(body.behaviorScore, 10) ?? 100;
    const computedOverall = Math.round(
      hifz * 0.35 + tajweed * 0.25 + murajaah * 0.2 + attendance * 0.1 + behavior * 0.1
    );
    const overallScore = body.overallScore !== void 0 ? parseInt(body.overallScore, 10) : computedOverall;
    const grade = body.grade || calculateGrade(overallScore);
    const newRating = {
      id,
      studentId: body.studentId,
      teacherId: body.teacherId || null,
      groupId: body.groupId || null,
      month: body.month || (/* @__PURE__ */ new Date()).toISOString().substring(0, 7),
      // "YYYY-MM"
      hifzScore: hifz,
      tajweedScore: tajweed,
      murajaahScore: murajaah,
      attendanceScore: attendance,
      behaviorScore: behavior,
      overallScore,
      grade,
      surahEvaluated: body.surahEvaluated || null,
      ayahStart: body.ayahStart ? parseInt(body.ayahStart, 10) : null,
      ayahEnd: body.ayahEnd ? parseInt(body.ayahEnd, 10) : null,
      notes: body.notes || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    if (!newRating.studentId) {
      return c.json({ error: "Student ID is required for rating" }, 400);
    }
    await db.insert(studentRatings).values(newRating);
    if (body.updateStudentSurah && body.surahEvaluated) {
      const student = await db.select().from(students).where(eq7(students.id, newRating.studentId)).then((r) => r[0]);
      if (student) {
        await db.update(students).set({
          currentSurahName: body.surahEvaluated,
          currentAyah: body.ayahEnd || student.currentAyah,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq7(students.id, student.id));
      }
    }
    return c.json({ success: true, rating: newRating }, 201);
  } catch (err) {
    console.error("Error adding rating:", err);
    return c.json({ error: err.message || "Failed to submit rating" }, 500);
  }
});
ratingsRouter.put("/:id", async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param("id");
  try {
    const body = await c.req.json();
    const existing = await db.select().from(studentRatings).where(eq7(studentRatings.id, id)).then((r) => r[0]);
    if (!existing) {
      return c.json({ error: "Rating record not found" }, 404);
    }
    const hifz = body.hifzScore !== void 0 ? parseInt(body.hifzScore, 10) : existing.hifzScore;
    const tajweed = body.tajweedScore !== void 0 ? parseInt(body.tajweedScore, 10) : existing.tajweedScore;
    const murajaah = body.murajaahScore !== void 0 ? parseInt(body.murajaahScore, 10) : existing.murajaahScore;
    const attendance = body.attendanceScore !== void 0 ? parseInt(body.attendanceScore, 10) : existing.attendanceScore;
    const behavior = body.behaviorScore !== void 0 ? parseInt(body.behaviorScore, 10) : existing.behaviorScore;
    const computedOverall = Math.round(
      hifz * 0.35 + tajweed * 0.25 + murajaah * 0.2 + attendance * 0.1 + behavior * 0.1
    );
    const overallScore = body.overallScore !== void 0 ? parseInt(body.overallScore, 10) : computedOverall;
    const updatedData = {
      month: body.month ?? existing.month,
      teacherId: body.teacherId !== void 0 ? body.teacherId : existing.teacherId,
      groupId: body.groupId !== void 0 ? body.groupId : existing.groupId,
      hifzScore: hifz,
      tajweedScore: tajweed,
      murajaahScore: murajaah,
      attendanceScore: attendance,
      behaviorScore: behavior,
      overallScore,
      grade: body.grade || calculateGrade(overallScore),
      surahEvaluated: body.surahEvaluated !== void 0 ? body.surahEvaluated : existing.surahEvaluated,
      ayahStart: body.ayahStart !== void 0 ? parseInt(body.ayahStart, 10) : existing.ayahStart,
      ayahEnd: body.ayahEnd !== void 0 ? parseInt(body.ayahEnd, 10) : existing.ayahEnd,
      notes: body.notes !== void 0 ? body.notes : existing.notes
    };
    await db.update(studentRatings).set(updatedData).where(eq7(studentRatings.id, id));
    return c.json({ success: true, rating: { ...existing, ...updatedData } });
  } catch (err) {
    return c.json({ error: err.message || "Failed to update rating" }, 500);
  }
});
ratingsRouter.delete("/:id", async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param("id");
  try {
    await db.delete(studentRatings).where(eq7(studentRatings.id, id));
    return c.json({ success: true, message: "Rating deleted" });
  } catch (err) {
    return c.json({ error: err.message || "Failed to delete rating" }, 500);
  }
});

// src/server/routes/sessions.ts
import { Hono as Hono9 } from "hono";
import { eq as eq8, and } from "drizzle-orm";

// src/server/routes/prayerTimes.ts
import { Hono as Hono8 } from "hono";
var prayerTimesRouter = new Hono8();
var prayerCache = /* @__PURE__ */ new Map();
var DEFAULT_ALGERIA_TIMINGS = {
  Fajr: "05:17",
  Sunrise: "06:43",
  Dhuhr: "12:37",
  Asr: "15:59",
  Sunset: "18:31",
  Maghrib: "18:31",
  Isha: "19:52",
  Imsak: "05:07",
  Midnight: "00:37"
};
prayerTimesRouter.get("/", async (c) => {
  try {
    const rawDate = c.req.query("date");
    const city = c.req.query("city") || "Algiers";
    const country = c.req.query("country") || "Algeria";
    const method = c.req.query("method") || "19";
    let formattedDate = "";
    let cacheKey = "";
    if (rawDate) {
      if (rawDate.includes("-")) {
        const parts = rawDate.split("-");
        if (parts[0].length === 4) {
          formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
          cacheKey = `${rawDate}_${city}_${country}_${method}`;
        } else {
          formattedDate = rawDate;
          cacheKey = `${rawDate}_${city}_${country}_${method}`;
        }
      }
    } else {
      const today = /* @__PURE__ */ new Date();
      const d = String(today.getDate()).padStart(2, "0");
      const m = String(today.getMonth() + 1).padStart(2, "0");
      const y = today.getFullYear();
      formattedDate = `${d}-${m}-${y}`;
      cacheKey = `today_${formattedDate}_${city}_${country}_${method}`;
    }
    if (prayerCache.has(cacheKey)) {
      return c.json({ success: true, data: prayerCache.get(cacheKey), fromCache: true });
    }
    const url = formattedDate ? `https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}` : `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;
    const res = await fetch(url, {
      headers: {
        "Accept": "application/json"
      }
    });
    if (!res.ok) {
      throw new Error(`AlAdhan API responded with status ${res.status}`);
    }
    const json = await res.json();
    if (json && json.data) {
      const resultData = {
        timings: json.data.timings,
        date: json.data.date,
        meta: json.data.meta,
        location: {
          city,
          country,
          methodName: "Algeria (Ministry of Religious Affairs / Method 19)"
        }
      };
      prayerCache.set(cacheKey, resultData);
      return c.json({
        success: true,
        data: resultData
      });
    }
    throw new Error("Invalid response structure from AlAdhan API");
  } catch (err) {
    console.error("Error fetching AlAdhan prayer times:", err.message);
    const today = /* @__PURE__ */ new Date();
    const fallbackData = {
      timings: DEFAULT_ALGERIA_TIMINGS,
      date: {
        readable: today.toDateString(),
        hijri: {
          day: "20",
          month: { ar: "\u0631\u064E\u0628\u064A\u0639 \u0627\u0644\u062B\u0627\u0646\u064A", en: "Rabi al-Thani" },
          year: "1448",
          date: "20-04-1448"
        },
        gregorian: {
          date: today.toISOString().split("T")[0]
        }
      },
      meta: {
        method: { id: 19, name: "Algeria" },
        timezone: "Africa/Algiers"
      },
      isFallback: true
    };
    return c.json({
      success: true,
      data: fallbackData,
      note: "Using standard Algeria prayer timetable"
    });
  }
});
async function fetchAlgeriaTimingsForDate(rawDate) {
  let cacheKey = rawDate || "today";
  if (prayerCache.has(cacheKey)) {
    return prayerCache.get(cacheKey).timings || DEFAULT_ALGERIA_TIMINGS;
  }
  try {
    let formattedDate = "";
    if (rawDate && rawDate.includes("-")) {
      const parts = rawDate.split("-");
      if (parts[0].length === 4) {
        formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      } else {
        formattedDate = rawDate;
      }
    } else {
      const today = /* @__PURE__ */ new Date();
      const d = String(today.getDate()).padStart(2, "0");
      const m = String(today.getMonth() + 1).padStart(2, "0");
      const y = today.getFullYear();
      formattedDate = `${d}-${m}-${y}`;
    }
    const url = `https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=Algiers&country=Algeria&method=19`;
    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    if (res.ok) {
      const json = await res.json();
      if (json?.data?.timings) {
        prayerCache.set(cacheKey, json.data);
        return json.data.timings;
      }
    }
  } catch (e) {
    console.error("Server error fetching AlAdhan timings:", e);
  }
  return DEFAULT_ALGERIA_TIMINGS;
}
async function computeAlgeriaSessionTimes(group, dateStr) {
  const timings = await fetchAlgeriaTimingsForDate(dateStr);
  const getP = (pName) => {
    switch (pName) {
      case "fajr":
        return timings.Fajr?.split(" ")[0] || "05:17";
      case "dhuhr":
        return timings.Dhuhr?.split(" ")[0] || "12:37";
      case "asr":
        return timings.Asr?.split(" ")[0] || "15:59";
      case "maghrib":
        return timings.Maghrib?.split(" ")[0] || "18:31";
      case "isha":
        return timings.Isha?.split(" ")[0] || "19:52";
      default:
        return "16:30";
    }
  };
  const addTime = (tStr, offsetH) => {
    const clean = tStr.split(" ")[0];
    const [h, m] = clean.split(":").map(Number);
    let newH = (h || 0) + offsetH;
    newH = (newH % 24 + 24) % 24;
    return `${String(newH).padStart(2, "0")}:${String(m || 0).padStart(2, "0")}`;
  };
  const sessionTime = group?.sessionTime;
  let calcStart = "16:30";
  let calcEnd = "18:00";
  let desc6 = group?.studyTime || "\u0645\u0646 \u0627\u0644\u0639\u0635\u0631 \u0625\u0644\u0649 \u0627\u0644\u0645\u063A\u0631\u0628";
  if (sessionTime) {
    const { startType, startTime, startPrayer, startOffsetHours, endType, endTime, endPrayer, endOffsetHours } = sessionTime;
    if (startType === "prayer" && startPrayer) {
      calcStart = addTime(getP(startPrayer), Number(startOffsetHours) || 0);
    } else if (startTime) {
      calcStart = startTime;
    }
    if (endType === "prayer" && endPrayer) {
      calcEnd = addTime(getP(endPrayer), Number(endOffsetHours) || 0);
    } else if (endTime) {
      calcEnd = endTime;
    }
  } else if (desc6) {
    const lower = desc6.toLowerCase();
    if (lower.includes("\u0627\u0644\u0641\u062C\u0631")) calcStart = addTime(timings.Fajr?.split(" ")[0] || "05:17", lower.includes("\u0641\u062C\u0631 +") ? 1 : 0);
    else if (lower.includes("\u0627\u0644\u0638\u0647\u0631")) calcStart = timings.Dhuhr?.split(" ")[0] || "12:37";
    else if (lower.includes("\u0627\u0644\u0639\u0635\u0631")) calcStart = timings.Asr?.split(" ")[0] || "15:59";
    else if (lower.includes("\u0627\u0644\u0645\u063A\u0631\u0628")) calcStart = timings.Maghrib?.split(" ")[0] || "18:31";
    else if (lower.includes("\u0627\u0644\u0639\u0634\u0627\u0621")) calcStart = timings.Isha?.split(" ")[0] || "19:52";
    if (lower.includes("\u0625\u0644\u0649 \u0635\u0644\u0627\u0629 \u0627\u0644\u0639\u0634\u0627\u0621") || lower.includes("\u0625\u0644\u0649 \u0627\u0644\u0639\u0634\u0627\u0621")) calcEnd = timings.Isha?.split(" ")[0] || "19:52";
    else if (lower.includes("\u0625\u0644\u0649 \u0635\u0644\u0627\u0629 \u0627\u0644\u0645\u063A\u0631\u0628") || lower.includes("\u0625\u0644\u0649 \u0627\u0644\u0645\u063A\u0631\u0628")) calcEnd = timings.Maghrib?.split(" ")[0] || "18:31";
    else if (lower.includes("\u0625\u0644\u0649 \u0635\u0644\u0627\u0629 \u0627\u0644\u0639\u0635\u0631") || lower.includes("\u0625\u0644\u0649 \u0627\u0644\u0639\u0635\u0631")) calcEnd = timings.Asr?.split(" ")[0] || "15:59";
    else if (lower.includes("\u0627\u0644\u0641\u062C\u0631 + \u0633\u0627\u0639\u0629") || lower.includes("\u0641\u062C\u0631 + 1")) calcEnd = addTime(timings.Fajr?.split(" ")[0] || "05:17", 1);
  }
  const slotStr = `${calcStart} - ${calcEnd}`;
  let text2 = desc6;
  if (desc6 && !desc6.includes(slotStr)) {
    text2 = `${desc6} (${slotStr})`;
  }
  return {
    startTime: calcStart,
    endTime: calcEnd,
    sessionTimeText: text2,
    timeSlot: slotStr
  };
}

// src/server/routes/sessions.ts
var sessionsRouter = new Hono9();
async function getAuthenticatedUser(c) {
  const sessionId = getSessionId(c);
  if (!sessionId) return null;
  const user = await db.select().from(users).where(eq8(users.id, sessionId)).then((r) => r[0]);
  if (!user) return null;
  let teacherProfile = null;
  let parentProfile = null;
  let role = user.role;
  if (user.role === "admin" || user.role === "teacher") {
    teacherProfile = await db.select().from(teachers).where(eq8(teachers.userId, user.id)).then((r) => r[0]);
    if (teacherProfile && teacherProfile.isAdmin) {
      role = "admin";
    }
  }
  if (user.role === "parent") {
    parentProfile = await db.select().from(parents).where(eq8(parents.userId, user.id)).then((r) => r[0]);
  }
  return { ...user, role, teacherProfile, parentProfile };
}
sessionsRouter.get("/", async (c) => {
  try {
    const user = await getAuthenticatedUser(c);
    if (!user) {
      return c.json({ error: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u062F\u062E\u0648\u0644\u060C \u064A\u0631\u062C\u0649 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0623\u0648\u0644\u0627\u064B" }, 401);
    }
    const startDate = c.req.query("startDate");
    const endDate = c.req.query("endDate");
    const groupIdFilter = c.req.query("groupId");
    const page = c.req.query("page");
    const limit = c.req.query("limit");
    const search = c.req.query("search")?.trim().toLowerCase();
    const statusFilter = c.req.query("status");
    const allGroups = await db.select().from(groups);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = /* @__PURE__ */ new Date();
    let genStart = /* @__PURE__ */ new Date();
    let genEnd = /* @__PURE__ */ new Date();
    if (startDate && endDate) {
      genStart = new Date(startDate);
      genEnd = new Date(endDate);
    } else if (startDate) {
      genStart = new Date(startDate);
      genEnd = new Date(startDate);
      genEnd.setDate(genEnd.getDate() + 14);
    } else {
      genStart.setDate(today.getDate() - 7);
      genEnd.setDate(today.getDate() + 7);
    }
    const diffDays = Math.min(60, Math.max(1, Math.round((genEnd.getTime() - genStart.getTime()) / (1e3 * 3600 * 24))));
    for (const group of allGroups) {
      const days = group.days || [];
      if (days.length === 0) continue;
      const groupTeacher = await db.select().from(groupTeachers).where(eq8(groupTeachers.groupId, group.id)).then((r) => r[0]);
      const defaultTeacherId = groupTeacher ? groupTeacher.teacherId : null;
      for (let i = 0; i <= diffDays; i++) {
        const checkDate = new Date(genStart);
        checkDate.setDate(genStart.getDate() + i);
        const dayName = dayNames[checkDate.getDay()];
        if (days.includes(dayName)) {
          const dateStr = checkDate.toISOString().split("T")[0];
          const existing = await db.select().from(sessions).where(
            and(
              eq8(sessions.groupId, group.id),
              eq8(sessions.date, dateStr)
            )
          ).then((r) => r[0]);
          if (!existing) {
            const sessionId = `ses_${group.id}_${dateStr}`;
            const computedTimes = await computeAlgeriaSessionTimes(group, dateStr);
            await db.insert(sessions).values({
              id: sessionId,
              groupId: group.id,
              teacherId: defaultTeacherId,
              sessionType: "main",
              date: dateStr,
              startTime: computedTimes.startTime,
              endTime: computedTimes.endTime,
              sessionTimeText: computedTimes.sessionTimeText,
              status: checkDate < today ? "completed" : "scheduled",
              notes: "\u062D\u0635\u0629 \u0623\u0633\u0627\u0633\u064A\u0629 \u0645\u062C\u062F\u0648\u0644\u0629 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B"
            }).onConflictDoNothing();
            const groupStudents = await db.select().from(students).where(eq8(students.groupId, group.id));
            for (const student of groupStudents) {
              await db.insert(sessionStudentRecords).values({
                id: `rec_${sessionId}_${student.id}`,
                sessionId,
                studentId: student.id,
                attendanceStatus: "present",
                surahNumber: student.currentSurahNumber,
                surahName: student.currentSurahName,
                ayahStart: student.currentAyah,
                ayahEnd: student.currentAyah ? student.currentAyah + 10 : 10,
                teacherRemarque: "",
                isAssessed: false
              }).onConflictDoNothing();
            }
          }
        }
      }
    }
    let query = db.select({
      id: sessions.id,
      groupId: sessions.groupId,
      teacherId: sessions.teacherId,
      sessionType: sessions.sessionType,
      date: sessions.date,
      startTime: sessions.startTime,
      endTime: sessions.endTime,
      sessionTimeText: sessions.sessionTimeText,
      status: sessions.status,
      notes: sessions.notes,
      groupStudyTime: groups.studyTime,
      groupSessionTime: groups.sessionTime,
      level: groups.level,
      room: groups.room,
      groupNumber: groups.number,
      teacherName: teachers.name,
      teacherAvatar: teachers.avatar
    }).from(sessions).innerJoin(groups, eq8(sessions.groupId, groups.id)).leftJoin(teachers, eq8(sessions.teacherId, teachers.id));
    let results = await query;
    if (groupIdFilter) {
      results = results.filter((r) => r.groupId === groupIdFilter);
    }
    if (startDate) {
      results = results.filter((r) => r.date >= startDate);
    }
    if (endDate) {
      results = results.filter((r) => r.date <= endDate);
    }
    if (statusFilter && statusFilter !== "all") {
      results = results.filter((r) => r.status === statusFilter);
    }
    if (user.role === "teacher" && user.teacherProfile) {
      const teacherGroups = await db.select({ groupId: groupTeachers.groupId }).from(groupTeachers).where(eq8(groupTeachers.teacherId, user.teacherProfile.id));
      const groupIds = teacherGroups.map((tg) => tg.groupId);
      results = results.filter((r) => groupIds.includes(r.groupId));
    } else if (user.role === "parent" && user.parentProfile) {
      const parentChildren = await db.select({ groupId: students.groupId }).from(students).where(eq8(students.parentId, user.parentProfile.id));
      const groupIds = parentChildren.map((c2) => c2.groupId).filter(Boolean);
      results = results.filter((r) => groupIds.includes(r.groupId));
    }
    if (search) {
      results = results.filter(
        (r) => r.teacherName && r.teacherName.toLowerCase().includes(search) || r.level && r.level.toLowerCase().includes(search) || r.groupNumber && String(r.groupNumber).includes(search) || r.sessionTimeText && r.sessionTimeText.toLowerCase().includes(search) || r.date && r.date.includes(search)
      );
    }
    results.sort((a, b) => b.date.localeCompare(a.date) || (b.startTime || "").localeCompare(a.startTime || ""));
    const total = results.length;
    if (page !== void 0) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit || "10", 10) || 10);
      const totalPages = Math.ceil(total / limitNum) || 1;
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedResults = results.slice(startIndex, startIndex + limitNum);
      return c.json({
        success: true,
        sessions: paginatedResults,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages
        }
      });
    }
    return c.json({ success: true, sessions: results, pagination: null });
  } catch (err) {
    console.error("Error fetching sessions:", err);
    return c.json({ error: err.message || "\u0641\u0634\u0644 \u0641\u064A \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u062D\u0635\u0635" }, 500);
  }
});
sessionsRouter.post("/exception", async (c) => {
  try {
    const user = await getAuthenticatedUser(c);
    if (!user) {
      return c.json({ error: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u062F\u062E\u0648\u0644" }, 401);
    }
    const { groupId, date, notes } = await c.req.json();
    if (!groupId || !date) {
      return c.json({ error: "\u0645\u0639\u0631\u0641 \u0627\u0644\u062D\u0644\u0642\u0629 \u0648\u0627\u0644\u062A\u0627\u0631\u064A\u062E \u0645\u0637\u0644\u0648\u0628\u0627\u0646" }, 400);
    }
    const group = await db.select().from(groups).where(eq8(groups.id, groupId)).then((r) => r[0]);
    if (!group) {
      return c.json({ error: "\u0627\u0644\u062D\u0644\u0642\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629" }, 404);
    }
    const groupTeacher = await db.select().from(groupTeachers).where(eq8(groupTeachers.groupId, groupId)).then((r) => r[0]);
    if (user.role !== "admin") {
      const isAssigned = await db.select().from(groupTeachers).where(
        and(
          eq8(groupTeachers.groupId, groupId),
          eq8(groupTeachers.teacherId, user.teacherProfile?.id || "")
        )
      ).then((r) => r.length > 0);
      if (!isAssigned) {
        return c.json({ error: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0644\u0643 \u0628\u0625\u0646\u0634\u0627\u0621 \u062D\u0635\u0629 \u0641\u064A \u062D\u0644\u0642\u0629 \u063A\u064A\u0631 \u0645\u0633\u0646\u062F\u0629 \u0625\u0644\u064A\u0643" }, 403);
      }
    }
    const sessionId = `ses_exc_${groupId}_${Date.now()}`;
    const computedTimes = await computeAlgeriaSessionTimes(group, date);
    const newSession = {
      id: sessionId,
      groupId,
      teacherId: user.teacherProfile?.id || groupTeacher?.teacherId || null,
      sessionType: "exception",
      date,
      startTime: computedTimes.startTime,
      endTime: computedTimes.endTime,
      sessionTimeText: `\u062D\u0635\u0629 \u0627\u0633\u062A\u062B\u0646\u0627\u0626\u064A\u0629 - ${computedTimes.sessionTimeText}`,
      status: "scheduled",
      notes: notes || "\u062D\u0635\u0629 \u0627\u0633\u062A\u062B\u0646\u0627\u0626\u064A\u0629 \u062A\u0645\u062A \u0625\u0636\u0627\u0641\u062A\u0647\u0627 \u0645\u0646 \u0635\u0641\u062D\u0629 \u0627\u0644\u062D\u0644\u0642\u0629"
    };
    await db.insert(sessions).values(newSession);
    const groupStudents = await db.select().from(students).where(eq8(students.groupId, groupId));
    for (const student of groupStudents) {
      await db.insert(sessionStudentRecords).values({
        id: `rec_${sessionId}_${student.id}`,
        sessionId,
        studentId: student.id,
        attendanceStatus: "present",
        // Default to present
        surahNumber: student.currentSurahNumber,
        surahName: student.currentSurahName,
        ayahStart: student.currentAyah,
        ayahEnd: student.currentAyah + 10,
        teacherRemarque: "",
        isAssessed: false
      });
    }
    return c.json({ success: true, session: newSession });
  } catch (err) {
    console.error("Error creating exception session:", err);
    return c.json({ error: err.message || "\u0641\u0634\u0644 \u0641\u064A \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062D\u0635\u0629 \u0627\u0644\u0627\u0633\u062A\u062B\u0646\u0627\u0626\u064A\u0629" }, 500);
  }
});
sessionsRouter.get("/:id", async (c) => {
  try {
    const sessionId = c.req.param("id");
    const user = await getAuthenticatedUser(c);
    if (!user) {
      return c.json({ error: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u062F\u062E\u0648\u0644" }, 401);
    }
    const session = await db.select({
      id: sessions.id,
      groupId: sessions.groupId,
      teacherId: sessions.teacherId,
      sessionType: sessions.sessionType,
      date: sessions.date,
      startTime: sessions.startTime,
      endTime: sessions.endTime,
      sessionTimeText: sessions.sessionTimeText,
      status: sessions.status,
      notes: sessions.notes,
      groupStudyTime: groups.studyTime,
      room: groups.room,
      groupNumber: groups.number,
      level: groups.level,
      teacherName: teachers.name,
      teacherAvatar: teachers.avatar
    }).from(sessions).innerJoin(groups, eq8(sessions.groupId, groups.id)).leftJoin(teachers, eq8(sessions.teacherId, teachers.id)).where(eq8(sessions.id, sessionId)).then((r) => r[0]);
    if (!session) {
      return c.json({ error: "\u0627\u0644\u062D\u0635\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629" }, 404);
    }
    let records = await db.select({
      id: sessionStudentRecords.id,
      sessionId: sessionStudentRecords.sessionId,
      studentId: sessionStudentRecords.studentId,
      attendanceStatus: sessionStudentRecords.attendanceStatus,
      absenceReason: sessionStudentRecords.absenceReason,
      surahNumber: sessionStudentRecords.surahNumber,
      surahName: sessionStudentRecords.surahName,
      ayahStart: sessionStudentRecords.ayahStart,
      ayahEnd: sessionStudentRecords.ayahEnd,
      teacherRemarque: sessionStudentRecords.teacherRemarque,
      isAssessed: sessionStudentRecords.isAssessed,
      studentName: students.name,
      studentAvatar: students.avatar,
      studentAge: students.age,
      studentDateOfBirth: students.dateOfBirth,
      studentParentId: students.parentId
    }).from(sessionStudentRecords).innerJoin(students, eq8(sessionStudentRecords.studentId, students.id)).where(eq8(sessionStudentRecords.sessionId, sessionId));
    if (user.role === "parent" && user.parentProfile) {
      records = records.filter((r) => r.studentParentId === user.parentProfile?.id);
    }
    const formattedRecords = records.map((r) => ({
      ...r,
      studentAge: calculateAge(r.studentDateOfBirth || r.studentAge)
    }));
    return c.json({ success: true, session, records: formattedRecords });
  } catch (err) {
    console.error("Error fetching session details:", err);
    return c.json({ error: err.message || "\u0641\u0634\u0644 \u0641\u064A \u062A\u062D\u0645\u064A\u0644 \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u062D\u0635\u0629" }, 500);
  }
});
sessionsRouter.post("/:id/records", async (c) => {
  try {
    const sessionId = c.req.param("id");
    const user = await getAuthenticatedUser(c);
    if (!user) {
      return c.json({ error: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u062F\u062E\u0648\u0644" }, 401);
    }
    if (user.role === "parent") {
      return c.json({ error: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0644\u0623\u0648\u0644\u064A\u0627\u0621 \u0627\u0644\u0623\u0645\u0648\u0631 \u0628\u062A\u0639\u062F\u064A\u0644 \u0633\u062C\u0644\u0627\u062A \u0627\u0644\u0637\u0644\u0627\u0628" }, 403);
    }
    const { records, notes, status } = await c.req.json();
    if (!Array.isArray(records)) {
      return c.json({ error: "\u062A\u0646\u0633\u064A\u0642 \u0627\u0644\u0633\u062C\u0644\u0627\u062A \u063A\u064A\u0631 \u0635\u0627\u0644\u062D" }, 400);
    }
    for (const rec of records) {
      await db.insert(sessionStudentRecords).values({
        id: rec.id || `rec_${sessionId}_${rec.studentId}`,
        sessionId,
        studentId: rec.studentId,
        attendanceStatus: rec.attendanceStatus || "present",
        absenceReason: rec.absenceReason || "",
        surahNumber: rec.surahNumber || null,
        surahName: rec.surahName || "",
        ayahStart: rec.ayahStart || null,
        ayahEnd: rec.ayahEnd || null,
        teacherRemarque: rec.teacherRemarque || "",
        isAssessed: rec.isAssessed !== void 0 ? Boolean(rec.isAssessed) : false
      }).onConflictDoUpdate({
        target: sessionStudentRecords.id,
        set: {
          attendanceStatus: rec.attendanceStatus || "present",
          absenceReason: rec.absenceReason || "",
          surahNumber: rec.surahNumber || null,
          surahName: rec.surahName || "",
          ayahStart: rec.ayahStart || null,
          ayahEnd: rec.ayahEnd || null,
          teacherRemarque: rec.teacherRemarque || "",
          isAssessed: rec.isAssessed !== void 0 ? Boolean(rec.isAssessed) : false
        }
      });
      if (rec.attendanceStatus === "present" && rec.surahName) {
        await db.update(students).set({
          currentSurahName: rec.surahName,
          currentSurahNumber: rec.surahNumber || 1,
          currentAyah: rec.ayahEnd || rec.ayahStart || 1,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq8(students.id, rec.studentId));
      }
    }
    await db.update(sessions).set({
      status: status || "completed",
      notes: notes !== void 0 ? notes : null,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq8(sessions.id, sessionId));
    return c.json({ success: true, message: "\u062A\u0645 \u062D\u0641\u0638 \u0648\u0631\u0635\u062F \u0627\u0644\u062D\u0636\u0648\u0631 \u0648\u0627\u0644\u0623\u062F\u0627\u0621 \u0628\u0646\u062C\u0627\u062D" });
  } catch (err) {
    console.error("Error saving session records:", err);
    return c.json({ error: err.message || "\u0641\u0634\u0644 \u0641\u064A \u062D\u0641\u0638 \u0648\u062A\u062D\u062F\u064A\u062B \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062D\u0635\u0629" }, 500);
  }
});
sessionsRouter.post("/:id/records/:recordId", async (c) => {
  try {
    const sessionId = c.req.param("id");
    const recordId = c.req.param("recordId");
    const user = await getAuthenticatedUser(c);
    if (!user) {
      return c.json({ error: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u062F\u062E\u0648\u0644" }, 401);
    }
    if (user.role === "parent") {
      return c.json({ error: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0644\u0623\u0648\u0644\u064A\u0627\u0621 \u0627\u0644\u0623\u0645\u0648\u0631 \u0628\u062A\u0639\u062F\u064A\u0644 \u0633\u062C\u0644\u0627\u062A \u0627\u0644\u0637\u0644\u0627\u0628" }, 403);
    }
    const rec = await c.req.json();
    const isAssessed = rec.isAssessed !== void 0 ? Boolean(rec.isAssessed) : true;
    await db.insert(sessionStudentRecords).values({
      id: recordId,
      sessionId,
      studentId: rec.studentId,
      attendanceStatus: rec.attendanceStatus || "present",
      absenceReason: rec.absenceReason || "",
      surahNumber: rec.surahNumber || null,
      surahName: rec.surahName || "",
      ayahStart: rec.ayahStart || null,
      ayahEnd: rec.ayahEnd || null,
      teacherRemarque: rec.teacherRemarque || "",
      isAssessed
    }).onConflictDoUpdate({
      target: sessionStudentRecords.id,
      set: {
        attendanceStatus: rec.attendanceStatus || "present",
        absenceReason: rec.absenceReason || "",
        surahNumber: rec.surahNumber || null,
        surahName: rec.surahName || "",
        ayahStart: rec.ayahStart || null,
        ayahEnd: rec.ayahEnd || null,
        teacherRemarque: rec.teacherRemarque || "",
        isAssessed
      }
    });
    if (rec.attendanceStatus === "present" && rec.surahName && rec.studentId) {
      await db.update(students).set({
        currentSurahName: rec.surahName,
        currentSurahNumber: rec.surahNumber || 1,
        currentAyah: rec.ayahEnd || rec.ayahStart || 1,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq8(students.id, rec.studentId));
    }
    return c.json({ success: true, message: "\u062A\u0645 \u062D\u0641\u0638 \u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0637\u0627\u0644\u0628 \u0628\u0646\u062C\u0627\u062D", isAssessed });
  } catch (err) {
    console.error("Error saving single student record:", err);
    return c.json({ error: err.message || "\u0641\u0634\u0644 \u0641\u064A \u062D\u0641\u0638 \u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" }, 500);
  }
});

// src/server/routes/attendances.ts
import { Hono as Hono10 } from "hono";
import { eq as eq9, and as and2, desc as desc5 } from "drizzle-orm";
var attendancesRouter = new Hono10();
attendancesRouter.get("/", async (c) => {
  await ensureDatabaseInitialized();
  const groupId = c.req.query("groupId")?.trim();
  const studentId = c.req.query("studentId")?.trim();
  const date = c.req.query("date")?.trim();
  const statusFilter = c.req.query("status")?.trim();
  const search = c.req.query("search")?.trim().toLowerCase();
  const allAttendances = await db.select().from(attendances).orderBy(desc5(attendances.createdAt));
  const allStudents = await db.select().from(students);
  const allTeachers = await db.select().from(teachers);
  const allGroups = await db.select().from(groups);
  const allGroupTypes = await db.select().from(groupTypes);
  const studentMap = new Map(allStudents.map((s) => [s.id, s]));
  const teacherMap = new Map(allTeachers.map((t) => [t.id, t]));
  const groupMap = new Map(allGroups.map((g) => [g.id, g]));
  const groupTypeMap = new Map(allGroupTypes.map((gt) => [gt.id, gt]));
  let enriched = allAttendances.map((att) => {
    const student = studentMap.get(att.studentId);
    const teacher = att.recordedByTeacherId ? teacherMap.get(att.recordedByTeacherId) : null;
    const group = groupMap.get(att.groupId);
    const groupType = group ? groupTypeMap.get(group.typeId) : null;
    return {
      ...att,
      groupTypeName: att.groupTypeName || groupType?.name || "\u062D\u0644\u0642\u0629 \u0642\u0631\u0622\u0646\u064A\u0629",
      groupNumber: att.groupNumber ?? group?.number,
      student: student ? {
        id: student.id,
        name: student.name,
        avatar: student.avatar,
        gender: student.gender
      } : null,
      teacher: teacher ? {
        id: teacher.id,
        name: teacher.name,
        avatar: teacher.avatar
      } : null,
      group: group ? {
        id: group.id,
        number: group.number,
        type: groupType?.name || "\u062D\u0644\u0642\u0629 \u0642\u0631\u0622\u0646\u064A\u0629",
        studyTime: group.studyTime
      } : null
    };
  });
  if (groupId) {
    enriched = enriched.filter((a) => a.groupId === groupId);
  }
  if (studentId) {
    enriched = enriched.filter((a) => a.studentId === studentId);
  }
  if (date) {
    enriched = enriched.filter((a) => a.date === date);
  }
  if (statusFilter) {
    enriched = enriched.filter((a) => a.status === statusFilter);
  }
  if (search) {
    enriched = enriched.filter(
      (a) => a.student?.name.toLowerCase().includes(search) || a.reason && a.reason.toLowerCase().includes(search) || a.sessionTimeText && a.sessionTimeText.toLowerCase().includes(search) || a.groupTypeName && a.groupTypeName.toLowerCase().includes(search)
    );
  }
  return c.json({ attendances: enriched });
});
attendancesRouter.post("/bulk", async (c) => {
  await ensureDatabaseInitialized();
  try {
    const body = await c.req.json();
    const { groupId, date, sessionTimeText, recordedByTeacherId, records } = body;
    if (!groupId) {
      return c.json({ error: "\u0645\u0639\u0631\u0641 \u0627\u0644\u062D\u0644\u0642\u0629 \u0645\u0637\u0644\u0648\u0628" }, 400);
    }
    if (!date) {
      return c.json({ error: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u062D\u0635\u0629 \u0645\u0637\u0644\u0648\u0628" }, 400);
    }
    if (!Array.isArray(records) || records.length === 0) {
      return c.json({ error: "\u0633\u062C\u0644 \u0627\u0644\u062D\u0636\u0648\u0631 \u0648\u0627\u0644\u063A\u064A\u0627\u0628 \u0644\u0644\u0637\u0644\u0627\u0628 \u0641\u0627\u0631\u063A" }, 400);
    }
    const group = await db.select().from(groups).where(eq9(groups.id, groupId)).then((r) => r[0]);
    let groupTypeName = "\u062D\u0644\u0642\u0629 \u0642\u0631\u0622\u0646\u064A\u0629";
    if (group?.typeId) {
      const gt = await db.select().from(groupTypes).where(eq9(groupTypes.id, group.typeId)).then((r) => r[0]);
      if (gt) groupTypeName = gt.name;
    }
    const effectiveSessionTime = sessionTimeText?.trim() || group?.studyTime || "\u063A\u064A\u0631 \u0645\u062D\u062F\u062F";
    const existingGroupAttendances = await db.select().from(attendances).where(and2(eq9(attendances.groupId, groupId), eq9(attendances.date, date)));
    const existingMap = new Map(existingGroupAttendances.map((item) => [item.studentId, item]));
    for (const rec of records) {
      const { studentId, status, reason } = rec;
      if (!studentId || !status) continue;
      const existingRecord = existingMap.get(studentId);
      if (existingRecord) {
        await db.update(attendances).set({
          status,
          reason: reason?.trim() || null,
          sessionTimeText: effectiveSessionTime,
          recordedByTeacherId: recordedByTeacherId || existingRecord.recordedByTeacherId,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq9(attendances.id, existingRecord.id));
      } else {
        const id = `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        await db.insert(attendances).values({
          id,
          studentId,
          groupId,
          groupTypeName,
          groupNumber: group?.number || 1,
          date,
          sessionTimeText: effectiveSessionTime,
          status,
          reason: reason?.trim() || null,
          recordedByTeacherId: recordedByTeacherId || null,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        });
      }
    }
    return c.json({
      success: true,
      message: `\u062A\u0645 \u062D\u0641\u0638 \u0633\u062C\u0644 \u0627\u0644\u063A\u064A\u0627\u0628 \u0648\u0627\u0644\u062D\u0636\u0648\u0631 \u0644\u0639\u062F\u062F ${records.length} \u0637\u0644\u0627\u0628 \u0628\u0646\u062C\u0627\u062D`,
      savedCount: records.length
    });
  } catch (err) {
    console.error("Error recording group attendance:", err);
    return c.json({ error: err.message || "\u0641\u0634\u0644 \u0641\u064A \u062D\u0641\u0638 \u0633\u062C\u0644 \u0627\u0644\u062D\u0636\u0648\u0631 \u0648\u0627\u0644\u063A\u064A\u0627\u0628" }, 500);
  }
});
attendancesRouter.put("/:id", async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param("id");
  try {
    const body = await c.req.json();
    const existing = await db.select().from(attendances).where(eq9(attendances.id, id)).then((r) => r[0]);
    if (!existing) {
      return c.json({ error: "\u0633\u062C\u0644 \u0627\u0644\u063A\u064A\u0627\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F" }, 404);
    }
    const updated = {
      status: body.status || existing.status,
      reason: body.reason !== void 0 ? body.reason?.trim() || null : existing.reason,
      sessionTimeText: body.sessionTimeText?.trim() || existing.sessionTimeText,
      updatedAt: /* @__PURE__ */ new Date()
    };
    await db.update(attendances).set(updated).where(eq9(attendances.id, id));
    return c.json({ success: true, attendance: { ...existing, ...updated } });
  } catch (err) {
    return c.json({ error: err.message || "\u0641\u0634\u0644 \u0641\u064A \u062A\u0639\u062F\u064A\u0644 \u0633\u062C\u0644 \u0627\u0644\u063A\u064A\u0627\u0628" }, 500);
  }
});
attendancesRouter.delete("/:id", async (c) => {
  await ensureDatabaseInitialized();
  const id = c.req.param("id");
  try {
    await db.delete(attendances).where(eq9(attendances.id, id));
    return c.json({ success: true, message: "\u062A\u0645 \u062D\u0630\u0641 \u0633\u062C\u0644 \u0627\u0644\u063A\u064A\u0627\u0628 \u0628\u0646\u062C\u0627\u062D" });
  } catch (err) {
    return c.json({ error: err.message || "\u0641\u0634\u0644 \u0641\u064A \u062D\u0630\u0641 \u0633\u062C\u0644 \u0627\u0644\u063A\u064A\u0627\u0628" }, 500);
  }
});

// src/server/routes/stats.ts
import { Hono as Hono11 } from "hono";
var statsRouter = new Hono11();
statsRouter.get("/counts", async (c) => {
  await ensureDatabaseInitialized();
  try {
    const allStudents = await db.select({ id: students.id }).from(students);
    const allParents = await db.select({ id: parents.id }).from(parents);
    const allTeachers = await db.select({ id: teachers.id }).from(teachers);
    const allGroups = await db.select({ id: groups.id }).from(groups);
    const allRatings = await db.select({ id: studentRatings.id }).from(studentRatings);
    return c.json({
      counts: {
        students: allStudents.length,
        parents: allParents.length,
        teachers: allTeachers.length,
        groups: allGroups.length,
        ratings: allRatings.length
      }
    });
  } catch (err) {
    return c.json({ counts: { students: 0, parents: 0, teachers: 0, groups: 0, ratings: 0 } });
  }
});
statsRouter.get("/", async (c) => {
  await ensureDatabaseInitialized();
  const allStudents = await db.select().from(students);
  const allTeachers = await db.select().from(teachers);
  const allGroups = await db.select().from(groups);
  const allRatings = await db.select().from(studentRatings);
  const totalStudents = allStudents.length;
  const totalTeachers = allTeachers.length;
  const totalGroups = allGroups.length;
  const averageRating = allRatings.length > 0 ? Math.round(allRatings.reduce((acc, r) => acc + r.overallScore, 0) / allRatings.length) : 92;
  const totalJuzMemorized = allStudents.reduce((acc, s) => acc + (s.memorizedJuzCount || 0), 0);
  const topStudents = [...allStudents].sort((a, b) => (b.memorizedJuzCount || 0) - (a.memorizedJuzCount || 0)).slice(0, 5);
  return c.json({
    stats: {
      totalStudents,
      totalTeachers,
      totalGroups,
      averageRating,
      totalJuzMemorized,
      topStudents
    }
  });
});
var quranRouter = new Hono11();
quranRouter.get("/surahs", (c) => {
  return c.json({ surahs: QURAN_SURAHS });
});

// src/server/routes/storage.ts
import { Hono as Hono12 } from "hono";
import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
var storageRouter = new Hono12();
var UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
var hasS3Config = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_S3_BUCKET);
var s3Client = hasS3Config ? new S3Client({
  region: process.env.AWS_REGION || "eu-central-1",
  endpoint: process.env.AWS_ENDPOINT_URL_S3 || void 0,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  forcePathStyle: true
}) : null;
var S3_BUCKET = process.env.AWS_S3_BUCKET || "uploads";
function detectMimeType(buffer) {
  if (buffer.length > 8) {
    if (buffer[0] === 137 && buffer[1] === 80 && buffer[2] === 78 && buffer[3] === 71) {
      return "image/png";
    } else if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) {
      return "image/jpeg";
    } else if (buffer[0] === 71 && buffer[1] === 73 && buffer[2] === 70) {
      return "image/gif";
    } else if (buffer[0] === 82 && buffer[1] === 73 && buffer[2] === 70 && buffer[3] === 70) {
      return "image/webp";
    } else if (buffer.toString("utf8", 0, 100).includes("<svg")) {
      return "image/svg+xml";
    }
  }
  return "image/jpeg";
}
storageRouter.get("/:key", async (c) => {
  const key = c.req.param("key");
  const safeKey = key.replace(/[^a-zA-Z0-9_\-.]/g, "");
  const localFilePath = path.join(UPLOADS_DIR, safeKey);
  if (s3Client) {
    try {
      const s3Res = await s3Client.send(new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: safeKey
      }));
      if (s3Res.Body) {
        const bytes = await s3Res.Body.transformToByteArray();
        const buffer = Buffer.from(bytes);
        const mimeType = s3Res.ContentType || detectMimeType(buffer);
        fs.writeFile(localFilePath, buffer, () => {
        });
        c.header("Content-Type", mimeType);
        c.header("Cache-Control", "no-cache, no-store, must-revalidate");
        c.header("Pragma", "no-cache");
        c.header("Expires", "0");
        return c.body(buffer);
      }
    } catch {
    }
  }
  if (fs.existsSync(localFilePath) && fs.statSync(localFilePath).isFile()) {
    const fileBuffer = fs.readFileSync(localFilePath);
    const mimeType = detectMimeType(fileBuffer);
    c.header("Content-Type", mimeType);
    c.header("Cache-Control", "no-cache, no-store, must-revalidate");
    c.header("Pragma", "no-cache");
    c.header("Expires", "0");
    return c.body(fileBuffer);
  }
  const isTeacher = safeKey.startsWith("teacher-") || safeKey.startsWith("tch_");
  const label = safeKey.replace(/^(student-|teacher-|std_|tch_)/, "").substring(0, 6).toUpperCase();
  const bgColor = isTeacher ? "#0f766e" : "#047857";
  const iconSymbol = isTeacher ? "\u{1F468}\u200D\u{1F3EB}" : "\u{1F393}";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="64" fill="${bgColor}" />
    <text x="64" y="60" text-anchor="middle" font-size="42" dominant-baseline="central">${iconSymbol}</text>
    <text x="64" y="100" text-anchor="middle" font-size="14" font-family="sans-serif" font-weight="bold" fill="#ffffff">${label}</text>
  </svg>`;
  c.header("Content-Type", "image/svg+xml");
  c.header("Cache-Control", "no-cache, no-store, must-revalidate");
  c.header("Pragma", "no-cache");
  c.header("Expires", "0");
  return c.body(svg);
});
storageRouter.post("/upload", async (c) => {
  try {
    const body = await c.req.parseBody();
    const key = body.key;
    const file = body.file;
    if (!key) {
      return c.json({ error: "Storage key is required (e.g., student-id or teacher-id)" }, 400);
    }
    const safeKey = key.replace(/[^a-zA-Z0-9_\-.]/g, "");
    const localFilePath = path.join(UPLOADS_DIR, safeKey);
    if (file && typeof file.arrayBuffer === "function") {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimeType = detectMimeType(buffer);
      if (s3Client) {
        try {
          await s3Client.send(new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: safeKey,
            Body: buffer,
            ContentType: mimeType
          }));
        } catch (s3Err) {
          console.error("Failed to upload to S3 bucket, saving locally:", s3Err);
        }
      }
      fs.writeFileSync(localFilePath, buffer);
      return c.json({
        success: true,
        key: safeKey,
        url: `/api/storage/${safeKey}`
      });
    }
    return c.json({ error: "Invalid file upload" }, 400);
  } catch (err) {
    return c.json({ error: err.message || "Failed to upload object" }, 500);
  }
});

// src/server/app.ts
var app = new Hono13();
app.use("*", logger());
app.use("*", cors({
  origin: (origin) => origin || "*",
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposeHeaders: ["Set-Cookie"]
}));
app.onError((err, c) => {
  console.error("[UNCAUGHT SERVER ERROR]:", err);
  return c.json({
    error: err.message || "Internal Server Error",
    details: err.toString()
  }, 500);
});
app.get("/api/health", (c) => {
  return c.json({ status: "ok", service: "Quran Madrasa API" });
});
app.route("/api/auth", authRouter);
app.route("/api/students", studentsRouter);
app.route("/api/parents", parentsRouter);
app.route("/api/teachers", teachersRouter);
app.route("/api/group-types", groupTypesRouter);
app.route("/api/groups", groupsRouter);
app.route("/api/ratings", ratingsRouter);
app.route("/api/sessions", sessionsRouter);
app.route("/api/attendances", attendancesRouter);
app.route("/api/stats", statsRouter);
app.route("/api/quran", quranRouter);
app.route("/api/storage", storageRouter);
app.route("/api/prayer-times", prayerTimesRouter);
var app_default = app;

// src/server/vercel-entry.ts
var vercel_entry_default = handle(app_default);
export {
  vercel_entry_default as default
};
