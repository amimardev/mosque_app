import { OperationRegistry } from '../operationRegistry.js';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

export const storageRouter = new OperationRegistry();

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

export async function getStorageImageResponse(key: string): Promise<Response> {
  const safeKey = key.replace(/[^a-zA-Z0-9_.-]/g, '');
  if (!safeKey || safeKey !== key) {
    return new Response('Invalid storage key', { status: 400 });
  }
  if (!s3Client) {
    return new Response('Object storage is not configured', { status: 503 });
  }

  try {
    const object = await s3Client.send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: safeKey }));
    if (!object.Body) return new Response('Image not found', { status: 404 });

    const headers = new Headers({
      'Content-Type': object.ContentType || 'application/octet-stream',
      'Cache-Control': 'private, max-age=300',
      'X-Content-Type-Options': 'nosniff',
    });
    if (object.ContentLength !== undefined) headers.set('Content-Length', String(object.ContentLength));
    if (object.ETag) headers.set('ETag', object.ETag);
    if (object.LastModified) headers.set('Last-Modified', object.LastModified.toUTCString());

    return new Response(object.Body.transformToWebStream() as ReadableStream<Uint8Array>, { headers });
  } catch (error) {
    if (isMissingObject(error)) return new Response('Image not found', { status: 404 });
    console.error('Failed to read image from object storage:', error);
    return new Response('Unable to load image', { status: 502 });
  }
}

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
  let buffer: Buffer | null = null;
  let mimeType = 'image/svg+xml';

  if (s3Client) {
    try {
      const response = await s3Client.send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: safeKey }));
      if (response.Body) {
        buffer = Buffer.from(await response.Body.transformToByteArray());
        mimeType = response.ContentType || detectMimeType(buffer);
      }
    } catch (error) {
      if (!isMissingObject(error)) throw error;
    }
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

  // Read stored images from object storage only.
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

        c.header('Content-Type', mimeType);
        c.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        c.header('Pragma', 'no-cache');
        c.header('Expires', '0');
        return c.body(buffer);
      }
    } catch (error) {
      if (!isMissingObject(error)) throw error;
    }
  }

  // Fallback SVG badge for objects that have not been uploaded.
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
    if (!s3Client) {
      return c.json({ error: 'Object storage is not configured' }, 503);
    }

    const body = await c.req.parseBody();
    const key = body.key as string;
    const file = body.file as File | { base64?: string };

    if (!key) {
      return c.json({ error: 'Storage key is required (e.g., student-id or teacher-id)' }, 400);
    }

    const safeKey = key.replace(/[^a-zA-Z0-9_\-.]/g, '');

    if (file && (typeof (file as File).arrayBuffer === 'function' || typeof (file as { base64?: string }).base64 === 'string')) {
      const buffer = typeof (file as { base64?: string }).base64 === 'string'
        ? Buffer.from((file as { base64: string }).base64, 'base64')
        : Buffer.from(await (file as File).arrayBuffer());
      const mimeType = detectMimeType(buffer);

      await s3Client.send(new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: safeKey,
        Body: buffer,
        ContentType: mimeType,
      }));

      return c.json({ 
        success: true, 
        key: safeKey, 
        url: `/api/storage/${safeKey}?v=${Date.now()}`
      });
    }

    return c.json({ error: 'Invalid file upload' }, 400);
  } catch (err: any) {
    return c.json({ error: err.message || 'Failed to upload object' }, 500);
  }
});

function isMissingObject(error: unknown) {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as { name?: string; Code?: string; $metadata?: { httpStatusCode?: number } };
  return candidate.name === 'NoSuchKey' || candidate.name === 'NotFound' || candidate.Code === 'NoSuchKey' || candidate.$metadata?.httpStatusCode === 404;
}
