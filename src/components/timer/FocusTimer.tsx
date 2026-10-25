import React, { useState } from 'react';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Clock,
  Trash2,
  AlertTriangle,
  Search,
  Sparkles,
  Zap,
  X,
} from 'lucide-react';
import { useRoadmap } from '../../context/RoadmapContext';
import {
  formatSecondsToTimer,
  formatMinutesHuman,
  formatRelativeTime,
} from '../../utils/dateUtils';
import { allDays, getDayByNumber } from '../../data/roadmapData';

const ACTIVITY_PRESETS = [
  { label: 'Curriculum Lesson & Reading', color: 'bg-phase1-bg text-phase1-accent border-phase1-border' },
  { label: 'Coding Practice Task', color: 'bg-phase3-bg text-phase3-accent border-phase3-border' },
  { label: 'Milestone Project Build', color: 'bg-phase2-bg text-phase2-accent border-phase2-border' },
  { label: 'Evaluation & Benchmark Testing', color: 'bg-[#FFF1CB] text-[#785A10] border-[#F2DE98]' },
  { label: 'Review & Concept Consolidation', color: 'bg-[#E4EBDD] text-[#3D5C2E] border-[#CAD7C0]' },
  { label: 'Research Paper Deep-Dive', color: 'bg-[#F3DFE8] text-[#853D68] border-[#E5C8D9]' },
];

export const FocusTimer: React.FC = () => {
  const {
    activeTimer,
    activeTimerElapsedSeconds,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopAndSaveTimer,
    discardActiveTimer,
    deleteStudySession,
    progress,
    selectedDayNumber,
    navigateToDay,
  } = useRoadmap();

  const [selectedDayInput, setSelectedDayInput] = useState<number>(
    activeTimer ? activeTimer.dayNumber : selectedDayNumber
  );
  const [selectedActivity, setSelectedActivity] = useState<string>(
    activeTimer ? activeTimer.activity : ACTIVITY_PRESETS[0].label
  );
  const [sessionNotes, setSessionNotes] = useState<string>('');
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [historySearch, setHistorySearch] = useState<string>('');

  const selectedDayData = getDayByNumber(selectedDayInput) || allDays[0];
  const plannedSeconds = (selectedDayData.time_hours || 4) * 3600;

  const progressPercent = plannedSeconds > 0
    ? Math.min(100, Math.round((activeTimerElapsedSeconds / plannedSeconds) * 100))
    : 0;

  const isOvertime = activeTimerElapsedSeconds > plannedSeconds;

  const handleStartNewSession = () => {
    startTimer(selectedDayInput, selectedActivity);
  };

  const handleConfirmDiscard = () => {
    discardActiveTimer();
    setIsDiscardConfirmOpen(false);
    setSessionNotes('');
  };

  const handleSaveSession = () => {
    stopAndSaveTimer(sessionNotes);
    setIsSaveModalOpen(false);
    setSessionNotes('');
  };

  // Filter study sessions
  const filteredSessions = progress.studySessions
    .filter((s) => {
      if (!historySearch.trim()) return true;
      const q = historySearch.toLowerCase();
      return (
        s.activity.toLowerCase().includes(q) ||
        (s.notes && s.notes.toLowerCase().includes(q)) ||
        String(s.dayNumber) === q.trim()
      );
    })
    .slice()
    .reverse();

  const totalLoggedMinutes = progress.studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-ink-secondary">
          <span>DEEP WORK</span>
          <span>•</span>
          <span>TIMESTAMPS RESILIENT</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink-primary sm:text-3xl font-sans">
          Focus Engineering Timer
        </h1>
        <p className="mt-0.5 text-xs text-ink-secondary">
          Timestamp-anchored study clock. Survives tab switches, reloads, and background idling without losing precision.
        </p>
      </div>

      {/* Main Timer Display Hero */}
      <div className="gradient-lavender-blue grain-overlay rounded-3xl border border-surface-border p-6 sm:p-10 shadow-bloom-card">
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6 max-w-xl mx-auto">
          {/* Active Target Info */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-sans">
            <span className="rounded-xl bg-ink-primary px-3 py-1 font-mono font-semibold text-white shadow-bloom">
              Day {selectedDayData.day}
            </span>
            <span className="rounded-xl border border-surface-border bg-white px-3 py-1 font-semibold text-ink-primary shadow-bloom">
              {activeTimer ? activeTimer.activity : selectedActivity}
            </span>
            <span className="rounded-xl bg-white border border-surface-border px-3 py-1 font-mono text-ink-secondary">
              Planned: {selectedDayData.time_hours}h
            </span>
          </div>

          {/* Huge Monospace Digital Clock */}
          <div className="space-y-2">
            <div className="text-6xl sm:text-7xl md:text-8xl font-black font-mono tracking-tight text-ink-primary tabular-nums select-none">
              {formatSecondsToTimer(activeTimerElapsedSeconds)}
            </div>

            {/* Progress Bar & Overtime Status */}
            <div className="w-64 sm:w-80 mx-auto space-y-1.5">
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/80 border border-surface-border">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isOvertime ? 'bg-phase4-accent' : 'bg-brand-primary'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-ink-secondary">
                <span>{progressPercent}% target</span>
                {isOvertime ? (
                  <span className="font-semibold text-phase4-accent">Overtime +{formatSecondsToTimer(activeTimerElapsedSeconds - plannedSeconds)}</span>
                ) : (
                  <span>{formatSecondsToTimer(Math.max(0, plannedSeconds - activeTimerElapsedSeconds))} left</span>
                )}
              </div>
            </div>
          </div>

          {/* Primary Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {!activeTimer ? (
              <button
                onClick={handleStartNewSession}
                className="inline-flex items-center gap-2 rounded-2xl bg-brand-primary px-7 py-3 text-sm font-semibold text-white shadow-bloom-elevated hover:bg-brand-hover transition-bloom active:scale-95 font-sans"
              >
                <Play className="h-4 w-4 fill-current text-white" />
                <span>Begin Focus Session</span>
              </button>
            ) : (
              <>
                {activeTimer.isRunning ? (
                  <button
                    onClick={pauseTimer}
                    className="inline-flex items-center gap-2 rounded-2xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-bloom hover:bg-brand-hover transition-bloom active:scale-95 font-sans"
                  >
                    <Pause className="h-4 w-4" />
                    <span>Pause Timer</span>
                  </button>
                ) : (
                  <button
                    onClick={resumeTimer}
                    className="inline-flex items-center gap-2 rounded-2xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-bloom hover:bg-brand-hover transition-bloom active:scale-95 font-sans"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    <span>Resume Timer</span>
                  </button>
                )}

                <button
                  onClick={() => setIsSaveModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-phase3-border bg-phase3-bg px-5 py-3 text-sm font-semibold text-phase3-accent shadow-bloom hover:bg-phase3-border transition-bloom active:scale-95 font-sans"
                >
                  <Square className="h-4 w-4 fill-current" />
                  <span>Stop & Save Session</span>
                </button>

                <button
                  onClick={() => setIsDiscardConfirmOpen(true)}
                  title="Discard active timer"
                  className="rounded-2xl border border-surface-border bg-white p-3 text-ink-secondary hover:text-phase4-accent hover:bg-phase4-bg transition-bloom"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Session Configurator & Activity Chips (When Idle) */}
      {!activeTimer && (
        <div className="rounded-3xl border border-[#C5DAF5] bg-[#F2F7FD] p-5 sm:p-6 shadow-bloom space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#3B689B] font-sans">
            Session Configuration
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-ink-primary font-sans">Target Curriculum Day:</label>
              <select
                value={selectedDayInput}
                onChange={(e) => setSelectedDayInput(Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-[#C5DAF5] bg-white p-2.5 text-xs font-bold text-ink-primary focus:border-brand-primary focus:outline-none font-sans shadow-bloom"
              >
                {allDays.map((d) => (
                  <option key={d.day} value={d.day}>
                    Day {d.day}: {d.day_title.substring(0, 48)} ({d.time_hours}h)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-ink-primary font-sans">Learning Activity:</label>
              <input
                type="text"
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#C5DAF5] bg-white p-2.5 text-xs font-bold text-ink-primary focus:border-brand-primary focus:outline-none font-sans shadow-bloom"
              />
            </div>
          </div>

          {/* Quick Preset Chips */}
          <div>
            <span className="text-xs font-bold text-[#3B689B] font-sans">Quick Activity Presets:</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {ACTIVITY_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setSelectedActivity(preset.label)}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-bloom font-sans ${preset.color} ${
                    selectedActivity === preset.label ? 'ring-2 ring-brand-primary shadow-bloom' : 'opacity-90 hover:opacity-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Saved Study Sessions Log */}
      <div className="rounded-3xl border border-[#BDDFC6] bg-[#F0F8F3] p-5 sm:p-6 shadow-bloom space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#226348]" />
              <h3 className="text-sm font-bold text-ink-primary font-sans">Saved Study Sessions Log</h3>
            </div>
            <p className="text-xs text-[#226348] font-bold font-sans mt-0.5">
              {progress.studySessions.length} sessions logged • {formatMinutesHuman(totalLoggedMinutes)} verified engineering effort
            </p>
          </div>

          <div className="relative flex items-center w-full sm:w-72 shrink-0">
            <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-ink-secondary" />
            <input
              type="text"
              placeholder="Filter by activity, notes, day..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="w-full rounded-xl border border-[#BDDFC6] bg-white pl-10 pr-9 py-2 text-xs font-semibold text-ink-primary placeholder:text-ink-secondary/70 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none font-sans shadow-bloom transition-bloom"
            />
            {historySearch && (
              <button
                type="button"
                onClick={() => setHistorySearch('')}
                className="absolute right-2.5 p-1 rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-[#E1F1E6] transition-bloom"
                title="Clear filter"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#BDDFC6] bg-white/60 py-8 text-center text-xs text-ink-secondary font-sans">
            {progress.studySessions.length === 0
              ? 'No study sessions recorded yet. Start a session above to record verified study hours.'
              : 'No sessions match your filter query.'}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-2xl border border-[#BDDFC6] bg-white p-3.5 shadow-bloom transition-bloom"
              >
                <div className="space-y-1 truncate pr-3">
                  <div className="flex items-center gap-2 font-sans">
                    <span className="rounded-lg bg-[#E5EFFB] font-mono text-[11px] font-bold text-[#3B689B] border border-[#C5DAF5] px-2 py-0.5">
                      Day {session.dayNumber}
                    </span>
                    <span className="text-xs font-bold text-ink-primary truncate">{session.activity}</span>
                  </div>
                  {session.notes && (
                    <p className="text-xs text-ink-secondary italic truncate font-sans bg-[#FAF8F5] p-1.5 rounded-lg border border-[#EAE1D8]">
                      "{session.notes}"
                    </p>
                  )}
                  <p className="text-xs text-ink-muted font-sans font-mono">
                    {formatRelativeTime(session.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="rounded-xl bg-[#E1F1E6] border border-[#BDDFC6] px-3 py-1 text-xs font-mono font-bold text-[#226348]">
                    {formatMinutesHuman(session.durationMinutes)}
                  </span>
                  <button
                    onClick={() => deleteStudySession(session.id)}
                    title="Delete session"
                    className="rounded-lg p-1.5 text-ink-secondary hover:bg-[#FDECE2] hover:text-[#A85E37] transition-bloom"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Discard Confirmation Modal */}
      {isDiscardConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl border border-[#F4CEB8] bg-[#FAF8F5] p-6 shadow-bloom-modal">
            <div className="flex items-center gap-2 text-[#A85E37] mb-2">
              <AlertTriangle className="h-5 w-5" />
              <h4 className="text-base font-bold font-sans">Discard Active Session?</h4>
            </div>
            <p className="text-xs text-ink-secondary leading-relaxed font-sans">
              This will discard the currently tracked {formatSecondsToTimer(activeTimerElapsedSeconds)}. This action cannot be undone.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2.5 font-sans">
              <button
                onClick={() => setIsDiscardConfirmOpen(false)}
                className="rounded-xl border border-[#EAE1D8] bg-white px-4 py-2 text-xs font-bold text-ink-primary hover:bg-[#FAF8F5] shadow-bloom"
              >
                Keep Studying
              </button>
              <button
                onClick={handleConfirmDiscard}
                className="rounded-xl bg-[#FBE7DB] border border-[#F4CEB8] px-4 py-2 text-xs font-bold text-[#A85E37] hover:bg-[#F7D4C1] shadow-bloom"
              >
                Discard Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Session Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-[#CBB8EC] bg-[#FAF8F5] p-6 shadow-bloom-modal space-y-4">
            <div>
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#553C9A]">Session Complete</span>
              <h3 className="text-lg font-bold text-ink-primary font-sans mt-0.5">
                Save {formatSecondsToTimer(activeTimerElapsedSeconds)} Study Session
              </h3>
              <p className="text-xs text-ink-secondary mt-0.5 font-sans font-medium">
                Day {activeTimer?.dayNumber}: {activeTimer?.activity}
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-ink-primary font-sans">Session Takeaways & Log Notes (Optional):</label>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                rows={3}
                placeholder="What did you build or learn? Any blocker resolved?"
                className="mt-1.5 w-full rounded-2xl border border-[#CBB8EC] bg-white p-3 text-xs text-ink-primary focus:border-brand-primary focus:outline-none font-sans shadow-bloom"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 font-sans">
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="rounded-xl border border-[#EAE1D8] bg-white px-4 py-2 text-xs font-bold text-ink-primary hover:bg-[#FAF8F5] shadow-bloom"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSession}
                className="rounded-xl bg-brand-primary px-5 py-2 text-xs font-bold text-white shadow-bloom hover:bg-brand-hover"
              >
                Confirm & Log Hours
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
