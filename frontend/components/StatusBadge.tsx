import React from 'react';
import { STATUS_CONFIG } from '@/lib/constants';

type Status = 'stable' | 'watch' | 'drift';

interface StatusBadgeProps {
  status: Status;
  bsi?: number;
  showSublabel?: boolean;
}

export default function StatusBadge({ status, bsi, showSublabel = false }: StatusBadgeProps) {
  let effectiveStatus: Status = status;

  // Use BSI mapping if provided
  if (bsi !== undefined) {
    if (bsi >= 90) effectiveStatus = 'stable';
    else if (bsi >= 75) effectiveStatus = 'watch';
    else effectiveStatus = 'drift';
  }

  const config = STATUS_CONFIG[effectiveStatus];

  return (
    <div className={`inline-flex flex-col`}>
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.color} ${config.border}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.label}
      </span>
      {showSublabel && (
        <span className="text-gray-500 text-xs mt-1">{config.sublabel}</span>
      )}
    </div>
  );
}
