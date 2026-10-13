import { createServerFn } from '@tanstack/react-start';
import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';
import { z } from 'zod';
import { getDuplicateNameWarning, getPhotoCropBounds } from '../studentDocumentUtils.js';

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const imageInput = z.object({
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
  imageBase64: z.string().min(1).max(Math.ceil(MAX_IMAGE_BYTES * 4 / 3) + 8),
});

const studentReview = z.object({
  name: z.string().nullable().default(null),
  dateOfBirth: z.string().nullable().default(null),
  gender: z.enum(['male', 'female']).nullable().default(null),
  level: z.enum(['primary', 'middle', 'secondary']).nullable().default(null),
  address: z.string().nullable().default(null),
  guardianPhone: z.string().nullable().default(null),
  photo_box_1000: z.array(z.number().int()).length(4).nullable().default(null),
});

const prompt = `Read this scanned student registration document. Return only JSON with keys:
name, dateOfBirth, gender, level, address, guardianPhone, photo_box_1000.
Use null for unreadable/missing values. Preserve the student's name and address in the script used on the document. dateOfBirth must be YYYY-MM-DD when readable. gender must be "male" or "female" when readable. Map study level to primary, middle, or secondary; use null if uncertain. guardianPhone is the parent/guardian phone, not the student's phone. photo_box_1000 is null when no student portrait exists; otherwise return [ymin,xmin,ymax,xmax] normalized to integers 0..1000 and covering only the portrait.`;

function decodeImage(imageBase64: string) {
  const bytes = Buffer.from(imageBase64, 'base64');
  if (!bytes.length || bytes.length > MAX_IMAGE_BYTES) throw new Error('الملف كبير جداً أو فارغ');
  return bytes;
}

function normalizeDate(value: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : value;
}

async function requireAdmin() {
  const { getRequestHeader } = await import('@tanstack/react-start/server');
  const { getSessionUserId } = await import('../session.js');
  const { getFullUserProfile } = await import('../authService.js');
  const userId = await getSessionUserId(getRequestHeader('cookie'));
  if (!userId) throw new Error('يرجى تسجيل الدخول بحساب إدارة المدرسة');
  const user = await getFullUserProfile(userId);
  if (user?.role !== 'admin') throw new Error('هذه العملية متاحة لإدارة المدرسة فقط');
}

export const extractStudentDocumentFn = createServerFn({ method: 'POST' })
  .validator(imageInput)
  .handler(async ({ data }) => {
    await requireAdmin();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY غير مضبوط على الخادم');

    const image = decodeImage(data.imageBase64);
    const imageMetadata = await sharp(image).metadata();
    const expectedFormat = { 'image/jpeg': 'jpeg', 'image/png': 'png', 'image/webp': 'webp' }[data.mimeType];
    if (!imageMetadata.width || !imageMetadata.height || imageMetadata.format !== expectedFormat) {
      throw new Error('صيغة صورة الوثيقة غير صالحة');
    }
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      contents: [{
        role: 'user',
        parts: [
          { text: prompt },
          { inlineData: { mimeType: data.mimeType, data: image.toString('base64') } },
        ],
      }],
      config: { responseMimeType: 'application/json' },
    });

    const raw = response.text;
    if (!raw) throw new Error('لم يتمكن Gemini من قراءة بيانات الوثيقة');
    let parsed: z.infer<typeof studentReview>;
    try {
      parsed = studentReview.parse(JSON.parse(raw));
    } catch {
      throw new Error('تعذر فهم البيانات المستخرجة. أعد المسح أو أدخل البيانات يدوياً');
    }

    let profileImage: { mimeType: 'image/jpeg'; imageBase64: string } | null = null;
    const warnings: string[] = [];
    if (parsed.photo_box_1000) {
      try {
        const metadata = await sharp(image).metadata();
        if (!metadata.width || !metadata.height) throw new Error('Invalid image dimensions');
        const crop = getPhotoCropBounds(parsed.photo_box_1000, metadata.width, metadata.height);
        if (!crop) throw new Error('Invalid photo bounds');
        const cropped = await sharp(image).extract(crop).jpeg({ quality: 88 }).toBuffer();
        profileImage = { mimeType: 'image/jpeg', imageBase64: cropped.toString('base64') };
      } catch (error) {
        console.warn('Unable to crop student portrait:', error);
        warnings.push('لم نتمكن من قص الصورة الشخصية تلقائياً؛ يمكنك اختيار صورة يدوياً.');
      }
    } else {
      warnings.push('لم يتم العثور على صورة شخصية واضحة في الوثيقة.');
    }

    const { photo_box_1000: _photoBox, ...fields } = parsed;
    if (!fields.name?.trim()) warnings.push('تعذر قراءة اسم الطالب؛ أدخله يدوياً.');
    if (!fields.level) warnings.push('المستوى غير واضح؛ اختر المستوى الصحيح يدوياً.');
    if (!fields.gender) warnings.push('جنس الطالب غير واضح؛ اختره يدوياً.');
    const dateOfBirth = normalizeDate(fields.dateOfBirth);
    if (fields.dateOfBirth && !dateOfBirth) warnings.push('تاريخ الميلاد غير واضح؛ أدخله يدوياً.');
    return { student: { ...fields, dateOfBirth }, profileImage, warnings };
  });

const createInput = z.object({
  student: z.object({
    name: z.string().trim().min(1).max(200),
    dateOfBirth: z.string().nullable().optional(),
    gender: z.enum(['male', 'female']),
    level: z.enum(['primary', 'middle', 'secondary']),
    address: z.string().max(500).nullable().optional(),
    guardianPhone: z.string().max(40).nullable().optional(),
    notes: z.string().max(2000).nullable().optional(),
  }),
  profileImage: z.object({ mimeType: z.literal('image/jpeg'), imageBase64: z.string().max(Math.ceil(MAX_IMAGE_BYTES * 4 / 3) + 8) }).nullable().optional(),
  allowDuplicate: z.boolean().default(false),
});

export const createScannedStudentFn = createServerFn({ method: 'POST' })
  .validator(createInput)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { db } = await import('../../db/index.js');
    const schema = await import('../../db/schema.js');
    const { ensureDatabaseInitialized } = await import('../../db/init.js');
    const { eq } = await import('drizzle-orm');
    const { uploadStorageImage } = await import('../operations/storage.js');
    await ensureDatabaseInitialized();

    const allStudents = await db.select({ id: schema.students.id, name: schema.students.name }).from(schema.students);
    const duplicateWarning = getDuplicateNameWarning(data.student.name, allStudents, data.allowDuplicate);
    if (duplicateWarning) {
      return { status: 'duplicate' as const, matches: duplicateWarning.map(({ id, name }) => ({ id, name })) };
    }

    const id = `std_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    let parentId: string | null = null;
    const guardianPhone = data.student.guardianPhone?.replace(/[\s()-]/g, '');
    if (guardianPhone) {
      const parentRows = await db.select({ id: schema.parents.id, userId: schema.parents.userId }).from(schema.parents);
      const linkedUserIds = parentRows.map((parent) => parent.userId).filter((value): value is string => !!value);
      if (linkedUserIds.length) {
        const users = await db.select({ id: schema.users.id, phone: schema.users.phone }).from(schema.users);
        const userId = users.find((user) => user.phone?.replace(/[\s()-]/g, '') === guardianPhone)?.id;
        const matchedParent = parentRows.find((parent) => parent.userId === userId);
        parentId = matchedParent?.id || null;
        if (parentId && data.student.address?.trim()) {
          await db.update(schema.parents).set({ address: data.student.address.trim() }).where(eq(schema.parents.id, parentId));
        }
      }
    }

    let avatar = `/api/storage/student-${id}`;
    if (data.profileImage) {
      const photo = decodeImage(data.profileImage.imageBase64);
      await uploadStorageImage(`student-${id}`, photo, data.profileImage.mimeType);
      avatar = `/api/storage/student-${id}?v=${Date.now()}`;
    }

    const birthDate = data.student.dateOfBirth || null;
    await db.insert(schema.students).values({
      id,
      name: data.student.name.trim(),
      avatar,
      gender: data.student.gender,
      dateOfBirth: birthDate,
      age: birthDate,
      parentId,
      phone: null,
      groupId: null,
      level: data.student.level,
      notes: data.student.notes?.trim() || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      status: 'created' as const,
      parentLinked: !!parentId,
      parentDataNotLinked: !parentId && !!(guardianPhone || data.student.address?.trim()),
    };
  });
