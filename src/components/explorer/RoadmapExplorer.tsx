import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useRoadmap } from '../../context/RoadmapContext';
import {
  allDays,
  allPhases,
} from '../../data/roadmapData';
import { calculateDayChecklist } from '../../utils/calculations';
import { getPhaseTheme, getDifficultyBadge } from '../../utils/themeUtils';

type StatusFilter = 'all' | 'completed' | 'in_progress' | 'not_started';

export const RoadmapExplorer: React.FC = () => {
  const {
    progress,
    navigateToDay,
    toggleDayCompleted,
    selectedPhaseFilter,
    setSelectedPhaseFilter,
  } = useRoadmap();

  const [searchQuery, setSearchQuery] = useState('');
  const selectedPhase = selectedPhaseFilter;
  const setSelectedPhase = setSelectedPhaseFilter;
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
  });

  const togglePhaseExpand = (phaseId: number) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseId]: !prev[phaseId],
    }));
  };

  const expandAll = () => {
    setExpandedPhases({ 1: true, 2: true, 3: true, 4: true });
  };

  const collapseAll = () => {
    setExpandedPhases({ 1: false, 2: false, 3: false, 4: false });
  };

  // Filter lessons
  const filteredDays = useMemo(() => {
    return allDays.filter((day) => {
      // Phase filter
      if (selectedPhase !== 'all' && day.phase !== selectedPhase) {
        return false;
      }

      // Difficulty filter
      if (difficultyFilter !== 'all' && day.difficulty.toLowerCase() !== difficultyFilter.toLowerCase()) {
        return false;
      }

      // Status filter
      const isCompleted = !!progress.completedDays[day.day];
      const chk = calculateDayChecklist(day.day, day.checklist, progress.completedChecklist);
      const isInProgress = !isCompleted && chk.completed > 0;

      if (statusFilter === 'completed' && !isCompleted) return false;
      if (statusFilter === 'in_progress' && !isInProgress) return false;
      if (statusFilter === 'not_started' && (isCompleted || isInProgress)) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = day.day_title.toLowerCase().includes(query);
        const matchesNode = day.node_title.toLowerCase().includes(query);
        const matchesTopic = day.what_to_learn.some((t) => t.toLowerCase().includes(query));
        const matchesDay = String(day.day) === query.trim();
        if (!matchesTitle && !matchesNode && !matchesTopic && !matchesDay) {
          return false;
        }
      }

      return true;
    });
  }, [selectedPhase, difficultyFilter, statusFilter, searchQuery, progress]);

  // Group filtered days by phase
  const filteredPhases = useMemo(() => {
    return allPhases.filter((phase) => {
      if (selectedPhase !== 'all' && phase.id !== selectedPhase) return false;
      return true;
    });
  }, [selectedPhase]);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-bloom-muted">
          <span>CURRICULUM HORIZON</span>
          <span>•</span>
          <span>185 DAYS</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-bloom-text sm:text-3xl font-sans">
          Curriculum Explorer
        </h1>
        <p className="mt-0.5 text-xs text-bloom-muted">
          Complete 185-day engineering roadmap with filterable nodes, difficulty tags, and quick lesson access
        </p>
      </div>

      {/* Filter and Search Bar with Pastel Tint */}
      <div className="rounded-2xl border border-surface-border bg-[#F5F0EB] p-4 shadow-bloom space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-ink-muted" />
          <input
            type="text"
            placeholder="Search by lesson title, topic, node name, or day number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-surface-border bg-white pl-9 pr-4 text-xs font-medium text-ink-primary placeholder:text-ink-muted focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition-bloom font-sans"
          />
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
          {/* Phase Segmented Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedPhase('all')}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-bloom ${
                selectedPhase === 'all'
                  ? 'bg-brand-primary text-white shadow-bloom'
                  : 'bg-white text-ink-secondary hover:text-ink-primary border border-surface-border hover:bg-surface-subtle'
              }`}
            >
              All Phases (4)
            </button>
            {allPhases.map((phase) => {
              const theme = getPhaseTheme(phase.id);
              const isSelected = selectedPhase === phase.id;
              return (
                <button
                  key={phase.id}
                  onClick={() => setSelectedPhase(phase.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-bloom border ${
                    isSelected
                      ? `${theme.badgeBg} ${theme.badgeText} ${theme.cardBorder} ring-2 ring-brand/30 shadow-bloom`
                      : `${theme.badgeBg}/60 hover:${theme.badgeBg} ${theme.badgeText} ${theme.cardBorder}`
                  }`}
                >
                  P{phase.id}: {phase.title.split(' ')[0]}
                </button>
              );
            })}
          </div>

          {/* Status & Difficulty Dropdowns */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="h-9 rounded-xl border border-surface-border bg-white px-3 text-xs font-semibold text-ink-primary focus:border-brand-primary focus:outline-none shadow-bloom font-sans"
            >
              <option value="all">Status: All</option>
              <option value="completed">Completed Only</option>
              <option value="in_progress">In Progress</option>
              <option value="not_started">Not Started</option>
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="h-9 rounded-xl border border-surface-border bg-white px-3 text-xs font-semibold text-ink-primary focus:border-brand-primary focus:outline-none shadow-bloom font-sans"
            >
              <option value="all">Difficulty: All</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <div className="hidden sm:flex items-center gap-2 border-l border-surface-border pl-2.5 text-xs font-semibold text-ink-secondary">
              <button onClick={expandAll} className="hover:text-brand-primary font-sans">Expand All</button>
              <span>•</span>
              <button onClick={collapseAll} className="hover:text-brand-primary font-sans">Collapse</button>
            </div>
          </div>
        </div>
      </div>

      {/* Showing count indicator */}
      <div className="flex items-center justify-between text-xs text-ink-secondary px-1 font-sans">
        <span>
          Showing <strong className="text-ink-primary font-mono">{filteredDays.length}</strong> of {allDays.length} available lessons
        </span>
        {(searchQuery || selectedPhase !== 'all' || statusFilter !== 'all' || difficultyFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedPhase('all');
              setStatusFilter('all');
              setDifficultyFilter('all');
            }}
            className="text-brand-primary hover:underline font-bold font-sans"
          >
            Clear Filters (Show All)
          </button>
        )}
      </div>

      {/* Phase Sections with Visible 70% Pastel Saturation */}
      <div className="space-y-5">
        {filteredPhases.map((phase) => {
          const daysInPhase = filteredDays.filter((d) => d.phase === phase.id);
          const allPhaseDays = allDays.filter((d) => d.phase === phase.id);
          const completedInPhase = allPhaseDays.filter((d) => progress.completedDays[d.day]).length;
          const isExpanded = expandedPhases[phase.id] !== false;
          const theme = getPhaseTheme(phase.id);

          // Rich pastel body backgrounds for 70% color requirement
          const phaseBodyBg =
            phase.id === 1 ? 'bg-[#F2F7FD]' :
            phase.id === 2 ? 'bg-[#F6F1FD]' :
            phase.id === 3 ? 'bg-[#F0F8F3]' :
            'bg-[#FDF4EE]';

          if (daysInPhase.length === 0) return null;

          return (
            <div key={phase.id} className={`rounded-3xl border ${theme.cardBorder} ${phaseBodyBg} shadow-bloom overflow-hidden`}>
              {/* Phase Header with Solid Pastel */}
              <button
                onClick={() => togglePhaseExpand(phase.id)}
                className={`flex w-full items-center justify-between border-b ${theme.cardBorder} ${theme.badgeBg} px-5 py-4 text-left transition-bloom hover:opacity-95`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl font-mono text-xs font-bold text-white shadow-bloom" style={{ backgroundColor: theme.barColor }}>
                    P{phase.id}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-ink-primary font-sans">{phase.title}</h3>
                      <span className="text-xs font-mono font-medium text-ink-secondary">{phase.timeline}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-sans">
                  <span className={`font-bold font-mono px-2.5 py-0.5 rounded-full bg-white/90 border ${theme.cardBorder} ${theme.badgeText}`}>
                    {completedInPhase}/{allPhaseDays.length} done
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-ink-secondary" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-ink-secondary" />
                  )}
                </div>
              </button>

              {/* Lesson Rows with Pastel Striping */}
              {isExpanded && (
                <div className={`divide-y ${theme.cardBorder}`}>
                  {daysInPhase.map((day) => {
                    const isCompleted = !!progress.completedDays[day.day];
                    const chk = calculateDayChecklist(day.day, day.checklist, progress.completedChecklist);
                    const diff = getDifficultyBadge(day.difficulty);

                    return (
                      <div
                        key={day.day}
                        className={`group flex items-center justify-between px-5 py-3.5 transition-bloom gap-3 ${
                          isCompleted
                            ? 'bg-pastel-mint/40 hover:bg-pastel-mint/60'
                            : 'hover:bg-white/80'
                        }`}
                      >
                        {/* Day Info */}
                        <div className="flex items-center gap-3 overflow-hidden min-w-0">
                          {/* Checkbox */}
                          <button
                            onClick={() => toggleDayCompleted(day.day)}
                            className="transition-bloom shrink-0 hover:scale-110"
                            title={isCompleted ? 'Mark uncompleted' : 'Mark day complete'}
                          >
                            <CheckCircle2
                              className={`h-5 w-5 ${
                                isCompleted ? 'fill-pastel-mint-text text-white' : 'text-ink-muted hover:text-pastel-mint-text'
                              }`}
                            />
                          </button>

                          {/* Day Number Badge */}
                          <span className="font-mono text-xs font-bold text-ink-primary w-12 shrink-0 bg-white/80 px-2 py-0.5 rounded-md border border-surface-border text-center">
                            D{day.day}
                          </span>

                          {/* Title and Node path */}
                          <div className="truncate min-w-0">
                            <button
                              onClick={() => navigateToDay(day.day)}
                              className="text-xs font-bold text-ink-primary hover:text-brand-primary transition-bloom text-left truncate block leading-snug font-sans"
                            >
                              {day.day_title}
                            </button>
                            <span className="text-[11px] text-ink-secondary truncate block mt-0.5 font-sans">
                              {day.node_title}
                            </span>
                          </div>
                        </div>

                        {/* Right: Difficulty, Time, Checklist, and Button */}
                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            className={`hidden sm:inline-block rounded-md px-2.5 py-0.5 text-[10px] font-sans font-bold uppercase ${diff.bg} ${diff.text}`}
                          >
                            {diff.label}
                          </span>

                          <span className="text-xs text-ink-secondary font-mono font-medium whitespace-nowrap bg-white/70 px-2 py-0.5 rounded-md border border-surface-border">
                            {day.time_hours}h
                          </span>

                          {/* Checklist Pill */}
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold border ${
                              chk.percentage === 100
                                ? 'bg-pastel-mint text-pastel-mint-text border-pastel-mint-border'
                                : chk.completed > 0
                                ? 'bg-pastel-powder text-pastel-powder-text border-pastel-powder-border'
                                : 'bg-white/90 text-ink-secondary border-surface-border'
                            }`}
                          >
                            {chk.completed}/{chk.total}
                          </span>

                          {/* High-Contrast Action Button */}
                          <button
                            onClick={() => navigateToDay(day.day)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-surface-border-strong px-3 py-1.5 text-xs font-bold text-brand-primary hover:bg-brand-primary hover:text-white transition-bloom shadow-bloom active:scale-95"
                          >
                            <span>Open</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
