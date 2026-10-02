/**
 * Calculates a person's real age in full years relative to the current date.
 * Supports:
 * - ISO date strings: "2012-05-14"
 * - Date objects
 * - Timestamps or birth date strings stored in age or dateOfBirth columns
 * - Fallback to numeric value if an older integer is passed
 */
export function calculateAge(birthDateInput: string | number | Date | null | undefined): number | null {
  if (birthDateInput === null || birthDateInput === undefined || birthDateInput === '') {
    return null;
  }

  // If it's already a number or a simple integer string without dashes (e.g., 14 or "14")
  if (typeof birthDateInput === 'number') {
    return birthDateInput >= 0 ? birthDateInput : null;
  }

  const str = String(birthDateInput).trim();
  // If it doesn't contain a dash or slash, test if it's just a raw number
  if (/^\d+$/.test(str)) {
    const num = parseInt(str, 10);
    return isNaN(num) ? null : num;
  }

  const birthDate = new Date(str);
  if (isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 0 ? age : null;
}

/**
 * Returns formatted age in Arabic, e.g. "14 سنة" or fallback string.
 */
export function formatArabicAge(birthDateInput: string | number | Date | null | undefined, fallback: string = 'غير محدد'): string {
  const age = calculateAge(birthDateInput);
  if (age === null) return fallback;
  return `${age} سنة`;
}
