import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  CheckCircle2,
  Clock,
  CheckSquare,
  Flame,
} from 'lucide-react';
import { useRoadmap } from '../../context/RoadmapContext';
import {
  allDays,
  allPhases,
} from '../../data/roadmapData';
import {
  calculateOverallProgress,
  calculateAllChecklists,
  calculatePhaseProgress,
  calculateTotalActualHours,
  calculateStreak,
} from '../../utils/calculations';
import { getPhaseTheme } from '../../utils/themeUtils';
import { WeeklyStudyChart } from '../dashboard/WeeklyStudyChart';
import { HeatmapCalendar } from '../dashboard/HeatmapCalendar';

export const AnalyticsView: React.FC = () => {
  const { progress, navigateToDay } = useRoadmap();

  const overall = calculateOverallProgress(progress.completedDays, 185);
  const checklists = calculateAllChecklists(allDays, progress.completedChecklist);
  const totalActualHours = calculateTotalActualHours(progress.studySessions);
  const streak = calculateStreak(progress.studySessions, progress.completedDays, progress.startDate);
  const phaseSummaries = calculatePhaseProgress(
    allPhases,
    allDays,
    progress.completedDays,
    progress.studySessions
  );

  // Phase comparison chart data
  const phaseChartData = phaseSummaries.map((p) => ({
    name: `Phase ${p.phaseId}`,
    completed: p.completedDays,
    total: p.totalDays,
    percentage: p.percentage,
    hours: p.actualHours,
  }));

  // Difficulty breakdown data
  const difficultyCounts = {
    beginner: { total: 0, completed: 0 },
    intermediate: { total: 0, completed: 0 },
    advanced: { total: 0, completed: 0 },
  };

  allDays.forEach((d) => {
    const diff = d.difficulty.toLowerCase();
    if (diff.includes('beginner') && !diff.includes('intermediate')) {
      difficultyCounts.beginner.total++;
      if (progress.completedDays[d.day]) difficultyCounts.beginner.completed++;
    } else if (diff.includes('advanced')) {
      difficultyCounts.advanced.total++;
      if (progress.completedDays[d.day]) difficultyCounts.advanced.completed++;
    } else {
      difficultyCounts.intermediate.total++;
      if (progress.completedDays[d.day]) difficultyCounts.intermediate.completed++;
    }
  });

  const difficultyChartData = [
    { name: 'Beginner', value: difficultyCounts.beginner.total, completed: difficultyCounts.beginner.completed, color: '#275A41', bg: 'bg-bloom-mint-ink' },
    { name: 'Intermediate', value: difficultyCounts.intermediate.total, completed: difficultyCounts.intermediate.completed, color: '#2B537D', bg: 'bg-bloom-blue-ink' },
    { name: 'Advanced', value: difficultyCounts.advanced.total, completed: difficultyCounts.advanced.completed, color: '#7A4226', bg: 'bg-bloom-peach-ink' },
  ];

  // Recently completed topics
  const completedDayNumbers = Object.keys(progress.completedDays)
    .filter((k) => progress.completedDays[Number(k)])
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-bloom-muted">
          <span>ROADMAP AUDIT</span>
          <span>•</span>
          <span>EMPIRICAL METRICS</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-bloom-text sm:text-3xl font-sans">
          Learning Analytics & Benchmarks
        </h1>
        <p className="mt-0.5 text-xs text-bloom-muted">
          Multi-dimensional progress metrics separating curriculum completion from checklist mastery and logged hours
        </p>
      </div>

      {/* Triad of Progress Metrics (70% Quiet Bloom Pastel Saturation) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Roadmap Completion (Powder Blue) */}
        <div className="rounded-3xl border border-[#C5DAF5] bg-[#E5EFFB] p-5 shadow-bloom flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#2B537D]">1. Curriculum</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-[#C5DAF5] text-[#2B537D] shadow-bloom">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-ink-primary font-mono tabular-nums">{overall.percentage}%</p>
          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-white/80 border border-black/5">
            <div className="h-full rounded-full bg-[#3B689B]" style={{ width: `${overall.percentage}%` }} />
          </div>
          <p className="mt-2 text-xs font-semibold text-[#2B537D] font-sans">
            {overall.completedCount} of 185 days verified
          </p>
        </div>

        {/* Metric 2: Checklist Mastery (Soft Mint) */}
        <div className="rounded-3xl border border-[#BDDFC6] bg-[#E1F1E6] p-5 shadow-bloom flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#31785C]">2. Checklists</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-[#BDDFC6] text-[#31785C] shadow-bloom">
              <CheckSquare className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-ink-primary font-mono tabular-nums">{checklists.percentage}%</p>
          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-white/80 border border-black/5">
            <div className="h-full rounded-full bg-[#31785C]" style={{ width: `${checklists.percentage}%` }} />
          </div>
          <p className="mt-2 text-xs font-semibold text-[#31785C] font-sans">
            {checklists.completed} of {checklists.total} checklist tasks
          </p>
        </div>

        {/* Metric 3: Total Actual Study Hours (Muted Lavender) */}
        <div className="rounded-3xl border border-[#D7C7F2] bg-[#EEE6FA] p-5 shadow-bloom flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#6D56A6]">3. Actual Hours</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-[#D7C7F2] text-[#6D56A6] shadow-bloom">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-ink-primary font-mono tabular-nums">
            {totalActualHours} <span className="text-base font-medium text-ink-secondary">hrs</span>
          </p>
          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-white/80 border border-black/5">
            <div
              className="h-full rounded-full bg-[#6D56A6]"
              style={{ width: `${Math.min(100, Math.round((totalActualHours / 740) * 100))}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-semibold text-[#6D56A6] font-sans">
            Across {progress.studySessions.length} verified sessions
          </p>
        </div>

        {/* Metric 4: Consistency Streak (Warm Peach) */}
        <div className="rounded-3xl border border-[#F4CEB8] bg-[#FBE7DB] p-5 shadow-bloom flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#A85E37]">4. Cadence</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-[#F4CEB8] text-[#A85E37] shadow-bloom">
              <Flame className="h-4 w-4 fill-current" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-ink-primary font-mono tabular-nums">
            {streak.currentStreak} <span className="text-base font-medium text-ink-secondary">days</span>
          </p>
          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-white/80 border border-black/5">
            <div
              className="h-full rounded-full bg-[#A85E37]"
              style={{ width: `${Math.min(100, (streak.currentStreak / 30) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-semibold text-[#A85E37] font-sans">
            Best streak: {streak.longestStreak} days
          </p>
        </div>
      </div>

      {/* Middle Row: Phase Completion Chart & Difficulty Breakdown */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Phase Completion Bar Chart (2 Cols) in Soft Lavender */}
        <div className="rounded-3xl border border-[#D7C7F2] bg-[#F7F3FD] p-6 shadow-bloom lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-bloom-muted">Foundational Phases</span>
              <h3 className="text-sm font-bold text-bloom-text">Curriculum Completion by Phase</h3>
            </div>
            <span className="text-xs font-mono font-medium text-bloom-muted bg-surface-subtle px-2.5 py-1 rounded-xl border border-bloom-border">
              185 Horizon
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={phaseChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAE5EC" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#777384', fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#777384', fontSize: 11, fontFamily: 'monospace' }} />
                <Tooltip
                  cursor={{ fill: 'rgba(128, 114, 184, 0.04)' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const completed = payload.find((p) => p.dataKey === 'completed')?.value ?? 0;
                      const total = payload.find((p) => p.dataKey === 'total')?.value ?? 0;
                      const pct = payload[0]?.payload?.percentage;
                      const hours = payload[0]?.payload?.hours;
                      return (
                        <div className="rounded-xl border border-bloom-border bg-surface p-3 shadow-bloom-modal text-xs font-mono">
                          <p className="font-semibold text-bloom-text">{label}</p>
                          <p className="mt-1 text-bloom-muted">
                            Completed: <strong className="text-bloom-text">{completed}</strong> / {total} days ({pct}%)
                          </p>
                          <p className="text-bloom-mint-ink font-semibold mt-0.5">{hours} hours logged</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="total" fill="#EAE5EC" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="completed" fill="#8072B8" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Difficulty Breakdown (1 Col) in Warm Peach */}
        <div className="rounded-3xl border border-[#F2DCCF] bg-[#FAF3EC] p-6 shadow-bloom flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-ink-secondary">Complexity Gradient</span>
            <h3 className="text-sm font-bold text-ink-primary font-sans">Challenge Tiers</h3>
          </div>

          <div className="my-4 space-y-4">
            {difficultyChartData.map((d) => {
              const pct = d.value > 0 ? Math.round((d.completed / d.value) * 100) : 0;
              return (
                <div key={d.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 font-bold text-ink-primary font-sans">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      {d.name}
                    </span>
                    <span className="text-ink-secondary font-mono text-xs font-semibold">
                      {d.completed} / {d.value} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-white border border-black/10">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${d.bg}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl bg-white p-3.5 text-xs text-ink-secondary border border-surface-border leading-relaxed font-sans shadow-bloom">
            <span className="font-bold text-ink-primary">Curriculum Note:</span> Over 60% of curriculum content resides in Advanced tiers (multi-agent graphs, LoRA fine-tuning, Triton kernels, and cloud LLMOps).
          </div>
        </div>
      </div>

      {/* Heatmap & Weekly Chart Components */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <WeeklyStudyChart />
        <HeatmapCalendar />
      </div>

      {/* Recently Completed Topics Feed in Powder Blue */}
      <div className="rounded-3xl border border-[#C5DAF5] bg-[#F2F7FD] p-6 shadow-bloom space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-bloom-muted">Verified Milestones</span>
            <h3 className="text-sm font-bold text-bloom-text">Recently Completed Topics</h3>
          </div>
          <span className="text-xs font-mono text-bloom-muted">{completedDayNumbers.length} completed</span>
        </div>

        {completedDayNumbers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-bloom-border py-8 text-center text-xs text-bloom-muted">
            No completed lessons yet. Mark lessons complete in the Daily Study Room or Curriculum Explorer.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {completedDayNumbers.slice(0, 9).map((dayNum) => {
              const day = allDays.find((d) => d.day === dayNum);
              if (!day) return null;
              const theme = getPhaseTheme(day.phase);
              return (
                <button
                  key={dayNum}
                  onClick={() => navigateToDay(dayNum)}
                  className="flex items-center justify-between rounded-xl border border-bloom-border bg-surface-subtle p-3 text-left hover:border-bloom-border-strong hover:bg-surface transition-bloom group"
                >
                  <div className="space-y-1 truncate pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-bloom-mint-ink text-[9px] text-white font-bold">
                        ✓
                      </span>
                      <span className="font-mono text-xs font-semibold text-bloom-text">Day {day.day}</span>
                      <span className={`rounded-md px-1.5 py-0.2 text-[9px] font-mono font-semibold ${theme.badgeBg} ${theme.badgeText}`}>
                        P{day.phase}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-bloom-text truncate group-hover:text-bloom-violet transition-bloom">
                      {day.day_title}
                    </p>
                    <p className="text-[10px] text-bloom-muted truncate font-mono">{day.node_title}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
