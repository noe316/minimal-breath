import React from "react";
import { DOT_PATTERNS } from "../constants";

interface DotTimerProps {
  totalSeconds: number; // 이 phase의 전체 초 (4, 7, 8)
  timeLeft: number;     // 남은 초 (8 → 7 → 6 ... 0)
}

export const DotTimer: React.FC<DotTimerProps> = ({ totalSeconds, timeLeft }) => {
  const pattern = DOT_PATTERNS[totalSeconds];

  if (!pattern) return null;

  const rows = pattern.length;      // 3
  const cols = pattern[0].length;   // 3

  // 패턴 안의 "1" 위치만 뽑아서 인덱스 부여
  type Dot = { idx: number; row: number; col: number };

  const dots: Dot[] = [];
  let idx = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (pattern[row][col] === 1) {
        dots.push({ idx, row, col });
        idx++;
      }
    }
  }

  const totalDots = dots.length; // 4, 7, 8
  // timeLeft(남은 초) 만큼 살아있게: 8초 시작 → 8개, 7초 남으면 7개 ...
  const aliveCount = Math.max(Math.min(timeLeft, totalDots), 0);

  return (
      <div className="dot-timer">
        {Array.from({ length: rows }).map((_, row) => (
            <div
                key={row}
                className="dot-row"
                style={{

                }}
            >
              {Array.from({ length: cols }).map((__, col) => {
                const dot = dots.find(d => d.row === row && d.col === col);

                if (!dot) {
                  return <div key={col} className="dot-empty" />;
                }

                const isAlive = dot.idx < aliveCount;

                return (
                    <div
                        key={col}
                        className={`dot ${isAlive ? "dot--alive" : "dot--dead"}`}
                    />
                );
              })}
            </div>
        ))}
      </div>
  );
};