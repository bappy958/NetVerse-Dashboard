/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Server,
  Activity,
  AlertOctagon,
  TrendingUp,
  Cpu,
  Wifi,
  Radio,
  Zap,
  Globe,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  Shield,
  ArrowUpRight
} from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { NetworkDevice, NetworkAlert, NetworkLog } from "../types";
import MetricCard from "./MetricCard";

interface DashboardViewProps {
  devices: NetworkDevice[];
  alerts: NetworkAlert[];
  logs: NetworkLog[];
  onSetTab: (tab: string) => void;
  onTriggerAction: (actionName: string, deviceName: string) => void;
}

export default function DashboardView({
  devices,
  alerts,
  logs,
  onSetTab,
  onTriggerAction
}: DashboardViewProps) {
  
  // Calculate stats from devices list
  const totalDevicesCount = devices.length;
  const onlineDevicesCount = devices.filter(d => d.status === "ONLINE").length;
  const offlineDevicesCount = devices.filter(d => d.status === "OFFLINE").length;
  const activeAlarmsCount = alerts.filter(a => a.status === "ACTIVE").length;

  const averageLatency = Math.round(
    devices.reduce((acc, curr) => acc + curr.latency, 0) / totalDevicesCount
  ) || 0;

  const averagePacketLoss = Number(
    (devices.reduce((acc, curr) => acc + curr.packetLoss, 0) / totalDevicesCount).toFixed(2)
  ) || 0.0;

  const totalBandwidth = Number(
    (devices.reduce((acc, curr) => acc + (curr.bandwidthIn + curr.bandwidthOut), 0) / 1000).toFixed(2)
  ) || 0.0; // In Gbps

  const averageCpuUsage = Math.round(
    devices.reduce((acc, curr) => acc + curr.cpuUsage, 0) / totalDevicesCount
  ) || 0;

  const averageMemoryUsage = Math.round(
    devices.reduce((acc, curr) => acc + curr.memoryUsage, 0) / totalDevicesCount
  ) || 0;

  // Compute Network Health Score: Starts at 100, drops for offline nodes and active high/critical alarms
  const computeHealthScore = () => {
    let score = 100;
    score -= offlineDevicesCount * 8;
    score -= alerts.filter(a => a.status === "ACTIVE" && a.severity === "CRITICAL").length * 10;
    score -= alerts.filter(a => a.status === "ACTIVE" && a.severity === "HIGH").length * 5;
    return Math.max(score, 10);
  };

  const healthScore = computeHealthScore();

  // Mock Traffic chart dataset
  const trafficSparkData = [
    { name: "08:00", rx: 320, tx: 210 },
    { name: "09:00", rx: 420, tx: 250 },
    { name: "10:00", rx: 890, tx: 610 }, // Spike
    { name: "11:00", rx: 510, tx: 380 },
    { name: "12:00", rx: 620, tx: 430 },
    { name: "13:00", rx: 940, tx: 710 }, // Heavy load
    { name: "14:00", rx: 410, tx: 290 }
  ];

  // Colors for Health score ring
  const getScoreColor = (score: number) => {
    if (score >= 90) return "stroke-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]";
    if (score >= 75) return "stroke-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]";
    return "stroke-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]";
  };

  return (
    <div id="dashboard-grid-root" className="space-y-6">
      
      {/* Overview stats header containing Health Score circular progress & core details */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Network Health Circular Progress Card (glowing HUD) */}
        <div className="lg:col-span-1 bg-[#1e293b]/60 border border-[#1e293b] rounded-3xl p-5 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden backdrop-blur-md">
          {/* Subtle cyber scan backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#1e293b_0%,transparent_70%)] opacity-30 pointer-events-none" />
          
          <h4 className="text-[10px] text-[#64748b] font-bold uppercase tracking-widest font-mono mb-4">
            Network Health Index
          </h4>

          {/* SVG Circular Ring */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {/* Back track ring */}
              <circle
                cx="50"
                cy="50"
                r="40"
                className="fill-none stroke-slate-900 stroke-[6px]"
              />
              {/* Health Score animated ring */}
              <circle
                cx="50"
                cy="50"
                r="40"
                className={`fill-none stroke-[7.5px] stroke-linecap-round transition-all duration-1000 ${getScoreColor(healthScore)}`}
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * healthScore) / 100}
              />
            </svg>
            
            {/* Center numeric overlay */}
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold font-sans text-white tracking-tighter">
                {healthScore}%
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#64748b] mt-0.5">
                {healthScore >= 90 ? "SECURE" : healthScore >= 75 ? "DEGRADED" : "CRITICAL"}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-[#94a3b8] leading-relaxed max-w-xs mt-4">
            Total threat metrics and packet-loss calculations verified safe.
          </p>
        </div>

        {/* Realtime Core Throughput Chart (Span 3) */}
        <div className="lg:col-span-3 bg-[#1e293b]/60 border border-[#1e293b] rounded-3xl p-5 shadow-xl relative overflow-hidden backdrop-blur-md">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                Core Router Throughput Allocation (Mbps)
              </h4>
            </div>
            <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full font-mono font-semibold uppercase">
              Live Interfaces
            </span>
          </div>

          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficSparkData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="rxGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#475569" fontSize={9} fontFamily="monospace" />
                <YAxis stroke="#475569" fontSize={9} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#1e293b",
                    borderRadius: "12px"
                  }}
                />
                <Area
                  type="monotone"
                  name="RX Stream"
                  dataKey="rx"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#rxGrad)"
                  strokeWidth={2.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Active Assets"
          value={`${onlineDevicesCount} / ${totalDevicesCount}`}
          icon={Server}
          iconColor="text-cyan-400"
          trend={{ value: `${offlineDevicesCount} offline`, isUp: false, neutral: offlineDevicesCount === 0 }}
          sparklineData={[11, 12, 12, 12, 13, 13, 13]}
        />
        
        <MetricCard
          title="Active Alarms"
          value={activeAlarmsCount}
          icon={AlertOctagon}
          iconColor="text-red-400"
          trend={{ value: `${alerts.filter(a => a.severity === "CRITICAL").length} critical`, isUp: false }}
          sparklineData={[1, 0, 3, 2, 4, 1, activeAlarmsCount]}
        />

        <MetricCard
          title="Avg Subnet Latency"
          value={`${averageLatency} ms`}
          icon={Activity}
          iconColor="text-emerald-400"
          trend={{ value: `${averagePacketLoss}% Loss`, isUp: true, neutral: averagePacketLoss < 1 }}
          sparklineData={[12, 14, 84, 22, 18, 9, averageLatency]}
        />

        <MetricCard
          title="Aggregate Throughput"
          value={`${totalBandwidth} Gbps`}
          icon={TrendingUp}
          iconColor="text-blue-400"
          trend={{ value: "Capacity: 10Gbps", isUp: true, neutral: true }}
          sparklineData={[2.1, 2.5, 6.1, 3.8, 4.3, 7.1, totalBandwidth]}
        />

        <MetricCard
          title="Avg CPU Saturation"
          value={`${averageCpuUsage}%`}
          icon={Cpu}
          iconColor="text-amber-400"
          trend={{ value: "Core baseline safe", isUp: true, neutral: true }}
          sparklineData={[14, 18, 56, 34, 22, 15, averageCpuUsage]}
        />

        <MetricCard
          title="Memory Allocation"
          value={`${averageMemoryUsage}%`}
          icon={Cpu}
          iconColor="text-purple-400"
          trend={{ value: "Slab allocation safe", isUp: true, neutral: true }}
          sparklineData={[42, 45, 48, 52, 49, 44, averageMemoryUsage]}
        />
      </div>

      {/* Lower part of Dashboard: Recent Alarms (Left) & Live syslogs Timeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Critical Alerts card */}
        <div className="bg-[#1e293b]/60 border border-[#1e293b] rounded-3xl p-5 shadow-xl relative overflow-hidden backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-[#1e293b] pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4.5 h-4.5 text-red-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                  Active Security Alarms
                </h4>
              </div>
              <button
                onClick={() => onSetTab("alerts")}
                className="text-[10px] text-cyan-400 font-mono font-bold hover:underline"
              >
                Go to Alert Console →
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {alerts.filter(a => a.status === "ACTIVE").length === 0 ? (
                <p className="text-xs text-[#64748b] text-center py-12">
                  No active alarms. Subnet routes reporting healthy.
                </p>
              ) : (
                alerts
                  .filter(a => a.status === "ACTIVE")
                  .slice(0, 4)
                  .map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/25 rounded-xl transition-all flex items-start gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 animate-pulse shrink-0" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-red-400 font-mono font-bold uppercase">
                            {alert.severity}
                          </span>
                          <span className="text-[9px] text-[#475569] font-mono">
                            {alert.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-white mt-1 leading-relaxed">
                          {alert.message}
                        </p>
                        <span className="text-[9.5px] text-cyan-400 font-mono block mt-1.5 uppercase">
                          @{alert.deviceName} • {alert.category}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>

        {/* Chronometric Syslogs timeline card */}
        <div className="bg-[#1e293b]/60 border border-[#1e293b] rounded-3xl p-5 shadow-xl relative overflow-hidden backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-[#1e293b] pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-4.5 h-4.5 text-cyan-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                  Intranet status Syslogs
                </h4>
              </div>
              <button
                onClick={() => onSetTab("logs")}
                className="text-[10px] text-cyan-400 font-mono font-bold hover:underline"
              >
                Go to Live Buffer →
              </button>
            </div>

            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {logs.slice(0, 4).map((log) => (
                <div key={log.id} className="flex gap-3 relative group">
                  {/* Status dot */}
                  <div className="relative z-10 flex items-center justify-center mt-1 shrink-0">
                    <div className={`w-2 h-2 rounded-full ${log.status === "FAILED" ? "bg-red-500" : "bg-emerald-500"}`} />
                  </div>
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-cyan-400 font-bold">@{log.deviceName}</span>
                      <span className="text-[#64748b]">{log.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#cbd5e1] font-mono mt-0.5 leading-normal truncate max-w-md">
                      {log.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
