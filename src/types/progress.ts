export type ProjectProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface ProjectProgress {
  status: ProjectProgressStatus;
  deliverablesCompleted: string[];
  notes: string;
}

export interface StudySession {
  id: string;
  dayNumber: number;
  dayTitle: string;
  activity: string;
  startTime: number;
  endTime: number;
  durationMinutes: number;
  plannedMinutes: number;
  notes?: string;
  createdAt: string; // ISO date string YYYY-MM-DDTHH:mm:ss
}

export interface ActiveTimerState {
  dayNumber: number;
  dayTitle: string;
  activity: string;
  plannedMinutes: number;
  startTimestamp: number; // Date.now() when started/resumed
  accumulatedSeconds: number; // Seconds counted before the current active run
  isRunning: boolean;
  notes?: string;
}

export interface UserSettings {
  dailyGoalHours: number;
  timerSound: boolean;
  roadmapStartDate: string; // YYYY-MM-DD
  userName?: string;
}

export interface UserProgressData {
  version: number;
  startDate: string; // YYYY-MM-DD
  completedDays: Record<number, boolean>;
  completedChecklist: Record<string, boolean>; // key format: `${day}_${index}`
  notesByDay: Record<number, string>;
  projectProgress: Record<string, ProjectProgress>;
  studySessions: StudySession[];
  activeTimer: ActiveTimerState | null;
  settings: UserSettings;
  lastActiveDate?: string;
}
