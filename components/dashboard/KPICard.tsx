'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  valueUSD?: number;
  hint?: string;
  icon: LucideIcon;
  index: number;
}

const KpiCard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  valueUSD, 
  hint, 
  icon: Icon, 
  index 
}) => {
  const currency = (n: number) => new Intl.NumberFormat("en-US", { 
    style: "currency", 
    currency: "USD", 
    maximumFractionDigits: 0 
  }).format(Math.round(n ?? 0));
  
  const number = (n: number) => new Intl.NumberFormat("en-US").format(Math.round(n ?? 0));

  return (
    <motion.div 
      className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, delay: index * 0.1 }}
    > 
      <div className="flex items-center justify-between"> 
        <p className="text-sm font-medium text-gray-500">{title}</p> 
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200"> 
          <Icon size={20} className="text-blue-500" /> 
        </div> 
      </div> 
      <p className="text-4xl font-bold text-[#1E1E1E] mt-3">
        {valueUSD != null ? currency(valueUSD) : number(value ?? 0)}
      </p>
      {hint && <div className="text-muted text-sm mt-1">{hint}</div>}
    </motion.div>
  );
};

export default KpiCard;


