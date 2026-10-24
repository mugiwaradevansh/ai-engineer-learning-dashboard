/**
 * Date and time utilities for the AI Engineer Roadmap Dashboard
 */

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateString(dateStr: string): Date {
  if (!dateStr || typeof dateStr !== 'string') {
    return new Date();
  }
  const parts = dateStr.trim().split('-').map(Number);
  if (parts.length === 3 && !parts.some(isNaN)) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  const fallback = new Date(dateStr);
  return isNaN(fallback.getTime()) ? new Date() : fallback;
}

export function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateStr: string | Date): string {
  const date = typeof dateStr === 'string' ? parseDateString(dateStr) : dateStr;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatShortMonthDay(dateStr: string | Date): string {
  const date = typeof dateStr === 'string' ? parseDateString(dateStr) : dateStr;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatDayOfWeek(dateStr: string | Date): string {
  const date = typeof dateStr === 'string' ? parseDateString(dateStr) : dateStr;
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Calculates which roadmap day number corresponds to the current date based on the user's start date.
 * Day 1 = startDate.
 */
export function calculateCurrentRoadmapDay(startDateStr: string, totalRoadmapDays: number = 185): number {
  if (!startDateStr) return 1;
  const start = parseDateString(startDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 1; // Starting in future
  }

  const calculatedDay = diffDays + 1;
  return Math.min(Math.max(calculatedDay, 1), totalRoadmapDays);
}

/**
 * Gets the calendar date for a specific roadmap day based on startDate.
 */
export function getDateForRoadmapDay(dayNumber: number, startDateStr: string): Date {
  const start = parseDateString(startDateStr);
  const target = new Date(start);
  target.setDate(start.getDate() + (dayNumber - 1));
  return target;
}

/**
 * Given a calendar date, computes which roadmap day number it represents.
 */
export function getRoadmapDayForDate(date: Date, startDateStr: string): number | null {
  const start = parseDateString(startDateStr);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const day = diffDays + 1;
  if (day >= 1 && day <= 185) {
    return day;
  }
  return null;
}

/**
 * Formats duration in seconds into HH:MM:SS or MM:SS
 */
export function formatSecondsToTimer(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Formats minutes into human-friendly string like "2h 30m" or "45m"
 */
export function formatMinutesHuman(totalMinutes: number): string {
  if (!totalMinutes || totalMinutes <= 0) return '0m';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  }
  return `${minutes}m`;
}

/**
 * Formats hours into human-friendly decimal e.g. "3.5 hrs" or "12 hrs"
 */
export function formatHoursHuman(hours: number): string {
  if (hours === 0) return '0 hrs';
  const rounded = Math.round(hours * 10) / 10;
  return `${rounded} ${rounded === 1 ? 'hr' : 'hrs'}`;
}

/**
 * Formats relative time like "Just now", "25m ago", "Yesterday"
 */
export function formatRelativeTime(timestamp: number | string): string {
  const time = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp;
  const now = Date.now();
  const diffSeconds = Math.floor((now - time) / 1000);

  if (diffSeconds < 60) return 'Just now';
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  if (diffSeconds < 172800) return 'Yesterday';
  return formatDisplayDate(new Date(time));
}
