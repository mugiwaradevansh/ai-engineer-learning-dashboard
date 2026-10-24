import { RoadmapDay, RoadmapPhase } from '../types/roadmap';
import { StudySession } from '../types/progress';
import { parseDateString, formatDateString } from './dateUtils';

export interface ProgressSummary {
  completedDaysCount: number;
  totalRoadmapDays: number;
  availableDaysCount: number;
  roadmapPercentage: number;
  totalActualHours: number;
  totalPlannedHours: number;
  totalChecklistItems: number;
  completedChecklistItems: number;
  checklistPercentage: number;
  currentStreak: number;
  longestStreak: number;
}

export interface PhaseProgressSummary {
  phaseId: number;
  title: string;
  totalDays: number;
  completedDays: number;
  percentage: number;
  totalHoursPlanned: number;
  actualHours: number;
}

/**
 * Calculates overall roadmap progress percentage and counts.
 */
export function calculateOverallProgress(
  completedDays: Record<number, boolean>,
  totalDays: number = 185
): { completedCount: number; totalDays: number; percentage: number } {
  if (!totalDays || totalDays <= 0) return { completedCount: 0, totalDays: 0, percentage: 0 };
  const completedCount = Object.keys(completedDays).filter((k) => completedDays[Number(k)]).length;
  const percentage = Math.min(100, Math.round((completedCount / totalDays) * 100));
  return { completedCount, totalDays, percentage };
}

/**
 * Calculates checklist item completion for a single day.
 */
export function calculateDayChecklist(
  dayNumber: number,
  checklist: string[] = [],
  completedChecklist: Record<string, boolean> = {}
): { completed: number; total: number; percentage: number } {
  if (!checklist || checklist.length === 0) {
    return { completed: 0, total: 0, percentage: 100 };
  }
  let completed = 0;
  for (let i = 0; i < checklist.length; i++) {
    if (completedChecklist[`${dayNumber}_${i}`]) {
      completed++;
    }
  }
  const percentage = Math.round((completed / checklist.length) * 100);
  return { completed, total: checklist.length, percentage };
}

/**
 * Calculates total checklist items across all available curriculum days.
 */
export function calculateAllChecklists(
  allDays: RoadmapDay[],
  completedChecklist: Record<string, boolean> = {}
): { completed: number; total: number; percentage: number } {
  let total = 0;
  let completed = 0;

  for (const day of allDays) {
    if (day.checklist && day.checklist.length > 0) {
      total += day.checklist.length;
      for (let i = 0; i < day.checklist.length; i++) {
        if (completedChecklist[`${day.day}_${i}`]) {
          completed++;
        }
      }
    }
  }

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
}

/**
 * Calculates progress for each phase.
 */
export function calculatePhaseProgress(
  phases: RoadmapPhase[],
  days: RoadmapDay[],
  completedDays: Record<number, boolean>,
  studySessions: StudySession[]
): PhaseProgressSummary[] {
  return phases.map((phase) => {
    const daysInPhase = days.filter((d) => d.phase === phase.id);
    const totalDays = daysInPhase.length;
    const completedDaysCount = daysInPhase.filter((d) => completedDays[d.day]).length;
    const percentage = totalDays > 0 ? Math.round((completedDaysCount / totalDays) * 100) : 0;
    const totalHoursPlanned = daysInPhase.reduce((sum, d) => sum + (d.time_hours || 0), 0);

    const phaseDayNumbers = new Set(daysInPhase.map((d) => d.day));
    const phaseSessions = studySessions.filter((s) => phaseDayNumbers.has(s.dayNumber));
    const actualMinutes = phaseSessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const actualHours = Math.round((actualMinutes / 60) * 10) / 10;

    return {
      phaseId: phase.id,
      title: phase.title,
      totalDays,
      completedDays: completedDaysCount,
      percentage,
      totalHoursPlanned,
      actualHours,
    };
  });
}

/**
 * Calculates total study hours from saved sessions.
 */
export function calculateTotalActualHours(studySessions: StudySession[]): number {
  if (!studySessions || studySessions.length === 0) return 0;
  const totalMinutes = studySessions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  return Math.round((totalMinutes / 60) * 10) / 10;
}

/**
 * Calculates today's actual study hours from sessions created today.
 */
export function calculateTodayActualHours(studySessions: StudySession[]): number {
  if (!studySessions || studySessions.length === 0) return 0;
  const todayStr = formatDateString(new Date());
  const todaySessions = studySessions.filter((s) => {
    const sessionDate = s.createdAt ? s.createdAt.substring(0, 10) : '';
    return sessionDate === todayStr;
  });
  const minutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  return Math.round((minutes / 60) * 10) / 10;
}

/**
 * Calculates consecutive daily study streak (days with either a completed day or saved session).
 */
export function calculateStreak(
  studySessions: StudySession[],
  completedDays: Record<number, boolean>,
  _startDateStr: string
): { currentStreak: number; longestStreak: number } {
  // Collect all dates that had activity
  const activeDates = new Set<string>();

  // From sessions
  for (const session of studySessions) {
    if (session.createdAt) {
      activeDates.add(session.createdAt.substring(0, 10));
    }
  }

  // From today if any session exists
  if (activeDates.size === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const sortedDates = Array.from(activeDates)
    .map((d) => parseDateString(d).getTime())
    .sort((a, b) => a - b);

  if (sortedDates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const oneDayMs = 24 * 60 * 60 * 1000;
  let longest = 1;
  let currentRun = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prev = sortedDates[i - 1];
    const curr = sortedDates[i];
    const diffDays = Math.round((curr - prev) / oneDayMs);

    if (diffDays === 1) {
      currentRun++;
      if (currentRun > longest) {
        longest = currentRun;
      }
    } else if (diffDays > 1) {
      currentRun = 1;
    }
  }

  // Check if current streak is active (activity today or yesterday)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();
  const lastActiveTime = sortedDates[sortedDates.length - 1];
  const daysSinceLastActive = Math.round((todayTime - lastActiveTime) / oneDayMs);

  let currentStreak = 0;
  if (daysSinceLastActive === 0 || daysSinceLastActive === 1) {
    currentStreak = currentRun;
  }

  return { currentStreak, longestStreak: Math.max(longest, currentStreak) };
}

/**
 * Calculates weekly planned vs actual study hours for the last 7 days.
 */
export function calculateWeeklyChartData(
  studySessions: StudySession[],
  todayRoadmapDayPlannedHours: number = 4
): Array<{ day: string; date: string; actual: number; planned: number }> {
  const result: Array<{ day: string; date: string; actual: number; planned: number }> = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate 7 days back from today
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDateString(d);
    const dayLabel = daysOfWeek[d.getDay()];

    const sessionsForDay = studySessions.filter((s) => s.createdAt && s.createdAt.substring(0, 10) === dateStr);
    const minutes = sessionsForDay.reduce((acc, s) => acc + s.durationMinutes, 0);
    const actualHours = Math.round((minutes / 60) * 10) / 10;

    // Default planned hours is 4h for weekdays, 3h for weekends or based on curriculum
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const defaultPlanned = i === 0 ? todayRoadmapDayPlannedHours : isWeekend ? 3 : 4;

    result.push({
      day: dayLabel,
      date: dateStr,
      actual: actualHours,
      planned: defaultPlanned,
    });
  }

  return result;
}

/**
 * Generates heatmap cells for activity tracking (by calendar dates).
 */
export function generateActivityHeatmap(
  studySessions: StudySession[],
  weeksBack: number = 16
): Array<{
  date: string;
  count: number;
  minutes: number;
  level: 0 | 1 | 2 | 3 | 4;
}> {
  const sessionMap = new Map<string, { count: number; minutes: number }>();
  for (const s of studySessions) {
    if (s.createdAt) {
      const dateStr = s.createdAt.substring(0, 10);
      const existing = sessionMap.get(dateStr) || { count: 0, minutes: 0 };
      existing.count += 1;
      existing.minutes += s.durationMinutes;
      sessionMap.set(dateStr, existing);
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find the previous Sunday to start cleanly aligned to weeks
  const dayOfWeek = today.getDay(); // 0 is Sun
  const totalDays = weeksBack * 7 + (dayOfWeek + 1);

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (totalDays - 1));

  const result: Array<{
    date: string;
    count: number;
    minutes: number;
    level: 0 | 1 | 2 | 3 | 4;
  }> = [];

  for (let i = 0; i < totalDays; i++) {
    const curr = new Date(startDate);
    curr.setDate(startDate.getDate() + i);
    const dateStr = formatDateString(curr);
    const data = sessionMap.get(dateStr) || { count: 0, minutes: 0 };

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (data.minutes > 0) {
      if (data.minutes < 60) level = 1;
      else if (data.minutes < 150) level = 2;
      else if (data.minutes < 240) level = 3;
      else level = 4;
    }

    result.push({
      date: dateStr,
      count: data.count,
      minutes: data.minutes,
      level,
    });
  }

  return result;
}
