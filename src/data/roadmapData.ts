import rawData from './roadmapRaw.json';
import {
  RoadmapData,
  RoadmapDay,
  RoadmapNode,
  RoadmapPhase,
  MilestoneProject,
} from '../types/roadmap';

export const roadmapData = rawData as unknown as RoadmapData;

// Pre-sorted list of all lessons
export const allDays: RoadmapDay[] = [...roadmapData.days].sort((a, b) => a.day - b.day);
export const allPhases: RoadmapPhase[] = [...roadmapData.phases].sort((a, b) => a.id - b.id);
export const allNodes: RoadmapNode[] = [...roadmapData.nodes].sort((a, b) => a.id - b.id);
export const allProjects: MilestoneProject[] = [...roadmapData.projects];

// Fast O(1) Lookup Maps
export const daysMap = new Map<number, RoadmapDay>();
allDays.forEach((day) => daysMap.set(day.day, day));

export const nodesMap = new Map<number, RoadmapNode>();
allNodes.forEach((node) => nodesMap.set(node.id, node));

export const phasesMap = new Map<number, RoadmapPhase>();
allPhases.forEach((phase) => phasesMap.set(phase.id, phase));

export const projectsMap = new Map<string, MilestoneProject>();
allProjects.forEach((proj) => projectsMap.set(proj.id, proj));

export function getDayByNumber(dayNumber: number): RoadmapDay | undefined {
  return daysMap.get(dayNumber);
}

export function getNodeById(nodeId: number): RoadmapNode | undefined {
  return nodesMap.get(nodeId);
}

export function getPhaseById(phaseId: number): RoadmapPhase | undefined {
  return phasesMap.get(phaseId);
}

export function getProjectById(projectId: string): MilestoneProject | undefined {
  return projectsMap.get(projectId);
}

export function getDaysByPhase(phaseId: number): RoadmapDay[] {
  return allDays.filter((d) => d.phase === phaseId);
}

export function getDaysByNode(nodeId: number | string): RoadmapDay[] {
  return allDays.filter((d) => d.node === nodeId);
}

export function getAdjacentDays(currentDayNumber: number): {
  prevDay: RoadmapDay | null;
  nextDay: RoadmapDay | null;
} {
  const currentIndex = allDays.findIndex((d) => d.day === currentDayNumber);
  if (currentIndex === -1) {
    return { prevDay: null, nextDay: null };
  }
  const prevDay = currentIndex > 0 ? allDays[currentIndex - 1] : null;
  const nextDay = currentIndex < allDays.length - 1 ? allDays[currentIndex + 1] : null;
  return { prevDay, nextDay };
}

/**
 * Finds the closest available day if a day number doesn't exist
 */
export function getClosestDay(targetDay: number): RoadmapDay {
  if (daysMap.has(targetDay)) {
    return daysMap.get(targetDay)!;
  }
  let closest = allDays[0];
  let minDiff = Math.abs(allDays[0].day - targetDay);
  for (const day of allDays) {
    const diff = Math.abs(day.day - targetDay);
    if (diff < minDiff) {
      minDiff = diff;
      closest = day;
    }
  }
  return closest;
}
