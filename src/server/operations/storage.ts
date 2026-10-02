import { OperationRegistry } from '../operationRegistry.js';
import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

export const storageRouter = new OperationRegistry();

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Ensure local uploads folder exists as cache / fallback
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initialize S3 client if AWS / Neon Object Storage credentials exist in environment
const hasS3Config = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_S3_BUCKET);

const s3Client = hasS3Config ? new S3Client({
  region: process.env.AWS_REGION || 'eu-central-1',
  endpoint: process.env.AWS_ENDPOINT_URL_S3 || undefined,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
}) : null;

const S3_BUCKET = process.env.AWS_S3_BUCKET || 'uploads';

function detectMimeType(buffer: Buffer): string {
  if (buffer.length > 8) {
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
      return 'image/png';
    } else if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
      return 'image/jpeg';
    } else if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
      return 'image/gif';
    } else if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
      return 'image/webp';
    } else if (buffer.toString('utf8', 0, 100).includes('<svg')) {
      return 'image/svg+xml';
    }
  }
  return 'image/jpeg';
}

export async function getStorageDataUrl(key: string): Promise<string> {
  const safeKey = key.replace(/[^a-zA-Z0-9_\-.]/g, '');
  const localFilePath = path.join(UPLOADS_DIR, safeKey);
  let buffer: Buffer | null = null;
  let mimeType = 'image/svg+xml';

  if (s3Client) {
    try {
      const response = await s3Client.send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: safeKey }));
      if (response.Body) {
        buffer = Buffer.from(await response.Body.transformToByteArray());
        mimeType = response.ContentType || detectMimeType(buffer);
        fs.writeFile(localFilePath, buffer, () => {});
      }
    } catch {
      // Use the local cache or generated placeholder below.
    }
  }

  if (!buffer && fs.existsSync(localFilePath) && fs.statSync(localFilePath).isFile()) {
    buffer = fs.readFileSync(localFilePath);
    mimeType = detectMimeType(buffer);
  }

  if (!buffer) {
    const isTeacher = safeKey.startsWith('teacher-') || safeKey.startsWith('tch_');
    const label = safeKey.replace(/^(student-|teacher-|std_|tch_)/, '').substring(0, 6).toUpperCase();
    const bgColor = isTeacher ? '#0f766e' : '#047857';
    const iconSymbol = isTeacher ? '👨‍🏫' : '🎓';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="64" fill="${bgColor}"/><text x="64" y="60" text-anchor="middle" font-size="42" dominant-baseline="central">${iconSymbol}</text><text x="64" y="100" text-anchor="middle" font-size="14" font-family="sans-serif" font-weight="bold" fill="#ffffff">${label}</text></svg>`;
    buffer = Buffer.from(svg);
  }

  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

// GET object by key: e.g. /api/storage/student-std_1 or /api/storage/teacher-tch_1
storageRouter.get('/:key', async (c) => {
  const key = c.req.param('key');
  
  // Sanitization
  const safeKey = key.replace(/[^a-zA-Z0-9_\-.]/g, '');
  const localFilePath = path.join(UPLOADS_DIR, safeKey);

  // 1. Try fetching from Neon S3 Object Storage bucket
  if (s3Client) {
    try {
      const s3Res = await s3Client.send(new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: safeKey,
      }));

      if (s3Res.Body) {
        const bytes = await s3Res.Body.transformToByteArray();
        const buffer = Buffer.from(bytes);
        const mimeType = s3Res.ContentType || detectMimeType(buffer);

        // Cache locally for fast subsequent reads
        fs.writeFile(localFilePath, buffer, () => {});

        c.header('Content-Type', mimeType);
        c.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        c.header('Pragma', 'no-cache');
        c.header('Expires', '0');
        return c.body(buffer);
      }
    } catch {
      // Fall through to local cache or fallback SVG
    }
  }

  // 2. Check local uploads cache
  if (fs.existsSync(localFilePath) && fs.statSync(localFilePath).isFile()) {
    const fileBuffer = fs.readFileSync(localFilePath);
    const mimeType = detectMimeType(fileBuffer);
    
    c.header('Content-Type', mimeType);
    c.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    c.header('Pragma', 'no-cache');
    c.header('Expires', '0');
    return c.body(fileBuffer);
  }

  // 3. Fallback SVG badge representing student-{id} or teacher-{id}
  const isTeacher = safeKey.startsWith('teacher-') || safeKey.startsWith('tch_');
  const label = safeKey.replace(/^(student-|teacher-|std_|tch_)/, '').substring(0, 6).toUpperCase();
  
  const bgColor = isTeacher ? '#0f766e' : '#047857';
  const iconSymbol = isTeacher ? '👨‍🏫' : '🎓';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="64" fill="${bgColor}" />
    <text x="64" y="60" text-anchor="middle" font-size="42" dominant-baseline="central">${iconSymbol}</text>
    <text x="64" y="100" text-anchor="middle" font-size="14" font-family="sans-serif" font-weight="bold" fill="#ffffff">${label}</text>
  </svg>`;

  c.header('Content-Type', 'image/svg+xml');
  c.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  c.header('Pragma', 'no-cache');
  c.header('Expires', '0');
  return c.body(svg);
});

// POST upload object: /api/storage/upload (key = student-{id} or teacher-{id})
storageRouter.post('/upload', async (c) => {
  try {
    const body = await c.req.parseBody();
    const key = body.key as string;
    const file = body.file as File | { base64?: string };

    if (!key) {
      return c.json({ error: 'Storage key is required (e.g., student-id or teacher-id)' }, 400);
    }

    const safeKey = key.replace(/[^a-zA-Z0-9_\-.]/g, '');
    const localFilePath = path.join(UPLOADS_DIR, safeKey);

    if (file && (typeof (file as File).arrayBuffer === 'function' || typeof (file as { base64?: string }).base64 === 'string')) {
      const buffer = typeof (file as { base64?: string }).base64 === 'string'
        ? Buffer.from((file as { base64: string }).base64, 'base64')
        : Buffer.from(await (file as File).arrayBuffer());
      const mimeType = detectMimeType(buffer);

      // 1. Upload to Neon S3 Object Storage bucket
      if (s3Client) {
        try {
          await s3Client.send(new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: safeKey,
            Body: buffer,
            ContentType: mimeType,
          }));
        } catch (s3Err) {
          console.error('Failed to upload to S3 bucket, saving locally:', s3Err);
        }
      }

      // 2. Also save to local uploads directory
      fs.writeFileSync(localFilePath, buffer);

      return c.json({ 
        success: true, 
        key: safeKey, 
        url: `/api/storage/${safeKey}` 
      });
    }

    return c.json({ error: 'Invalid file upload' }, 400);
  } catch (err: any) {
    return c.json({ error: err.message || 'Failed to upload object' }, 500);
  }
});
