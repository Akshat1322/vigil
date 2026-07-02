"use client";

import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { BsiHistoryPoint } from '@/lib/api';

interface Props {
  data: BsiHistoryPoint[];
  lineColor: string;
}

export default function SparklineChart({ data, lineColor }: Props) {
  if (!data || data.length < 2) {
    return null;
  }
  
  const gradientId = "gradient-" + Math.random().toString(36).substring(2, 11);

  return (
    <ResponsiveContainer width="100%" height={72}>
      <AreaChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={lineColor} stopOpacity={0.08}/>
            <stop offset="95%" stopColor={lineColor} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <YAxis domain={[80, 100]} hide={true} />
        <Area 
          type="monotone"
          dataKey="bsi"
          stroke={lineColor}
          strokeWidth={1.5}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
