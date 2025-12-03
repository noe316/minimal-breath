import { SessionRecord, DailyStat } from '../types';
import { LOCAL_STORAGE_KEY } from '../constants';

// Helper to get KST Date String (YYYY-MM-DD)
export const getKSTDateString = (timestamp: number): string => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-CA', { // en-CA gives YYYY-MM-DD
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

// Helper to get KST Time String (HH:MM)
export const formatTimeKST = (timestamp: number): string => {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date(timestamp));
};

export const saveSession = (cycles: number, durationSec: number) => {
  const newRecord: SessionRecord = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    totalCycles: cycles,
    totalDurationSec: durationSec,
  };

  const existingData = getHistory();
  const updatedData = [newRecord, ...existingData];
  
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error("Failed to save to local storage", error);
  }
};

export const getHistory = (): SessionRecord[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to read from local storage", error);
    return [];
  }
};

// 예: "2025-12-03" 형태로 로컬 날짜 반환
const getLocalDateString = (timestamp: number): string => {
  const d = new Date(timestamp); // 브라우저 로컬 타임존 기준

  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, '0'); // 0~11 → 1~12
  const day = `${d.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};
export const getDailyStats = (): DailyStat[] => {
  const history = getHistory();
  const groups: Record<string, DailyStat> = {};

  history.forEach(record => {
    // ✅ KST 대신 사용자 로컬 타임존 기준 날짜로 그룹핑
    const localDate = getLocalDateString(record.timestamp);

    if (!groups[localDate]) {
      groups[localDate] = {
        date: localDate,
        count: 0,
        totalDuration: 0,
        sessions: []
      };
    }

    groups[localDate].count += 1;
    groups[localDate].totalDuration += record.totalDurationSec;
    groups[localDate].sessions.push(record);
  });

  return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date));
};

export const formatDuration = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
};
