'use client';

import React from 'react';

interface MiniLineProps {
  data?: Array<{ x: number; y: number }>;
}

const MiniLine: React.FC<MiniLineProps> = ({ data = [] }) => {
  const w = 520;
  const h = 120;
  const pad = 16;
  
  const xs = data.map(d => d.x) ?? [];
  const ys = data.map(d => d.y) ?? [];
  
  if (xs.length < 2) {
    return <div className="text-gray-500 text-sm">Not enough data.</div>;
  }
  
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = 0;
  const yMax = Math.max(...ys) * 1.1;
  
  const sx = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (w - pad * 2);
  const sy = (y: number) => h - pad - ((y - yMin) / (yMax - yMin)) * (h - pad * 2);
  
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${sx(x)} ${sy(ys[i])}`).join(" ");
  
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="meetings trend">
      <path d={path} fill="none" stroke="url(#grad1)" strokeWidth="3" />
      <defs>
        <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF6B2C" />
          <stop offset="100%" stopColor="#3AA3FF" />
        </linearGradient>
      </defs>
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#E5E7EB" />
    </svg>
  );
};

const MeetingsTrend: React.FC = () => {
  // Mock data for meetings trend (matching the old dashboard)
  const trendData = [
    { x: 1, y: 22 },
    { x: 2, y: 28 },
    { x: 3, y: 31 },
    { x: 4, y: 26 },
    { x: 5, y: 33 },
    { x: 6, y: 42 },
    { x: 7, y: 38 }
  ];

  return <MiniLine data={trendData} />;
};

export default MeetingsTrend;