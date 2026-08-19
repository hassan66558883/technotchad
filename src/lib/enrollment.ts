export const MIN_STUDENTS_TO_START = 6;

// A session under the minimum becomes "urgent" once it's this close to starting —
// close enough that there's little time left to enroll more students or decide to postpone.
export const URGENT_THRESHOLD_DAYS = 7;

export function daysUntil(date: Date): number {
  const ms = date.getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function isEnrollmentUrgent(date: Date): boolean {
  return daysUntil(date) <= URGENT_THRESHOLD_DAYS;
}
