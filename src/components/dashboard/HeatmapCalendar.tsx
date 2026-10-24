import React, { useState } from 'react';
import { generateActivityHeatmap } from '../../utils/calculations';
import { formatDisplayDate, formatMinutesHuman } from '../../utils/dateUtils';
import { useRoadmap } from '../../context/RoadmapContext';

export const HeatmapCalendar: React.FC = () => {
  const { progress } = useRoadmap();
  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    minutes: number;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  // Generate 18 weeks of activity
  const heatmapData = generateActivityHeatmap(progress.studySessions, 18);

  // Split into 7-day columns (Sunday to Saturday)
  const columns: typeof heatmapData[] = [];
  for (let i = 0; i < heatmapData.length; i += 7) {
    columns.push(heatmapData.slice(i, i + 7));
  }

  // Clearly differentiated pastel & violet intensities
  const getColorClass = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-[#D8CEEF] hover:ring-2 hover:ring-[#B7A6DE]';
      case 2:
        return 'bg-[#B7A6DE] hover:ring-2 hover:ring-[#8B76C4]';
      case 3:
        return 'bg-[#8B76C4] hover:ring-2 hover:ring-[#665397]';
      case 4:
        return 'bg-[#665397] text-white hover:ring-2 hover:ring-[#544280]';
      default:
        // Visible warm-neutral empty state
        return 'bg-[#F0EBF1] border border-[#E5DDE7] hover:bg-[#E5DDE7]';
    }
  };

  const totalStudyMinutes = progress.studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  return (
    <div className="relative flex flex-col justify-between rounded-3xl border border-[#F2DCCF] bg-[#FAF3EC] p-6 shadow-bloom">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary font-sans">Daily Discipline</span>
          <h3 className="text-sm font-bold text-ink-primary font-sans">18-Week Consistency Grid</h3>
        </div>
        <div className="text-xs font-sans text-ink-primary">
          <span className="text-brand-primary font-bold font-mono">{progress.studySessions.length}</span> sessions logged (
          <span className="font-mono">{formatMinutesHuman(totalStudyMinutes)}</span>)
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-1 pt-1">
        <div className="flex items-center gap-1.5 min-w-[500px]">
          {/* Day of Week Labels */}
          <div className="flex flex-col justify-between py-0.5 text-[10px] font-sans text-ink-secondary h-[94px] pr-1.5 font-medium">
            <span>Sun</span>
            <span>Tue</span>
            <span>Thu</span>
            <span>Sat</span>
          </div>

          {/* Columns */}
          <div className="flex gap-1.5">
            {columns.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-1.5">
                {col.map((cell) => (
                  <div
                    key={cell.date}
                    className={`h-3 w-3 rounded-[3px] transition-bloom cursor-pointer ${getColorClass(cell.level)}`}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredCell({
                        date: cell.date,
                        minutes: cell.minutes,
                        count: cell.count,
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                      });
                    }}
                    onMouseLeave={() => setHoveredCell(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visible Legend */}
      <div className="mt-4 flex items-center justify-between text-xs text-ink-secondary border-t border-surface-border pt-3 font-sans">
        <span className="text-xs font-serif italic text-ink-secondary">Steady cadence blossoms into intuition</span>
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="font-sans mr-0.5">Less</span>
          <span className="h-3 w-3 rounded-[3px] bg-[#F0EBF1] border border-[#E5DDE7]" title="0h" />
          <span className="h-3 w-3 rounded-[3px] bg-[#D8CEEF]" title="1h" />
          <span className="h-3 w-3 rounded-[3px] bg-[#B7A6DE]" title="2h" />
          <span className="h-3 w-3 rounded-[3px] bg-[#8B76C4]" title="3h" />
          <span className="h-3 w-3 rounded-[3px] bg-[#665397]" title="4h+" />
          <span className="font-sans ml-0.5">More</span>
        </div>
      </div>

      {/* Floating Tooltip */}
      {hoveredCell && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-xl border border-surface-border bg-surface px-3 py-2 text-center text-xs text-ink-primary shadow-bloom-modal font-sans"
          style={{
            left: hoveredCell.x,
            top: hoveredCell.y - 8,
          }}
        >
          <p className="font-bold">{formatDisplayDate(hoveredCell.date)}</p>
          <p className="text-xs text-ink-secondary font-mono mt-0.5">
            {hoveredCell.minutes > 0
              ? `${formatMinutesHuman(hoveredCell.minutes)} (${hoveredCell.count} ${
                  hoveredCell.count === 1 ? 'session' : 'sessions'
                })`
              : 'No study recorded'}
          </p>
        </div>
      )}
    </div>
  );
};
