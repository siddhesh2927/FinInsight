'use client';

import { DocStatus, DatasetStatus } from '@/types/chat';

interface StatusBadgeProps {
  status: DocStatus | DatasetStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const badgeConfig: Record<string, { container: string; dot: string; label: string }> = {
    Indexed: {
      container: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      dot: 'bg-emerald-500',
      label: 'Indexed',
    },
    Connected: {
      container: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      dot: 'bg-emerald-500',
      label: 'Connected',
    },
    Processing: {
      container: 'bg-amber-50 text-amber-700 border-amber-100',
      dot: 'bg-amber-500 animate-pulse',
      label: 'Processing',
    },
    Failed: {
      container: 'bg-red-50 text-red-700 border-red-100',
      dot: 'bg-red-500',
      label: 'Failed',
    },
  };

  const config = badgeConfig[status] || badgeConfig['Processing'];

  return (
    <span 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-bold shadow-3xs ${config.container}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
}
