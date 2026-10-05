import { pgTable, text, integer, doublePrecision, jsonb, timestamp, boolean } from 'drizzle-orm/pg-core';
import type { GroupSessionTime } from '../types';

export const teachers = pgTable('teachers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  avatar: text('avatar').notNull(),
  specialization: text('specialization').default('Tajweed & Hifz').notNull(),
  bio: text('bio'),
  status: text('status').default('active').notNull(), // 'active' | 'on_leave'
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  isAdmin: boolean('is_admin').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const groupTypes = pgTable('group_types', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const groups = pgTable('groups', {
  id: text('id').primaryKey(),
  number: integer('number').notNull(),
  typeId: text('type_id').notNull().references(() => groupTypes.id, { onDelete: 'cascade' }),
  gender: text('gender').default('male').notNull(), // 'male' | 'female'
  sessionTime: jsonb('session_time').$type<GroupSessionTime>(),
  studyTime: text('study_time').notNull(), // e.g., "السبت، الاثنين • من بعد صلاة العصر إلى المغرب"
  days: jsonb('days').$type<string[]>().default([]).notNull(),
  timeSlot: text('time_slot'), // e.g., "16:30 - 18:00"
  room: text('room').default('Main Halaqa Hall'),
  capacity: integer('capacity').default(20).notNull(),
  level: text('level').default('Intermediate').notNull(), // 'Beginner' | 'Intermediate' | 'Advanced Hifz' | 'Ijazah'
  status: text('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const groupTeachers = pgTable('group_teachers', {
  id: text('id').primaryKey(),
  groupId: text('group_id').notNull().references(() => groups.id, { onDelete: 'cascade' }),
  teacherId: text('teacher_id').notNull().references(() => teachers.id, { onDelete: 'cascade' }),
  role: text('role').default('lead').notNull(), // 'lead' | 'assistant'
  assignedAt: timestamp('assigned_at').defaultNow().notNull(),
});

export const parents = pgTable('parents', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  address: text('address'),
  notes: text('notes'),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const students = pgTable('students', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  avatar: text('avatar').notNull(),
  gender: text('gender').default('male').notNull(), // 'male' | 'female'
  dateOfBirth: text('date_of_birth'),
  age: text('age'), // Stored as a date string (YYYY-MM-DD), real displayed age is calculated dynamically
  parentId: text('parent_id').references(() => parents.id, { onDelete: 'set null' }),
  email: text('email'),
  groupId: text('group_id').references(() => groups.id, { onDelete: 'set null' }),
  currentSurahNumber: integer('current_surah_number').default(1).notNull(),
  currentSurahName: text('current_surah_name').default('Al-Fatihah').notNull(),
  currentAyah: integer('current_ayah').default(1).notNull(),
  targetJuz: integer('target_juz').default(30),
  memorizedJuzCount: integer('memorized_juz_count').default(1).notNull(),
  status: text('status').default('active').notNull(), // 'active' | 'graduated' | 'paused'
  enrollmentDate: text('enrollment_date'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const studentRatings = pgTable('student_ratings', {
  id: text('id').primaryKey(),
  studentId: text('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  teacherId: text('teacher_id').references(() => teachers.id, { onDelete: 'set null' }),
  groupId: text('group_id').references(() => groups.id, { onDelete: 'set null' }),
  month: text('month').notNull(), // e.g. "2026-09" or "September 2026"
  hifzScore: integer('hifz_score').default(90).notNull(), // 0 - 100
  tajweedScore: integer('tajweed_score').default(85).notNull(), // 0 - 100
  murajaahScore: integer('murajaah_score').default(88).notNull(), // 0 - 100 (Revision)
  attendanceScore: integer('attendance_score').default(95).notNull(), // 0 - 100
  behaviorScore: integer('behavior_score').default(100).notNull(), // 0 - 100
  overallScore: integer('overall_score').default(90).notNull(), // 0 - 100
  grade: text('grade').default('Mumtaz (Excellent)').notNull(),
  surahEvaluated: text('surah_evaluated'),
  ayahStart: integer('ayah_start'),
  ayahEnd: integer('ayah_end'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password'),
  role: text('role').default('admin').notNull(),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const attendances = pgTable('attendances', {
  id: text('id').primaryKey(),
  studentId: text('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  groupId: text('group_id').notNull().references(() => groups.id, { onDelete: 'cascade' }),
  groupTypeName: text('group_type_name'),
  groupNumber: integer('group_number'),
  date: text('date').notNull(), // YYYY-MM-DD
  sessionTimeText: text('session_time_text'), // e.g., "من صلاة العصر إلى صلاة المغرب"
  status: text('status').default('absent').notNull(), // 'absent' | 'present' | 'late' | 'excused'
  reason: text('reason'),
  recordedByTeacherId: text('recorded_by_teacher_id').references(() => teachers.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  groupId: text('group_id').notNull().references(() => groups.id, { onDelete: 'cascade' }),
  teacherId: text('teacher_id').references(() => teachers.id, { onDelete: 'set null' }),
  sessionType: text('session_type').default('main').notNull(), // 'main' | 'exception'
  date: text('date').notNull(), // YYYY-MM-DD
  startTime: text('start_time'),
  endTime: text('end_time'),
  sessionTimeText: text('session_time_text'),
  status: text('status').default('scheduled').notNull(), // 'scheduled' | 'completed' | 'cancelled'
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessionStudentRecords = pgTable('session_student_records', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull().references(() => sessions.id, { onDelete: 'cascade' }),
  studentId: text('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  attendanceStatus: text('attendance_status').default('absent').notNull(), // 'present' | 'absent' | 'late' | 'excused'
  absenceReason: text('absence_reason'),
  surahNumber: integer('surah_number'),
  surahName: text('surah_name'),
  ayahStart: integer('ayah_start'),
  ayahEnd: integer('ayah_end'),
  teacherRemarque: text('teacher_remarque'),
  isAssessed: boolean('is_assessed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const authSessions = pgTable('auth_sessions', {
  tokenHash: text('token_hash').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  studentId: text('student_id').references(() => students.id, { onDelete: 'cascade' }),
  sessionId: text('session_id').references(() => sessions.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  href: text('href'),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
