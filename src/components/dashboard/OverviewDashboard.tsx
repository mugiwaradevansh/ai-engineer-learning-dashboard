import React from 'react';
import {
  CheckCircle2,
  Clock,
  Flame,
  BookOpen,
  ArrowRight,
  Play,
  Rocket,
  CheckSquare,
  ChevronRight,
  Target,
  Sparkles,
} from 'lucide-react';
import { useRoadmap } from '../../context/RoadmapContext';
import {
  allPhases,
  allDays,
  allProjects,
  getClosestDay,
} from '../../data/roadmapData';
import {
  calculateOverallProgress,
  calculateAllChecklists,
  calculateDayChecklist,
  calculatePhaseProgress,
  calculateTotalActualHours,
  calculateTodayActualHours,
  calculateStreak,
} from '../../utils/calculations';
import { formatMinutesHuman, formatRelativeTime } from '../../utils/dateUtils';
import { getPhaseTheme, getDifficultyBadge } from '../../utils/themeUtils';
import { WeeklyStudyChart } from './WeeklyStudyChart';
import { HeatmapCalendar } from './HeatmapCalendar';

export const OverviewDashboard: React.FC = () => {
  const {
    progress,
    currentRoadmapDay,
    navigateToDay,
    setCurrentView,
    startTimer,
    toggleDayCompleted,
  } = useRoadmap();

  // Calculations
  const overall = calculateOverallProgress(progress.completedDays, 185);
  const totalActualHours = calculateTotalActualHours(progress.studySessions);
  const todayActualHours = calculateTodayActualHours(progress.studySessions);
  const checklists = calculateAllChecklists(allDays, progress.completedChecklist);
  const streaks = calculateStreak(progress.studySessions, progress.completedDays, progress.startDate);
  const phaseProgressList = calculatePhaseProgress(
    allPhases,
    allDays,
    progress.completedDays,
    progress.studySessions
  );

  // Today's scheduled lesson
  const targetDay = getClosestDay(currentRoadmapDay);
  const todayChecklist = calculateDayChecklist(
    targetDay.day,
    targetDay.checklist,
    progress.completedChecklist
  );
  const isTargetDayCompleted = !!progress.completedDays[targetDay.day];
  const targetPhase = allPhases.find((p) => p.id === targetDay.phase) || allPhases[0];
  const phaseTheme = getPhaseTheme(targetDay.phase);
  const diffBadge = getDifficultyBadge(targetDay.difficulty);

  return (
    <div className="space-y-7 pb-16">
      {/* 1. MAIN WELCOME SECTION: Large, visible pastel gradient with fine paper grain */}
      <div className="gradient-welcome-bloom grain-overlay rounded-3xl border border-surface-border p-6 sm:p-8 shadow-bloom">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/80 border border-white/60 text-brand-primary text-xs font-semibold px-3 py-0.5 shadow-bloom font-sans">
                AI Engineer Roadmap 2026
              </span>
              <span className="text-xs font-sans text-ink-secondary">
                • 185 Days Curriculum Horizon
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-ink-primary font-sans">
              Quiet Bloom Studio
            </h1>
            <p className="text-sm sm:text-base text-ink-primary/85 font-serif italic leading-relaxed">
              Where disciplined daily practice blossoms into production engineering mastery.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigateToDay(targetDay.day)}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-xs font-semibold text-white shadow-bloom hover:bg-brand-hover transition-bloom active:scale-98"
            >
              <BookOpen className="h-4 w-4 text-white" />
              <span>Open Day {targetDay.day} Room</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SIX STATISTIC CARDS: Distinct, visibly tinted pastel surfaces */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Card 1: Curriculum Completion (Lavender) */}
        <div className="rounded-2xl border border-[#D8C8F0] bg-[#EEE6FA] p-4 shadow-bloom flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between text-[#6D56A6]">
            <span className="text-xs font-bold font-sans">Curriculum</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="my-2.5">
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-primary font-mono tabular-nums">
              {overall.percentage}%
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/60">
              <div
                className="h-full rounded-full bg-[#6D56A6] transition-all duration-500"
                style={{ width: `${overall.percentage}%` }}
              />
            </div>
          </div>
          <p className="text-xs font-medium text-ink-secondary font-sans truncate">
            {overall.completedCount} of 185 days
          </p>
        </div>

        {/* Card 2: Actual Study Effort (Powder Blue) */}
        <div className="rounded-2xl border border-[#C6DCF8] bg-[#E5EFFB] p-4 shadow-bloom flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between text-[#3B689B]">
            <span className="text-xs font-bold font-sans">Actual Study</span>
            <Clock className="h-4 w-4" />
          </div>
          <div className="my-2.5">
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-primary font-mono tabular-nums">
              {totalActualHours}<span className="text-sm font-semibold text-ink-secondary ml-0.5">h</span>
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/60">
              <div
                className="h-full rounded-full bg-[#3B689B] transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((totalActualHours / 740) * 100))}%` }}
              />
            </div>
          </div>
          <p className="text-xs font-medium text-ink-secondary font-sans truncate">
            {todayActualHours > 0 ? `${todayActualHours}h logged today` : '0h logged today'}
          </p>
        </div>

        {/* Card 3: Checklist Items (Soft Mint) */}
        <div className="rounded-2xl border border-[#BEE0CA] bg-[#E1F1E6] p-4 shadow-bloom flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between text-[#31785C]">
            <span className="text-xs font-bold font-sans">Checklists</span>
            <CheckSquare className="h-4 w-4" />
          </div>
          <div className="my-2.5">
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-primary font-mono tabular-nums">
              {checklists.percentage}%
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/60">
              <div
                className="h-full rounded-full bg-[#31785C] transition-all duration-500"
                style={{ width: `${checklists.percentage}%` }}
              />
            </div>
          </div>
          <p className="text-xs font-medium text-ink-secondary font-sans truncate">
            {checklists.completed} / {checklists.total} tasks
          </p>
        </div>

        {/* Card 4: Pacing Schedule (Dusty Rose) */}
        <div className="rounded-2xl border border-[#E5C8D9] bg-[#F3DFE8] p-4 shadow-bloom flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between text-[#853D68]">
            <span className="text-xs font-bold font-sans">Schedule</span>
            <Target className="h-4 w-4" />
          </div>
          <div className="my-2.5">
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-primary font-mono tabular-nums">
              Day {currentRoadmapDay}
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/60">
              <div
                className="h-full rounded-full bg-[#853D68] transition-all duration-500"
                style={{ width: `${Math.round((currentRoadmapDay / 185) * 100)}%` }}
              />
            </div>
          </div>
          <p className="text-xs font-medium text-ink-secondary font-sans truncate">
            Phase {targetPhase.id}: {targetPhase.title.split(' ')[0]}
          </p>
        </div>

        {/* Card 5: Daily Target (Butter Cream) */}
        <div className="rounded-2xl border border-[#F2DE98] bg-[#FFF1CB] p-4 shadow-bloom flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between text-[#785A10]">
            <span className="text-xs font-bold font-sans">Daily Quota</span>
            <Clock className="h-4 w-4" />
          </div>
          <div className="my-2.5">
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-primary font-mono tabular-nums">
              {targetDay.time_hours}<span className="text-sm font-semibold text-ink-secondary ml-0.5">h</span>
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/60">
              <div
                className="h-full rounded-full bg-[#785A10] transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((todayActualHours / targetDay.time_hours) * 100))}%` }}
              />
            </div>
          </div>
          <p className="text-xs font-medium text-ink-secondary font-sans truncate">
            {todayActualHours >= targetDay.time_hours ? 'Target achieved' : `${Math.max(0, targetDay.time_hours - todayActualHours)}h remaining`}
          </p>
        </div>

        {/* Card 6: Consistency Cadence (Soft Sage) */}
        <div className="rounded-2xl border border-[#CAD7C0] bg-[#E4EBDD] p-4 shadow-bloom flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between text-[#3D5C2E]">
            <span className="text-xs font-bold font-sans">Cadence</span>
            <Flame className="h-4 w-4 fill-current" />
          </div>
          <div className="my-2.5">
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-primary font-mono tabular-nums">
              {streaks.currentStreak}<span className="text-sm font-semibold text-ink-secondary ml-0.5">d</span>
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/60">
              <div
                className="h-full rounded-full bg-[#3D5C2E] transition-all duration-500"
                style={{ width: `${Math.min(100, (streaks.currentStreak / 30) * 100)}%` }}
              />
            </div>
          </div>
          <p className="text-xs font-medium text-ink-secondary font-sans truncate">
            Best streak: {streaks.longestStreak} days
          </p>
        </div>
      </div>

      {/* 3. DAILY LEARNING HERO CARD: Distinctly visible pastel gradient + fine paper texture */}
      <div className="gradient-hero-card grain-overlay rounded-3xl border border-[#D5CBE5] p-6 sm:p-8 shadow-bloom-card">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="space-y-3.5 min-w-0">
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-xl bg-ink-primary font-mono text-xs font-bold text-white px-3 py-1 tracking-wider shadow-bloom">
                DAY {targetDay.day}
              </span>
              <span className={`rounded-xl px-2.5 py-1 text-xs font-semibold font-sans border ${phaseTheme.badgeBg} ${phaseTheme.badgeText} ${phaseTheme.cardBorder}`}>
                Phase {targetDay.phase}: {phaseTheme.name}
              </span>
              <span className="rounded-xl bg-white/80 border border-surface-border px-2.5 py-1 text-xs font-medium text-ink-primary shadow-bloom">
                {targetDay.node_title}
              </span>
              <span className={`rounded-xl px-2.5 py-1 text-xs font-semibold font-sans ${diffBadge.bg} ${diffBadge.text}`}>
                {diffBadge.label}
              </span>
              <span className="flex items-center gap-1 text-xs font-mono font-medium text-ink-secondary bg-white/70 px-2.5 py-1 rounded-xl border border-surface-border">
                <Clock className="h-3.5 w-3.5 text-brand" />
                {targetDay.time_hours}h planned
              </span>
            </div>

            {/* Lesson Title & Instructions */}
            <div className="min-w-0">
              <h2 className="text-2xl font-bold tracking-tight text-ink-primary sm:text-3xl leading-snug font-sans">
                {targetDay.day_title}
              </h2>
              <p className="mt-2 text-sm text-ink-primary/85 max-w-3xl leading-relaxed font-sans">
                {targetDay.how_to_learn}
              </p>
            </div>

            {/* Checklist progress tracker */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <div className="flex items-center gap-2.5 text-xs font-sans">
                <div className="h-2 w-44 overflow-hidden rounded-full bg-white/80 border border-surface-border">
                  <div
                    className="h-full rounded-full bg-phase3-accent transition-all duration-500"
                    style={{ width: `${todayChecklist.percentage}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-ink-primary">
                  {todayChecklist.completed} of {todayChecklist.total} verified ({todayChecklist.percentage}%)
                </span>
              </div>

              {isTargetDayCompleted && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-phase3-accent bg-phase3-bg px-2.5 py-1 rounded-xl border border-phase3-border shadow-bloom">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Day Completed
                </span>
              )}
            </div>
          </div>

          {/* Action Button Group with ACCESSIBLE PASTEL BUTTONS (No invisible white buttons) */}
          <div className="flex flex-col gap-2.5 sm:flex-row lg:flex-col shrink-0">
            {/* Primary Action Button: #665397 with clean white text */}
            <button
              onClick={() => navigateToDay(targetDay.day)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-5 py-3 text-xs font-bold text-white shadow-bloom hover:bg-brand-hover transition-bloom active:scale-98"
            >
              <span>Enter Study Room</span>
              <ArrowRight className="h-4 w-4 text-white" />
            </button>

            {/* Secondary Action: Start Timer in Distinct Powder Blue */}
            <button
              onClick={() => {
                startTimer(targetDay.day, targetDay.day_title);
                setCurrentView('timer');
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-pastel-powder-border bg-pastel-powder px-4 py-2.5 text-xs font-bold text-pastel-powder-text hover:bg-[#CFE2F8] transition-bloom shadow-bloom active:scale-98"
            >
              <Play className="h-3.5 w-3.5 fill-current text-pastel-powder-text" />
              <span>Start Focus Timer</span>
            </button>

            {/* Complete Action: In Distinct Soft Mint */}
            {!isTargetDayCompleted && (
              <button
                onClick={() => toggleDayCompleted(targetDay.day)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-pastel-mint-border bg-pastel-mint px-4 py-2.5 text-xs font-bold text-pastel-mint-text hover:bg-[#CEEADB] transition-bloom text-center shadow-bloom active:scale-98"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-pastel-mint-text" />
                <span>Mark Day Complete</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Middle Row: Weekly Effort & Activity Heatmap */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <WeeklyStudyChart />
        <HeatmapCalendar />
      </div>

      {/* 5. 4 Phases with 70% Recognizable Pastel Solid Identities */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary font-sans">
              Curriculum Architecture
            </span>
            <h2 className="text-base font-bold text-ink-primary font-sans">Four Foundational Phases</h2>
          </div>
          <button
            onClick={() => setCurrentView('explorer')}
            className="flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline font-sans"
          >
            <span>View All Lessons</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {phaseProgressList.map((phase) => {
            const rawPhase = allPhases.find((p) => p.id === phase.phaseId)!;
            const theme = getPhaseTheme(phase.phaseId);

            // Saturated pastel background per phase (70% color coverage)
            const phaseBg =
              phase.phaseId === 1 ? 'bg-[#E5EFFB] border-[#C5DAF5]' :
              phase.phaseId === 2 ? 'bg-[#EEE6FA] border-[#D7C7F2]' :
              phase.phaseId === 3 ? 'bg-[#E1F1E6] border-[#BDDFC6]' :
              'bg-[#FBE7DB] border-[#F4CEB8]';

            return (
              <div
                key={phase.phaseId}
                className={`flex flex-col justify-between rounded-3xl border ${phaseBg} p-5 shadow-bloom hover:shadow-bloom-card transition-bloom`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`rounded-xl px-2.5 py-0.5 text-xs font-bold font-sans bg-white/90 border ${theme.cardBorder} ${theme.badgeText}`}>
                      Phase {phase.phaseId}
                    </span>
                    <span className="rounded-lg bg-white/80 border border-surface-border px-2 py-0.5 text-xs font-mono font-medium text-ink-secondary">
                      D{rawPhase.days_range[0]}–{rawPhase.days_range[1]}
                    </span>
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-ink-primary line-clamp-1 font-sans">{phase.title}</h3>
                  <p className="mt-1 text-xs text-ink-secondary line-clamp-2 leading-relaxed font-sans">{rawPhase.subtitle}</p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-black/10">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="text-ink-secondary font-medium">
                      {phase.completedDays} / {phase.totalDays} days
                    </span>
                    <span className={`font-bold font-mono ${theme.badgeText}`}>{phase.percentage}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/90 border border-black/5">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${phase.percentage}%`, backgroundColor: theme.barColor }}
                    />
                  </div>
                  <div className="mt-1.5 text-xs font-sans text-ink-secondary text-right font-medium">
                    {phase.actualHours} hrs logged
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Bottom Row: Capstone Projects & Recent Sessions */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Capstone Milestone Highlights with Soft Powder Blue Atmosphere */}
        <div className="rounded-3xl border border-[#C6DCF8] bg-[#F2F7FD] p-6 shadow-bloom space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Rocket className="h-4 w-4 text-brand-primary" />
              <h3 className="text-sm font-bold text-ink-primary font-sans">Capstone Milestones</h3>
            </div>
            <button
              onClick={() => setCurrentView('projects')}
              className="text-xs font-bold text-brand-primary hover:underline font-sans"
            >
              All Projects →
            </button>
          </div>

          <div className="space-y-2.5">
            {allProjects.map((proj) => {
              const projProg = progress.projectProgress[proj.id];
              const isCompleted = projProg?.status === 'completed';
              const isInProgress = projProg?.status === 'in_progress';
              const theme = getPhaseTheme(proj.phase);

              return (
                <div
                  key={proj.id}
                  onClick={() => setCurrentView('projects')}
                  className="flex items-center justify-between rounded-2xl border border-surface-border bg-white p-3.5 hover:border-brand-primary hover:shadow-bloom transition-bloom cursor-pointer"
                >
                  <div className="space-y-0.5 truncate pr-3">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold font-mono ${theme.badgeBg} ${theme.badgeText} border ${theme.cardBorder}`}>
                        {proj.id}
                      </span>
                      <span className="text-xs font-bold text-ink-primary truncate font-sans">{proj.title}</span>
                    </div>
                    <p className="text-xs text-ink-secondary truncate font-sans">
                      Phase {proj.phase} • Days {proj.days.join(', ')}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize font-sans shrink-0 ${
                      isCompleted
                        ? 'bg-phase3-bg text-phase3-accent border border-phase3-border'
                        : isInProgress
                        ? 'bg-phase1-bg text-phase1-accent border border-phase1-border'
                        : 'bg-surface text-ink-secondary border border-surface-border'
                    }`}
                  >
                    {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Not Started'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Study Sessions */}
        <div className="rounded-2xl border border-surface-border bg-surface p-5 shadow-bloom space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-phase3-accent" />
              <h3 className="text-sm font-bold text-ink-primary font-sans">Recent Study Sessions</h3>
            </div>
            <button
              onClick={() => setCurrentView('timer')}
              className="text-xs font-semibold text-brand-primary hover:underline font-sans"
            >
              Session History →
            </button>
          </div>

          {progress.studySessions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-surface-border py-8 text-center text-xs text-ink-muted font-sans">
              No study sessions logged yet. Start a session with the Focus Timer to track your hours.
            </div>
          ) : (
            <div className="space-y-2.5">
              {progress.studySessions.slice(-4).reverse().map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-xl border border-surface-border bg-surface-subtle p-3"
                >
                  <div className="space-y-0.5 truncate pr-3">
                    <p className="text-xs font-semibold text-ink-primary truncate font-sans">
                      Day {session.dayNumber}: {session.activity}
                    </p>
                    <p className="text-xs text-ink-muted font-sans">
                      {formatRelativeTime(session.createdAt)}
                    </p>
                  </div>
                  <span className="rounded-lg bg-phase3-bg border border-phase3-border px-2.5 py-0.5 text-xs font-mono font-semibold text-phase3-accent shrink-0">
                    {formatMinutesHuman(session.durationMinutes)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
