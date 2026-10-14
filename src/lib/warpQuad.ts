export interface Point {
  x: number;
  y: number;
}

export interface BoundingBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Solve 8x8 linear equation system A * x = B using Gaussian elimination with partial pivoting.
 */
export function solve8x8(A: number[][], B: number[]): number[] | null {
  const n = 8;
  const M: number[][] = A.map((row, i) => [...row, B[i]]);

  for (let col = 0; col < n; col++) {
    // Find pivot
    let maxRow = col;
    let maxVal = Math.abs(M[col][col]);
    for (let r = col + 1; r < n; r++) {
      const val = Math.abs(M[r][col]);
      if (val > maxVal) {
        maxVal = val;
        maxRow = r;
      }
    }
    if (maxVal < 1e-10) return null; // Singular matrix

    // Swap rows
    if (maxRow !== col) {
      const temp = M[col];
      M[col] = M[maxRow];
      M[maxRow] = temp;
    }

    // Eliminate column entries below pivot
    for (let r = col + 1; r < n; r++) {
      const factor = M[r][col] / M[col][col];
      for (let c = col; c <= n; c++) {
        M[r][c] -= factor * M[col][c];
      }
    }
  }

  // Back-substitution
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) {
    let sum = M[r][n];
    for (let c = r + 1; c < n; c++) {
      sum -= M[r][c] * x[c];
    }
    x[r] = sum / M[r][r];
  }

  return x;
}

/**
 * Compute the 3x3 homography matrix mapping output coordinates (u, v) -> source coordinates (x, y).
 * Source quad points: p0 (TL), p1 (TR), p2 (BR), p3 (BL).
 * Destination quad: (0,0), (outW,0), (outW,outH), (0,outH).
 */
export function getHomographyMatrix(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  outW: number,
  outH: number,
): number[] | null {
  const destPts: Point[] = [
    { x: 0, y: 0 },
    { x: outW, y: 0 },
    { x: outW, y: outH },
    { x: 0, y: outH },
  ];
  const srcPts: Point[] = [p0, p1, p2, p3];

  const A: number[][] = [];
  const B: number[] = [];

  for (let i = 0; i < 4; i++) {
    const u = destPts[i].x;
    const v = destPts[i].y;
    const x = srcPts[i].x;
    const y = srcPts[i].y;

    A.push([u, v, 1, 0, 0, 0, -u * x, -v * x]);
    B.push(x);

    A.push([0, 0, 0, u, v, 1, -u * y, -v * y]);
    B.push(y);
  }

  const h = solve8x8(A, B);
  if (!h) return null;
  // h = [h00, h01, h02, h10, h11, h12, h20, h21] with h22 = 1
  return [...h, 1];
}

function dist(p1: Point, p2: Point) {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

/**
 * Cap image dimensions so the longest side is <= maxDim (default 2000px).
 */
function getConstrainedCanvas(
  img: HTMLImageElement | ImageBitmap,
  maxDim = 2000,
): { canvas: HTMLCanvasElement; scale: number; width: number; height: number } {
  const origW = img instanceof HTMLImageElement ? img.naturalWidth : img.width;
  const origH = img instanceof HTMLImageElement ? img.naturalHeight : img.height;

  const scale = Math.min(1, maxDim / Math.max(origW, origH));
  const w = Math.max(1, Math.round(origW * scale));
  const h = Math.max(1, Math.round(origH * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get 2D canvas context');
  ctx.drawImage(img, 0, 0, w, h);

  return { canvas, scale, width: w, height: h };
}

/**
 * Warp a quadrilateral region from an image into a rectangular canvas.
 *
 * @param img Source image element or ImageBitmap.
 * @param pts 4 corners ordered: [TL, TR, BR, BL] in a 0..1000 virtual coordinate space.
 * @returns HTMLCanvasElement containing the warped/cropped result.
 */
export function warpQuad(
  img: HTMLImageElement | ImageBitmap,
  pts: Point[],
): HTMLCanvasElement {
  if (pts.length !== 4) {
    throw new Error('warpQuad requires exactly 4 corner points: [TL, TR, BR, BL]');
  }

  // Constrain image size to at most 2000px to avoid heavy memory/CPU overhead
  const { canvas: srcCanvas, scale, width: srcW, height: srcH } = getConstrainedCanvas(img, 2000);
  const srcCtx = srcCanvas.getContext('2d')!;

  // Scale virtual (0..1000) coordinates to current image pixel coordinates
  const p0: Point = { x: (pts[0].x / 1000) * srcW, y: (pts[0].y / 1000) * srcH };
  const p1: Point = { x: (pts[1].x / 1000) * srcW, y: (pts[1].y / 1000) * srcH };
  const p2: Point = { x: (pts[2].x / 1000) * srcW, y: (pts[2].y / 1000) * srcH };
  const p3: Point = { x: (pts[3].x / 1000) * srcW, y: (pts[3].y / 1000) * srcH };

  // Check if coordinates form an axis-aligned bounding box (within 1.5px tolerance)
  const isAxisAligned =
    Math.abs(p0.y - p1.y) <= 1.5 &&
    Math.abs(p3.y - p2.y) <= 1.5 &&
    Math.abs(p0.x - p3.x) <= 1.5 &&
    Math.abs(p1.x - p2.x) <= 1.5;

  if (isAxisAligned) {
    const minX = Math.max(0, Math.min(srcW - 1, Math.round(Math.min(p0.x, p3.x))));
    const minY = Math.max(0, Math.min(srcH - 1, Math.round(Math.min(p0.y, p1.y))));
    const maxX = Math.max(minX + 1, Math.min(srcW, Math.round(Math.max(p1.x, p2.x))));
    const maxY = Math.max(minY + 1, Math.min(srcH, Math.round(Math.max(p3.y, p2.y))));
    const cropW = maxX - minX;
    const cropH = maxY - minY;

    const outCanvas = document.createElement('canvas');
    outCanvas.width = cropW;
    outCanvas.height = cropH;
    const outCtx = outCanvas.getContext('2d')!;
    outCtx.drawImage(srcCanvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
    return outCanvas;
  }

  // Calculate output dimensions
  const topEdge = dist(p0, p1);
  const bottomEdge = dist(p3, p2);
  const leftEdge = dist(p0, p3);
  const rightEdge = dist(p1, p2);

  const outW = Math.max(1, Math.round(Math.max(topEdge, bottomEdge)));
  const outH = Math.max(1, Math.round(Math.max(leftEdge, rightEdge)));

  const H = getHomographyMatrix(p0, p1, p2, p3, outW, outH);
  if (!H) {
    throw new Error('Failed to compute homography matrix for quad');
  }

  const outCanvas = document.createElement('canvas');
  outCanvas.width = outW;
  outCanvas.height = outH;
  const outCtx = outCanvas.getContext('2d')!;

  const srcImageData = srcCtx.getImageData(0, 0, srcW, srcH);
  const srcData = srcImageData.data;
  const outImageData = outCtx.createImageData(outW, outH);
  const outData = outImageData.data;

  const [h00, h01, h02, h10, h11, h12, h20, h21] = H;

  // Inverse-map each output pixel with bilinear interpolation
  for (let v = 0; v < outH; v++) {
    for (let u = 0; u < outW; u++) {
      const denom = h20 * u + h21 * v + 1.0;
      if (denom === 0) continue;

      const sx = (h00 * u + h01 * v + h02) / denom;
      const sy = (h10 * u + h11 * v + h12) / denom;

      if (sx < 0 || sx >= srcW - 1 || sy < 0 || sy >= srcH - 1) {
        continue;
      }

      const x0 = Math.floor(sx);
      const y0 = Math.floor(sy);
      const x1 = x0 + 1;
      const y1 = y0 + 1;

      const dx = sx - x0;
      const dy = sy - y0;
      const w00 = (1 - dx) * (1 - dy);
      const w10 = dx * (1 - dy);
      const w01 = (1 - dx) * dy;
      const w11 = dx * dy;

      const i00 = (y0 * srcW + x0) * 4;
      const i10 = (y0 * srcW + x1) * 4;
      const i01 = (y1 * srcW + x0) * 4;
      const i11 = (y1 * srcW + x1) * 4;

      const outIdx = (v * outW + u) * 4;
      outData[outIdx] = Math.round(
        w00 * srcData[i00] + w10 * srcData[i10] + w01 * srcData[i01] + w11 * srcData[i11]
      );
      outData[outIdx + 1] = Math.round(
        w00 * srcData[i00 + 1] + w10 * srcData[i10 + 1] + w01 * srcData[i01 + 1] + w11 * srcData[i11 + 1]
      );
      outData[outIdx + 2] = Math.round(
        w00 * srcData[i00 + 2] + w10 * srcData[i10 + 2] + w01 * srcData[i01 + 2] + w11 * srcData[i11 + 2]
      );
      outData[outIdx + 3] = 255;
    }
  }

  outCtx.putImageData(outImageData, 0, 0);
  return outCanvas;
}

/**
 * Crop an axis-aligned box [ymin, xmin, ymax, xmax] in 0..1000 virtual coordinates.
 */
export function cropBox(
  img: HTMLImageElement | ImageBitmap,
  box: [number, number, number, number],
): HTMLCanvasElement {
  const [ymin, xmin, ymax, xmax] = box;
  const srcW = img instanceof HTMLImageElement ? img.naturalWidth : img.width;
  const srcH = img instanceof HTMLImageElement ? img.naturalHeight : img.height;

  const left = Math.max(0, Math.min(srcW - 1, Math.round((xmin * srcW) / 1000)));
  const top = Math.max(0, Math.min(srcH - 1, Math.round((ymin * srcH) / 1000)));
  const right = Math.max(left + 1, Math.min(srcW, Math.round((xmax * srcW) / 1000)));
  const bottom = Math.max(top + 1, Math.min(srcH, Math.round((ymax * srcH) / 1000)));

  const width = right - left;
  const height = bottom - top;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to create canvas context');

  ctx.drawImage(img, left, top, width, height, 0, 0, width, height);
  return canvas;
}

/**
 * Crop student photo directly in the browser from a document Blob and [ymin, xmin, ymax, xmax] coordinates.
 * Respects EXIF orientation via createImageBitmap.
 */
export async function cropPhotoFromBlob(
  blob: Blob,
  box: number[],
  quality = 0.88,
): Promise<{ mimeType: 'image/jpeg'; imageBase64: string } | null> {
  if (!box || box.length !== 4) return null;
  const [ymin, xmin, ymax, xmax] = box;
  if (
    ![ymin, xmin, ymax, xmax].every(Number.isInteger) ||
    ymin < 0 ||
    xmin < 0 ||
    ymax > 1000 ||
    xmax > 1000 ||
    ymin >= ymax ||
    xmin >= xmax
  ) {
    return null;
  }

  const bitmap = await createImageBitmap(blob, { imageOrientation: 'from-image' });
  try {
    const canvas = cropBox(bitmap, [ymin, xmin, ymax, xmax]);
    const croppedBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', quality);
    });

    if (!croppedBlob) return null;

    const buffer = await croppedBlob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }

    return {
      mimeType: 'image/jpeg',
      imageBase64: btoa(binary),
    };
  } finally {
    bitmap.close();
  }
}
