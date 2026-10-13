import assert from 'node:assert/strict';
import test from 'node:test';
import { findSameNameStudents, getDuplicateNameWarning, getPhotoCropBounds } from '../studentDocumentUtils.js';

test('same-name matching ignores whitespace, compatibility forms, and Arabic marks', () => {
  const matches = findSameNameStudents('  مُحَمَّد   بن علي ', [
    { id: 'std_1', name: 'محمد بن علي' },
    { id: 'std_2', name: 'أحمد بن علي' },
  ]);
  assert.deepEqual(matches.map((student) => student.id), ['std_1']);
});

test('blank names never match existing students', () => {
  assert.deepEqual(findSameNameStudents('   ', [{ id: 'std_1', name: 'طالب' }]), []);
});

test('a duplicate returns a warning and explicit confirmation allows continuing', () => {
  const records = [{ id: 'std_1', name: 'محمد بن علي' }];
  assert.deepEqual(getDuplicateNameWarning('محمد بن علي', records, false), records);
  assert.equal(getDuplicateNameWarning('محمد بن علي', records, true), null);
  assert.equal(getDuplicateNameWarning('اسم جديد', records, false), null);
});

test('normalized photo bounds map to pixel crop coordinates', () => {
  assert.deepEqual(getPhotoCropBounds([100, 200, 600, 800], 1000, 2000), {
    left: 200, top: 200, width: 600, height: 1000,
  });
});

test('invalid or out-of-range photo bounds are rejected', () => {
  assert.equal(getPhotoCropBounds([600, 300, 200, 900], 1000, 1000), null);
  assert.equal(getPhotoCropBounds([0, 0, 1001, 1000], 1000, 1000), null);
  assert.equal(getPhotoCropBounds(null, 1000, 1000), null);
});
