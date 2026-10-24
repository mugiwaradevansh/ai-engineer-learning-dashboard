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
} from 'lucide-react';
import { useRoadmap, DashboardView } from '../../context/RoadmapContext';

export const MobileNav: React.FC = () => {
  const { currentView, setCurrentView, selectedDayNumber, activeTimer } = useRoadmap();

  const items: Array<{ id: DashboardView; label: string; icon: React.ElementType; badge?: string }> = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'study', label: 'Study', icon: BookOpen, badge: `D${selectedDayNumber}` },
    { id: 'timer', label: 'Timer', icon: Timer, badge: activeTimer?.isRunning ? '•' : undefined },
    { id: 'explorer', label: 'Roadmap', icon: Compass },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'projects', label: 'Projects', icon: Rocket },
    { id: 'analytics', label: 'Stats', icon: BarChart3 },
    { id: 'vault', label: 'Vault', icon: Library },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex h-14 items-center justify-around border-t border-[#EAE5EC] bg-[#FAF8F5]/95 px-2 backdrop-blur-md lg:hidden shadow-bloom">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`relative flex flex-col items-center justify-center p-1 text-[10px] font-medium transition-bloom ${
              isActive ? 'text-bloom-violet font-semibold' : 'text-bloom-muted hover:text-bloom-text'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="mt-0.5">{item.label}</span>
            {item.badge && (
              <span className="absolute -top-1 right-0 rounded-full bg-bloom-lavender text-bloom-lavender-ink border border-bloom-lavender-border px-1 text-[8px] font-bold font-mono">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
