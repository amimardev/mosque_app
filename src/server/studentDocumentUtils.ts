export interface StudentNameRecord {
  id: string;
  name: string;
}

export function normalizeStudentName(value: string) {
  return value.normalize('NFKC').toLocaleLowerCase().replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/\s+/g, ' ').trim();
}

export function findSameNameStudents(name: string, students: StudentNameRecord[]) {
  const normalized = normalizeStudentName(name);
  if (!normalized) return [];
  return students.filter((student) => normalizeStudentName(student.name) === normalized);
}

export function getDuplicateNameWarning(name: string, students: StudentNameRecord[], allowDuplicate: boolean) {
  const matches = findSameNameStudents(name, students);
  return matches.length > 0 && !allowDuplicate ? matches : null;
}

export function getPhotoCropBounds(box: number[] | null, width: number, height: number) {
  if (!box || box.length !== 4 || width < 1 || height < 1) return null;
  const [ymin, xmin, ymax, xmax] = box;
  if (![ymin, xmin, ymax, xmax].every(Number.isInteger)
    || ymin < 0 || xmin < 0 || ymax > 1000 || xmax > 1000 || ymin >= ymax || xmin >= xmax) return null;
  const left = Math.max(0, Math.min(width - 1, Math.round(xmin * width / 1000)));
  const top = Math.max(0, Math.min(height - 1, Math.round(ymin * height / 1000)));
  const right = Math.max(left + 1, Math.min(width, Math.round(xmax * width / 1000)));
  const bottom = Math.max(top + 1, Math.min(height, Math.round(ymax * height / 1000)));
  return { left, top, width: right - left, height: bottom - top };
}
