import React from 'react';
import { RoadmapProvider, useRoadmap } from './context/RoadmapContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { DailyStudyRoom } from './components/study/DailyStudyRoom';
import { FocusTimer } from './components/timer/FocusTimer';
import { RoadmapExplorer } from './components/explorer/RoadmapExplorer';
import { CalendarView } from './components/calendar/CalendarView';
import { ProjectsView } from './components/projects/ProjectsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ReferenceVaultView } from './components/vault/ReferenceVaultView';
import { SettingsModal } from './components/settings/SettingsModal';

const DashboardContent: React.FC = () => {
  const { currentView } = useRoadmap();

  return (
    <div className="min-h-screen bg-canvas text-bloom-text flex flex-col font-sans">
      <Header />
      <div className="flex flex-1 w-full">
        <Sidebar />
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-8 max-w-7xl mx-auto w-full">
          {currentView === 'dashboard' && <OverviewDashboard />}
          {currentView === 'study' && <DailyStudyRoom />}
          {currentView === 'timer' && <FocusTimer />}
          {currentView === 'explorer' && <RoadmapExplorer />}
          {currentView === 'calendar' && <CalendarView />}
          {currentView === 'projects' && <ProjectsView />}
          {currentView === 'analytics' && <AnalyticsView />}
          {currentView === 'vault' && <ReferenceVaultView />}
        </main>
      </div>
      <MobileNav />
      <SettingsModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <RoadmapProvider>
      <DashboardContent />
    </RoadmapProvider>
  );
};

export default App;
