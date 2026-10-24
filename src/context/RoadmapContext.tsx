import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProgressData,
  StudySession,
  ActiveTimerState,
  UserSettings,
  ProjectProgressStatus,
} from '../types/progress';
import {
  allDays,
  allProjects,
  getDayByNumber,
  getClosestDay,
} from '../data/roadmapData';
import {
  getTodayDateString,
  calculateCurrentRoadmapDay,
  formatDateString,
} from '../utils/dateUtils';

const STORAGE_KEY = 'ai_engineer_roadmap_progress_v1';

export type DashboardView =
  | 'dashboard'
  | 'study'
  | 'timer'
  | 'explorer'
  | 'calendar'
  | 'projects'
  | 'analytics'
  | 'vault';

interface RoadmapContextType {
  // Data
  progress: UserProgressData;
  currentRoadmapDay: number;
  selectedDayNumber: number;
  currentView: DashboardView;
  isSettingsOpen: boolean;
  selectedPhaseFilter: number | 'all';

  // Navigation
  setCurrentView: (view: DashboardView) => void;
  setSelectedDayNumber: (day: number) => void;
  navigateToDay: (day: number) => void;
  setSelectedPhaseFilter: (phase: number | 'all') => void;
  navigateToPhase: (phaseId: number) => void;
  openSettings: () => void;
  closeSettings: () => void;

  // Lesson interactions
  toggleDayCompleted: (dayNumber: number) => void;
  toggleChecklistItem: (dayNumber: number, itemIndex: number) => void;
  saveDayNote: (dayNumber: number, note: string) => void;

  // Project interactions
  updateProjectStatus: (projectId: string, status: ProjectProgressStatus) => void;
  toggleProjectDeliverable: (projectId: string, deliverableIndex: number) => void;
  saveProjectNote: (projectId: string, note: string) => void;

  // Timer interactions
  activeTimer: ActiveTimerState | null;
  activeTimerElapsedSeconds: number;
  startTimer: (dayNumber: number, activity?: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopAndSaveTimer: (sessionNotes?: string) => void;
  discardActiveTimer: () => void;
  deleteStudySession: (id: string) => void;

  // Settings & Storage
  updateStartDate: (newStartDate: string) => void;
  updateSettings: (newSettings: Partial<UserSettings>, newStartDate?: string) => void;
  exportProgressJSON: () => void;
  importProgressJSON: (jsonString: string) => { success: boolean; error?: string };
  resetAllProgress: () => void;
}

const defaultSettings: UserSettings = {
  dailyGoalHours: 4,
  timerSound: true,
  roadmapStartDate: getTodayDateString(),
  userName: 'AI Engineer',
};

const initialProgress: UserProgressData = {
  version: 1,
  startDate: getTodayDateString(),
  completedDays: {},
  completedChecklist: {},
  notesByDay: {},
  projectProgress: {},
  studySessions: [],
  activeTimer: null,
  settings: defaultSettings,
};

// Initialize projects with default empty state
allProjects.forEach((p) => {
  initialProgress.projectProgress[p.id] = {
    status: 'not_started',
    deliverablesCompleted: [],
    notes: '',
  };
});

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

export const RoadmapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial progress from localStorage with safety
  const [progress, setProgress] = useState<UserProgressData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return {
            ...initialProgress,
            ...parsed,
            settings: {
              ...defaultSettings,
              ...(parsed.settings || {}),
            },
            projectProgress: {
              ...initialProgress.projectProgress,
              ...(parsed.projectProgress || {}),
            },
          };
        }
      }
    } catch (e) {
      console.error('Failed to load stored progress:', e);
    }
    return initialProgress;
  });

  const [currentView, setCurrentView] = useState<DashboardView>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<number | 'all'>('all');

  const navigateToPhase = useCallback((phaseId: number) => {
    setSelectedPhaseFilter(phaseId);
    setCurrentView('explorer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Calculate current roadmap day based on startDate
  const currentRoadmapDay = useMemo(() => {
    return calculateCurrentRoadmapDay(progress.startDate || progress.settings.roadmapStartDate || getTodayDateString());
  }, [progress.startDate, progress.settings.roadmapStartDate]);

  // Selected day for the Daily Study Room (defaults to the current calculated day)
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(() => {
    return getClosestDay(currentRoadmapDay).day;
  });

  // Keep selected day synchronized when current roadmap day shifts
  useEffect(() => {
    setSelectedDayNumber(getClosestDay(currentRoadmapDay).day);
  }, [currentRoadmapDay]);

  // Save progress changes to localStorage with functional update support
  const saveProgress = useCallback((updater: UserProgressData | ((prev: UserProgressData) => UserProgressData)) => {
    setProgress((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save progress to localStorage:', e);
      }
      return next;
    });
  }, []);

  // ----------------------------------------------------
  // Active Timer state and live tick calculations
  // ----------------------------------------------------
  const [activeTimerElapsedSeconds, setActiveTimerElapsedSeconds] = useState<number>(0);

  // Recalculate elapsed seconds accurately using timestamps
  useEffect(() => {
    const timer = progress.activeTimer;
    if (!timer) {
      setActiveTimerElapsedSeconds(0);
      return;
    }

    const updateElapsed = () => {
      if (timer.isRunning) {
        const diffFromStart = Math.floor((Date.now() - timer.startTimestamp) / 1000);
        setActiveTimerElapsedSeconds(timer.accumulatedSeconds + Math.max(0, diffFromStart));
      } else {
        setActiveTimerElapsedSeconds(timer.accumulatedSeconds);
      }
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 500);
    return () => clearInterval(interval);
  }, [progress.activeTimer]);

  const startTimer = useCallback((dayNumber: number, activity?: string) => {
    const day = getDayByNumber(dayNumber) || allDays[0];
    const newTimer: ActiveTimerState = {
      dayNumber: day.day,
      dayTitle: day.day_title,
      activity: activity || 'Lesson Study & Practice',
      plannedMinutes: (day.time_hours || 4) * 60,
      startTimestamp: Date.now(),
      accumulatedSeconds: 0,
      isRunning: true,
    };

    saveProgress({
      ...progress,
      activeTimer: newTimer,
    });
  }, [progress, saveProgress]);

  const pauseTimer = useCallback(() => {
    if (!progress.activeTimer || !progress.activeTimer.isRunning) return;
    const now = Date.now();
    const currentRun = Math.max(0, Math.floor((now - progress.activeTimer.startTimestamp) / 1000));
    const newAccumulated = progress.activeTimer.accumulatedSeconds + currentRun;

    const updatedTimer: ActiveTimerState = {
      ...progress.activeTimer,
      accumulatedSeconds: newAccumulated,
      isRunning: false,
    };

    saveProgress({
      ...progress,
      activeTimer: updatedTimer,
    });
  }, [progress, saveProgress]);

  const resumeTimer = useCallback(() => {
    if (!progress.activeTimer || progress.activeTimer.isRunning) return;
    const updatedTimer: ActiveTimerState = {
      ...progress.activeTimer,
      startTimestamp: Date.now(),
      isRunning: true,
    };

    saveProgress({
      ...progress,
      activeTimer: updatedTimer,
    });
  }, [progress, saveProgress]);

  const stopAndSaveTimer = useCallback((sessionNotes?: string) => {
    if (!progress.activeTimer) return;
    const now = Date.now();
    let totalSeconds = progress.activeTimer.accumulatedSeconds;
    if (progress.activeTimer.isRunning) {
      totalSeconds += Math.max(0, Math.floor((now - progress.activeTimer.startTimestamp) / 1000));
    }

    // Minimum 1 minute duration if study was at least 30s
    const durationMinutes = totalSeconds >= 30 ? Math.max(1, Math.round(totalSeconds / 60)) : 0;

    if (durationMinutes > 0) {
      const newSession: StudySession = {
        id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        dayNumber: progress.activeTimer.dayNumber,
        dayTitle: progress.activeTimer.dayTitle,
        activity: progress.activeTimer.activity,
        startTime: now - totalSeconds * 1000,
        endTime: now,
        durationMinutes,
        plannedMinutes: progress.activeTimer.plannedMinutes,
        notes: sessionNotes || progress.activeTimer.notes || '',
        createdAt: new Date().toISOString(),
      };

      saveProgress({
        ...progress,
        studySessions: [newSession, ...progress.studySessions],
        activeTimer: null,
      });

      // Subtle celebration if studied > 15 minutes
      if (durationMinutes >= 15) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#315DAD', '#107569', '#E5E9F0'],
        });
      }
    } else {
      // Very short session discarded cleanly
      saveProgress({
        ...progress,
        activeTimer: null,
      });
    }
  }, [progress, saveProgress]);

  const discardActiveTimer = useCallback(() => {
    saveProgress({
      ...progress,
      activeTimer: null,
    });
  }, [progress, saveProgress]);

  const deleteStudySession = useCallback((id: string) => {
    saveProgress({
      ...progress,
      studySessions: progress.studySessions.filter((s) => s.id !== id),
    });
  }, [progress, saveProgress]);

  // ----------------------------------------------------
  // Lesson Progress interactions
  // ----------------------------------------------------
  const toggleDayCompleted = useCallback((dayNumber: number) => {
    const isCurrentlyComplete = !!progress.completedDays[dayNumber];
    const willBeComplete = !isCurrentlyComplete;

    const newCompletedDays = {
      ...progress.completedDays,
      [dayNumber]: willBeComplete,
    };

    saveProgress({
      ...progress,
      completedDays: newCompletedDays,
    });

    if (willBeComplete) {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#107569', '#315DAD', '#FCD34D'],
      });
    }
  }, [progress, saveProgress]);

  const toggleChecklistItem = useCallback((dayNumber: number, itemIndex: number) => {
    const key = `${dayNumber}_${itemIndex}`;
    const newChecklist = {
      ...progress.completedChecklist,
      [key]: !progress.completedChecklist[key],
    };

    saveProgress({
      ...progress,
      completedChecklist: newChecklist,
    });
  }, [progress, saveProgress]);

  const saveDayNote = useCallback((dayNumber: number, note: string) => {
    saveProgress({
      ...progress,
      notesByDay: {
        ...progress.notesByDay,
        [dayNumber]: note,
      },
    });
  }, [progress, saveProgress]);

  // ----------------------------------------------------
  // Milestone Project interactions
  // ----------------------------------------------------
  const updateProjectStatus = useCallback((projectId: string, status: ProjectProgressStatus) => {
    const current = progress.projectProgress[projectId] || {
      status: 'not_started',
      deliverablesCompleted: [],
      notes: '',
    };

    const newProjProgress = {
      ...progress.projectProgress,
      [projectId]: {
        ...current,
        status,
      },
    };

    saveProgress({
      ...progress,
      projectProgress: newProjProgress,
    });

    if (status === 'completed') {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#315DAD', '#107569', '#F59E0B'],
      });
    }
  }, [progress, saveProgress]);

  const toggleProjectDeliverable = useCallback((projectId: string, deliverableIndex: number) => {
    const current = progress.projectProgress[projectId] || {
      status: 'not_started',
      deliverablesCompleted: [],
      notes: '',
    };
    const key = String(deliverableIndex);
    const completedList = new Set(current.deliverablesCompleted || []);

    if (completedList.has(key)) {
      completedList.delete(key);
    } else {
      completedList.add(key);
    }

    saveProgress({
      ...progress,
      projectProgress: {
        ...progress.projectProgress,
        [projectId]: {
          ...current,
          deliverablesCompleted: Array.from(completedList),
        },
      },
    });
  }, [progress, saveProgress]);

  const saveProjectNote = useCallback((projectId: string, note: string) => {
    const current = progress.projectProgress[projectId] || {
      status: 'not_started',
      deliverablesCompleted: [],
      notes: '',
    };

    saveProgress({
      ...progress,
      projectProgress: {
        ...progress.projectProgress,
        [projectId]: {
          ...current,
          notes: note,
        },
      },
    });
  }, [progress, saveProgress]);

  // ----------------------------------------------------
  // Settings & Start Date
  // ----------------------------------------------------
  const updateStartDate = useCallback((newStartDate: string) => {
    saveProgress((prev) => ({
      ...prev,
      startDate: newStartDate,
      settings: {
        ...prev.settings,
        roadmapStartDate: newStartDate,
      },
    }));
  }, [saveProgress]);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>, newStartDate?: string) => {
    saveProgress((prev) => {
      const effectiveStartDate = newStartDate || newSettings.roadmapStartDate || prev.startDate;
      return {
        ...prev,
        startDate: effectiveStartDate,
        settings: {
          ...prev.settings,
          ...newSettings,
          roadmapStartDate: effectiveStartDate,
        },
      };
    });
  }, [saveProgress]);

  // ----------------------------------------------------
  // Backup Export & Restore
  // ----------------------------------------------------
  const exportProgressJSON = useCallback(() => {
    const exportData = {
      ...progress,
      exportedAt: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai_engineer_roadmap_progress_${formatDateString(new Date())}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [progress]);

  const importProgressJSON = useCallback((jsonString: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'Invalid file: not a JSON object.' };
      }

      // Validate required properties
      if (!parsed.completedDays || typeof parsed.completedDays !== 'object') {
        return { success: false, error: 'Missing completedDays in backup file.' };
      }

      const mergedProgress: UserProgressData = {
        version: parsed.version || 1,
        startDate: parsed.startDate || getTodayDateString(),
        completedDays: parsed.completedDays || {},
        completedChecklist: parsed.completedChecklist || {},
        notesByDay: parsed.notesByDay || {},
        projectProgress: {
          ...initialProgress.projectProgress,
          ...(parsed.projectProgress || {}),
        },
        studySessions: Array.isArray(parsed.studySessions) ? parsed.studySessions : [],
        activeTimer: null, // Discard active timer from backup to avoid corruption
        settings: {
          ...defaultSettings,
          ...(parsed.settings || {}),
        },
      };

      saveProgress(mergedProgress);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to parse JSON file.' };
    }
  }, [saveProgress]);

  const resetAllProgress = useCallback(() => {
    const resetData: UserProgressData = {
      ...initialProgress,
      startDate: getTodayDateString(),
      settings: {
        ...defaultSettings,
        roadmapStartDate: getTodayDateString(),
      },
    };
    saveProgress(resetData);
  }, [saveProgress]);

  // Navigation helpers
  const navigateToDay = useCallback((day: number) => {
    const validDay = getClosestDay(day).day;
    setSelectedDayNumber(validDay);
    setCurrentView('study');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openSettings = useCallback(() => setIsSettingsOpen(true), []);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);

  const value = {
    progress,
    currentRoadmapDay,
    selectedDayNumber,
    currentView,
    isSettingsOpen,
    selectedPhaseFilter,
    setCurrentView,
    setSelectedDayNumber,
    navigateToDay,
    setSelectedPhaseFilter,
    navigateToPhase,
    openSettings,
    closeSettings,
    toggleDayCompleted,
    toggleChecklistItem,
    saveDayNote,
    updateProjectStatus,
    toggleProjectDeliverable,
    saveProjectNote,
    activeTimer: progress.activeTimer,
    activeTimerElapsedSeconds,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopAndSaveTimer,
    discardActiveTimer,
    deleteStudySession,
    updateStartDate,
    updateSettings,
    exportProgressJSON,
    importProgressJSON,
    resetAllProgress,
  };

  return <RoadmapContext.Provider value={value}>{children}</RoadmapContext.Provider>;
};

export const useRoadmap = () => {
  const context = useContext(RoadmapContext);
  if (!context) {
    throw new Error('useRoadmap must be used within a RoadmapProvider');
  }
  return context;
};
