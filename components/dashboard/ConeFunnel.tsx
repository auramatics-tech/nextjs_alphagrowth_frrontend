'use client';

import React from 'react';
import type { SalesFunnelData } from '../../types/dashboard';

interface ConeFunnelProps {
  values: SalesFunnelData;
}

const ConeFunnel: React.FC<ConeFunnelProps> = ({ values }) => {
  const currency = (n: number) => new Intl.NumberFormat("en-US", { 
    style: "currency", 
    currency: "USD", 
    maximumFractionDigits: 0 
  }).format(Math.round(n ?? 0));

  const stages = [
    { key: "qualifiedValue", label: "Qualified Interested", color: "#FF6B2C" },
    { key: "scheduledValue", label: "Meeting Scheduled", color: "#3AA3FF" },
    { key: "completedValue", label: "Meeting Completed", color: "#7A6BF2" },
    { key: "nurtureValue", label: "Follow-up / Nurture", color: "#8A9AAE" },
    { key: "wonValue", label: "Closed Won", color: "#2E7D32" },
    { key: "lostValue", label: "Closed Lost", color: "#C62828" },
  ];

  const max = Math.max(...stages.map(s => values?.[s.key as keyof SalesFunnelData] ?? 0), 1);

  return (
    <div className="space-y-1">
      {stages.map((s) => {
        const v = values?.[s.key as keyof SalesFunnelData] ?? 0;
        const pct = Math.max(8, Math.round((v / max) * 100));
        return (
          <div key={s.key} className="p-2">
            <div className="flex justify-between items-center text-xs font-bold text-gray-500 mb-1">
              <span>{s.label}</span>
              <span>{currency(v)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ 
                  width: `${pct}%`, 
                  backgroundColor: s.color 
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConeFunnel;
