import { n as OperationRegistry } from "./api-CjBBtC3c.mjs";
import { n as GetObjectCommand, r as S3Client, t as PutObjectCommand } from "../_libs/@aws-sdk/client-s3+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/storage-B1BjdWQX.js
var storageRouter = new OperationRegistry();
var s3Client = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_S3_BUCKET) ? new S3Client({
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
		if (buffer[0] === 137 && buffer[1] === 80 && buffer[2] === 78 && buffer[3] === 71) return "image/png";
		else if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) return "image/jpeg";
		else if (buffer[0] === 71 && buffer[1] === 73 && buffer[2] === 70) return "image/gif";
		else if (buffer[0] === 82 && buffer[1] === 73 && buffer[2] === 70 && buffer[3] === 70) return "image/webp";
		else if (buffer.toString("utf8", 0, 100).includes("<svg")) return "image/svg+xml";
	}
	return "image/jpeg";
}
async function getStorageDataUrl(key) {
	const safeKey = key.replace(/[^a-zA-Z0-9_\-.]/g, "");
	let buffer = null;
	let mimeType = "image/svg+xml";
	if (s3Client) try {
		const response = await s3Client.send(new GetObjectCommand({
			Bucket: S3_BUCKET,
			Key: safeKey
		}));
		if (response.Body) {
			buffer = Buffer.from(await response.Body.transformToByteArray());
			mimeType = response.ContentType || detectMimeType(buffer);
		}
	} catch (error) {
		if (!isMissingObject(error)) throw error;
	}
	if (!buffer) {
		const isTeacher = safeKey.startsWith("teacher-") || safeKey.startsWith("tch_");
		const label = safeKey.replace(/^(student-|teacher-|std_|tch_)/, "").substring(0, 6).toUpperCase();
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="64" fill="${isTeacher ? "#0f766e" : "#047857"}"/><text x="64" y="60" text-anchor="middle" font-size="42" dominant-baseline="central">${isTeacher ? "👨‍🏫" : "🎓"}</text><text x="64" y="100" text-anchor="middle" font-size="14" font-family="sans-serif" font-weight="bold" fill="#ffffff">${label}</text></svg>`;
		buffer = Buffer.from(svg);
	}
	return `data:${mimeType};base64,${buffer.toString("base64")}`;
}
storageRouter.get("/:key", async (c) => {
	const safeKey = c.req.param("key").replace(/[^a-zA-Z0-9_\-.]/g, "");
	if (s3Client) try {
		const s3Res = await s3Client.send(new GetObjectCommand({
			Bucket: S3_BUCKET,
			Key: safeKey
		}));
		if (s3Res.Body) {
			const bytes = await s3Res.Body.transformToByteArray();
			const buffer = Buffer.from(bytes);
			const mimeType = s3Res.ContentType || detectMimeType(buffer);
			c.header("Content-Type", mimeType);
			c.header("Cache-Control", "no-cache, no-store, must-revalidate");
			c.header("Pragma", "no-cache");
			c.header("Expires", "0");
			return c.body(buffer);
		}
	} catch (error) {
		if (!isMissingObject(error)) throw error;
	}
	const isTeacher = safeKey.startsWith("teacher-") || safeKey.startsWith("tch_");
	const label = safeKey.replace(/^(student-|teacher-|std_|tch_)/, "").substring(0, 6).toUpperCase();
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="64" fill="${isTeacher ? "#0f766e" : "#047857"}" />
    <text x="64" y="60" text-anchor="middle" font-size="42" dominant-baseline="central">${isTeacher ? "👨‍🏫" : "🎓"}</text>
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
		if (!s3Client) return c.json({ error: "Object storage is not configured" }, 503);
		const body = await c.req.parseBody();
		const key = body.key;
		const file = body.file;
		if (!key) return c.json({ error: "Storage key is required (e.g., student-id or teacher-id)" }, 400);
		const safeKey = key.replace(/[^a-zA-Z0-9_\-.]/g, "");
		if (file && (typeof file.arrayBuffer === "function" || typeof file.base64 === "string")) {
			const buffer = typeof file.base64 === "string" ? Buffer.from(file.base64, "base64") : Buffer.from(await file.arrayBuffer());
			const mimeType = detectMimeType(buffer);
			await s3Client.send(new PutObjectCommand({
				Bucket: S3_BUCKET,
				Key: safeKey,
				Body: buffer,
				ContentType: mimeType
			}));
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
function isMissingObject(error) {
	if (!error || typeof error !== "object") return false;
	const candidate = error;
	return candidate.name === "NoSuchKey" || candidate.name === "NotFound" || candidate.Code === "NoSuchKey" || candidate.$metadata?.httpStatusCode === 404;
}
//#endregion
export { getStorageDataUrl, storageRouter };
