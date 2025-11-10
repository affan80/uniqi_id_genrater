import { Team, Cohort, QRCode, CompletedLevel } from "@/types";

export const mockCohorts: Cohort[] = [
  { id: 1, name: "Cyber Warriors 2024" },
  { id: 2, name: "Digital Ninjas" },
  { id: 3, name: "Code Breakers" },
];

export const mockCompletedLevels: CompletedLevel[] = [
  { id: 1, teamId: 1, level: 1 },
  { id: 2, teamId: 1, level: 2 },
  { id: 3, teamId: 1, level: 3 },
  { id: 4, teamId: 2, level: 1 },
  { id: 5, teamId: 2, level: 2 },
  { id: 6, teamId: 3, level: 1 },
  { id: 7, teamId: 4, level: 1 },
  { id: 8, teamId: 4, level: 2 },
  { id: 9, teamId: 4, level: 3 },
  { id: 10, teamId: 4, level: 4 },
];

export const mockTeams: Team[] = [
  {
    id: 1,
    name: "Phoenix Rising",
    currentLevel: 3,
    cohortId: 1,
    cohort: mockCohorts[0],
    completedLevels: mockCompletedLevels.filter(cl => cl.teamId === 1),
  },
  {
    id: 2,
    name: "Shadow Hackers",
    currentLevel: 2,
    cohortId: 1,
    cohort: mockCohorts[0],
    completedLevels: mockCompletedLevels.filter(cl => cl.teamId === 2),
  },
  {
    id: 3,
    name: "Quantum Leap",
    currentLevel: 1,
    cohortId: 1,
    cohort: mockCohorts[0],
    completedLevels: mockCompletedLevels.filter(cl => cl.teamId === 3),
  },
  {
    id: 4,
    name: "Matrix Runners",
    currentLevel: 4,
    cohortId: 2,
    cohort: mockCohorts[1],
    completedLevels: mockCompletedLevels.filter(cl => cl.teamId === 4),
  },
  {
    id: 5,
    name: "Neon Knights",
    currentLevel: 0,
    cohortId: 2,
    cohort: mockCohorts[1],
    completedLevels: [],
  },
];

export const mockQRCodes: QRCode[] = [
  { id: 1, code: "QR001-LEVEL1", level: 1, cohortId: 1, cohort: mockCohorts[0] },
  { id: 2, code: "QR002-LEVEL2", level: 2, cohortId: 1, cohort: mockCohorts[0] },
  { id: 3, code: "QR003-LEVEL3", level: 3, cohortId: 1, cohort: mockCohorts[0] },
  { id: 4, code: "QR004-LEVEL4", level: 4, cohortId: 1, cohort: mockCohorts[0] },
  { id: 5, code: "QR005-LEVEL5", level: 5, cohortId: 1, cohort: mockCohorts[0] },
];

export const TOTAL_LEVELS = 10;
