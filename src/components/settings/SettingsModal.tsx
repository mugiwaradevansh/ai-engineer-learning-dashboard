import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Download,
  Upload,
  AlertTriangle,
  Check,
  Settings,
} from 'lucide-react';
import { useRoadmap } from '../../context/RoadmapContext';
import {
  calculateCurrentRoadmapDay,
  getTodayDateString,
} from '../../utils/dateUtils';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    closeSettings,
    progress,
    updateStartDate,
    updateSettings,
    exportProgressJSON,
    importProgressJSON,
    resetAllProgress,
  } = useRoadmap();

  const [tempStartDate, setTempStartDate] = useState<string>(
    progress.startDate || progress.settings.roadmapStartDate || getTodayDateString()
  );
  const [dailyGoalHours, setDailyGoalHours] = useState<number>(progress.settings.dailyGoalHours || 4);
  const [timerSound, setTimerSound] = useState<boolean>(progress.settings.timerSound ?? true);

  const [importStatus, setImportStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [hasSavedNotice, setHasSavedNotice] = useState(false);

  // Sync state whenever settings modal is opened or underlying progress changes
  useEffect(() => {
    if (isSettingsOpen) {
      setTempStartDate(progress.startDate || progress.settings.roadmapStartDate || getTodayDateString());
      setDailyGoalHours(progress.settings.dailyGoalHours || 4);
      setTimerSound(progress.settings.timerSound ?? true);
    }
  }, [isSettingsOpen, progress.startDate, progress.settings]);

  if (!isSettingsOpen) return null;

  const previewCurrentDay = calculateCurrentRoadmapDay(tempStartDate);

  const handleSaveSettings = () => {
    updateSettings({
      roadmapStartDate: tempStartDate,
      dailyGoalHours: Number(dailyGoalHours),
      timerSound,
    }, tempStartDate);
    setHasSavedNotice(true);
    setTimeout(() => {
      setHasSavedNotice(false);
      closeSettings();
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importProgressJSON(content);
      if (res.success) {
        setImportStatus({ message: 'Backup successfully restored!', isError: false });
        setTimeout(() => {
          setImportStatus(null);
          closeSettings();
        }, 1500);
      } else {
        setImportStatus({ message: res.error || 'Failed to import backup file.', isError: true });
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = () => {
    resetAllProgress();
    setIsResetConfirmOpen(false);
    closeSettings();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl border border-surface-border-strong bg-[#FAF8F5] p-6 sm:p-8 shadow-bloom-modal my-auto max-h-[90vh] overflow-y-auto overflow-x-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-surface-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-phase2-bg border border-phase2-border text-brand-primary shadow-bloom shrink-0">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink-primary font-sans">Quiet Bloom Workspace Settings</h2>
              <p className="text-xs text-ink-secondary font-sans font-medium">Configure start date, study quotas, and JSON backups</p>
            </div>
          </div>
          <button
            onClick={closeSettings}
            className="rounded-xl p-2 text-ink-secondary hover:bg-white hover:text-ink-primary transition-bloom shadow-bloom border border-surface-border shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status Notice */}
        {hasSavedNotice && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-pastel-mint p-3 text-xs font-bold text-pastel-mint-text border border-pastel-mint-border shadow-bloom">
            <Check className="h-4 w-4 shrink-0" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        {importStatus && (
          <div
            className={`mt-4 rounded-xl p-3 text-xs font-bold shadow-bloom ${
              importStatus.isError
                ? 'bg-pastel-peach text-pastel-peach-text border border-pastel-peach-border'
                : 'bg-pastel-mint text-pastel-mint-text border border-pastel-mint-border'
            }`}
          >
            {importStatus.message}
          </div>
        )}

        {/* Section 1: Roadmap Start Date (Soft Lavender Container) */}
        <div className="mt-6 rounded-3xl border border-[#D7C7F2] bg-[#EEE6FA]/60 p-5 sm:p-6 space-y-4 shadow-bloom overflow-hidden">
          <div className="space-y-1">
            <label className="text-xs font-bold text-ink-primary flex items-center gap-1.5 font-sans">
              <Calendar className="h-4 w-4 text-brand-primary shrink-0" />
              <span>Official Roadmap Start Date</span>
            </label>
            <p className="text-xs text-ink-secondary font-sans font-medium leading-relaxed">
              Day 1 corresponds to this calendar date. Changing this date recalculates your target lesson without
              deleting your historical session records.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <input
                type="date"
                value={tempStartDate}
                onChange={(e) => setTempStartDate(e.target.value)}
                className="rounded-xl border border-surface-border-strong bg-white p-2.5 text-xs font-bold text-ink-primary focus:border-brand-primary focus:outline-none shadow-bloom font-sans"
              />

              <div className="text-xs text-ink-secondary font-sans bg-white/90 px-3 py-2 rounded-xl border border-surface-border font-medium shadow-bloom">
                Current target: <strong className="text-brand-primary font-bold font-mono">Day {previewCurrentDay}</strong>
              </div>
            </div>
          </div>

          {/* Section 2: Study Target & Audio */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-4 border-t border-[#D7C7F2]">
            <div className="space-y-1">
              <label className="text-xs font-bold text-ink-primary font-sans">Daily Study Quota (Hours):</label>
              <input
                type="number"
                min={1}
                max={12}
                value={dailyGoalHours}
                onChange={(e) => setDailyGoalHours(Number(e.target.value))}
                className="w-full rounded-xl border border-surface-border-strong bg-white p-2.5 text-xs font-bold text-ink-primary focus:border-brand-primary focus:outline-none shadow-bloom font-sans"
              />
              <span className="block text-[11px] text-ink-secondary font-mono">Curriculum standard: 4.0 hours / day</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-ink-primary font-sans">Focus Timer Chime:</label>
              <div className="mt-1 flex items-start gap-2.5 rounded-xl border border-[#D7C7F2]/70 bg-white/80 p-2.5 shadow-bloom">
                <input
                  type="checkbox"
                  id="timerSound"
                  checked={timerSound}
                  onChange={(e) => setTimerSound(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-surface-border text-brand-primary focus:ring-brand"
                />
                <label htmlFor="timerSound" className="text-xs text-ink-primary font-medium cursor-pointer font-sans leading-tight">
                  Play completion chime when timer session saves
                </label>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSaveSettings}
              className="rounded-xl bg-brand-primary px-5 py-2.5 text-xs font-bold text-white shadow-bloom hover:bg-brand-hover transition-bloom font-sans active:scale-95"
            >
              Save Configuration
            </button>
          </div>
        </div>

        {/* Section 3: Backup & Restore with High-Contrast Pastel Cards */}
        <div className="mt-6 rounded-3xl border border-surface-border bg-[#F5F0EB] p-5 sm:p-6 space-y-4 shadow-bloom overflow-hidden">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-secondary block">
            Data Persistence & Portability
          </span>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Export in Powder Blue */}
            <div className="rounded-2xl border border-[#C5DAF5] bg-[#E5EFFB] p-5 space-y-3 shadow-bloom overflow-hidden min-w-0 flex flex-col justify-between">
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-ink-primary flex items-center gap-1.5 font-sans">
                  <Download className="h-4 w-4 text-[#3B689B] shrink-0" />
                  <span>Export Progress Backup</span>
                </h4>
                <p className="text-xs text-ink-secondary leading-relaxed font-sans font-medium">
                  Download a JSON snapshot of all your completed days, checklists, timer sessions, and personal notes.
                </p>
              </div>
              <button
                onClick={exportProgressJSON}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-[#C5DAF5] px-4 py-2.5 text-xs font-bold text-[#3B689B] shadow-bloom hover:bg-[#3B689B] hover:text-white transition-bloom font-sans active:scale-95 text-center"
              >
                <Download className="h-3.5 w-3.5 shrink-0" />
                <span>Download Backup (.json)</span>
              </button>
            </div>

            {/* Import in Soft Mint */}
            <div className="rounded-2xl border border-[#BDDFC6] bg-[#E1F1E6] p-5 space-y-3 shadow-bloom overflow-hidden min-w-0 flex flex-col justify-between">
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-ink-primary flex items-center gap-1.5 font-sans">
                  <Upload className="h-4 w-4 text-[#31785C] shrink-0" />
                  <span>Restore From Backup</span>
                </h4>
                <p className="text-xs text-ink-secondary leading-relaxed font-sans font-medium">
                  Restore progress from an existing backup file. Validates schema before replacing data.
                </p>
              </div>
              <label className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-[#BDDFC6] px-4 py-2.5 text-xs font-bold text-[#31785C] shadow-bloom hover:bg-[#31785C] hover:text-white transition-bloom cursor-pointer font-sans active:scale-95 text-center">
                <Upload className="h-3.5 w-3.5 shrink-0" />
                <span>Upload Backup File</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Section 4: Danger Zone with Peach Button */}
        <div className="mt-6 rounded-3xl border border-[#F4CEB8] bg-[#FBE7DB] p-5 sm:p-6 shadow-bloom overflow-hidden">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#A85E37] flex items-center gap-1.5 font-sans">
                <AlertTriangle className="h-4 w-4 text-[#A85E37] shrink-0" />
                <span>Reset All Curriculum Progress</span>
              </h4>
              <p className="text-xs text-ink-secondary font-sans font-medium leading-relaxed">
                Clears all completed checklists, days, study sessions, and custom notes.
              </p>
            </div>

            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="rounded-xl border border-[#F4CEB8] bg-white px-4 py-2.5 text-xs font-bold text-[#A85E37] hover:bg-[#A85E37] hover:text-white transition-bloom whitespace-nowrap shadow-bloom active:scale-95 font-sans shrink-0"
            >
              Reset Data
            </button>
          </div>
        </div>

        {/* Reset Confirmation Sub-Modal */}
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/45 p-4">
            <div className="w-full max-w-sm rounded-3xl border border-[#F4CEB8] bg-[#FAF8F5] p-6 shadow-bloom-modal">
              <h4 className="text-sm font-bold text-ink-primary font-sans">Confirm Progress Reset?</h4>
              <p className="mt-2 text-xs text-ink-secondary leading-relaxed font-sans font-medium">
                This will irreversibly erase your current progress. Consider creating an Export Backup first.
              </p>
              <div className="mt-5 flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="rounded-xl border border-surface-border-strong bg-white px-4 py-2 text-xs font-bold text-ink-primary hover:bg-surface-subtle shadow-bloom font-sans"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReset}
                  className="rounded-xl bg-[#A85E37] px-4 py-2 text-xs font-bold text-white hover:bg-[#8F4E2C] shadow-bloom font-sans active:scale-95"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
