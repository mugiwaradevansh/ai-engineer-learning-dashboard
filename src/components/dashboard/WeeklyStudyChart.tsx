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
import { calculateWeeklyChartData } from '../../utils/calculations';
import { useRoadmap } from '../../context/RoadmapContext';
import { getDayByNumber } from '../../data/roadmapData';

export const WeeklyStudyChart: React.FC = () => {
  const { progress, currentRoadmapDay } = useRoadmap();
  const currentDayData = getDayByNumber(currentRoadmapDay);
  const plannedHours = currentDayData?.time_hours || 4;

  const data = calculateWeeklyChartData(progress.studySessions, plannedHours);

  const totalWeeklyActual = Math.round(data.reduce((acc, d) => acc + d.actual, 0) * 10) / 10;
  const totalWeeklyPlanned = Math.round(data.reduce((acc, d) => acc + d.planned, 0) * 10) / 10;

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-[#DED4EE] bg-[#F7F3FD] p-6 shadow-bloom">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary font-sans">7-Day Cadence</span>
          <h3 className="text-sm font-bold text-ink-primary font-sans">Weekly Effort Distribution</h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-sans">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#8172B8]" />
            <span className="text-ink-primary font-semibold font-mono">{totalWeeklyActual}h Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#DDD4EE]" />
            <span className="text-ink-secondary font-mono">{totalWeeklyPlanned}h Target</span>
          </div>
        </div>
      </div>

      <div className="mt-4 h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAE3EA" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#716C7D', fontSize: 11, fontFamily: 'Plus Jakarta Sans' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#716C7D', fontSize: 11, fontFamily: 'Plus Jakarta Sans' }}
              unit="h"
              domain={[0, 'auto']}
            />
            <Tooltip
              cursor={{ fill: 'rgba(129, 114, 184, 0.06)' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const actual = payload.find((p) => p.dataKey === 'actual')?.value ?? 0;
                  const planned = payload.find((p) => p.dataKey === 'planned')?.value ?? 0;
                  const date = payload[0]?.payload?.date;
                  return (
                    <div className="rounded-xl border border-surface-border bg-surface p-3 shadow-bloom-modal text-xs font-sans">
                      <p className="font-bold text-ink-primary">
                        {label} <span className="font-normal text-ink-secondary font-mono">({date})</span>
                      </p>
                      <div className="mt-2 space-y-1.5 font-sans text-xs">
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-1.5 text-ink-secondary">
                            <span className="h-2 w-2 rounded-sm bg-[#8172B8]" />
                            Logged:
                          </span>
                          <span className="font-semibold text-ink-primary font-mono">{actual} hrs</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-1.5 text-ink-secondary">
                            <span className="h-2 w-2 rounded-sm bg-[#DDD4EE]" />
                            Target:
                          </span>
                          <span className="font-medium text-ink-secondary font-mono">{planned} hrs</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="planned" fill="#DDD4EE" radius={[4, 4, 0, 0]} maxBarSize={22} />
            <Bar dataKey="actual" fill="#8172B8" radius={[4, 4, 0, 0]} maxBarSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
