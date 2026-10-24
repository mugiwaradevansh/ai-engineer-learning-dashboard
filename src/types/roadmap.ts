export interface RoadmapResource {
  title: string;
  url: string;
  type?: string;
  duration?: string;
}

export interface RoadmapDay {
  day: number;
  phase: number;
  node: number | string;
  node_title: string;
  day_title: string;
  time_hours: number;
  difficulty: string;
  what_to_learn: string[];
  primary_resource: RoadmapResource;
  secondary_resource?: RoadmapResource;
  how_to_learn: string;
  practice_task: string;
  pro_tip: string;
  checklist: string[];
}

export interface RoadmapNode {
  id: number;
  phase: number;
  title: string;
  duration: string;
  days_range: [number, number];
  difficulty: string;
  intro: string;
  what_to_learn: string[];
  pro_tip: string;
}

export interface RoadmapPhase {
  id: number;
  title: string;
  subtitle: string;
  timeline: string;
  days_range: [number, number];
  color_bg: string;
  color_accent: string;
  nodes: number[];
  milestone_project_id: string;
}

export interface MilestoneProject {
  id: string;
  phase: number;
  days: number[];
  title: string;
  stack: string;
  duration: string;
  description: string;
  github_tip: string;
  deliverables: string[];
  evaluation: string;
}

export interface ParallelTrackResource {
  title: string;
  url: string;
  duration: string;
}

export interface ParallelTrack {
  title: string;
  when_to_start: string;
  why_optional: string;
  why_recommended: string;
  resources: ParallelTrackResource[];
}

export interface ResearchPaper {
  order: number;
  title: string;
  url: string;
  year: number;
  what_to_read: string;
  why: string;
}

export interface BookRecommendation {
  rank: number;
  title: string;
  url: string;
  star: boolean;
  when_to_read: string;
  why: string;
}

export interface Certification {
  rank: number;
  name: string;
  url: string;
  cost_inr: string;
  when_to_start: string;
  duration_weeks: string;
  exam_type: string;
  best_for: string;
  why: string;
  prep_resource: string;
}

export interface Newsletter {
  rank: number;
  name: string;
  url: string;
  frequency: string;
  focus: string;
  why: string;
}

export interface KeyRepository {
  name: string;
  url: string;
  stars: string;
  why: string;
}

export interface RoadmapMeta {
  title: string;
  subtitle: string;
  total_days: number;
  total_phases: number;
  total_nodes: number;
  total_projects: number;
  daily_hours_recommended: number;
  note: string;
}

export interface RoadmapData {
  meta: RoadmapMeta;
  phases: RoadmapPhase[];
  nodes: RoadmapNode[];
  days: RoadmapDay[];
  projects: MilestoneProject[];
  parallel_track: ParallelTrack;
  papers: ResearchPaper[];
  books: BookRecommendation[];
  certifications: Certification[];
  newsletters: Newsletter[];
  key_repos: KeyRepository[];
}
