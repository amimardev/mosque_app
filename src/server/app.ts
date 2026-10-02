import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { authRouter } from './routes/auth.js';
import { studentsRouter } from './routes/students.js';
import { parentsRouter } from './routes/parents.js';
import { teachersRouter } from './routes/teachers.js';
import { groupsRouter } from './routes/groups.js';
import { groupTypesRouter } from './routes/groupTypes.js';
import { ratingsRouter } from './routes/ratings.js';
import { sessionsRouter } from './routes/sessions.js';
import { attendancesRouter } from './routes/attendances.js';
import { statsRouter, quranRouter } from './routes/stats.js';
import { storageRouter } from './routes/storage.js';
import { prayerTimesRouter } from './routes/prayerTimes.js';

export const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: (origin) => origin || '*',
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposeHeaders: ['Set-Cookie']
}));

// Global Error Handler
app.onError((err, c) => {
  console.error('[UNCAUGHT SERVER ERROR]:', err);
  return c.json({
    error: err.message || 'Internal Server Error',
    details: err.toString()
  }, 500);
});

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', service: 'Quran Madrasa API' });
});

// Mount Madrasa routes
app.route('/api/auth', authRouter);
app.route('/api/students', studentsRouter);
app.route('/api/parents', parentsRouter);
app.route('/api/teachers', teachersRouter);
app.route('/api/group-types', groupTypesRouter);
app.route('/api/groups', groupsRouter);
app.route('/api/ratings', ratingsRouter);
app.route('/api/sessions', sessionsRouter);
app.route('/api/attendances', attendancesRouter);
app.route('/api/stats', statsRouter);
app.route('/api/quran', quranRouter);
app.route('/api/storage', storageRouter);
app.route('/api/prayer-times', prayerTimesRouter);

export default app;
