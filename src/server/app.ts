import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { authRouter } from './routes/auth';
import { studentsRouter } from './routes/students';
import { parentsRouter } from './routes/parents';
import { teachersRouter } from './routes/teachers';
import { groupsRouter } from './routes/groups';
import { groupTypesRouter } from './routes/groupTypes';
import { ratingsRouter } from './routes/ratings';
import { sessionsRouter } from './routes/sessions';
import { attendancesRouter } from './routes/attendances';
import { statsRouter, quranRouter } from './routes/stats';
import { storageRouter } from './routes/storage';
import { prayerTimesRouter } from './routes/prayerTimes';

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
