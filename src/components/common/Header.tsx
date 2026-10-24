import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Square,
  Search,
  Settings,
  Download,
  Sparkles,
  Command,
} from 'lucide-react';
import { useRoadmap } from '../../context/RoadmapContext';
import { formatSecondsToTimer } from '../../utils/dateUtils';
import { allDays, getDayByNumber } from '../../data/roadmapData';
import { getPhaseTheme } from '../../utils/themeUtils';

export const Header: React.FC = () => {
  const {
    currentRoadmapDay,
    activeTimer,
    activeTimerElapsedSeconds,
    pauseTimer,
    resumeTimer,
    stopAndSaveTimer,
    openSettings,
    exportProgressJSON,
    navigateToDay,
    setCurrentView,
  } = useRoadmap();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentLesson = getDayByNumber(currentRoadmapDay);
  const phaseTheme = getPhaseTheme(currentLesson?.phase || 1);

  const searchResults = searchQuery.trim()
    ? allDays
        .filter(
          (d) =>
            d.day_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.node_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.what_to_learn.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
            String(d.day) === searchQuery.trim()
        )
        .slice(0, 6)
    : [];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!isSearchOpen || searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = searchResults[selectedIndex];
      if (selected) {
        navigateToDay(selected.day);
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-surface-border bg-surface/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Brand Identity with Quiet Bloom Charm */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-2.5 text-left group transition-bloom"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-primary text-white shadow-bloom">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-sm font-bold tracking-tight text-ink-primary font-sans">Quiet Bloom</span>
              <span className="rounded-full bg-phase2-bg text-phase2-accent border border-phase2-border px-2 py-0.5 text-[9px] font-bold font-mono uppercase tracking-wider">
                AI 2026
              </span>
            </div>
            <p className="text-[11px] text-ink-secondary font-serif italic mt-0.5">Engineering Workspace</p>
          </div>
        </button>

        {/* Target Day Indicator with Visible Pastel Badge */}
        <div className={`hidden items-center gap-2 rounded-full border px-3 py-1 text-xs md:flex ${phaseTheme.badgeBg} ${phaseTheme.cardBorder}`}>
          <span className={`h-2.5 w-2.5 rounded-full ${phaseTheme.dotColor}`} />
          <span className="text-ink-secondary text-xs font-medium font-sans">Target:</span>
          <button
            onClick={() => navigateToDay(currentRoadmapDay)}
            className={`font-bold hover:underline font-sans ${phaseTheme.badgeText}`}
          >
            Day {currentRoadmapDay} / 185
          </button>
        </div>
      </div>

      {/* Center: Search Bar with Tactile Keyboard Badge */}
      <div className="relative mx-3 max-w-sm flex-1 md:max-w-md">
        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-ink-muted" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search lessons, tasks, concepts..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
              setSelectedIndex(0);
            }}
            onFocus={() => setIsSearchOpen(true)}
            onKeyDown={handleSearchKeyDown}
            className="h-9 w-full rounded-xl border border-surface-border bg-surface-subtle pl-9 pr-14 text-xs text-ink-primary placeholder:text-ink-muted focus:border-brand-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20 transition-bloom font-sans"
          />

          <div className="pointer-events-none absolute right-2.5 hidden items-center gap-0.5 rounded-md border border-surface-border bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-ink-secondary sm:flex font-mono">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </div>
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && searchResults.length > 0 && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsSearchOpen(false)} />
            <div className="absolute left-0 right-0 top-11 z-50 rounded-2xl border border-surface-border bg-surface p-1.5 shadow-bloom-modal">
              <div className="flex items-center justify-between px-2.5 py-1 text-xs font-bold text-ink-muted uppercase tracking-wider border-b border-surface-border mb-1 font-sans">
                <span>Matching lessons</span>
                <span className="font-sans text-ink-muted font-normal text-[11px]">↑↓ to navigate • Enter to open</span>
              </div>
              {searchResults.map((day, idx) => (
                <button
                  key={day.day}
                  onClick={() => {
                    navigateToDay(day.day);
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left transition-bloom font-sans ${
                    idx === selectedIndex ? 'bg-phase2-bg text-phase2-accent font-semibold' : 'hover:bg-surface-subtle text-ink-primary'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="flex h-5 w-8 shrink-0 items-center justify-center rounded-md bg-surface-subtle text-[10px] font-semibold text-ink-primary font-mono border border-surface-border">
                      D{day.day}
                    </span>
                    <div className="truncate">
                      <p className="truncate text-xs font-semibold">{day.day_title}</p>
                      <p className="text-[11px] text-ink-secondary truncate">{day.node_title}</p>
                    </div>
                  </div>
                  <span className="ml-2 whitespace-nowrap text-xs text-ink-secondary font-mono">{day.time_hours}h</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Right: Active Timer Pill & Quick Actions */}
      <div className="flex items-center gap-2">
        {/* Active Timer Pill in Soft Mint */}
        {activeTimer ? (
          <div className="flex items-center gap-2 rounded-xl border border-phase3-border bg-phase3-bg px-3 py-1.5 text-xs shadow-bloom">
            <span
              className={`h-2 w-2 rounded-full ${
                activeTimer.isRunning ? 'bg-phase3-accent animate-pulse' : 'bg-phase4-accent'
              }`}
            />
            <button
              onClick={() => setCurrentView('timer')}
              className="font-mono text-xs font-bold text-phase3-accent hover:underline"
              title="Open Focus Timer"
            >
              {formatSecondsToTimer(activeTimerElapsedSeconds)}
            </button>

            <div className="flex items-center gap-1 border-l border-phase3-border pl-1.5">
              {activeTimer.isRunning ? (
                <button
                  onClick={pauseTimer}
                  title="Pause session"
                  className="rounded p-0.5 text-phase3-accent hover:bg-phase3-border transition-bloom"
                >
                  <Pause className="h-3 w-3" />
                </button>
              ) : (
                <button
                  onClick={resumeTimer}
                  title="Resume session"
                  className="rounded p-0.5 text-phase3-accent hover:bg-phase3-border transition-bloom"
                >
                  <Play className="h-3 w-3 fill-current" />
                </button>
              )}
              <button
                onClick={() => stopAndSaveTimer()}
                title="Stop and save session"
                className="rounded p-0.5 text-phase3-accent hover:bg-phase3-border transition-bloom"
              >
                <Square className="h-3 w-3 fill-current" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setCurrentView('timer')}
            className="hidden items-center gap-1.5 rounded-xl border border-[#C5DAF5] bg-[#E5EFFB] px-3.5 py-1.5 text-xs font-bold text-[#3B689B] shadow-bloom hover:bg-[#D5E6F8] transition-bloom sm:flex font-sans"
            title="Open Focus Timer"
          >
            <Play className="h-3 w-3 fill-current text-[#3B689B]" />
            <span>Focus Timer</span>
          </button>
        )}

        {/* Export Backup */}
        <button
          onClick={exportProgressJSON}
          title="Export Progress Backup (JSON)"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAE1D8] bg-[#FAF8F5] text-ink-primary hover:border-[#D5C2B4] hover:bg-white transition-bloom shadow-bloom"
        >
          <Download className="h-4 w-4" />
        </button>

        {/* Settings */}
        <button
          onClick={openSettings}
          title="Roadmap Settings & Start Date"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAE1D8] bg-[#FAF8F5] text-ink-primary hover:border-[#D5C2B4] hover:bg-white transition-bloom shadow-bloom"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
