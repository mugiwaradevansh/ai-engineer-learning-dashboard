import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Timer,
  Compass,
  Calendar,
  Rocket,
  BarChart3,
  Library,
  Settings,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useRoadmap, DashboardView } from '../../context/RoadmapContext';
import { calculateOverallProgress, calculateStreak } from '../../utils/calculations';
import { allPhases, allDays } from '../../data/roadmapData';
import { getPhaseTheme } from '../../utils/themeUtils';

interface NavItem {
  id: DashboardView;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    selectedDayNumber,
    activeTimer,
    progress,
    openSettings,
    navigateToPhase,
    selectedPhaseFilter,
  } = useRoadmap();

  const overall = calculateOverallProgress(progress.completedDays, 185);
  const streaks = calculateStreak(progress.studySessions, progress.completedDays, progress.startDate);

  const mainNavItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'study',
      label: 'Daily Study Room',
      icon: BookOpen,
      badge: `D${selectedDayNumber}`,
    },
    {
      id: 'timer',
      label: 'Focus Timer',
      icon: Timer,
      badge: activeTimer ? (activeTimer.isRunning ? 'Active' : 'Paused') : undefined,
    },
    {
      id: 'explorer',
      label: 'Curriculum Explorer',
      icon: Compass,
      badge: '185d',
    },
    {
      id: 'calendar',
      label: 'Study Calendar',
      icon: Calendar,
    },
  ];

  const secondaryNavItems: NavItem[] = [
    {
      id: 'projects',
      label: 'Capstone Projects',
      icon: Rocket,
      badge: '4',
    },
    {
      id: 'analytics',
      label: 'Analytics & Benchmarks',
      icon: BarChart3,
    },
    {
      id: 'vault',
      label: 'Reference Vault',
      icon: Library,
      badge: 'Library',
    },
  ];

  const renderNavButton = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;
    return (
      <button
        key={item.id}
        onClick={() => setCurrentView(item.id)}
        className={`group relative flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold font-sans transition-bloom ${
          isActive
            ? 'bg-phase2-bg text-phase2-accent border border-phase2-border shadow-bloom'
            : 'text-ink-primary hover:bg-surface-subtle border border-transparent'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {isActive && (
            <span className="absolute left-1.5 h-4 w-1 rounded-full bg-brand-primary" />
          )}
          <Icon
            className={`h-4 w-4 transition-bloom ${
              isActive ? 'text-brand-primary' : 'text-ink-secondary group-hover:text-ink-primary'
            }`}
          />
          <span className={isActive ? 'ml-1' : ''}>{item.label}</span>
        </div>

        {item.badge && (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold font-mono transition-bloom ${
              isActive
                ? 'bg-white text-brand-primary border border-phase2-border shadow-bloom'
                : item.id === 'timer' && activeTimer
                ? activeTimer.isRunning
                  ? 'bg-phase3-bg text-phase3-accent font-semibold animate-pulse border border-phase3-border'
                  : 'bg-phase4-bg text-phase4-accent font-semibold border border-phase4-border'
                : 'bg-surface-subtle text-ink-secondary border border-surface-border group-hover:bg-white'
            }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 flex-col border-r border-surface-border bg-[#F8F5F1] lg:flex shrink-0 overflow-hidden">
      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3.5 space-y-4 overscroll-contain">
        {/* Core Workspace */}
        <div>
          <p className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted font-sans">Workspace</p>
          <nav className="mt-1.5 space-y-1">
            {mainNavItems.map(renderNavButton)}
          </nav>
        </div>

        {/* Portfolio & Assets */}
        <div>
          <p className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted font-sans">Outputs & Assets</p>
          <nav className="mt-1.5 space-y-1">
            {secondaryNavItems.map(renderNavButton)}
          </nav>
        </div>

        {/* 4 Phases with Recognizable Pastel Identities (Interactive Filter) */}
        <div>
          <div className="flex items-center justify-between px-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted font-sans">Curriculum Phases</p>
            <span className="text-[10px] text-ink-secondary font-mono font-medium">185d</span>
          </div>

          <div className="mt-1.5 space-y-1.5">
            {allPhases.map((phase) => {
              const theme = getPhaseTheme(phase.id);
              const daysInPhase = allDays.filter((d) => d.phase === phase.id);
              const completedCount = daysInPhase.filter((d) => progress.completedDays[d.day]).length;
              const pct = daysInPhase.length > 0 ? Math.round((completedCount / daysInPhase.length) * 100) : 0;
              const isPhaseActive = currentView === 'explorer' && selectedPhaseFilter === phase.id;

              return (
                <button
                  key={phase.id}
                  onClick={() => navigateToPhase(phase.id)}
                  title={`Filter Explorer to Phase ${phase.id}`}
                  className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition-bloom border font-sans shadow-bloom ${
                    isPhaseActive
                      ? `${theme.badgeBg} ${theme.badgeText} ${theme.cardBorder} ring-2 ring-brand/30 font-bold`
                      : `${theme.badgeBg}/80 hover:${theme.badgeBg} ${theme.cardBorder} text-ink-primary hover:scale-[1.01]`
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden min-w-0">
                    <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${theme.dotColor}`} />
                    <span className="truncate text-xs font-semibold font-sans">
                      Phase {phase.id}: {phase.title.split(' ')[0]}
                    </span>
                  </div>

                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold font-mono border shrink-0 bg-white/90 ${theme.badgeText} ${theme.cardBorder}`}>
                    {pct}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pinned Bottom Dock: Always fully visible, never cut off */}
      <div className="shrink-0 border-t border-surface-border bg-[#F8F5F1] p-3 space-y-2 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] z-10">
        {/* Streak indicator in warm peach */}
        {streaks.currentStreak > 0 && (
          <div className="flex items-center justify-between rounded-xl bg-phase4-bg border border-phase4-border px-3 py-1.5 text-xs text-phase4-accent shadow-bloom">
            <div className="flex items-center gap-1.5 font-bold font-sans">
              <Flame className="h-3.5 w-3.5 fill-current text-phase4-accent" />
              <span>{streaks.currentStreak}-Day Cadence</span>
            </div>
            <span className="text-[10px] font-mono font-bold">Active</span>
          </div>
        )}

        {/* Progress Mini Widget */}
        <div className="rounded-xl border border-surface-border bg-white/85 p-2.5 shadow-bloom font-sans">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-ink-primary text-[11px]">Roadmap Horizon</span>
            <span className="font-bold text-brand-primary font-mono text-xs">{overall.percentage}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-subtle border border-surface-border">
            <div
              className="h-full rounded-full bg-brand-primary transition-all duration-500"
              style={{ width: `${overall.percentage}%` }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-ink-secondary font-medium">
            <span>{overall.completedCount} verified</span>
            <span>185 total days</span>
          </div>
        </div>

        {/* High-Contrast Tactile Settings Button */}
        <button
          onClick={openSettings}
          className="flex w-full items-center justify-between rounded-xl border border-surface-border bg-white px-3 py-2 text-xs font-bold text-ink-primary hover:border-brand-primary hover:bg-[#EEE6FA] hover:text-brand-primary transition-bloom shadow-bloom font-sans active:scale-[0.98]"
        >
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-brand-primary shrink-0" />
            <span>Workspace Settings</span>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-brand-primary shrink-0" />
        </button>
      </div>
    </aside>
  );
};
