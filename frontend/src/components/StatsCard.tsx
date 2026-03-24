import React from "react";
import { TrendingUp } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string;
  up: boolean;
  change: string;
  icon: React.ElementType;
  iconColor: string;
  cardBg: string;
  cardBorder: string;
  iconBg: string;
}

const StatsCard = ({
  label,
  value,
  up,
  change,
  icon: Icon,
  iconColor,
  cardBg,
  cardBorder,
  iconBg,
}: StatsCardProps) => {
  return (
    <div className={`${cardBg} border ${cardBorder} rounded-xl p-5`}>
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`}
        >
          <Icon size={16} className={iconColor} strokeWidth={1.8} />
        </div>
        <span
          className={`flex items-center gap-1 text-[11px] ${up ? "text-teal-400" : "text-red-400"}`}
        >
          <TrendingUp size={11} />
          {change}
        </span>
      </div>
      <p className="text-3xl font-semibold tracking-tight mb-0.5">{value}</p>
      <p className="text-xs text-white/35">{label}</p>
    </div>
  );
};

export default StatsCard;
