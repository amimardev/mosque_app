import assert from 'node:assert/strict';
import test from 'node:test';
import { getHomographyMatrix, solve8x8 } from './warpQuad.js';

test('solve8x8 solves an 8x8 linear system correctly', () => {
  // Identity matrix test
  const A = Array.from({ length: 8 }, (_, i) => {
    const row = new Array(8).fill(0);
    row[i] = 2; // 2 * x_i = B_i
    return row;
  });
  const B = [2, 4, 6, 8, 10, 12, 14, 16];
  const solution = solve8x8(A, B);

  assert.ok(solution);
  assert.equal(solution.length, 8);
  assert.deepEqual(solution, [1, 2, 3, 4, 5, 6, 7, 8]);
});

test('getHomographyMatrix calculates accurate perspective homography mapping', () => {
  // Source quad: skewed rectangle
  const p0 = { x: 50, y: 30 };   // TL
  const p1 = { x: 450, y: 70 };  // TR
  const p2 = { x: 480, y: 380 }; // BR
  const p3 = { x: 20, y: 320 };  // BL

  const outW = 400;
  const outH = 300;

  const H = getHomographyMatrix(p0, p1, p2, p3, outW, outH);
  assert.ok(H);
  assert.equal(H.length, 9);
  assert.equal(H[8], 1); // h22 = 1

  const [h00, h01, h02, h10, h11, h12, h20, h21] = H;

  function mapOutputToSource(u: number, v: number) {
    const denom = h20 * u + h21 * v + 1.0;
    const sx = (h00 * u + h01 * v + h02) / denom;
    const sy = (h10 * u + h11 * v + h12) / denom;
    return { x: sx, y: sy };
  }

  // TL: (0, 0) should map to p0 (50, 30)
  const mappedTL = mapOutputToSource(0, 0);
  assert.ok(Math.abs(mappedTL.x - p0.x) < 1e-4);
  assert.ok(Math.abs(mappedTL.y - p0.y) < 1e-4);

  // TR: (outW, 0) should map to p1 (450, 70)
  const mappedTR = mapOutputToSource(outW, 0);
  assert.ok(Math.abs(mappedTR.x - p1.x) < 1e-4);
  assert.ok(Math.abs(mappedTR.y - p1.y) < 1e-4);

  // BR: (outW, outH) should map to p2 (480, 380)
  const mappedBR = mapOutputToSource(outW, outH);
  assert.ok(Math.abs(mappedBR.x - p2.x) < 1e-4);
  assert.ok(Math.abs(mappedBR.y - p2.y) < 1e-4);

  // BL: (0, outH) should map to p3 (20, 320)
  const mappedBL = mapOutputToSource(0, outH);
  assert.ok(Math.abs(mappedBL.x - p3.x) < 1e-4);
  assert.ok(Math.abs(mappedBL.y - p3.y) < 1e-4);
});

test('getHomographyMatrix handles rectangular scaling correctly', () => {
  const p0 = { x: 100, y: 100 };
  const p1 = { x: 300, y: 100 };
  const p2 = { x: 300, y: 250 };
  const p3 = { x: 100, y: 250 };

  const outW = 200;
  const outH = 150;

  const H = getHomographyMatrix(p0, p1, p2, p3, outW, outH);
  assert.ok(H);

  const [h00, h01, h02, h10, h11, h12, h20, h21] = H;

  // Center point: (100, 75) should map to source center (200, 175)
  const denom = h20 * 100 + h21 * 75 + 1.0;
  const sx = (h00 * 100 + h01 * 75 + h02) / denom;
  const sy = (h10 * 100 + h11 * 75 + h12) / denom;

  assert.ok(Math.abs(sx - 200) < 1e-4);
  assert.ok(Math.abs(sy - 175) < 1e-4);
});

