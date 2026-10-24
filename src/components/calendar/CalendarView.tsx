import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useRoadmap } from '../../context/RoadmapContext';
import {
  parseDateString,
  formatDateString,
  formatDisplayDate,
  getRoadmapDayForDate,
  formatMinutesHuman,
} from '../../utils/dateUtils';
import { getDayByNumber } from '../../data/roadmapData';
import { getPhaseTheme } from '../../utils/themeUtils';

export const CalendarView: React.FC = () => {
  const { progress, navigateToDay, openSettings } = useRoadmap();
  const startDateStr = progress.startDate || progress.settings.roadmapStartDate;

  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => formatDateString(new Date()));

  // Month navigation
  const prevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const jumpToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(formatDateString(today));
  };

  // Matrix calculation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays: Array<{
    dateStr: string;
    dayOfMonth: number;
    isCurrentMonth: boolean;
    isToday: boolean;
  }> = [];

  const todayStr = formatDateString(new Date());

  // Trailing previous month days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const date = new Date(year, month - 1, d);
    const dateStr = formatDateString(date);
    calendarDays.push({
      dateStr,
      dayOfMonth: d,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const dateStr = formatDateString(date);
    calendarDays.push({
      dateStr,
      dayOfMonth: i,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
    });
  }

  // Leading next month days
  const remainingCells = 42 - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    const date = new Date(year, month + 1, i);
    const dateStr = formatDateString(date);
    calendarDays.push({
      dateStr,
      dayOfMonth: i,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
    });
  }

  // Selected date details
  const selectedRoadmapDayNum = getRoadmapDayForDate(parseDateString(selectedDateStr), startDateStr);
  const selectedDayLesson = selectedRoadmapDayNum ? getDayByNumber(selectedRoadmapDayNum) : null;
  const isSelectedDayCompleted = selectedRoadmapDayNum ? !!progress.completedDays[selectedRoadmapDayNum] : false;
  const selectedPhaseTheme = selectedDayLesson ? getPhaseTheme(selectedDayLesson.phase) : null;

  const sessionsOnSelectedDate = progress.studySessions.filter(
    (s) => s.createdAt && s.createdAt.substring(0, 10) === selectedDateStr
  );
  const totalMinutesOnSelectedDate = sessionsOnSelectedDate.reduce((sum, s) => sum + s.durationMinutes, 0);

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-ink-secondary">
            <span>PACING HORIZON</span>
            <span>•</span>
            <span>CHRONOLOGY</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink-primary sm:text-3xl font-sans">
            Curriculum Schedule Calendar
          </h1>
          <p className="mt-0.5 text-xs text-ink-secondary font-sans">
            Roadmap trajectory mapped to your start date ({formatDisplayDate(startDateStr)})
          </p>
        </div>

        <div className="flex items-center gap-2 font-sans">
          <button
            onClick={jumpToToday}
            className="rounded-xl border border-[#EAE1D8] bg-white px-3.5 py-1.5 text-xs font-bold text-ink-primary shadow-bloom hover:bg-surface-subtle transition-bloom"
          >
            Today
          </button>
          <div className="flex items-center rounded-xl border border-[#EAE1D8] bg-white p-0.5 shadow-bloom">
            <button
              onClick={prevMonth}
              className="rounded-lg p-1.5 text-ink-secondary hover:bg-surface-subtle hover:text-ink-primary transition-bloom"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 text-xs font-bold text-ink-primary min-w-[130px] text-center font-mono">{monthName}</span>
            <button
              onClick={nextMonth}
              className="rounded-lg p-1.5 text-ink-secondary hover:bg-surface-subtle hover:text-ink-primary transition-bloom"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid + Date Details */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Calendar Grid (2 Cols) */}
        <div className="rounded-3xl border border-[#F2DCCF] bg-[#FAF3EC] p-5 shadow-bloom lg:col-span-2">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-[#EAE1D8] pb-3 text-center text-xs font-bold uppercase tracking-wider text-ink-secondary font-sans">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Grid cells */}
          <div className="grid grid-cols-7 gap-2 pt-3">
            {calendarDays.map((cell) => {
              const roadmapDay = getRoadmapDayForDate(parseDateString(cell.dateStr), startDateStr);
              const lesson = roadmapDay ? getDayByNumber(roadmapDay) : null;
              const theme = lesson ? getPhaseTheme(lesson.phase) : null;
              const isCompleted = roadmapDay ? !!progress.completedDays[roadmapDay] : false;
              const daySessions = progress.studySessions.filter(
                (s) => s.createdAt && s.createdAt.substring(0, 10) === cell.dateStr
              );
              const dayMins = daySessions.reduce((sum, s) => sum + s.durationMinutes, 0);
              const isSelected = cell.dateStr === selectedDateStr;

              return (
                <button
                  key={cell.dateStr}
                  onClick={() => setSelectedDateStr(cell.dateStr)}
                  className={`flex flex-col justify-between rounded-2xl p-2 min-h-[72px] sm:min-h-[78px] text-left transition-bloom border ${
                    isSelected
                      ? 'border-brand-primary ring-2 ring-brand-primary/25 bg-[#EEE6FA] shadow-bloom'
                      : cell.isCurrentMonth
                      ? 'border-[#EAE1D8] bg-white hover:border-[#D5C2B4] hover:bg-[#FFFDFB] shadow-bloom'
                      : 'border-transparent bg-white/40 text-ink-muted hover:bg-white/70'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs ${
                        cell.isToday
                          ? 'flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-white text-[11px] font-bold shadow-bloom font-mono'
                          : cell.isCurrentMonth
                          ? 'font-bold text-ink-primary font-mono'
                          : 'font-normal text-ink-muted font-mono'
                      }`}
                    >
                      {cell.dayOfMonth}
                    </span>

                    {roadmapDay && theme && (
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[9px] font-mono font-bold ${
                          isCompleted
                            ? 'bg-[#E1F1E6] text-[#226348] border border-[#BDDFC6]'
                            : `${theme.badgeBg} ${theme.badgeText}`
                        }`}
                      >
                        D{roadmapDay}
                      </span>
                    )}
                  </div>

                  {/* Badges / indicators */}
                  <div className="mt-1 flex items-center justify-between w-full text-[9px] font-mono">
                    {dayMins > 0 ? (
                      <span className="rounded-full bg-[#E5EFFB] px-1.5 text-[9px] font-bold text-[#3B689B] border border-[#C5DAF5]">
                        {formatMinutesHuman(dayMins)}
                      </span>
                    ) : <span />}

                    {isCompleted && (
                      <span className="h-2 w-2 rounded-full bg-[#31785C] shadow-bloom" title="Completed Day" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Color-Coded Legend */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#EAE1D8] pt-3.5 text-xs font-sans">
            <div className="flex flex-wrap items-center gap-3 font-medium text-ink-primary">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#5B8FB9]" /> Phase 1 Foundations
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#8072B8]" /> Phase 2 RAG & Agents
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#4E9B78]" /> Phase 3 Fine-Tuning
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#D97D54]" /> Phase 4 Production
              </span>
            </div>
            <button
              onClick={openSettings}
              title="Click to edit your roadmap start date in Settings"
              className="font-mono text-[10px] font-bold text-brand-primary bg-white px-2.5 py-1 rounded-xl border border-[#EAE1D8] shadow-bloom hover:bg-[#EEE6FA] transition-bloom flex items-center gap-1 active:scale-95"
            >
              <span>Start Date: {startDateStr}</span>
              <span className="text-[9px] underline text-[#8072B8] ml-0.5">(Change)</span>
            </button>
          </div>
        </div>

        {/* Selected Date Inspector Sidebar */}
        <div className="rounded-3xl border border-[#D7C7F2] bg-[#F6F1FD] p-5 shadow-bloom space-y-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#553C9A] font-sans">Selected Calendar Date</span>
            <h2 className="mt-0.5 text-lg font-bold text-ink-primary font-sans">
              {formatDisplayDate(selectedDateStr)}
            </h2>
          </div>

          {/* Associated Roadmap Lesson */}
          {selectedDayLesson && selectedPhaseTheme ? (
            <div className={`rounded-2xl border ${selectedPhaseTheme.cardBorder} bg-white p-4 space-y-3 shadow-bloom`}>
              <div className="flex items-center justify-between">
                <span className={`rounded-lg px-2.5 py-0.5 text-xs font-mono font-bold ${selectedPhaseTheme.badgeBg} ${selectedPhaseTheme.badgeText}`}>
                  Day {selectedDayLesson.day}
                </span>
                {isSelectedDayCompleted ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-[#226348] bg-[#E1F1E6] px-2 py-0.5 rounded-lg border border-[#BDDFC6] font-sans">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                  </span>
                ) : (
                  <span className="text-xs font-sans font-bold text-ink-secondary">In Progress</span>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-ink-primary leading-snug font-sans">
                  {selectedDayLesson.day_title}
                </h3>
                <p className="mt-1 text-xs text-ink-secondary font-sans">
                  {selectedDayLesson.node_title} • {selectedDayLesson.time_hours}h planned
                </p>
              </div>

              <button
                onClick={() => navigateToDay(selectedDayLesson.day)}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary py-2 text-xs font-bold text-white shadow-bloom hover:bg-brand-hover transition-bloom font-sans"
              >
                <span>Launch in Study Room</span>
                <ArrowRight className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#D7C7F2] bg-white/60 p-5 text-center text-xs text-ink-secondary font-sans">
              {parseDateString(selectedDateStr) < parseDateString(startDateStr)
                ? 'Precedes your official roadmap start date.'
                : 'Beyond the 185-day curriculum horizon.'}
            </div>
          )}

          {/* Activity Sessions on Date */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#D7C7F2] pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#553C9A] font-sans">Study Log</span>
              <span className="text-xs font-mono font-bold text-[#553C9A] bg-white px-2 py-0.5 rounded-lg border border-[#D7C7F2] shadow-bloom">
                {formatMinutesHuman(totalMinutesOnSelectedDate)}
              </span>
            </div>

            {sessionsOnSelectedDate.length === 0 ? (
              <p className="text-xs text-ink-secondary italic font-sans bg-white/60 p-3 rounded-xl border border-[#D7C7F2]">
                No study sessions logged on this date.
              </p>
            ) : (
              <div className="space-y-2">
                {sessionsOnSelectedDate.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-xl border border-[#D7C7F2] bg-white p-3 text-xs space-y-1 font-sans shadow-bloom"
                  >
                    <div className="flex items-center justify-between font-bold text-ink-primary">
                      <span>Day {s.dayNumber} Session</span>
                      <span className="text-[#3B689B] font-mono">{formatMinutesHuman(s.durationMinutes)}</span>
                    </div>
                    <p className="text-xs text-ink-secondary">{s.activity}</p>
                    {s.notes && (
                      <p className="text-xs text-ink-primary italic bg-[#FAF8F5] p-2 rounded-lg border border-[#EAE1D8] font-sans">
                        "{s.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
