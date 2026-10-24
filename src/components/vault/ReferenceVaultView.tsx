import React, { useState } from 'react';
import {
  FileText,
  Book,
  Award,
  Mail,
  Github,
  ExternalLink,
  Star,
  GraduationCap,
} from 'lucide-react';
import { roadmapData } from '../../data/roadmapData';

type VaultTab = 'papers' | 'books' | 'certifications' | 'newsletters' | 'repos' | 'parallel';

export const ReferenceVaultView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<VaultTab>('papers');

  const {
    papers = [],
    books = [],
    certifications = [],
    newsletters = [],
    key_repos = [],
    parallel_track,
  } = roadmapData;

  const tabs: Array<{ id: VaultTab; label: string; count: number; icon: React.ElementType; activeClass: string }> = [
    { id: 'papers', label: 'Research Papers', count: papers.length, icon: FileText, activeClass: 'bg-bloom-blue text-bloom-blue-ink border-bloom-blue-border' },
    { id: 'books', label: 'Textbooks', count: books.length, icon: Book, activeClass: 'bg-bloom-peach text-bloom-peach-ink border-bloom-peach-border' },
    { id: 'certifications', label: 'Certifications', count: certifications.length, icon: Award, activeClass: 'bg-bloom-lavender text-bloom-lavender-ink border-bloom-lavender-border' },
    { id: 'newsletters', label: 'Newsletters', count: newsletters.length, icon: Mail, activeClass: 'bg-bloom-rose text-bloom-rose-ink border-bloom-rose-border' },
    { id: 'repos', label: 'Key GitHub Repos', count: key_repos.length, icon: Github, activeClass: 'bg-bloom-butter text-bloom-butter-ink border-bloom-butter-border' },
    { id: 'parallel', label: 'ML Foundations Track', count: parallel_track?.resources?.length || 0, icon: GraduationCap, activeClass: 'bg-bloom-mint text-bloom-mint-ink border-bloom-mint-border' },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-bloom-muted">
          <span>SCHOLARLY ASSETS</span>
          <span>•</span>
          <span>SUPPLEMENTARY ARCHIVE</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-bloom-text sm:text-3xl font-sans">
          Curriculum Reference Vault
        </h1>
        <p className="mt-0.5 text-xs text-bloom-muted">
          Authoritative supplementary material, seminal research papers, textbooks, and industry certifications
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-bloom-border pb-3.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-bloom border ${
                isActive
                  ? `${tab.activeClass} shadow-bloom`
                  : 'bg-surface text-bloom-muted hover:bg-surface-subtle hover:text-bloom-text border-bloom-border'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono font-semibold ${
                  isActive ? 'bg-surface/80 text-bloom-text' : 'bg-surface-subtle text-bloom-muted'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Research Papers (Powder Blue) */}
      {activeTab === 'papers' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {papers.map((paper) => (
            <div
              key={paper.order}
              className="flex flex-col justify-between rounded-3xl border border-[#C5DAF5] bg-[#F2F7FD] p-6 shadow-bloom hover:border-brand-primary transition-bloom space-y-3.5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-xl bg-white text-[#2B537D] border border-[#C5DAF5] px-3 py-1 text-xs font-mono font-bold shadow-bloom">
                    Paper #{paper.order} • {paper.year}
                  </span>
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline bg-white px-3 py-1 rounded-xl border border-surface-border shadow-bloom"
                  >
                    <span>Read on arXiv</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                <h3 className="mt-3 text-sm font-bold text-ink-primary leading-snug font-sans">{paper.title}</h3>

                <div className="mt-3 rounded-2xl bg-white p-3.5 text-xs text-ink-primary border border-[#C5DAF5] shadow-bloom">
                  <span className="font-bold text-[#2B537D]">What to read: </span>
                  {paper.what_to_read}
                </div>

                <p className="mt-2.5 text-xs text-ink-secondary leading-relaxed font-sans">
                  <strong className="text-ink-primary font-bold">Why it matters: </strong>
                  {paper.why}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Books (Warm Peach) */}
      {activeTab === 'books' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {books.map((book) => (
            <div
              key={book.rank}
              className="flex flex-col justify-between rounded-3xl border border-[#F4CEB8] bg-[#FDF4EE] p-6 shadow-bloom hover:border-brand-primary transition-bloom space-y-3.5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-xl bg-white text-[#7A4226] border border-[#F4CEB8] px-3 py-1 text-xs font-mono font-bold shadow-bloom">
                      Rank #{book.rank}
                    </span>
                    {book.star && (
                      <span className="inline-flex items-center gap-1 rounded-xl bg-[#FFF1CB] text-[#785A10] border border-[#F2DE98] px-2.5 py-1 text-xs font-bold shadow-bloom">
                        <Star className="h-3 w-3 fill-current" /> Must Read
                      </span>
                    )}
                  </div>

                  <a
                    href={book.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline bg-white px-3 py-1 rounded-xl border border-surface-border shadow-bloom"
                  >
                    <span>View Textbook</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                <h3 className="mt-3 text-sm font-bold text-ink-primary leading-snug font-sans">{book.title}</h3>

                <div className="mt-3 rounded-2xl bg-white p-3 text-xs text-ink-primary border border-[#F4CEB8] shadow-bloom">
                  <span className="font-bold text-[#7A4226]">Timeline: </span>
                  {book.when_to_read}
                </div>

                <p className="mt-2.5 text-xs text-bloom-text leading-relaxed bg-surface-subtle p-3.5 rounded-2xl border border-bloom-border">
                  {book.why}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Certifications */}
      {activeTab === 'certifications' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {certifications.map((cert) => (
            <div
              key={cert.rank}
              className="flex flex-col justify-between rounded-3xl border border-[#D7C7F2] bg-[#F6F1FD] p-6 shadow-bloom space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-xl bg-[#EEE6FA] text-[#553C9A] border border-[#CBB8EC] px-3 py-1 text-xs font-mono font-bold">
                    Rank #{cert.rank}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#553C9A] bg-white px-3 py-1 rounded-xl border border-[#D7C7F2] shadow-bloom">
                    {cert.cost_inr}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-bold text-ink-primary leading-snug font-sans">{cert.name}</h3>

                <div className="mt-3 space-y-1.5 text-xs text-ink-secondary font-medium">
                  <div>
                    <strong className="text-ink-primary font-bold">Timeline:</strong> {cert.when_to_start} ({cert.duration_weeks} weeks)
                  </div>
                  <div>
                    <strong className="text-ink-primary font-bold">Exam Type:</strong> {cert.exam_type}
                  </div>
                  <div>
                    <strong className="text-ink-primary font-bold">Target Market:</strong> {cert.best_for}
                  </div>
                </div>

                <p className="mt-3 text-xs text-ink-primary bg-white p-3.5 rounded-2xl border border-[#D7C7F2] leading-relaxed shadow-bloom">
                  {cert.why}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-[#D7C7F2] pt-3.5 text-xs">
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-[#553C9A] hover:underline bg-white px-3.5 py-1.5 rounded-xl border border-[#D7C7F2] shadow-bloom"
                >
                  <span>Official Page</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                {cert.prep_resource && (
                  <a
                    href={cert.prep_resource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-ink-secondary hover:text-ink-primary bg-white/70 px-3 py-1.5 rounded-xl border border-[#D7C7F2]"
                  >
                    <span>Preparation Guide</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Newsletters */}
      {activeTab === 'newsletters' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {newsletters.map((nl) => (
            <div
              key={nl.rank}
              className="flex flex-col justify-between rounded-3xl border border-[#E4C6D6] bg-[#FDF0F5] p-6 shadow-bloom space-y-3.5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-xl bg-[#F6D7E5] text-[#8C335C] border border-[#E4C6D6] px-3 py-1 text-xs font-mono font-bold">
                    Rank #{nl.rank} • {nl.frequency}
                  </span>
                  <a
                    href={nl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C335C] hover:underline bg-white px-3 py-1 rounded-xl border border-[#E4C6D6] shadow-bloom"
                  >
                    <span>Subscribe</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                <h3 className="mt-3 text-base font-bold text-ink-primary leading-snug font-sans">{nl.name}</h3>
                <p className="mt-1.5 text-xs font-bold text-[#8C335C]">{nl.focus}</p>
                <p className="mt-2 text-xs text-ink-secondary leading-relaxed bg-white p-3 rounded-2xl border border-[#E4C6D6] shadow-bloom">
                  {nl.why}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Key GitHub Repos */}
      {activeTab === 'repos' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {key_repos.map((repo) => (
            <div
              key={repo.name}
              className="flex flex-col justify-between rounded-3xl border border-[#F2DE98] bg-[#FFF9E6] p-6 shadow-bloom space-y-3.5 transition-bloom"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-ink-primary">
                    <Github className="h-4 w-4" />
                    <span>{repo.name}</span>
                  </span>
                  <span className="rounded-xl bg-white text-[#8F6A10] border border-[#F2DE98] px-2.5 py-1 text-xs font-mono font-bold shadow-bloom">
                    ★ {repo.stars}
                  </span>
                </div>

                <p className="mt-3 text-xs text-ink-primary leading-relaxed bg-white/80 p-3.5 rounded-2xl border border-[#F2DE98]">
                  {repo.why}
                </p>
              </div>

              <div className="mt-4 pt-3.5 border-t border-[#F2DE98]">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8F6A10] hover:underline bg-white px-3.5 py-1.5 rounded-xl border border-[#F2DE98] shadow-bloom"
                >
                  <span>Open GitHub Repository</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 6: Parallel Track */}
      {activeTab === 'parallel' && parallel_track && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#BDDFC6] bg-[#F0F8F3] p-6 sm:p-7 shadow-bloom space-y-3.5">
            <h2 className="text-xl font-bold text-ink-primary font-sans">{parallel_track.title}</h2>
            <div className="text-xs text-[#226348] font-bold font-mono">
              When to start: {parallel_track.when_to_start}
            </div>
            <div className="rounded-2xl bg-white p-4 border border-[#BDDFC6] text-xs space-y-2 text-ink-primary shadow-bloom">
              <p>
                <strong className="font-bold text-[#226348]">Why optional: </strong>
                {parallel_track.why_optional}
              </p>
              <p>
                <strong className="font-bold text-[#226348]">Why recommended: </strong>
                {parallel_track.why_recommended}
              </p>
            </div>
          </div>

          <h3 className="text-sm font-bold text-ink-primary">Recommended Foundations Playlists & Textbook</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {parallel_track.resources.map((res, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-3xl border border-[#BDDFC6] bg-[#F0F8F3] p-5 shadow-bloom space-y-3.5"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#226348] uppercase bg-white px-2 py-0.5 rounded-md border border-[#BDDFC6]">
                    Module #{i + 1}
                  </span>
                  <h4 className="mt-2 text-sm font-bold text-ink-primary leading-snug">{res.title}</h4>
                  <p className="mt-1 text-xs text-ink-secondary font-mono">{res.duration}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#BDDFC6]">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#226348] hover:underline bg-white px-3 py-1.5 rounded-xl border border-[#BDDFC6] shadow-bloom"
                  >
                    <span>Access Curriculum Material</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
