'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { BsiHistoryPoint } from '@/lib/api';

interface Props {
  history: BsiHistoryPoint[];
  lineColor?: string;
}

export default function BsiTrendChart({ history, lineColor = "#34d399" }: Props) {
  if (!history || history.length < 2) {
    return (
      <div className="py-8 text-center text-sm text-[#64748b]">
        Not enough data yet — check back after the next scheduled run.
      </div>
    );
  }

  // Format the data for recharts
  const chartData = history.map(point => ({
    ...point,
    formattedTime: new Date(point.timestamp).toLocaleDateString() + ' ' + new Date(point.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  }));
  
  const gradientId = "gradient-trend-" + Math.random().toString(36).substring(2, 11);

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 0,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity={0.15}/>
              <stop offset="100%" stopColor={lineColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2433" vertical={false} />
          <XAxis dataKey="formattedTime" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={{stroke: '#1e2433'}} />
          <YAxis domain={[0, 100]} stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={{stroke: '#1e2433'}} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#161b27', borderColor: '#1e2433', color: '#f1f5f9' }}
            itemStyle={{ color: lineColor }}
            labelFormatter={(label) => `Run at: ${label}`}
            formatter={(value, name, props) => [
              `${Number(value).toFixed(1)} (Run: ${props?.payload?.run_id?.substring(0,8) ?? ''})`,
              'BSI Score'
            ]}
          />
          <ReferenceLine y={90} stroke="#475569" strokeDasharray="3 3" label={{ position: 'top', value: 'Stable threshold', fill: '#475569', fontSize: 12 }} />
          <Area type="monotone" dataKey="bsi" stroke={lineColor} strokeWidth={2} fill={`url(#${gradientId})`} activeDot={{ r: 6, fill: lineColor, stroke: '#161b27' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
