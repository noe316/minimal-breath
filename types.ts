export enum BreathingPhase {
  IDLE = 'IDLE',
  INHALE = 'INHALE',
  HOLD = 'HOLD',
  EXHALE = 'EXHALE',
  COMPLETED = 'COMPLETED',
}

export interface SessionRecord {
  id: string;
  timestamp: number; // UTC timestamp
  totalCycles: number;
  totalDurationSec: number;
}

export interface DailyStat {
  date: string; // YYYY-MM-DD (KST)
  count: number;
  totalDuration: number;
  sessions: SessionRecord[];
}

export type PhaseConfig = {
  duration: number; // seconds
  label: string;
  instruction: string;
};