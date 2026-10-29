import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Play,
  Lightbulb,
  Terminal,
  FileText,
  Save,
  Check,
  Copy,
  CheckSquare,
  Video,
  Code,
  ArrowRight,
} from 'lucide-react';
import { useRoadmap } from '../../context/RoadmapContext';
import {
  allDays,
  getDayByNumber,
  getAdjacentDays,
  getNodeById,
  getPhaseById,
} from '../../data/roadmapData';
import { calculateDayChecklist } from '../../utils/calculations';
import { getPhaseTheme, getDifficultyBadge, getResourceTypeBadge } from '../../utils/themeUtils';
import { RoadmapResource } from '../../types/roadmap';

export const DailyStudyRoom: React.FC = () => {
  const {
    selectedDayNumber,
    setSelectedDayNumber,
    progress,
    toggleDayCompleted,
    toggleChecklistItem,
    saveDayNote,
    startTimer,
    setCurrentView,
  } = useRoadmap();

  // Find the selected day's data
  const currentDay = getDayByNumber(selectedDayNumber) || allDays[0];
  const { prevDay, nextDay } = getAdjacentDays(currentDay.day);
  const phaseInfo = getPhaseById(currentDay.phase);
  const nodeInfo = typeof currentDay.node === 'number' ? getNodeById(currentDay.node) : undefined;
  const phaseTheme = getPhaseTheme(currentDay.phase);
  const diffBadge = getDifficultyBadge(currentDay.difficulty);

  // Checklist calculations
  const checklistStats = calculateDayChecklist(
    currentDay.day,
    currentDay.checklist,
    progress.completedChecklist
  );
  const isDayCompleted = !!progress.completedDays[currentDay.day];

  // Notes state
  const [noteText, setNoteText] = useState<string>(progress.notesByDay[currentDay.day] || '');
  const [isNoteSaved, setIsNoteSaved] = useState<boolean>(true);
  const [isCopiedTask, setIsCopiedTask] = useState<boolean>(false);

  useEffect(() => {
    setNoteText(progress.notesByDay[currentDay.day] || '');
    setIsNoteSaved(true);
  }, [currentDay.day, progress.notesByDay]);

  // Keyboard navigation for [ and ]
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === '[' && prevDay) {
        e.preventDefault();
        setSelectedDayNumber(prevDay.day);
      } else if (e.key === ']' && nextDay) {
        e.preventDefault();
        setSelectedDayNumber(nextDay.day);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevDay, nextDay, setSelectedDayNumber]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteText(e.target.value);
    setIsNoteSaved(false);
  };

  const handleSaveNote = () => {
    saveDayNote(currentDay.day, noteText);
    setIsNoteSaved(true);
  };

  const handleCopyTask = () => {
    navigator.clipboard.writeText(currentDay.practice_task);
    setIsCopiedTask(true);
    setTimeout(() => setIsCopiedTask(false), 2000);
  };

  const insertNoteSnippet = (prefix: string) => {
    const newText = noteText ? `${noteText}\n\n${prefix}: ` : `${prefix}: `;
    setNoteText(newText);
    saveDayNote(currentDay.day, newText);
    setIsNoteSaved(true);
  };

  // Safe resource card renderer
  const renderResourceCard = (resource: RoadmapResource | undefined, isPrimary: boolean) => {
    if (!resource || !resource.title) return null;
    const hasValidUrl = resource.url && resource.url.trim().length > 0;
    const typeBadge = getResourceTypeBadge(resource.type);

    return (
      <div
        className={`flex flex-col justify-between rounded-2xl border p-4 transition-bloom shadow-bloom ${
          isPrimary
            ? 'border-phase1-border bg-phase1-bg/70'
            : 'border-surface-border bg-surface'
        }`}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider font-sans ${
                isPrimary ? 'bg-phase1-bg text-phase1-accent border border-phase1-border' : 'bg-surface-subtle text-ink-secondary border border-surface-border'
              }`}
            >
              {isPrimary ? 'Primary Reading' : 'Secondary Resource'}
            </span>

            <div className="flex items-center gap-1.5">
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold font-sans ${typeBadge.bg} ${typeBadge.text}`}>
                {typeBadge.iconLabel}
              </span>
              {resource.duration && (
                <span className="text-[10px] text-ink-secondary font-mono">{resource.duration}</span>
              )}
            </div>
          </div>

          <h4 className="text-xs font-semibold text-ink-primary leading-snug font-sans">{resource.title}</h4>
        </div>

        <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between">
          {hasValidUrl ? (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:underline group font-sans"
            >
              <span>Launch Curriculum Resource</span>
              <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-ink-secondary italic font-sans">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Independent review / build day</span>
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Floating Control Bar with Warm Pastel Tint */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-surface-border bg-[#F5F0EB] p-3.5 shadow-bloom sm:flex-row sm:items-center">
        {/* Navigation arrows with key shortcuts */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => prevDay && setSelectedDayNumber(prevDay.day)}
            disabled={!prevDay}
            className="flex items-center gap-1.5 rounded-xl border border-surface-border-strong bg-white px-3.5 py-1.5 text-xs font-bold text-ink-primary shadow-bloom hover:bg-brand-primary hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-bloom font-sans active:scale-95"
            title="Shortcut: ["
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Prev</span>
            {prevDay && <span className="font-mono text-[10px]">({prevDay.day})</span>}
          </button>

          <button
            onClick={() => nextDay && setSelectedDayNumber(nextDay.day)}
            disabled={!nextDay}
            className="flex items-center gap-1.5 rounded-xl border border-surface-border-strong bg-white px-3.5 py-1.5 text-xs font-bold text-ink-primary shadow-bloom hover:bg-brand-primary hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-bloom font-sans active:scale-95"
            title="Shortcut: ]"
          >
            <span>Next</span>
            {nextDay && <span className="font-mono text-[10px]">({nextDay.day})</span>}
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Quick Dropdown Picker */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-bold text-ink-secondary uppercase font-sans shrink-0">Lesson:</span>
          <select
            value={currentDay.day}
            onChange={(e) => setSelectedDayNumber(Number(e.target.value))}
            className="h-9 w-full max-w-xs rounded-xl border border-surface-border bg-white px-3 text-xs font-bold text-ink-primary focus:border-brand-primary focus:outline-none shadow-bloom font-sans truncate"
          >
            {allDays.map((d) => (
              <option key={d.day} value={d.day}>
                Day {d.day}: {d.day_title.substring(0, 36)}...
              </option>
            ))}
          </select>
        </div>

        {/* Focus Timer Launch Button: Accessible high-contrast button */}
        <button
          onClick={() => {
            startTimer(currentDay.day, currentDay.day_title);
            setCurrentView('timer');
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-2 text-xs font-bold text-white shadow-bloom hover:bg-brand-hover transition-bloom shrink-0 font-sans active:scale-95"
        >
          <Play className="h-3.5 w-3.5 fill-current text-white" />
          <span>Start Focus Timer ({currentDay.time_hours}h)</span>
        </button>
      </div>

      {/* Main Lesson Banner Card (Dynamic Phase Pastel Gradient with Paper Grain) */}
      <div
        className={`overflow-hidden rounded-3xl border shadow-bloom grain-overlay ${
          currentDay.phase === 1
            ? 'bg-gradient-to-br from-[#E5EFFB] via-[#DCEBFA] to-[#FAF8F5] border-[#C5DAF5]'
            : currentDay.phase === 2
            ? 'bg-gradient-to-br from-[#EEE6FA] via-[#E4D7F8] to-[#FAF8F5] border-[#D7C7F2]'
            : currentDay.phase === 3
            ? 'bg-gradient-to-br from-[#E1F1E6] via-[#D5ECDB] to-[#FAF8F5] border-[#BDDFC6]'
            : 'bg-gradient-to-br from-[#FBE7DB] via-[#F8DEC9] to-[#FAF8F5] border-[#F4CEB8]'
        }`}
      >
        {/* Phase Color Accent Bar */}
        <div className="h-3 w-full" style={{ backgroundColor: phaseTheme.barColor }} />

        <div className="p-6 sm:p-8 space-y-4">
          {/* Breadcrumb Path & Tags */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
              <span className="rounded-xl bg-ink-primary font-mono text-xs font-bold text-white px-3 py-1 shadow-bloom">
                DAY {currentDay.day} / 185
              </span>
              <span className={`rounded-xl px-3 py-1 text-xs font-bold font-sans border bg-white/90 ${phaseTheme.badgeText} ${phaseTheme.cardBorder}`}>
                Phase {currentDay.phase}: {phaseInfo?.title}
              </span>
              <span className="rounded-xl border border-surface-border bg-white/90 px-3 py-1 text-xs font-semibold text-ink-primary">
                Node {currentDay.node}: {currentDay.node_title}
              </span>
              <span className={`rounded-xl px-3 py-1 text-xs font-bold font-sans ${diffBadge.bg} ${diffBadge.text}`}>
                {diffBadge.label}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-ink-secondary bg-white/90 px-3 py-1 rounded-xl border border-surface-border">
              <Clock className="h-3.5 w-3.5 text-brand-primary" />
              <span>{currentDay.time_hours} hours recommended</span>
            </div>
          </div>

          {/* Title & Mark Complete Button */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start pt-1">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-ink-primary sm:text-3xl leading-snug font-sans">
                {currentDay.day_title}
              </h1>
              {nodeInfo && (
                <p className="mt-2 text-xs text-ink-secondary italic max-w-3xl leading-relaxed font-sans bg-white/60 p-3 rounded-xl border border-black/5">
                  "{nodeInfo.intro}"
                </p>
              )}
            </div>

            {/* Deliberate Mark Day Complete Action */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleDayCompleted(currentDay.day)}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-bloom transition-bloom font-sans active:scale-95 ${
                  isDayCompleted
                    ? 'bg-brand-primary text-white border border-brand-hover'
                    : 'bg-pastel-mint border border-pastel-mint-border text-pastel-mint-text hover:bg-[#CEEADB]'
                }`}
              >
                <CheckCircle2 className={`h-4 w-4 ${isDayCompleted ? 'text-white' : 'text-pastel-mint-text'}`} />
                <span>{isDayCompleted ? 'Day Completed ✓' : 'Mark Day Complete'}</span>
              </button>
            </div>
          </div>

          {/* Checklist Status Tracker */}
          <div className="rounded-2xl bg-white/90 p-4 border border-surface-border font-sans shadow-bloom">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-ink-primary">Daily Checklist Progress</span>
              <span className="font-bold text-phase3-accent font-mono">
                {checklistStats.completed} of {checklistStats.total} criteria completed ({checklistStats.percentage}%)
              </span>
            </div>
            <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-surface-subtle border border-surface-border">
              <div
                className="h-full rounded-full bg-phase3-accent transition-all duration-500"
                style={{ width: `${checklistStats.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Study Layout with 70% Pastel Saturation */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2 Cols): What to Learn, Strategy, Task, Pro Tip, Resources */}
        <div className="space-y-6 lg:col-span-2 min-w-0">
          {/* Section: What You Will Learn (Soft Lavender Card) */}
          <div className="rounded-3xl border border-[#DED4EE] bg-[#F4EFFC] p-6 shadow-bloom space-y-4">
            <div className="flex items-center gap-2 border-b border-[#DED4EE] pb-3">
              <BookOpen className="h-4 w-4 text-brand-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-primary font-sans">
                What You Will Learn
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-1">
              {currentDay.what_to_learn.map((topic, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-2xl border border-[#DED4EE] bg-white p-3.5 text-xs font-sans shadow-bloom"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-phase2-bg text-[10px] font-bold text-phase2-accent font-mono border border-phase2-border">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-ink-primary leading-relaxed">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Strategic How-to-Learn Instructions (Radiant Butter Cream) */}
          <div className="rounded-3xl border border-[#F2DE98] bg-[#FFF5D9] p-6 shadow-bloom space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="h-4 w-4 text-[#785A10]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#785A10] font-sans">
                Engineering Study Strategy
              </h3>
            </div>
            <p className="text-xs text-ink-primary leading-relaxed font-sans font-medium">
              {currentDay.how_to_learn}
            </p>
          </div>

          {/* Section: Concrete Practice Task (Code block with Copy) */}
          <div className="rounded-3xl border border-surface-border bg-[#F5F0EB] p-6 shadow-bloom space-y-3">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-brand-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-primary font-sans">
                  Hands-On Engineering Task
                </h3>
              </div>
              <button
                onClick={handleCopyTask}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-bloom font-sans shadow-bloom active:scale-95 ${
                  isCopiedTask
                    ? 'bg-[#107569] text-white border border-[#0B544B]'
                    : 'bg-white text-ink-primary border border-surface-border hover:bg-brand-primary hover:text-white'
                }`}
              >
                {isCopiedTask ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-white stroke-[2.5]" />
                    <span className="font-bold text-white tracking-wide">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Task</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative rounded-2xl bg-[#252131] p-5 font-mono text-xs leading-relaxed text-[#EFEAF6] overflow-x-auto whitespace-pre-wrap shadow-bloom border border-black/20">
              {currentDay.practice_task}
            </div>
          </div>

          {/* Section: Production Pro Tip (Warm Peach Card) */}
          <div className="rounded-3xl border border-[#F4CEB8] bg-[#FDECE2] p-6 shadow-bloom space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Code className="h-4 w-4 text-[#A85E37]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#A85E37] font-sans">
                Senior Staff Architecture Tip
              </h3>
            </div>
            <p className="text-xs text-ink-primary leading-relaxed font-sans font-medium">
              {currentDay.pro_tip}
            </p>
          </div>

          {/* Section: Resources */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-brand-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-primary font-sans">
                Curriculum Resources
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {renderResourceCard(currentDay.primary_resource, true)}
              {currentDay.secondary_resource && renderResourceCard(currentDay.secondary_resource, false)}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Checklist & Engineering Journal */}
        <div className="space-y-6 min-w-0">
          {/* Daily Interactive Checklist (Soft Mint Card) */}
          <div className="rounded-3xl border border-[#BDDFC6] bg-[#EAF5EE] p-6 shadow-bloom space-y-4">
            <div className="flex items-center justify-between border-b border-[#BDDFC6] pb-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-phase3-accent" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-primary font-sans">
                  Mastery Checklist
                </h3>
              </div>
              <span className="font-mono text-xs font-bold text-phase3-accent bg-white/90 px-2.5 py-0.5 rounded-full border border-[#BDDFC6]">
                {checklistStats.completed}/{checklistStats.total}
              </span>
            </div>

            <div className="space-y-2.5">
              {currentDay.checklist.map((item, idx) => {
                const isChecked = !!progress.completedChecklist[`${currentDay.day}_${idx}`];
                return (
                  <label
                    key={idx}
                    className={`flex items-start gap-3 rounded-2xl border p-3.5 text-xs cursor-pointer transition-bloom font-sans shadow-bloom ${
                      isChecked
                        ? 'border-phase3-border bg-white text-phase3-accent font-bold ring-2 ring-phase3-accent/20'
                        : 'border-[#BDDFC6] bg-white hover:bg-white/80 text-ink-primary font-medium'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleChecklistItem(currentDay.day, idx)}
                      className="mt-0.5 h-4 w-4 rounded border-surface-border text-phase3-accent focus:ring-phase3-accent"
                    />
                    <span className={`break-words min-w-0 ${isChecked ? 'line-through text-ink-secondary font-normal' : 'font-semibold'}`}>
                      {item}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Personal Engineering Journal / Notes (Warm Peach/Ivory Card) */}
          <div className="rounded-3xl border border-[#F2DCCF] bg-[#FAF2EB] p-6 shadow-bloom space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#F2DCCF] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-primary font-sans">
                  Study Notes & Insights
                </h3>
              </div>
              <span className="text-[11px] font-sans font-bold text-ink-secondary bg-white/80 px-2 py-0.5 rounded-md border border-surface-border">
                {isNoteSaved ? '✓ Saved' : '● Unsaved'}
              </span>
            </div>

            {/* Quick Starter Chips */}
            <div className="flex flex-wrap gap-1.5 font-sans">
              <button
                onClick={() => insertNoteSnippet('💡 Insight')}
                className="rounded-lg border border-[#F2DE98] bg-[#FFF5D9] px-2.5 py-1 text-[10px] font-bold text-[#785A10] hover:scale-105 transition-bloom"
              >
                + Insight
              </button>
              <button
                onClick={() => insertNoteSnippet('🐛 Bug Fixed')}
                className="rounded-lg border border-[#E4C6D6] bg-[#FCECE4] px-2.5 py-1 text-[10px] font-bold text-[#6F3A55] hover:scale-105 transition-bloom"
              >
                + Bug Fixed
              </button>
              <button
                onClick={() => insertNoteSnippet('📐 Architecture')}
                className="rounded-lg border border-[#C5DBF3] bg-[#E5EFFB] px-2.5 py-1 text-[10px] font-bold text-[#2B537D] hover:scale-105 transition-bloom"
              >
                + Pattern
              </button>
            </div>

            <textarea
              value={noteText}
              onChange={handleNoteChange}
              rows={8}
              placeholder="Record architectural decisions, benchmark scores, or command snippets here. Persists automatically across browser refreshes..."
              className="w-full rounded-2xl border border-surface-border bg-white p-3.5 text-xs text-ink-primary focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 font-sans transition-bloom leading-relaxed shadow-bloom"
            />

            <button
              onClick={handleSaveNote}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary py-3 text-xs font-bold text-white shadow-bloom hover:bg-brand-hover transition-bloom font-sans active:scale-98"
            >
              <Save className="h-4 w-4 text-white" />
              <span>Save Lesson Notes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
