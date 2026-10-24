/**
 * Quiet Bloom Theme Utilities
 * Phase and difficulty color mappings according to the Quiet Bloom design specification
 */

export interface PhaseColorTheme {
  id: number;
  name: string;
  badgeBg: string;
  badgeText: string;
  cardBorder: string;
  accentBg: string;
  accentText: string;
  barColor: string;
  dotColor: string;
  solidBadgeBg: string;
}

export function getPhaseTheme(phaseId: number): PhaseColorTheme {
  switch (phaseId) {
    case 1:
      return {
        id: 1,
        name: 'AI Engineering Foundation',
        badgeBg: 'bg-phase1-bg',
        badgeText: 'text-phase1-accent',
        cardBorder: 'border-phase1-border',
        accentBg: 'bg-phase1-bg',
        accentText: 'text-phase1-accent',
        barColor: '#3B689B',
        dotColor: 'bg-phase1-accent',
        solidBadgeBg: 'bg-phase1-accent',
      };
    case 2:
      return {
        id: 2,
        name: 'Core AI Stack & RAG',
        badgeBg: 'bg-phase2-bg',
        badgeText: 'text-phase2-accent',
        cardBorder: 'border-phase2-border',
        accentBg: 'bg-phase2-bg',
        accentText: 'text-phase2-accent',
        barColor: '#6D56A6',
        dotColor: 'bg-phase2-accent',
        solidBadgeBg: 'bg-phase2-accent',
      };
    case 3:
      return {
        id: 3,
        name: 'Agent Engineering',
        badgeBg: 'bg-phase3-bg',
        badgeText: 'text-phase3-accent',
        cardBorder: 'border-phase3-border',
        accentBg: 'bg-phase3-bg',
        accentText: 'text-phase3-accent',
        barColor: '#31785C',
        dotColor: 'bg-phase3-accent',
        solidBadgeBg: 'bg-phase3-accent',
      };
    case 4:
      return {
        id: 4,
        name: 'Production Engineering',
        badgeBg: 'bg-phase4-bg',
        badgeText: 'text-phase4-accent',
        cardBorder: 'border-phase4-border',
        accentBg: 'bg-phase4-bg',
        accentText: 'text-phase4-accent',
        barColor: '#A85E37',
        dotColor: 'bg-phase4-accent',
        solidBadgeBg: 'bg-phase4-accent',
      };
    default:
      return {
        id: phaseId,
        name: 'Curriculum',
        badgeBg: 'bg-surface-subtle',
        badgeText: 'text-ink-primary',
        cardBorder: 'border-surface-border',
        accentBg: 'bg-surface-subtle',
        accentText: 'text-ink-secondary',
        barColor: '#8072B8',
        dotColor: 'bg-brand',
        solidBadgeBg: 'bg-brand-primary',
      };
  }
}

export function getDifficultyBadge(difficulty: string): { bg: string; text: string; label: string } {
  const d = (difficulty || '').toLowerCase();
  if (d.includes('beginner') && !d.includes('intermediate')) {
    return { bg: 'bg-pastel-mint border border-pastel-mint-border', text: 'text-pastel-mint-text font-semibold', label: 'Beginner' };
  } else if (d.includes('advanced')) {
    return { bg: 'bg-pastel-peach border border-pastel-peach-border', text: 'text-pastel-peach-text font-semibold', label: 'Advanced' };
  }
  return { bg: 'bg-pastel-powder border border-pastel-powder-border', text: 'text-pastel-powder-text font-semibold', label: 'Intermediate' };
}

export function getResourceTypeBadge(type?: string): { bg: string; text: string; iconLabel: string } {
  const t = (type || '').toLowerCase();
  if (t.includes('video')) {
    return { bg: 'bg-pastel-peach border border-pastel-peach-border', text: 'text-pastel-peach-text font-semibold', iconLabel: 'Video Lecture' };
  } else if (t.includes('docs')) {
    return { bg: 'bg-pastel-mint border border-pastel-mint-border', text: 'text-pastel-mint-text font-semibold', iconLabel: 'Official Docs' };
  } else if (t.includes('repo')) {
    return { bg: 'bg-pastel-lavender border border-pastel-lavender-border', text: 'text-pastel-lavender-text font-semibold', iconLabel: 'GitHub Repo' };
  } else if (t.includes('course')) {
    return { bg: 'bg-pastel-powder border border-pastel-powder-border', text: 'text-pastel-powder-text font-semibold', iconLabel: 'Course' };
  } else if (t.includes('tool')) {
    return { bg: 'bg-pastel-butter border border-pastel-butter-border', text: 'text-pastel-butter-text font-semibold', iconLabel: 'Interactive Tool' };
  }
  return { bg: 'bg-surface-subtle border border-surface-border', text: 'text-ink-primary font-semibold', iconLabel: type || 'Resource' };
}
