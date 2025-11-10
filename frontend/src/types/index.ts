export interface Cohort {
  id: number;
  name: string;
}

export interface Team {
  id: number;
  name: string;
  currentLevel: number;
  cohortId: number;
  cohort?: Cohort;
  completedLevels?: CompletedLevel[];
}

export interface QRCode {
  id: number;
  code: string;
  level: number;
  cohortId: number;
  cohort?: Cohort;
}

export interface CompletedLevel {
  id: number;
  teamId: number;
  level: number;
  team?: Team;
}
