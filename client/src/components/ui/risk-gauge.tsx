import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RiskGaugeProps {
  riskLevel: number;
  className?: string;
}

export function RiskGauge({ riskLevel, className }: RiskGaugeProps) {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    // Animate the gauge filling up
    const timer = setTimeout(() => {
      setWidth(riskLevel);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [riskLevel]);
  
  const getGaugeColor = () => {
    if (riskLevel >= 80) return 'bg-red-500';
    if (riskLevel >= 50) return 'bg-amber-500';
    return 'bg-emerald-500';
  };
  
  return (
    <div className={cn("w-full", className)}>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${getGaugeColor()}`} 
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-600 dark:text-gray-400">
        <span>Low Risk</span>
        <span>Medium Risk</span>
        <span>High Risk</span>
      </div>
    </div>
  );
}
