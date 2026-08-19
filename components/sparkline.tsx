'use client';

import * as React from 'react';

interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export function Sparkline({ data, color = 'text-primary', width = 80, height = 28 }: SparklineProps) {
  const gradientId = React.useId();

  if (!data || data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  });

  const path = `M ${points.join(' L ')}`;
  const areaPath = `${path} L ${width},${height} L 0,${height} Z`;
  const safeId = gradientId.replace(/:/g, '');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={safeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className={color}>
        <path d={areaPath} fill={`url(#${safeId})`} />
        <path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={width} cy={height - ((data[data.length - 1] - min) / range) * height} r="2" fill="currentColor" />
      </g>
    </svg>
  );
}
