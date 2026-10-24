import React, { useState } from 'react';
import {
  Code2,
  Github,
  FileCheck,
  CheckSquare,
} from 'lucide-react';
import { useRoadmap } from '../../context/RoadmapContext';
import { allProjects, allPhases } from '../../data/roadmapData';
import { ProjectProgressStatus } from '../../types/progress';
import { getPhaseTheme } from '../../utils/themeUtils';

export const ProjectsView: React.FC = () => {
  const {
    progress,
    updateProjectStatus,
    toggleProjectDeliverable,
    saveProjectNote,
    navigateToDay,
  } = useRoadmap();

  const [activeProjectId, setActiveProjectId] = useState<string>(allProjects[0].id);

  const activeProject = allProjects.find((p) => p.id === activeProjectId) || allProjects[0];
  const activePhase = allPhases.find((p) => p.id === activeProject.phase);
  const phaseTheme = getPhaseTheme(activeProject.phase);

  const userProgress = progress.projectProgress[activeProject.id] || {
    status: 'not_started',
    deliverablesCompleted: [],
    notes: '',
  };

  const completedDeliverablesCount = userProgress.deliverablesCompleted?.length || 0;
  const totalDeliverablesCount = activeProject.deliverables.length;
  const deliverablesPercent = totalDeliverablesCount > 0
    ? Math.round((completedDeliverablesCount / totalDeliverablesCount) * 100)
    : 0;

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-bloom-muted">
          <span>CAPSTONE SYSTEMS</span>
          <span>•</span>
          <span>PRODUCTION ARTIFACTS</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-bloom-text sm:text-3xl font-sans">
          Capstone Milestone Projects
        </h1>
        <p className="mt-0.5 text-xs text-bloom-muted">
          4 production-grade portfolio projects demonstrating end-to-end engineering rigor, evaluation harnesses, and deployment
        </p>
      </div>

      {/* 4 Project Selector Cards with 70% Pastel Phase Colors */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {allProjects.map((p) => {
          const isSelected = p.id === activeProjectId;
          const status = progress.projectProgress[p.id]?.status || 'not_started';
          const pTheme = getPhaseTheme(p.phase);

          // Phase pastel surface
          const cardBg =
            p.phase === 1 ? 'bg-[#E5EFFB] border-[#C5DAF5] hover:bg-[#D9EAFB]' :
            p.phase === 2 ? 'bg-[#EEE6FA] border-[#D7C7F2] hover:bg-[#E4D5F8]' :
            p.phase === 3 ? 'bg-[#E1F1E6] border-[#BDDFC6] hover:bg-[#D2ECDC]' :
            'bg-[#FBE7DB] border-[#F4CEB8] hover:bg-[#F7D8C4]';

          return (
            <button
              key={p.id}
              onClick={() => setActiveProjectId(p.id)}
              className={`flex flex-col justify-between rounded-3xl border p-5 text-left transition-bloom shadow-bloom overflow-hidden ${cardBg} ${
                isSelected
                  ? 'ring-2 ring-brand-primary border-brand-primary shadow-bloom-elevated'
                  : 'hover:border-black/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-xl font-mono text-xs font-bold px-2.5 py-1 bg-white/90 border ${pTheme.cardBorder} ${pTheme.badgeText} shrink-0`}>
                    {p.id}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize font-sans shrink-0 ${
                      status === 'completed'
                        ? 'bg-phase3-bg text-phase3-accent border border-phase3-border'
                        : status === 'in_progress'
                        ? 'bg-phase1-bg text-phase1-accent border border-phase1-border'
                        : 'bg-white/90 text-ink-secondary border border-black/10'
                    }`}
                  >
                    {status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="mt-3.5 text-sm font-bold text-ink-primary leading-snug font-sans line-clamp-2">
                  {p.title}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-black/10 text-xs text-ink-secondary font-sans flex items-center justify-between font-semibold gap-2">
                <span className="shrink-0">Phase {p.phase}</span>
                <span className="font-mono text-[11px] truncate" title={`Days ${p.days.join(', ')}`}>
                  {p.days.length > 3 ? `Days ${p.days[0]}–${p.days[p.days.length - 1]}` : `Days ${p.days.join(', ')}`}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Project Full Details with Phase Gradient & Paper Grain */}
      <div
        className={`rounded-3xl border p-6 sm:p-8 shadow-bloom space-y-6 grain-overlay overflow-hidden ${
          activeProject.phase === 1
            ? 'bg-gradient-to-br from-[#E5EFFB] via-[#EBF3FC] to-[#FAF8F5] border-[#C5DAF5]'
            : activeProject.phase === 2
            ? 'bg-gradient-to-br from-[#EEE6FA] via-[#F4EEFC] to-[#FAF8F5] border-[#D7C7F2]'
            : activeProject.phase === 3
            ? 'bg-gradient-to-br from-[#E1F1E6] via-[#EBF6EE] to-[#FAF8F5] border-[#BDDFC6]'
            : 'bg-gradient-to-br from-[#FBE7DB] via-[#FCEDE4] to-[#FAF8F5] border-[#F4CEB8]'
        }`}
      >
        {/* Project Header Bar */}
        <div className="flex flex-col justify-between gap-5 border-b border-black/10 pb-6 lg:flex-row lg:items-start">
          <div className="space-y-3 flex-1 min-w-0 pr-0 lg:pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-xl px-3 py-1 font-mono text-xs font-bold bg-white/90 border ${phaseTheme.cardBorder} ${phaseTheme.badgeText}`}>
                PROJECT {activeProject.id}
              </span>
              <span className="rounded-xl border border-surface-border bg-white/90 px-3 py-1 text-xs font-bold text-ink-primary font-sans">
                Phase {activeProject.phase}: {activePhase?.title}
              </span>
              <span className="text-xs text-ink-secondary font-mono font-medium bg-white/80 px-2.5 py-1 rounded-xl border border-black/5">
                Duration: {activeProject.duration}
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-ink-primary sm:text-3xl font-sans break-words">
              {activeProject.title}
            </h2>

            <p className="text-xs text-ink-primary/90 leading-relaxed font-sans font-medium break-words">
              {activeProject.description}
            </p>
          </div>

          {/* Status Changer Buttons & Build Day Launchers */}
          <div className="flex flex-col items-start gap-3 lg:items-end shrink-0 w-full lg:w-auto">
            <div className="space-y-1.5 w-full lg:w-auto">
              <span className="text-xs font-bold text-ink-secondary font-sans block lg:text-right">Project Lifecycle Status:</span>
              <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-surface-border p-1 bg-white shadow-bloom">
                {(['not_started', 'in_progress', 'completed'] as ProjectProgressStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => updateProjectStatus(activeProject.id, st)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-bloom capitalize font-sans ${
                      userProgress.status === st
                        ? st === 'completed'
                          ? 'bg-phase3-bg text-phase3-accent border border-phase3-border shadow-bloom'
                          : st === 'in_progress'
                          ? 'bg-phase1-bg text-phase1-accent border border-phase1-border shadow-bloom'
                          : 'bg-brand-primary text-white shadow-bloom'
                        : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-subtle'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Jump to Project Build Days */}
            <div className="space-y-1.5 w-full lg:w-auto">
              <span className="text-ink-secondary font-sans text-xs font-bold block lg:text-right">Associated curriculum days:</span>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                {activeProject.days.map((d) => (
                  <button
                    key={d}
                    onClick={() => navigateToDay(d)}
                    className="rounded-xl border border-surface-border bg-white px-3 py-1 text-xs font-bold text-brand-primary hover:bg-brand-primary hover:text-white transition-bloom shadow-bloom active:scale-95"
                  >
                    Day {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack & Evaluation Specifications */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Tech Stack */}
          <div className="rounded-2xl border border-black/10 bg-white/70 p-5 shadow-bloom space-y-3 overflow-hidden">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-brand-primary shrink-0" />
              <h4 className="text-xs font-bold text-ink-primary uppercase tracking-wider font-mono">Production Tech Stack</h4>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {activeProject.stack.split(',').map((tech, i) => (
                <span
                  key={i}
                  className="rounded-xl border border-surface-border bg-white px-3 py-1 text-xs font-mono font-bold text-ink-primary shadow-bloom"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Evaluation Criteria */}
          <div className="rounded-2xl border border-black/10 bg-white/70 p-5 shadow-bloom space-y-3 overflow-hidden">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-[#31785C] shrink-0" />
              <h4 className="text-xs font-bold text-ink-primary uppercase tracking-wider font-mono">Evaluation & Benchmark Quality Bar</h4>
            </div>
            <p className="text-xs text-ink-primary leading-relaxed font-sans bg-white p-3.5 rounded-xl border border-surface-border shadow-bloom font-medium break-words">
              {activeProject.evaluation}
            </p>
          </div>
        </div>

        {/* Recruiter & GitHub Tip in Lavender */}
        <div className="rounded-2xl border border-[#D7C7F2] bg-[#EEE6FA]/60 p-5 shadow-bloom space-y-2 overflow-hidden">
          <div className="flex items-center gap-2">
            <Github className="h-4 w-4 text-[#553C9A] shrink-0" />
            <h4 className="text-xs font-bold text-ink-primary font-sans">GitHub Portfolio & Technical Interview Guidance</h4>
          </div>
          <p className="text-xs text-ink-primary leading-relaxed font-sans font-medium break-words">
            {activeProject.github_tip}
          </p>
        </div>

        {/* Deliverables Checklist (Interactive with Persistence) */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-2">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-[#31785C] shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-primary font-mono">Deliverables Checklist</h3>
            </div>
            <span className="text-xs font-mono font-bold text-ink-secondary bg-white/80 px-2.5 py-0.5 rounded-lg border border-black/5">
              {completedDeliverablesCount} of {totalDeliverablesCount} completed ({deliverablesPercent}%)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {activeProject.deliverables.map((item, idx) => {
              const isChecked = userProgress.deliverablesCompleted?.includes(String(idx));
              return (
                <label
                  key={idx}
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-xs cursor-pointer transition-bloom shadow-bloom min-w-0 overflow-hidden ${
                    isChecked
                      ? 'border-[#BDDFC6] bg-white text-[#226348] font-bold ring-1 ring-[#BDDFC6]'
                      : 'border-surface-border bg-white hover:bg-white/90 text-ink-primary font-medium'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleProjectDeliverable(activeProject.id, idx)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-surface-border text-[#31785C] focus:ring-[#31785C]"
                  />
                  <span className={`break-words min-w-0 flex-1 leading-snug font-sans ${isChecked ? 'line-through text-ink-secondary font-normal' : 'font-semibold'}`}>
                    {item}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Personal Project Notes / Repo Link */}
        <div className="border-t border-black/10 pt-5 space-y-2">
          <label className="text-xs font-bold text-ink-primary font-sans">
            Personal Repository URL & Architecture Notes:
          </label>
          <p className="text-xs text-ink-secondary font-sans font-medium">
            Add your public GitHub repo URL, architecture decisions, or benchmark results for this milestone. Saved immediately to local state.
          </p>
          <textarea
            value={userProgress.notes || ''}
            onChange={(e) => saveProjectNote(activeProject.id, e.target.value)}
            rows={3}
            placeholder="e.g. GitHub: https://github.com/my-profile/rag-chatbot-production&#10;RAGAS Scores: Faithfulness 0.88, Answer Relevance 0.84, Context Precision 0.81."
            className="w-full rounded-2xl border border-surface-border-strong bg-white p-3.5 text-xs text-ink-primary font-mono focus:border-brand-primary focus:outline-none shadow-bloom"
          />
        </div>
      </div>
    </div>
  );
};
