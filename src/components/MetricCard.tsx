/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  iconColor: string;
  trend?: {
    value: string | number;
    isUp: boolean;
    neutral?: boolean;
  };
  sparklineData?: number[];
  glowing?: boolean;
}

export default function MetricCard({
  title,
  value,
  icon: Icon,
  iconColor,
  trend,
  sparklineData,
  glowing = false
}: MetricCardProps) {
  // Generate SVG path for sparkline
  const generateSparklinePath = (data: number[]) => {
    if (!data || data.length < 2) return "";
    const width = 100;
    const height = 30;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min === 0 ? 1 : max - min;

    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    });

    return `M ${points.join(" L ")}`;
  };

  return (
    <div
      id={`metric-${title.toLowerCase().replace(/\s+/g, "-")}`}
      className={`bg-[#1e293b]/60 border border-[#1e293b] rounded-2xl p-5 backdrop-blur-md relative transition-all duration-300 hover:scale-[1.02] hover:border-cyan-500/30 group ${
        glowing ? "shadow-[0_0_20px_rgba(59,130,246,0.1)]" : "shadow-lg"
      }`}
    >
      {/* Glow highlight */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 rounded-2xl transition-all duration-500" />
      
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] text-[#64748b] font-bold uppercase tracking-widest font-mono">
            {title}
          </span>
          <h3 className="text-2xl font-bold text-white mt-1.5 tracking-tight font-sans">
            {value}
          </h3>
        </div>

        <div className={`p-3 bg-slate-900/40 rounded-xl border border-slate-800/60 ${iconColor} relative overflow-hidden shrink-0`}>
          <Icon className="w-5 h-5 relative z-10" />
          <div className="absolute inset-0 bg-current opacity-5 rounded-xl" />
        </div>
      </div>

      <div className="flex items-center justify-between mt-5 pt-3 border-t border-[#1e293b]/50">
        {trend ? (
          <div className="flex items-center gap-1">
            {trend.neutral ? (
              <Activity className="w-3.5 h-3.5 text-[#64748b]" />
            ) : trend.isUp ? (
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
            )}
            <span
              className={`text-xs font-mono font-semibold ${
                trend.neutral
                  ? "text-[#64748b]"
                  : trend.isUp
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {trend.value}
            </span>
          </div>
        ) : (
          <div className="w-1" />
        )}

        {/* Custom Mini SVG Sparkline */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="w-24 h-8">
            <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
              <path
                d={generateSparklinePath(sparklineData)}
                fill="none"
                stroke={trend && !trend.isUp && !trend.neutral ? "#ef4444" : "#06b6d4"}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_3px_rgba(6,182,212,0.3)]"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
